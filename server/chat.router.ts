// server/chat.router.ts
import { z } from "zod";
import { router, protectedProcedure } from "./_core/trpc";
import { invokeLLM, type Message, type Tool } from "./_core/llm";
import {
  getChatbotFunctions,
  type ChatbotFunctionEntry,
} from "./_core/chatbot-functions";
import * as db from "./db";
import { ENV } from "./_core/env";

// ===== Drizzle (para debug) =====
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../drizzle/schema"; // traz {disciplinas, matriculas, ...}

// Utilitários de mensagens LLM
function asText(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((c: any) =>
        typeof c === "string"
          ? c
          : c?.text ?? c?.content ?? c?.value ?? JSON.stringify(c),
      )
      .join(" ");
  }
  if (content == null) return "";
  return JSON.stringify(content);
}

function sanitizeMessageForLLM(m: Message): Message {
  const { role } = m as any;
  const content = (m as any).content ?? "";
  const tool_calls = (m as any).tool_calls;
  if (tool_calls) {
    return {
      role,
      content: typeof content === "string" ? content : "",
      tool_calls,
    } as any;
  }
  return { role, content } as any;
}

export const chatRouter = router({
  // ====== HEALTH / DEBUG ======
  health: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user?.id ?? "(sem user)";
    const headerMock = (ctx.req?.headers?.["x-mock-user-id"] as string) ?? null;
    const ownerEnv = process.env.OWNER_OPEN_ID ?? null;
    const periodo = process.env.PERIODO_ATUAL ?? null;

    return {
      ok: true,
      userId,
      headerMock,
      ownerEnv,
      periodo,
      now: new Date(),
    };
  }),

  debugMatriculas: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user?.id ?? "";
    const periodo = process.env.PERIODO_ATUAL ?? "";
    if (!userId || !periodo) {
      return {
        userId,
        periodo,
        list: [],
        count: 0,
        note: "userId ou periodo vazio",
      };
    }

    // ⚠️ ctx.db não existe no seu contexto -> abrimos um client local só para debug
    const dbLocal = drizzle(process.env.DATABASE_URL!, { schema, mode: "default" });
    const { matriculas, disciplinas } = schema;

    const list = await dbLocal
      .select({
        codigo: disciplinas.codigo,
        nome: disciplinas.nome,
        periodo: matriculas.periodo,
      })
      .from(matriculas)
      .innerJoin(disciplinas, eq(matriculas.disciplinaId, disciplinas.id))
      // ⚠️ coluna correta no schema é alunoId (não usuarioId)
      .where(and(eq(matriculas.alunoId, userId), eq(matriculas.periodo, periodo)));

    return { userId, periodo, count: list.length, list };
  }),

  // ====== Compat: obter conversa por id ======
  getConversa: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const mensagens = await db.getMensagens(input.id);
      return { id: input.id, mensagens };
    }),

  // ====== Enviar mensagem (com function-calling) ======
  enviarMensagem: protectedProcedure
    .input(
      z.object({
        conversaId: z.string().optional(),
        mensagem: z.string().min(1),
        periodo: z.string().optional(), // pode vir do cliente; caímos no ENV se não vier
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // 1) usuário e período
      const userId =
        ctx.user?.id || (ENV.devMode && ENV.ownerId ? ENV.ownerId : "");

      if (!userId) {
        return {
          ok: false as const,
          conversaId: input.conversaId,
          resposta:
            "Sem usuário autenticado (DEV_MODE desativado). Não consigo verificar matrículas.",
        };
      }

      const periodo = input.periodo ?? ENV.academicPeriod ?? "2025.2";
      console.log("[chat.enviarMensagem] userId=%s periodo=%s", userId, periodo);

      // 2) abre/garante conversa
      let conversaId = input.conversaId;
      if (!conversaId) {
        conversaId = await db.createConversa(userId);
      }

      // 3) persiste msg do usuário
      await db.createMensagem({
        conversaId,
        role: "user",
        conteudo: input.mensagem,
      });

      // 4) histórico + system
      const hist = await db.getMensagens(conversaId);
      const messages: Message[] = [
        {
          role: "system",
          content:
            "Você é o Hi/UFPE. Sempre que a pergunta envolver dados acadêmicos, USE FERRAMENTAS (function calling). Responda curto e confirme ações.",
        },
        ...hist.map((m) => ({
          role: (m.role as any) ?? "user",
          content: m.conteudo ?? "",
        })) as any[],
        { role: "user", content: input.mensagem },
      ];

      // 5) Tools: assinatura { type: 'function', function: {...} }
      const catalog: Record<string, ChatbotFunctionEntry> = (() => {
        try {
          return (getChatbotFunctions as any)({ userId, periodo });
        } catch {
          return (getChatbotFunctions as any)(userId);
        }
      })();

      const tools: Tool[] = Object.values(catalog).map(
        (f: ChatbotFunctionEntry) =>
          ({ type: "function", function: f.tool }) as Tool,
      );

      // 6) 1ª chamada
      let resp = await invokeLLM({ messages, tools, tool_choice: "auto" });
      let respostaTexto = asText(resp.choices[0]?.message?.content);

      // 7) loop assistant -> tools -> assistant
      while (resp.choices[0]?.message?.tool_calls?.length) {
        const assistantMsgRaw = resp.choices[0].message!;
        const assistantMsg = sanitizeMessageForLLM(assistantMsgRaw as any);
        messages.push(assistantMsg);

        const toolCalls = assistantMsgRaw.tool_calls!;
        const toolResponses: Message[] = [];

        for (const tc of toolCalls) {
          const name = tc.function.name as keyof typeof catalog;
          const handler = catalog[name];
          const args = JSON.parse(tc.function.arguments || "{}");

          const result = handler
            ? await handler.execute(args)
            : { error: `função '${String(name)}' não mapeada` };

          toolResponses.push({
            role: "tool",
            tool_call_id: tc.id,
            content: JSON.stringify(result),
          } as any);
        }

        messages.push(...toolResponses);

        resp = await invokeLLM({ messages, tools });
        respostaTexto = asText(resp.choices[0]?.message?.content);
      }

      // 8) assistant -> DB
      await db.createMensagem({
        conversaId,
        role: "assistant",
        conteudo: respostaTexto,
      });

      return { ok: true as const, conversaId, resposta: respostaTexto };
    }),
});
