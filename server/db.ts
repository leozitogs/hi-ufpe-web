import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  disciplinas, professores, horarios, matriculas, 
  comunicados, conversas, mensagens, uploads, eventos,
  metodosAvaliacao, avaliacoes, registroFaltas,
  Disciplina, Professor, Horario, Matricula, Comunicado,
  Conversa, Mensagem, Upload, Evento,
  MetodoAvaliacao, Avaliacao, RegistroFalta,
  InsertDisciplina, InsertMatricula, InsertMetodoAvaliacao, InsertAvaliacao, InsertRegistroFalta, InsertHorario
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ===== USERS =====

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { id: user.id };
    const updateSet: Record<string, unknown> = {};

    const fields = ["name", "email", "loginMethod", "matricula", "curso"] as const;
    fields.forEach(field => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    });

    if (user.periodo !== undefined) {
      values.periodo = user.periodo;
      updateSet.periodo = user.periodo;
    }

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }

    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    } else {
      values.role = user.role;
      updateSet.role = user.role;
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== DISCIPLINAS =====

export async function getDisciplinas(): Promise<Disciplina[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(disciplinas).orderBy(disciplinas.codigo);
}

export async function getDisciplina(id: string): Promise<Disciplina | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(disciplinas).where(eq(disciplinas.id, id)).limit(1);
  return result[0] || null;
}

export async function createDisciplina(disciplina: InsertDisciplina): Promise<Disciplina> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = disciplina.id || `disc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.insert(disciplinas).values({
    ...disciplina,
    id,
  });
  
  const [result] = await db.select().from(disciplinas).where(eq(disciplinas.id, id));
  return result;
}

export async function getDisciplinasByAluno(alunoId: string, periodo?: string): Promise<Disciplina[]> {
  const db = await getDb();
  if (!db) return [];
  
  let conditions = eq(matriculas.alunoId, alunoId);
  
  if (periodo) {
    conditions = and(
      eq(matriculas.alunoId, alunoId),
      eq(matriculas.periodo, periodo)
    ) as any;
  }
  
  const results = await db
    .select({ disciplina: disciplinas })
    .from(disciplinas)
    .innerJoin(matriculas, eq(disciplinas.id, matriculas.disciplinaId))
    .where(conditions);
  
  return results.map(r => r.disciplina);
}

export async function updateDisciplina(id: string, data: Partial<InsertDisciplina>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(disciplinas).set(data).where(eq(disciplinas.id, id));
}

export async function deleteDisciplina(id: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Deletar matrículas associadas
  await db.delete(matriculas).where(eq(matriculas.disciplinaId, id));
  
  // Deletar horários associados
  await db.delete(horarios).where(eq(horarios.disciplinaId, id));
  
  // Deletar disciplina
  await db.delete(disciplinas).where(eq(disciplinas.id, id));
}

// ===== PROFESSORES =====

export async function getProfessores(): Promise<Professor[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(professores).orderBy(professores.nome);
}

export async function getProfessor(id: string): Promise<Professor | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(professores).where(eq(professores.id, id)).limit(1);
  return result[0];
}

// ===== HORÁRIOS =====

export async function getHorarios(periodo?: string): Promise<Horario[]> {
  const db = await getDb();
  if (!db) return [];
  
  if (periodo) {
    return await db.select().from(horarios)
      .where(eq(horarios.periodo, periodo))
      .orderBy(horarios.diaSemana, horarios.horaInicio);
  }
  
  return await db.select().from(horarios)
    .orderBy(horarios.diaSemana, horarios.horaInicio);
}

export async function getHorariosByAluno(alunoId: string, periodo: string) {
  const db = await getDb();
  if (!db) return [];
  
  // Join com matriculas para pegar apenas horários das disciplinas do aluno
  const result = await db
    .select({
      horario: horarios,
      disciplina: disciplinas,
      professor: professores,
    })
    .from(horarios)
    .innerJoin(matriculas, eq(horarios.disciplinaId, matriculas.disciplinaId))
    .innerJoin(disciplinas, eq(horarios.disciplinaId, disciplinas.id))
    .innerJoin(professores, eq(horarios.professorId, professores.id))
    .where(
      and(
        eq(matriculas.alunoId, alunoId),
        eq(matriculas.periodo, periodo),
        eq(horarios.periodo, periodo)
      )
    )
    .orderBy(horarios.diaSemana, horarios.horaInicio);
  
  return result;
}

export async function getHorariosByDisciplina(disciplinaId: string): Promise<Horario[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(horarios).where(eq(horarios.disciplinaId, disciplinaId));
}

export async function createHorario(horario: InsertHorario): Promise<Horario> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = horario.id || `hora_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.insert(horarios).values({
    ...horario,
    id,
  });
  
  const [result] = await db.select().from(horarios).where(eq(horarios.id, id));
  return result;
}

export async function deleteHorario(id: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(horarios).where(eq(horarios.id, id));
}

// ===== MATRÍCULAS =====

export async function getMatriculasByAluno(alunoId: string, periodo?: string) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = periodo 
    ? and(eq(matriculas.alunoId, alunoId), eq(matriculas.periodo, periodo))
    : eq(matriculas.alunoId, alunoId);
  
  const result = await db
    .select({
      matricula: matriculas,
      disciplina: disciplinas,
      professor: professores,
    })
    .from(matriculas)
    .innerJoin(disciplinas, eq(matriculas.disciplinaId, disciplinas.id))
    .leftJoin(professores, eq(disciplinas.professorId, professores.id))
    .where(conditions)
    .orderBy(disciplinas.nome);
  
  return result;
}

export async function getMatricula(id: string): Promise<Matricula | null> {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db.select().from(matriculas).where(eq(matriculas.id, id));
  return result || null;
}

export async function createMatricula(matricula: InsertMatricula): Promise<Matricula> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = matricula.id || `mat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.insert(matriculas).values({
    ...matricula,
    id,
  });
  
  const [result] = await db.select().from(matriculas).where(eq(matriculas.id, id));
  return result;
}

export async function updateMatricula(id: string, data: Partial<InsertMatricula>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(matriculas).set({
    ...data,
    updatedAt: new Date(),
  }).where(eq(matriculas.id, id));
}

export async function deleteMatricula(id: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Buscar método de avaliação associado
  const [matricula] = await db.select().from(matriculas).where(eq(matriculas.id, id));
  
  if (matricula?.metodoAvaliacaoId) {
    // Deletar avaliações do método
    await db.delete(avaliacoes).where(eq(avaliacoes.metodoAvaliacaoId, matricula.metodoAvaliacaoId));
    
    // Deletar método de avaliação
    await db.delete(metodosAvaliacao).where(eq(metodosAvaliacao.id, matricula.metodoAvaliacaoId));
  }
  
  // Deletar registro de faltas
  await db.delete(registroFaltas).where(eq(registroFaltas.matriculaId, id));
  
  // Deletar matrícula
  await db.delete(matriculas).where(eq(matriculas.id, id));
}

// ===== MÉTODOS DE AVALIAÇÃO =====

export async function createMetodoAvaliacao(metodo: InsertMetodoAvaliacao): Promise<MetodoAvaliacao> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = metodo.id || `metodo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.insert(metodosAvaliacao).values({
    ...metodo,
    id,
  });
  
  // Atualizar matrícula com o ID do método
  await db.update(matriculas).set({
    metodoAvaliacaoId: id,
  }).where(eq(matriculas.id, metodo.matriculaId));
  
  const [result] = await db.select().from(metodosAvaliacao).where(eq(metodosAvaliacao.id, id));
  return result;
}

export async function getMetodoAvaliacaoByMatricula(matriculaId: string): Promise<MetodoAvaliacao | null> {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db.select().from(metodosAvaliacao).where(eq(metodosAvaliacao.matriculaId, matriculaId));
  return result || null;
}

export async function updateMetodoAvaliacao(id: string, data: Partial<InsertMetodoAvaliacao>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(metodosAvaliacao).set({
    ...data,
    updatedAt: new Date(),
  }).where(eq(metodosAvaliacao.id, id));
}

// ===== AVALIAÇÕES =====

export async function createAvaliacao(avaliacao: InsertAvaliacao): Promise<Avaliacao> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = avaliacao.id || `aval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.insert(avaliacoes).values({
    ...avaliacao,
    id,
  });
  
  const [result] = await db.select().from(avaliacoes).where(eq(avaliacoes.id, id));
  
  // Recalcular média da matrícula
  await recalcularMedia(avaliacao.metodoAvaliacaoId);
  
  return result;
}

export async function getAvaliacoesByMetodo(metodoAvaliacaoId: string): Promise<Avaliacao[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(avaliacoes).where(eq(avaliacoes.metodoAvaliacaoId, metodoAvaliacaoId));
}

export async function updateAvaliacao(id: string, data: Partial<InsertAvaliacao>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Buscar avaliação para pegar o metodoAvaliacaoId
  const [avaliacao] = await db.select().from(avaliacoes).where(eq(avaliacoes.id, id));
  
  await db.update(avaliacoes).set({
    ...data,
    updatedAt: new Date(),
  }).where(eq(avaliacoes.id, id));
  
  // Recalcular média
  if (avaliacao) {
    await recalcularMedia(avaliacao.metodoAvaliacaoId);
  }
}

export async function deleteAvaliacao(id: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Buscar avaliação para pegar o metodoAvaliacaoId
  const [avaliacao] = await db.select().from(avaliacoes).where(eq(avaliacoes.id, id));
  
  await db.delete(avaliacoes).where(eq(avaliacoes.id, id));
  
  // Recalcular média
  if (avaliacao) {
    await recalcularMedia(avaliacao.metodoAvaliacaoId);
  }
}

async function recalcularMedia(metodoAvaliacaoId: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  // Buscar método de avaliação
  const [metodo] = await db.select().from(metodosAvaliacao).where(eq(metodosAvaliacao.id, metodoAvaliacaoId));
  if (!metodo) return;
  
  // Buscar todas as avaliações
  const avaliacoesLista = await db.select().from(avaliacoes).where(eq(avaliacoes.metodoAvaliacaoId, metodoAvaliacaoId));
  
  // Calcular média baseado no tipo
  let media = 0;
  
  if (metodo.tipo === "media_ponderada") {
    let somaNotas = 0;
    let somaPesos = 0;
    
    avaliacoesLista.forEach(aval => {
      if (aval.notaObtida !== null) {
        somaNotas += Number(aval.notaObtida) * Number(aval.peso);
        somaPesos += Number(aval.peso);
      }
    });
    
    media = somaPesos > 0 ? somaNotas / somaPesos : 0;
  } else if (metodo.tipo === "media_simples") {
    const notasValidas = avaliacoesLista.filter(a => a.notaObtida !== null);
    const soma = notasValidas.reduce((acc, a) => acc + Number(a.notaObtida), 0);
    media = notasValidas.length > 0 ? soma / notasValidas.length : 0;
  }
  
  // Atualizar média na matrícula
  await db.update(matriculas).set({
    mediaCalculada: media.toFixed(2),
    media: media.toFixed(2),
    updatedAt: new Date(),
  }).where(eq(matriculas.id, metodo.matriculaId));
  
  // Atualizar status baseado na média
  const [matricula] = await db.select().from(matriculas).where(eq(matriculas.id, metodo.matriculaId));
  if (matricula) {
    const mediaMinima = Number(matricula.mediaMinima) || 5.0;
    const frequenciaMinima = matricula.frequenciaMinima || 75;
    const frequenciaAtual = matricula.frequencia || 0;
    
    let status: "cursando" | "aprovado" | "reprovado" = "cursando";
    
    // Verificar se todas as avaliações foram lançadas
    const todasLancadas = avaliacoesLista.every(a => a.notaObtida !== null);
    
    if (todasLancadas) {
      if (media >= mediaMinima && frequenciaAtual >= frequenciaMinima) {
        status = "aprovado";
      } else {
        status = "reprovado";
      }
    }
    
    await db.update(matriculas).set({
      status,
      updatedAt: new Date(),
    }).where(eq(matriculas.id, metodo.matriculaId));
  }
}

// ===== REGISTRO DE FALTAS =====

async function recalcularFrequencia(matriculaId: string): Promise<void> {
  const db = await getDb();
  if (!db) return;

  // 1. Buscar a matrícula para obter o disciplinaId
  const [matricula] = await db.select().from(matriculas).where(eq(matriculas.id, matriculaId));
  if (!matricula) return;

  // 2. Buscar a disciplina para obter a carga horária
  const [disciplina] = await db.select().from(disciplinas).where(eq(disciplinas.id, matricula.disciplinaId));
  if (!disciplina) return;

  // 3. Contar o total de faltas registradas
  const faltas = await db.select().from(registroFaltas).where(eq(registroFaltas.matriculaId, matriculaId));
  const totalFaltas = faltas.length;

  // 4. Calcular o total de aulas (Assumindo que Carga Horária = Total de Aulas)
  const totalAulas = Number(disciplina.cargaHoraria);
  
  let frequencia = 100;
  if (totalAulas > 0) {
    frequencia = Math.round(((totalAulas - totalFaltas) / totalAulas) * 100);
  }

  // 5. Atualizar a matrícula
  await db.update(matriculas).set({
    faltas: totalFaltas,
    frequencia,
    updatedAt: new Date(),
  }).where(eq(matriculas.id, matriculaId));
}

export async function registrarFalta(falta: InsertRegistroFalta): Promise<RegistroFalta> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = falta.id || `falta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.insert(registroFaltas).values({
    ...falta,
    id,
  });
  
  // Recalcular faltas e frequência
  await recalcularFrequencia(falta.matriculaId);
  
  const [result] = await db.select().from(registroFaltas).where(eq(registroFaltas.id, id));
  return result;
}

export async function getFaltasByMatricula(matriculaId: string): Promise<RegistroFalta[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(registroFaltas)
    .where(eq(registroFaltas.matriculaId, matriculaId))
    .orderBy(desc(registroFaltas.data));
}

export async function deleteFalta(id: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Buscar falta para pegar o matriculaId
  const [falta] = await db.select().from(registroFaltas).where(eq(registroFaltas.id, id));
  
  await db.delete(registroFaltas).where(eq(registroFaltas.id, id));
  
  // Recalcular faltas e frequência
  if (falta) {
    await recalcularFrequencia(falta.matriculaId);
  }
}

// ===== COMUNICADOS =====

export async function getComunicados(limit = 50): Promise<Comunicado[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(comunicados)
    .where(eq(comunicados.publico, true))
    .orderBy(desc(comunicados.dataPublicacao))
    .limit(limit);
}

export async function getComunicado(id: string): Promise<Comunicado | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(comunicados).where(eq(comunicados.id, id)).limit(1);
  return result[0];
}

export async function createComunicado(data: {
  titulo: string;
  conteudo: string;
  autor: string;
  autorId: string;
  tipo?: "geral" | "academico" | "administrativo" | "evento" | "urgente";
  prioridade?: "baixa" | "media" | "alta";
  publico?: boolean;
  dataExpiracao?: Date;
  anexos?: string;
}): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = `com_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.insert(comunicados).values({
    id,
    titulo: data.titulo,
    conteudo: data.conteudo,
    autor: data.autor,
    autorId: data.autorId,
    tipo: data.tipo || "geral",
    prioridade: data.prioridade || "media",
    publico: data.publico ?? true,
    dataExpiracao: data.dataExpiracao,
    anexos: data.anexos,
  });
  
  return id;
}

// ===== CONVERSAS E MENSAGENS DO CHATBOT =====

export async function getConversasByUsuario(usuarioId: string): Promise<Conversa[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(conversas)
    .where(eq(conversas.usuarioId, usuarioId))
    .orderBy(desc(conversas.updatedAt));
}

export async function getConversa(id: string): Promise<Conversa | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(conversas).where(eq(conversas.id, id)).limit(1);
  return result[0];
}

export async function createConversa(usuarioId: string, titulo?: string): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.insert(conversas).values({
    id,
    usuarioId,
    titulo: titulo ?? "Nova conversa",
  });
  
  return id;
}

export async function getMensagens(conversaId: string): Promise<Mensagem[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(mensagens)
    .where(eq(mensagens.conversaId, conversaId))
    .orderBy(mensagens.createdAt);
}

export async function createMensagem(data: {
  conversaId: string;
  role: "user" | "assistant" | "system";
  conteudo: string;
  metadata?: string;
}): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.insert(mensagens).values({
    id,
    conversaId: data.conversaId,
    role: data.role,
    conteudo: data.conteudo,
    metadata: data.metadata,
  });
  
  // Atualizar timestamp da conversa
  await db.update(conversas)
    .set({ updatedAt: new Date() })
    .where(eq(conversas.id, data.conversaId));
  
  return id;
}

// ===== UPLOADS =====

export async function getUploads(limit = 100): Promise<Upload[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(uploads)
    .orderBy(desc(uploads.createdAt))
    .limit(limit);
}

export async function createUpload(data: {
  nome: string;
  tipo: "planilha_horarios" | "planilha_notas" | "planilha_alunos" | "documento" | "outro";
  url: string;
  tamanho?: number;
  mimeType?: string;
  uploadPor: string;
}): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = `upl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.insert(uploads).values({
    id,
    nome: data.nome,
    tipo: data.tipo,
    url: data.url,
    tamanho: data.tamanho,
    mimeType: data.mimeType,
    uploadPor: data.uploadPor,
  });
  
  return id;
}

export async function markUploadProcessado(id: string, erros?: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.update(uploads)
    .set({ 
      processado: true,
      erros: erros || null,
    })
    .where(eq(uploads.id, id));
}

// ===== EVENTOS =====

export async function getEventos(inicio?: Date, fim?: Date): Promise<Evento[]> {
  const db = await getDb();
  if (!db) return [];
  
  if (inicio && fim) {
    return await db.select().from(eventos)
      .where(
        and(
          sql`${eventos.dataInicio} >= ${inicio}`,
          sql`${eventos.dataInicio} <= ${fim}`
        )
      )
      .orderBy(eventos.dataInicio);
  }
  
  return await db.select().from(eventos).orderBy(eventos.dataInicio);
}

export async function createEvento(data: {
  titulo: string;
  descricao?: string;
  tipo: "prova" | "trabalho" | "feriado" | "evento" | "prazo";
  dataInicio: Date;
  dataFim?: Date;
  local?: string;
  disciplinaId?: string;
}): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.insert(eventos).values({
    id,
    ...data,
  });
  
  return id;
}