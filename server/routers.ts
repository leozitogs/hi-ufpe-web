import * as UsersDB from "./database/users"; 
import jwt from "jsonwebtoken"; 
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";

// Imports Modulares
import * as DisciplinasDB from "./database/academic/disciplinas";
import * as MatriculasDB from "./database/academic/matriculas";
import * as MetodosDB from "./database/academic/avaliacoes";
import * as AvaliacoesDB from "./database/academic/avaliacoes";
import * as FaltasDB from "./database/academic/faltas";
import * as HorariosDB from "./database/academic/horarios";
import * as ComunicadosDB from "./database/communication/comunicados";
import * as ChatDB from "./database/communication/chatbot";

import * as crypto from "crypto";
import { getChatbotFunctions, ChatbotFunctionEntry } from "./_core/chatbot-functions";
import { Tool as OpenAITool, Message } from "./_core/llm";

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

    // --- ROTA DE LOGIN ---
    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string()
      }))
      .mutation(async ({ input, ctx }) => {
        const user = await UsersDB.getUserByEmail(input.email);

        // Verifica senha (texto plano por enquanto)
        // Agora o TS reconhece 'user.password' porque atualizamos o schema
        if (!user || user.password !== input.password) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Email ou senha incorretos' });
        }

        const secret = process.env.JWT_SECRET || "segredo-local-super-secreto-dev-123";
        
        // Gera o token
        const token = jwt.sign(
          { userId: user.id, role: user.role }, 
          secret, 
          { expiresIn: '7d' }
        );

        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, cookieOptions);

        return { success: true };
      }),

    // --- ROTA DE CADASTRO ---
    register: publicProcedure
      .input(z.object({
        email: z.string().email("Email inválido"),
        password: z.string().min(6, "Mínimo 6 caracteres"),
        confirmPassword: z.string()
      }))
      .mutation(async ({ input }) => {
        const { email, password, confirmPassword } = input;

        if (password !== confirmPassword) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: "Senhas não conferem" });
        }

        const existing = await UsersDB.getUserByEmail(email);
        if (existing) {
          throw new TRPCError({ code: 'CONFLICT', message: "Email já cadastrado" });
        }

        await UsersDB.createUser({
          id: crypto.randomUUID(),
          email,
          password, 
          name: email.split("@")[0],
          loginMethod: "email",
          role: "user", // FIX: Alterado de "student" para "user" (padrão do schema)
          createdAt: new Date(),
          matricula: "",
          curso: ""      
        });

        return { success: true, message: "Conta criada!" };
      }),
  }),

  // ===== DISCIPLINAS =====
  disciplinas: router({
    list: publicProcedure.query(async () => {
      return await DisciplinasDB.getDisciplinas();
    }),
    
    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await DisciplinasDB.getDisciplina(input.id);
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
        const disciplina = await DisciplinasDB.createDisciplina({ ...input, id: crypto.randomUUID() });
        const matricula = await MatriculasDB.createMatricula({
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
        return await DisciplinasDB.updateDisciplina(input.id, input);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        return await DisciplinasDB.deleteDisciplina(input.id);
      }),
  }),

  // ===== MATRICULAS =====
  matriculas: router({
    minhas: protectedProcedure.query(async ({ ctx }) => {
      return await MatriculasDB.getMatriculasByAluno(ctx.user.id);
    }),

    list: protectedProcedure
      .input(z.object({ periodo: z.string().optional(), alunoId: z.string().optional() }).optional())
      .query(async ({ input, ctx }) => {
        const alunoId = input?.alunoId ?? ctx.user.id;
        const matriculas = await MatriculasDB.getMatriculasByAluno(alunoId);
        
        // Conversão necessária pois getMatriculasByAluno retorna um tipo complexo de join
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
        return await MatriculasDB.getMatricula(input.id);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        metodoAvaliacaoId: z.string().optional(),
        mediaCalculada: z.string().optional(),
        mediaMinima: z.number().optional(),
        frequenciaMinima: z.number().optional(),
        faltas: z.number().optional(),
        media: z.string().optional(),
        status: z.enum(["cursando", "aprovado", "reprovado", "trancado"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const payload: any = { ...input };
        if (typeof input.status === 'string') {
          const allowed = ["cursando", "aprovado", "reprovado", "trancado"];
          payload.status = allowed.includes(input.status) ? input.status : undefined;
        }
        return await MatriculasDB.updateMatricula(input.id, payload);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        return await MatriculasDB.deleteMatricula(input.id);
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
        return await MetodosDB.createMetodoAvaliacao({ ...input, id: crypto.randomUUID() });
      }),

    getByMatricula: protectedProcedure
      .input(z.object({ matriculaId: z.string() }))
      .query(async ({ input }) => {
        return await MetodosDB.getMetodoAvaliacaoByMatricula(input.matriculaId);
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
        return await MetodosDB.updateMetodoAvaliacao(input.id, input);
      }),
  }),

  // ===== AVALIAÇÕES =====
  avaliacoes: router({
    create: protectedProcedure
      .input(z.object({
        metodoAvaliacaoId: z.string(),
        nome: z.string(),
        tipo: z.enum(["prova", "trabalho", "ap"]),
        peso: z.number(),
        notaMaxima: z.number().optional().default(10),
        dataAvaliacao: z.date().optional(),
        notaObtida: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return await AvaliacoesDB.createAvaliacao({ ...input, id: crypto.randomUUID(), peso: input.peso.toString(), notaMaxima: input.notaMaxima?.toString(), notaObtida: input.notaObtida?.toString() });
      }),

    listByMetodo: protectedProcedure
      .input(z.object({ metodoAvaliacaoId: z.string() }))
      .query(async ({ input }) => {
        return await AvaliacoesDB.getAvaliacoesByMetodo(input.metodoAvaliacaoId);
      }),

    lancarNota: protectedProcedure
      .input(z.object({
        id: z.string(),
        notaObtida: z.number(),
        dataAvaliacao: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        return await AvaliacoesDB.updateAvaliacao(input.id, { notaObtida: input.notaObtida?.toString(), dataAvaliacao: input.dataAvaliacao });
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
        return await AvaliacoesDB.updateAvaliacao(input.id, { ...input, peso: input.peso?.toString(), notaObtida: input.notaObtida?.toString(), notaMaxima: input.notaMaxima?.toString() });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        return await AvaliacoesDB.deleteAvaliacao(input.id);
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
        return await FaltasDB.registrarFalta({ ...input, id: crypto.randomUUID() });
      }),

    listByMatricula: protectedProcedure
      .input(z.object({ matriculaId: z.string() }))
      .query(async ({ input }) => {
        return await FaltasDB.getFaltasByMatricula(input.matriculaId);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        return await FaltasDB.deleteFalta(input.id);
      }),
  }),

  // ===== HORÁRIOS =====
  horarios: router({
    create: protectedProcedure
      .input(z.object({
        matriculaId: z.string(),
        diaSemana: z.enum(["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]),
        horaInicio: z.string(),
        horaFim: z.string(),
        local: z.string().optional(),
        criadoPor: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const matricula = await MatriculasDB.getMatricula(input.matriculaId);
        if (!matricula) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Matrícula não encontrada" });
        }
        return await HorariosDB.createHorario({ ...input, id: crypto.randomUUID(), disciplinaId: matricula.disciplinaId });
      }),

    listByDisciplina: protectedProcedure
      .input(z.object({ matriculaId: z.string() }))
      .query(async ({ input }) => {
        const matricula = await MatriculasDB.getMatricula(input.matriculaId);
        if (!matricula) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Matrícula não encontrada" });
        }
        return await HorariosDB.getHorariosByDisciplina(matricula.disciplinaId);
      }),

    listByAluno: protectedProcedure
      .input(z.object({ alunoId: z.string().optional(), periodo: z.string().optional() }).optional())
      .query(async ({ input, ctx }) => {
        const alunoId = input?.alunoId ?? ctx.user.id;
        const matriculasDoAluno = await MatriculasDB.getMatriculasByAluno(alunoId);
        
        const resultados: any[] = [];
        for (const m of (matriculasDoAluno as any[])) {
          const disciplinaId = m.matricula?.disciplinaId ?? m.disciplina?.id ?? m.disciplinaId;
          if (!disciplinaId) continue;
          
          const hs = await HorariosDB.getHorariosByDisciplina(disciplinaId);
          const horariosEnriquecidos = hs.map(h => ({
             horario: h,
             disciplina: m.disciplina,
             professor: m.professor,
             ...h
          }));
          resultados.push(...horariosEnriquecidos);
        }
        return resultados;
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        return await HorariosDB.deleteHorario(input.id);
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
        return await ComunicadosDB.createComunicado({ ...input, autor: ctx.user.name || 'Desconhecido', autorId: ctx.user.id });
      }),

    list: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        const res = await ComunicadosDB.getComunicados();
        if (input?.limit) return res.slice(0, input.limit);
        return res;
      }),

    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await ComunicadosDB.getComunicado(input.id);
      }),
  }),

  // ===== CHAT =====
  chat: router({
    getConversa: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const mensagens = await ChatDB.getMensagens(input.id);
        return { id: input.id, mensagens };
      }),

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

        if (!conversaId) {
          conversaId = await ChatDB.createConversa(usuario.id);
        }

        await ChatDB.createMensagem({
          conversaId: conversaId as string,
          role: "user",
          conteudo: input.mensagem,
        });

        const matriculasAluno = await MatriculasDB.getMatriculasByAluno(usuario.id);
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
  - Consultar/lançar notas e médias
  - Registrar faltas
  - Projeções/simulações de média
  - Consultar horários e situação geral

  Quando a pergunta envolver dados do sistema, PREFIRA usar ferramentas.
  Responda curto e confirme ações realizadas.

  Usuário: ${usuario.name || "Não informado"} • Curso: ${usuario.curso ?? "?"} • Período: ${usuario.periodo ?? "?"}
  Disciplinas do aluno:
  ${contextoDisciplinas}

  Histórico recente:
  ${(await ChatDB.getMensagens(conversaId as string)).map(m => `${m.role}: ${m.conteudo}`).join("\n")}
  `.trim();

        const messages: Message[] = [
          { role: "system", content: contextoSistema },
          { role: "user", content: input.mensagem },
        ];

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

        let resposta = await invokeLLM({ messages, tools });
        let content = resposta.choices[0]?.message?.content;
        let respostaTexto = typeof content === "string" ? content : "Desculpe, não consegui processar sua mensagem.";

        while (resposta.choices[0]?.message?.tool_calls?.length) {
          const toolCalls = resposta.choices[0].message.tool_calls!;
          messages.push(resposta.choices[0].message as any);

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

          messages.push(...toolResponses);
          resposta = await invokeLLM({ messages, tools });
          content = resposta.choices[0]?.message?.content;
          respostaTexto = typeof content === "string" ? content : "Desculpe, não consegui processar sua mensagem.";
        }

        await ChatDB.createMensagem({
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

export type AppRouter = typeof appRouter;