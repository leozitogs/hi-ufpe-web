import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { storagePut } from "./storage";
import * as db from "./db";
import * as crypto from "crypto";
import { getChatbotFunctions, ChatbotFunctionEntry } from "./_core/chatbot-functions";
import { Tool as OpenAITool, Message, Role } from "./_core/llm";
import { chatRouter } from "./chat.router";

// Procedure para admin
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin' && ctx.user.role !== 'secgrad' && ctx.user.role !== 'professor') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Acesso negado' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  // ===== AUTH =====
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ===== DISCIPLINAS =====
  disciplinas: router({
    list: publicProcedure.query(async () => {
      return await db.getDisciplinas();
    }),
    
    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getDisciplina(input.id);
      }),

    create: protectedProcedure
      .input(z.object({
        nome: z.string(),
        codigo: z.string(),
        creditos: z.number(),
        periodo: z.string(),
        cargaHoraria: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const disciplina = await db.createDisciplina({ ...input, id: crypto.randomUUID() });
        const matricula = await db.createMatricula({
          id: crypto.randomUUID(),
          disciplinaId: disciplina.id,
          alunoId: ctx.user.id,
          periodo: input.periodo,
          mediaMinima: "5.00",
          frequenciaMinima: 75,
        });
        return { disciplina, matricula };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        nome: z.string().optional(),
        codigo: z.string().optional(),
        creditos: z.number().optional(),
        periodo: z.string().optional(),
        cargaHoraria: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.updateDisciplina(input.id, input);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        return await db.deleteDisciplina(input.id);
      }),
  }),

  // ===== MATRICULAS =====
  matriculas: router({
    // alias compatível com frontend antigo
    minhas: protectedProcedure.query(async ({ ctx }) => {
      return await db.getMatriculasByAluno(ctx.user.id);
    }),

    // list agora aceita filtros opcionais
    list: protectedProcedure
      .input(z.object({ periodo: z.string().optional(), alunoId: z.string().optional() }).optional())
      .query(async ({ input, ctx }) => {
        const alunoId = input?.alunoId ?? ctx.user.id;
        const matriculas = await db.getMatriculasByAluno(alunoId);

        // normaliza para any[] para lidar com variações de shape retornado pelo DB
        const matriculasAny = matriculas as any[];

        if (input?.periodo) {
          return matriculasAny.filter((m) => {
            const periodoFromMatricula = m?.matricula?.periodo;
            const periodoTopLevel = m?.periodo;
            const periodo = periodoFromMatricula ?? periodoTopLevel ?? "";
            return periodo === input.periodo;
          });
        }

        return matriculasAny;
      }),

    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getMatricula(input.id);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        metodoAvaliacaoId: z.string().optional(),
        mediaCalculada: z.string().optional(),
        // manter como número (ajuste conforme seu DB)
        mediaMinima: z.number().optional(),
        frequenciaMinima: z.number().optional(),
        faltas: z.number().optional(),
        media: z.string().optional(),
        status: z.enum(["cursando", "aprovado", "reprovado", "trancado"]).optional(),
      }))
      .mutation(async ({ input }) => {
        // normalize payload conforme a assinatura do seu db.updateMatricula
        const payload: any = { ...input };

        // Se o seu DB espera strings para some fields, converta explicitamente aqui:
        // ex: payload.mediaMinima = typeof input.mediaMinima === 'number' ? input.mediaMinima.toString() : input.mediaMinima;

        // Valida status para garantir enum correto
        if (typeof input.status === 'string') {
          const allowed = ["cursando", "aprovado", "reprovado", "trancado"];
          payload.status = allowed.includes(input.status) ? input.status : undefined;
        }

        return await db.updateMatricula(input.id, payload);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        return await db.deleteMatricula(input.id);
      }),
  }),

  // ===== MÉTODOS DE AVALIAÇÃO =====
  metodosAvaliacao: router({
    create: protectedProcedure
      .input(z.object({
        matriculaId: z.string(),
        nome: z.string(),
        descricao: z.string().optional(),
        formula: z.string(),
        tipo: z.enum(["media_ponderada", "media_simples", "media_com_substituicao", "personalizado"]).optional().default("media_ponderada"),
      }))
      .mutation(async ({ input }) => {
        return await db.createMetodoAvaliacao({ ...input, id: crypto.randomUUID() });
      }),

    getByMatricula: protectedProcedure
      .input(z.object({ matriculaId: z.string() }))
      .query(async ({ input }) => {
        return await db.getMetodoAvaliacaoByMatricula(input.matriculaId);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        nome: z.string().optional(),
        descricao: z.string().optional(),
        formula: z.string().optional(),
        tipo: z.enum(["media_ponderada", "media_simples", "media_com_substituicao", "personalizado"]).optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.updateMetodoAvaliacao(input.id, input);
      }),
  }),

  // ===== AVALIAÇÕES =====
  avaliacoes: router({
    create: protectedProcedure
      .input(z.object({
        metodoAvaliacaoId: z.string(),
        nome: z.string(),
        tipo: z.enum(["prova", "trabalho", "ap"]), // Adicione outros tipos se necessário
        peso: z.number(),
        notaMaxima: z.number().optional().default(10),
        dataAvaliacao: z.date().optional(),
        notaObtida: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createAvaliacao({ ...input, id: crypto.randomUUID(), peso: input.peso.toString(), notaMaxima: input.notaMaxima?.toString(), notaObtida: input.notaObtida?.toString() });
      }),

    listByMetodo: protectedProcedure
      .input(z.object({ metodoAvaliacaoId: z.string() }))
      .query(async ({ input }) => {
        return await db.getAvaliacoesByMetodo(input.metodoAvaliacaoId);
      }),

    lancarNota: protectedProcedure
      .input(z.object({
        id: z.string(),
        notaObtida: z.number(),
        dataAvaliacao: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.updateAvaliacao(input.id, { notaObtida: input.notaObtida?.toString(), dataAvaliacao: input.dataAvaliacao });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        nome: z.string().optional(),
        tipo: z.enum(["prova", "trabalho", "ap"]).optional(),
        peso: z.number().optional(),
        notaMaxima: z.number().optional(),
        dataAvaliacao: z.date().optional(),
        notaObtida: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.updateAvaliacao(input.id, { ...input, peso: input.peso?.toString(), notaObtida: input.notaObtida?.toString(), notaMaxima: input.notaMaxima?.toString() });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        return await db.deleteAvaliacao(input.id);
      }),
  }),

  // ===== FALTAS =====
  faltas: router({
    registrar: protectedProcedure
      .input(z.object({
        matriculaId: z.string(),
        data: z.date(),
        justificada: z.boolean().optional().default(false),
        justificativa: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.registrarFalta({ ...input, id: crypto.randomUUID() });
      }),

    listByMatricula: protectedProcedure
      .input(z.object({ matriculaId: z.string() }))
      .query(async ({ input }) => {
        return await db.getFaltasByMatricula(input.matriculaId);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        return await db.deleteFalta(input.id);
      }),
  }),

  // ===== HORÁRIOS =====
  horarios: router({
    create: protectedProcedure
      .input(z.object({
        matriculaId: z.string(),
        diaSemana: z.enum(["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]), // Ex: "Segunda-feira"
        horaInicio: z.string(), // Ex: "08:00"
        horaFim: z.string(), // Ex: "10:00"
        local: z.string().optional(),
        criadoPor: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const matricula = await db.getMatricula(input.matriculaId);
        if (!matricula) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Matrícula não encontrada" });
        }
        return await db.createHorario({ ...input, id: crypto.randomUUID(), disciplinaId: matricula.disciplinaId });
      }),

    listByDisciplina: protectedProcedure
      .input(z.object({ matriculaId: z.string() }))
      .query(async ({ input }) => {
        const matricula = await db.getMatricula(input.matriculaId);
        if (!matricula) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Matrícula não encontrada" });
        }
        return await db.getHorariosByDisciplina(matricula.disciplinaId);
      }),

    // NOVO: lista horários por aluno (aceita alunoId opcional)
    listByAluno: protectedProcedure
      .input(z.object({ alunoId: z.string().optional(), periodo: z.string().optional() }).optional())
      .query(async ({ input, ctx }) => {
        const alunoId = input?.alunoId ?? ctx.user.id;
        
        // 1. Buscamos as matrículas (que JÁ trazem os dados da disciplina e professor)
        const matriculasDoAluno = await db.getMatriculasByAluno(alunoId);
        
        const resultados: any[] = [];

        // 2. Para cada matrícula...
        for (const m of (matriculasDoAluno as any[])) {
          const disciplinaId = m.matricula?.disciplinaId ?? m.disciplina?.id;
          
          if (!disciplinaId) continue;

          // 3. Buscamos os horários crus dessa disciplina
          const horariosDaDisciplina = await db.getHorariosByDisciplina(disciplinaId);

          // 4. O PULO DO GATO: Enriquecemos o horário com os dados da disciplina/professor
          //    que já temos na variável 'm' (da matrícula).
          const horariosEnriquecidos = horariosDaDisciplina.map(h => ({
            horario: h,                 // O objeto horário puro (dia, hora, sala)
            disciplina: m.disciplina,   // Anexamos o objeto disciplina (nome, código)
            professor: m.professor,     // Anexamos o objeto professor (nome)
            
            // Mantemos compatibilidade com estrutura plana se necessário
            ...h 
          }));

          resultados.push(...horariosEnriquecidos);
        }

        return resultados;
      }),
      
    // NOVO: compatibilidade com frontend antigo "meusHorarios"
    meusHorarios: protectedProcedure
      .input(z.object({ periodo: z.string().optional() }).optional())
      .query(async ({ input, ctx }) => {
        const matriculas = await db.getMatriculasByAluno(ctx.user.id);
        const resultados: any[] = [];
        for (const m of (matriculas as any[])) {
          const disciplinaId = m.matricula?.disciplinaId ?? m.disciplina?.id ?? m.disciplinaId;
          if (!disciplinaId) continue;
          const hs = await db.getHorariosByDisciplina(disciplinaId);
          resultados.push(...(hs || []));
        }
        return resultados;
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        return await db.deleteHorario(input.id);
      }),
  }),

  // ===== COMUNICADOS =====
  comunicados: router({
    create: adminProcedure
      .input(z.object({
        titulo: z.string(),
        conteudo: z.string(),
        disciplinaId: z.string().optional(),
        alunoId: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.createComunicado({ ...input, autor: ctx.user.name || 'Desconhecido', autorId: ctx.user.id });
      }),

    list: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        const res = await db.getComunicados();
        if (input?.limit) return res.slice(0, input.limit);
        return res;
      }),

    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getComunicado(input.id);
      }),
  }),

  // ===== CHAT =====
  chat: router({
    // compatibilidade: obter conversa por id
    getConversa: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const mensagens = await db.getMensagens(input.id);
        return { id: input.id, mensagens };
      }),

    // manter compatibilidade de payload (conversaId opcional)
    enviarMensagem: protectedProcedure
      .input(
        z.object({
          conversaId: z.string().optional(),
          mensagem: z.string().min(1),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const usuario = ctx.user;
        let conversaId = input.conversaId;

        // garante uma conversa
        if (!conversaId) {
          conversaId = await db.createConversa(usuario.id);
        }

        // persiste mensagem do usuário
        await db.createMensagem({
          conversaId: conversaId as string,
          role: "user",
          conteudo: input.mensagem,
        });

        // contexto factual do aluno (defensivo com shapes do DB)
        const matriculasAluno = await db.getMatriculasByAluno(usuario.id);
        const contextoDisciplinas = (matriculasAluno as any[])
          .map(m => {
            const mat = m?.matricula ?? {};
            const disciplina = m?.disciplina ?? {};
            const periodo = mat?.periodo ?? m?.periodo ?? "N/A";
            const media = mat?.mediaCalculada ?? mat?.media ?? m?.media ?? "N/A";
            const faltas = mat?.faltas ?? m?.faltas ?? 0;
            const status = mat?.status ?? m?.status ?? "N/A";
            return `Disciplina: ${disciplina?.nome ?? "N/A"} (${disciplina?.codigo ?? "N/A"}), Período: ${periodo}, Média: ${media}, Faltas: ${faltas}, Status: ${status}`;
          })
          .join("\n");

        const contextoSistema =
          `Você é o Hi, assistente virtual do Hub Inteligente UFPE.
  Você PODE executar ferramentas (function calling) para consultar/atualizar o sistema acadêmico:
  - Consultar/lçar notas e médias
  - Registrar faltas
  - Projeções/simulações de média
  - Consultar horários e situação geral

  Quando a pergunta envolver dados do sistema, PREFIRA usar ferramentas.
  Responda curto e confirme ações realizadas.

  Usuário: ${usuario.name || "Não informado"} • Curso: ${usuario.curso ?? "?"} • Período: ${usuario.periodo ?? "?"}
  Disciplinas do aluno:
  ${contextoDisciplinas}

  Histórico recente:
  ${(await db.getMensagens(conversaId as string)).map(m => `${m.role}: ${m.conteudo}`).join("\n")}
  `.trim();

        // histórico para o modelo
        const messages: Message[] = [
          { role: "system", content: contextoSistema },
          { role: "user", content: input.mensagem },
        ];

        // configura tools a partir do catálogo do chatbot

        const periodo =
          (typeof input === "object" && input && "periodo" in input && (input as any).periodo) ||
          (ctx as any)?.periodo ||
          process.env.PERIODO_ATUAL ||
          "2025.2";

        const chatbotFunctions = getChatbotFunctions({ alunoId: ctx.user.id, periodo });

        const tools: OpenAITool[] = Object.values(chatbotFunctions).map((f: ChatbotFunctionEntry) => ({
          type: "function",
          function: f.tool,
        }));

        // 1ª chamada: o modelo decide se chama ferramentas
        let resposta = await invokeLLM({ messages, tools });
        let content = resposta.choices[0]?.message?.content;
        let respostaTexto = typeof content === "string" ? content : "Desculpe, não consegui processar sua mensagem.";

        // Loop de function calling até não haver mais tool_calls
        while (resposta.choices[0]?.message?.tool_calls?.length) {
          const toolCalls = resposta.choices[0].message.tool_calls!;

          // adiciona a mensagem do assistant que contém as tool_calls ao histórico
          messages.push(resposta.choices[0].message as any);

          // executa cada tool e agrega respostas
          const toolResponses: Message[] = [];
          for (const call of toolCalls) {
            const functionName = call.function.name as keyof typeof chatbotFunctions;
            const functionToCall = chatbotFunctions[functionName];
            const args = JSON.parse(call.function.arguments || "{}");

            const result = functionToCall
              ? await functionToCall.execute(args)
              : { error: `função '${functionName}' não mapeada` };

            toolResponses.push({
              role: "tool",
              tool_call_id: call.id,
              content: JSON.stringify(result),
            });
          }

          // IMPORTANTE: usar spread para empilhar várias respostas de ferramenta
          messages.push(...toolResponses);

          // nova chamada, agora com os resultados das tools
          resposta = await invokeLLM({ messages, tools });
          content = resposta.choices[0]?.message?.content;
          respostaTexto = typeof content === "string" ? content : "Desculpe, não consegui processar sua mensagem.";
        }

        // persiste resposta do assistant
        await db.createMensagem({
          conversaId: conversaId as string,
          role: "assistant",
          conteudo: respostaTexto,
        });

        return {
          conversaId,
          resposta: respostaTexto,
        };
      }),
  }),

});

// export type para uso no client
export type AppRouter = typeof appRouter;
