/**
 * Funções disponíveis para o chatbot executar via function calling
 */

import * as db from "../db";
import { eq, and } from "drizzle-orm";
import { matriculas } from "../../drizzle/schema";

// Definições das funções para a OpenAI
export const CHATBOT_FUNCTIONS = [
  {
    name: "consultar_media",
    description: "Consulta a média atual do aluno em uma disciplina específica",
    parameters: {
      type: "object",
      properties: {
        disciplina: {
          type: "string",
          description: "Nome da disciplina (ex: 'Desenvolvimento de Software', 'Banco de Dados')",
        },
      },
      required: ["disciplina"],
    },
  },
  {
    name: "lancar_nota",
    description: "Lança uma nota em uma avaliação específica de uma disciplina",
    parameters: {
      type: "object",
      properties: {
        disciplina: {
          type: "string",
          description: "Nome da disciplina",
        },
        avaliacao: {
          type: "string",
          description: "Nome da avaliação (ex: 'Prova 1', 'AP 1', 'Trabalho Final')",
        },
        nota: {
          type: "number",
          description: "Nota obtida (0-10)",
        },
      },
      required: ["disciplina", "avaliacao", "nota"],
    },
  },
  {
    name: "registrar_falta",
    description: "Registra uma falta do aluno em uma disciplina",
    parameters: {
      type: "object",
      properties: {
        disciplina: {
          type: "string",
          description: "Nome da disciplina",
        },
        data: {
          type: "string",
          description: "Data da falta (formato YYYY-MM-DD)",
        },
        justificada: {
          type: "boolean",
          description: "Se a falta é justificada",
        },
        justificativa: {
          type: "string",
          description: "Justificativa da falta (opcional)",
        },
      },
      required: ["disciplina", "data"],
    },
  },
  {
    name: "calcular_projecao",
    description: "Calcula quanto o aluno precisa tirar nas próximas avaliações para atingir uma média desejada",
    parameters: {
      type: "object",
      properties: {
        disciplina: {
          type: "string",
          description: "Nome da disciplina",
        },
        media_desejada: {
          type: "number",
          description: "Média que o aluno deseja atingir (0-10)",
        },
      },
      required: ["disciplina", "media_desejada"],
    },
  },
  {
    name: "simular_nota",
    description: "Simula qual seria a média final se o aluno tirar determinada nota em uma avaliação futura",
    parameters: {
      type: "object",
      properties: {
        disciplina: {
          type: "string",
          description: "Nome da disciplina",
        },
        avaliacao: {
          type: "string",
          description: "Nome da avaliação futura",
        },
        nota_simulada: {
          type: "number",
          description: "Nota a ser simulada (0-10)",
        },
      },
      required: ["disciplina", "avaliacao", "nota_simulada"],
    },
  },
  {
    name: "consultar_faltas",
    description: "Consulta o número de faltas do aluno em uma disciplina",
    parameters: {
      type: "object",
      properties: {
        disciplina: {
          type: "string",
          description: "Nome da disciplina",
        },
      },
      required: ["disciplina"],
    },
  },
  {
    name: "consultar_proxima_aula",
    description: "Consulta qual é a próxima aula do aluno",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "consultar_situacao_geral",
    description: "Consulta a situação geral do aluno em todas as disciplinas (médias, status, faltas)",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
];

// Executor de funções
export async function executarFuncao(
  alunoId: string,
  functionName: string,
  args: any
): Promise<any> {
  switch (functionName) {
    case "consultar_media":
      return await consultarMedia(alunoId, args.disciplina);
    
    case "lancar_nota":
      return await lancarNota(alunoId, args.disciplina, args.avaliacao, args.nota);
    
    case "registrar_falta":
      return await registrarFalta(alunoId, args.disciplina, args.data, args.justificada, args.justificativa);
    
    case "calcular_projecao":
      return await calcularProjecao(alunoId, args.disciplina, args.media_desejada);
    
    case "simular_nota":
      return await simularNota(alunoId, args.disciplina, args.avaliacao, args.nota_simulada);
    
    case "consultar_faltas":
      return await consultarFaltas(alunoId, args.disciplina);
    
    case "consultar_proxima_aula":
      return await consultarProximaAula(alunoId);
    
    case "consultar_situacao_geral":
      return await consultarSituacaoGeral(alunoId);
    
    default:
      return { error: "Função não encontrada" };
  }
}

// Implementação das funções

async function consultarMedia(alunoId: string, disciplinaNome: string) {
  try {
    // Buscar matrícula
    const matriculasLista = await db.getMatriculasByAluno(alunoId);
    const matricula = matriculasLista.find((m: any) =>
      m.disciplina.nome.toLowerCase().includes(disciplinaNome.toLowerCase())
    );
    
    if (!matricula) {
      return { error: "Disciplina não encontrada nas suas matrículas" };
    }
    
    // Buscar método de avaliação e avaliações
    const metodo = await db.getMetodoAvaliacaoByMatricula(matricula.matricula.id);
    if (!metodo) {
      return {
        disciplina: matricula.disciplina.nome,
        media: matricula.matricula.media || "0.00",
        status: matricula.matricula.status,
        mensagem: "Método de avaliação não configurado",
      };
    }
    
    const avaliacoes = await db.getAvaliacoesByMetodo(metodo.id);
    
    return {
      disciplina: matricula.disciplina.nome,
      media: matricula.matricula.mediaCalculada || matricula.matricula.media || "0.00",
      status: matricula.matricula.status,
      metodo: metodo.nome,
      avaliacoes: avaliacoes.map((a: any) => ({
        nome: a.nome,
        tipo: a.tipo,
        peso: a.peso,
        notaObtida: a.notaObtida,
        notaMaxima: a.notaMaxima,
      })),
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function lancarNota(
  alunoId: string,
  disciplinaNome: string,
  avaliacaoNome: string,
  nota: number
) {
  try {
    // Buscar matrícula
    const matriculasLista = await db.getMatriculasByAluno(alunoId);
    const matricula = matriculasLista.find((m: any) =>
      m.disciplina.nome.toLowerCase().includes(disciplinaNome.toLowerCase())
    );
    
    if (!matricula) {
      return { error: "Disciplina não encontrada" };
    }
    
    // Buscar método e avaliações
    const metodo = await db.getMetodoAvaliacaoByMatricula(matricula.matricula.id);
    if (!metodo) {
      return { error: "Método de avaliação não configurado para esta disciplina" };
    }
    
    const avaliacoes = await db.getAvaliacoesByMetodo(metodo.id);
    const avaliacao = avaliacoes.find((a: any) =>
      a.nome.toLowerCase().includes(avaliacaoNome.toLowerCase())
    );
    
    if (!avaliacao) {
      return { error: `Avaliação '${avaliacaoNome}' não encontrada` };
    }
    
    // Lançar nota
    await db.updateAvaliacao(avaliacao.id, {
      notaObtida: nota.toString(),
      dataAvaliacao: new Date(),
    });
    
    // Buscar média atualizada
    const matriculaAtualizada = await db.getMatricula(matricula.matricula.id);
    
    return {
      sucesso: true,
      disciplina: matricula.disciplina.nome,
      avaliacao: avaliacao.nome,
      nota: nota,
      media_atualizada: matriculaAtualizada?.mediaCalculada || matriculaAtualizada?.media,
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function registrarFalta(
  alunoId: string,
  disciplinaNome: string,
  data: string,
  justificada?: boolean,
  justificativa?: string
) {
  try {
    // Buscar matrícula
    const matriculasLista = await db.getMatriculasByAluno(alunoId);
    const matricula = matriculasLista.find((m: any) =>
      m.disciplina.nome.toLowerCase().includes(disciplinaNome.toLowerCase())
    );
    
    if (!matricula) {
      return { error: "Disciplina não encontrada" };
    }
    
    // Registrar falta
    await db.registrarFalta({
      matriculaId: matricula.matricula.id,
      data: new Date(data),
      justificada: justificada || false,
      justificativa,
    } as any);
    
    // Buscar matrícula atualizada
    const matriculaAtualizada = await db.getMatricula(matricula.matricula.id);
    
    return {
      sucesso: true,
      disciplina: matricula.disciplina.nome,
      total_faltas: matriculaAtualizada?.faltas || 0,
      frequencia: matriculaAtualizada?.frequencia || 100,
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function calcularProjecao(
  alunoId: string,
  disciplinaNome: string,
  mediaDesejada: number
) {
  try {
    // Buscar matrícula e avaliações
    const matriculasLista = await db.getMatriculasByAluno(alunoId);
    const matricula = matriculasLista.find((m: any) =>
      m.disciplina.nome.toLowerCase().includes(disciplinaNome.toLowerCase())
    );
    
    if (!matricula) {
      return { error: "Disciplina não encontrada" };
    }
    
    const metodo = await db.getMetodoAvaliacaoByMatricula(matricula.matricula.id);
    if (!metodo) {
      return { error: "Método de avaliação não configurado" };
    }
    
    const avaliacoes = await db.getAvaliacoesByMetodo(metodo.id);
    
    if (metodo.tipo === "media_simples") {
      return { error: "Projeção de nota não implementada para Média Simples." };
    }
    
    // Apenas média ponderada é suportada por enquanto
    let somaPesosLancados = 0;
    let somaNotasLancadas = 0;
    let pesoRestante = 0;
    const avaliacoesPendentes = [];

    for (const a of avaliacoes) {
      const peso = Number(a.peso);
      if (a.notaObtida !== null) {
        somaPesosLancados += peso;
        somaNotasLancadas += Number(a.notaObtida) * peso;
      } else {
        pesoRestante += peso;
        avaliacoesPendentes.push({ nome: a.nome, peso: a.peso });
      }
    }

    if (pesoRestante === 0) {
      return {
        mensagem: "Todas as notas já foram lançadas. Não há como calcular projeção.",
        media_final: (somaNotasLancadas / somaPesosLancados).toFixed(2),
      };
    }

    const notaNecessaria = (mediaDesejada * (somaPesosLancados + pesoRestante) - somaNotasLancadas) / pesoRestante;

    return {
      disciplina: matricula.disciplina.nome,
      media_desejada: mediaDesejada,
      nota_necessaria: notaNecessaria.toFixed(2),
      contexto: `Para alcançar a média ${mediaDesejada}, você precisa obter uma média ponderada de ${notaNecessaria.toFixed(2)} nas avaliações restantes.`,
      avaliacoes_pendentes: avaliacoesPendentes,
    };

  } catch (error: any) {
    return { error: error.message };
  }
}

async function simularNota(
  alunoId: string,
  disciplinaNome: string,
  avaliacaoNome: string,
  notaSimulada: number
) {
  try {
    // Buscar matrícula e avaliações
    const matriculasLista = await db.getMatriculasByAluno(alunoId);
    const matricula = matriculasLista.find((m: any) =>
      m.disciplina.nome.toLowerCase().includes(disciplinaNome.toLowerCase())
    );
    
    if (!matricula) {
      return { error: "Disciplina não encontrada" };
    }
    
    const metodo = await db.getMetodoAvaliacaoByMatricula(matricula.matricula.id);
    if (!metodo) {
      return { error: "Método de avaliação não configurado" };
    }

    if (metodo.tipo !== "media_ponderada") {
      return { error: `Simulação de nota suportada apenas para Média Ponderada. Método atual: ${metodo.tipo}` };
    }
    
    const avaliacoes = await db.getAvaliacoesByMetodo(metodo.id);
    const avaliacao = avaliacoes.find((a: any) =>
      a.nome.toLowerCase().includes(avaliacaoNome.toLowerCase())
    );
    
    if (!avaliacao) {
      return { error: `Avaliação '${avaliacaoNome}' não encontrada` };
    }
    
    // Calcular média simulada
    let somaNotas = 0;
    let somaPesos = 0;
    
    avaliacoes.forEach((a: any) => {
      let nota: number | null = null;
      let peso = Number(a.peso);

      if (a.id === avaliacao.id) {
        // É a avaliação simulada
        nota = notaSimulada;
      } else if (a.notaObtida) {
        // É uma avaliação já lançada
        nota = Number(a.notaObtida);
      }
      
      if (nota !== null) {
        somaNotas += nota * peso;
        somaPesos += peso;
      }
    });
    
    const mediaSimulada = somaPesos > 0 ? somaNotas / somaPesos : 0;
    const mediaAtual = Number(matricula.matricula.mediaCalculada || matricula.matricula.media || 0);
    
    return {
      disciplina: matricula.disciplina.nome,
      avaliacao: avaliacao.nome,
      nota_simulada: notaSimulada,
      media_atual: mediaAtual.toFixed(2),
      media_simulada: mediaSimulada.toFixed(2),
      diferenca: (mediaSimulada - mediaAtual).toFixed(2),
      total_pesos_considerados: somaPesos,
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function consultarFaltas(alunoId: string, disciplinaNome: string) {
  try {
    // Buscar matrícula
    const matriculasLista = await db.getMatriculasByAluno(alunoId);
    const matricula = matriculasLista.find((m: any) =>
      m.disciplina.nome.toLowerCase().includes(disciplinaNome.toLowerCase())
    );
    
    if (!matricula) {
      return { error: "Disciplina não encontrada" };
    }
    
    const faltas = await db.getFaltasByMatricula(matricula.matricula.id);
    
    return {
      disciplina: matricula.disciplina.nome,
      total_faltas: matricula.matricula.faltas || 0,
      frequencia: matricula.matricula.frequencia || 100,
            limite_faltas: Math.floor((matricula.disciplina.cargaHoraria ?? 0) * 0.25),
      faltas_registradas: faltas.map((f: any) => ({
        data: f.data.toISOString().split('T')[0],
        justificada: f.justificada,
        justificativa: f.justificativa,
      })),
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function consultarProximaAula(alunoId: string) {
  try {
    const hoje = new Date();
    const diaSemanaAtual = hoje.getDay(); // 0 (Domingo) - 6 (Sábado)
    const horaAtual = hoje.getHours() + hoje.getMinutes() / 60;

    const horarios = await db.getHorariosByAluno(alunoId, "2025.1");

    if (!horarios || horarios.length === 0) {
      return { mensagem: "Você não tem horários cadastrados para o período atual." };
    }

    let proximaAula: any = null;

    // 1. Procurar no dia de hoje
    const aulasDeHoje = horarios
      .filter((h: any) => h.horario.diaSemana === diaSemanaAtual)
      .sort((a: any, b: any) => parseFloat(a.horario.horaInicio) - parseFloat(b.horario.horaInicio));

    for (const aula of aulasDeHoje) {
      if (parseFloat(aula.horario.horaInicio) > horaAtual) {
        proximaAula = aula;
        break;
      }
    }

    // 2. Se não encontrou, procurar nos próximos dias da semana
    if (!proximaAula) {
      for (let i = 1; i <= 7; i++) {
        const proximoDia = (diaSemanaAtual + i) % 7;
        const aulasDoDia = horarios
          .filter((h: any) => h.horario.diaSemana === proximoDia)
          .sort((a: any, b: any) => parseFloat(a.horario.horaInicio) - parseFloat(b.horario.horaInicio));

        if (aulasDoDia.length > 0) {
          proximaAula = aulasDoDia[0];
          break;
        }
      }
    }

    if (!proximaAula) {
      return { mensagem: "Não foi possível encontrar sua próxima aula." };
    }

    const diasDaSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

    return {
      disciplina: proximaAula.disciplina.nome,
      dia_semana: diasDaSemana[proximaAula.horario.diaSemana],
      hora_inicio: proximaAula.horario.horaInicio,
      hora_fim: proximaAula.horario.horaFim,
      local: proximaAula.horario.local,
      professor: proximaAula.professor.nome,
    };

  } catch (error: any) {
    return { error: error.message };
  }
}

async function consultarSituacaoGeral(alunoId: string) {
  try {
    const matriculasLista = await db.getMatriculasByAluno(alunoId, "2025.1");
    
    if (!matriculasLista || matriculasLista.length === 0) {
      return { mensagem: "Você não está matriculado em nenhuma disciplina neste período." };
    }
    
    const situacao = matriculasLista.map((m: any) => ({
      disciplina: m.disciplina.nome,
      media: m.matricula.mediaCalculada || m.matricula.media || "N/A",
      status: m.matricula.status,
      frequencia: m.matricula.frequencia,
    }));
    
    return { situacao };
    
  } catch (error: any) {
    return { error: error.message };
  }
}

export type ChatbotFunctionEntry = {
  tool: {
    name: string;
    description: string;
    parameters: { type: string; properties: Record<string, unknown>; required: string[]; };
  };
  execute: (args: any) => Promise<any>;
};

export const chatbotFunctions = {
  consultar_media: {
    tool: CHATBOT_FUNCTIONS[0],
    execute: (args: any) => consultarMedia(args.alunoId, args.disciplina),
  },
  lancar_nota: {
    tool: CHATBOT_FUNCTIONS[1],
    execute: (args: any) => lancarNota(args.alunoId, args.disciplina, args.avaliacao, args.nota),
  },
  registrar_falta: {
    tool: CHATBOT_FUNCTIONS[2],
    execute: (args: any) => registrarFalta(args.alunoId, args.disciplina, args.data, args.justificada, args.justificativa),
  },
  calcular_projecao: {
    tool: CHATBOT_FUNCTIONS[3],
    execute: (args: any) => calcularProjecao(args.alunoId, args.disciplina, args.media_desejada),
  },
  simular_nota: {
    tool: CHATBOT_FUNCTIONS[4],
    execute: (args: any) => simularNota(args.alunoId, args.disciplina, args.avaliacao, args.nota_simulada),
  },
  consultar_faltas: {
    tool: CHATBOT_FUNCTIONS[5],
    execute: (args: any) => consultarFaltas(args.alunoId, args.disciplina),
  },
  consultar_proxima_aula: {
    tool: CHATBOT_FUNCTIONS[6],
    execute: (args: any) => consultarProximaAula(args.alunoId),
  },
  consultar_situacao_geral: {
    tool: CHATBOT_FUNCTIONS[7],
    execute: (args: any) => consultarSituacaoGeral(args.alunoId),
  },
} as const;

export function getChatbotFunctions(alunoId: string) {
  return Object.fromEntries(
    Object.entries(chatbotFunctions).map(([key, value]) => [
      key,
      {
        tool: value.tool,
        execute: (args: any) => (value as any).execute({ ...args, alunoId }),
      },
    ])
  );
}