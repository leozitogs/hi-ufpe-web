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
        const matriculas = await db.getMatriculasByAluno(alunoId);
        const resultados: any[] = [];
        for (const m of (matriculas as any[])) {
          const disciplinaId = m.matricula?.disciplinaId ?? m.disciplina?.id ?? m.disciplinaId;
          if (!disciplinaId) continue;
          const hs = await db.getHorariosByDisciplina(disciplinaId);
          resultados.push(...(hs || []));
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

    enviarMensagem: protectedProcedure
      .input(z.object({
        conversaId: z.string().optional(),
        mensagem: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const usuario = ctx.user;
        let conversaId = input.conversaId;

        if (!conversaId) {
          conversaId = await db.createConversa(usuario.id);
        }

        await db.createMensagem({
          conversaId: conversaId as string,
          role: "user",
          conteudo: input.mensagem,
        });

        // Gerar contexto para a IA
        const matriculasAluno = await db.getMatriculasByAluno(usuario.id);

        // build contexto defensivamente
        const contextoDisciplinas = (matriculasAluno as any[]).map(m => {
          const mat = m?.matricula ?? {};
          const disciplina = m?.disciplina ?? {};
          const periodo = mat?.periodo ?? m?.periodo ?? 'N/A';
          const media = mat?.media ?? m?.media ?? 'N/A';
          const faltas = mat?.faltas ?? m?.faltas ?? 0;
          const status = mat?.status ?? m?.status ?? 'N/A';
          return `Disciplina: ${disciplina?.nome ?? 'N/A'} (${disciplina?.codigo ?? 'N/A'}), Período: ${periodo}, Média: ${media}, Faltas: ${faltas}, Status: ${status}`;
        }).join('\n');

        const contextoSistema = `Você é o Hi, assistente virtual do Hub Inteligente UFPE.\n\nVocê pode executar as seguintes ações para ajudar o aluno:\n- Consultar médias e notas\n- Lançar notas em avaliações\n- Registrar faltas\n- Calcular projeções e simulações\n- Consultar horários e próximas aulas\n- Consultar situação geral\n\nQuando o aluno mencionar uma nota, falta ou quiser saber informações, USE AS FUNÇÕES DISPONÍVEIS.\n\nInformações do usuário:\n- Nome: ${usuario.name || 'Não informado'}\n- Curso: ${usuario.curso}\n- Período: ${usuario.periodo}\n\nDisciplinas do aluno:\n${contextoDisciplinas}\n\nHistórico de conversas:\n${(await db.getMensagens(conversaId as string)).map(m => `${m.role}: ${m.conteudo}`).join('\n')}\n`;

        const messages: Message[] = [
          { role: "system", content: contextoSistema },
          { role: "user", content: input.mensagem },
        ];

        // Importar funções do chatbot
        const chatbotFunctions = getChatbotFunctions(ctx.user.id);
        const tools: OpenAITool[] = Object.values(chatbotFunctions).map((f: ChatbotFunctionEntry) => ({
          type: "function",
          function: f.tool,
        }));
        
        // Chamar IA com Function Calling
        let resposta = await invokeLLM({ messages, tools });
        let content = resposta.choices[0]?.message?.content;
        let respostaTexto = typeof content === 'string' ? content : "Desculpe, não consegui processar sua mensagem.";
        
        // Loop de Function Calling
        while (resposta.choices[0]?.message?.tool_calls) {
          const toolCalls = resposta.choices[0].message.tool_calls;
          
          // Adicionar a chamada de função ao histórico
          messages.push(resposta.choices[0].message as any);

          const toolResponses = [];
          for (const call of toolCalls) {
            const functionName = call.function.name as keyof typeof chatbotFunctions;
            const functionToCall = chatbotFunctions[functionName];
            const args = JSON.parse(call.function.arguments);
            
            // Executar a função
            const functionResult = await functionToCall.execute(args);
            
            // Adicionar o resultado ao histórico
            toolResponses.push({
              role: "tool" as const,
              tool_call_id: call.id,
              content: JSON.stringify(functionResult),
            });
          }
          
          messages.push(...toolResponses);

          // Chamar IA novamente com o resultado da função
          resposta = await invokeLLM({ messages, tools });
          content = resposta.choices[0]?.message?.content;
          respostaTexto = typeof content === 'string' ? content : "Desculpe, não consegui processar sua mensagem.";
        }

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
