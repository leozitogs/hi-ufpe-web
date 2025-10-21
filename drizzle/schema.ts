import { mysqlEnum, mysqlTable, text, timestamp, varchar, int, boolean, decimal, date } from "drizzle-orm/mysql-core";

/**
 * Schema do Hi UFPE - Hub Inteligente
 * Atualizado com sistema de avaliação flexível
 */

// Tabela de usuários (já existente, estendida)
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "professor", "secgrad"]).default("user").notNull(),
  matricula: varchar("matricula", { length: 20 }), // Matrícula do aluno
  curso: varchar("curso", { length: 200 }), // Curso do aluno
  periodo: varchar("periodo", { length: 10 }), // Período atual (ex: "2025.2")
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

// Disciplinas (atualizada para suportar disciplinas criadas por alunos)
export const disciplinas = mysqlTable("disciplinas", {
  id: varchar("id", { length: 64 }).primaryKey(),
  codigo: varchar("codigo", { length: 20 }), // IF668, etc (opcional para disciplinas do aluno)
  nome: varchar("nome", { length: 200 }).notNull(),
  descricao: text("descricao"),
  creditos: int("creditos"),
  cargaHoraria: int("cargaHoraria"), // Carga horária total
  departamento: varchar("departamento", { length: 100 }),
  ementa: text("ementa"),
  professorId: varchar("professorId", { length: 64 }), // FK para professores (opcional)
  criadoPor: varchar("criadoPor", { length: 64 }), // ID do usuário que criou (null = oficial)
  oficial: boolean("oficial").default(false).notNull(), // Disciplina oficial da universidade
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Professores
export const professores = mysqlTable("professores", {
  id: varchar("id", { length: 64 }).primaryKey(),
  nome: varchar("nome", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }),
  departamento: varchar("departamento", { length: 100 }),
  sala: varchar("sala", { length: 50 }),
  telefone: varchar("telefone", { length: 20 }),
  lattes: varchar("lattes", { length: 500 }),
  foto: varchar("foto", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

// Horários de aula (atualizada para suportar horários criados por alunos)
export const horarios = mysqlTable("horarios", {
  id: varchar("id", { length: 64 }).primaryKey(),
  disciplinaId: varchar("disciplinaId", { length: 64 }).notNull(),
  professorId: varchar("professorId", { length: 64 }), // Opcional
  diaSemana: mysqlEnum("diaSemana", ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]).notNull(),
  horaInicio: varchar("horaInicio", { length: 5 }).notNull(), // "08:00"
  horaFim: varchar("horaFim", { length: 5 }).notNull(), // "10:00"
  sala: varchar("sala", { length: 50 }),
  periodo: varchar("periodo", { length: 10 }), // "2025.2"
  criadoPor: varchar("criadoPor", { length: 64 }), // ID do usuário que criou
  matriculaId: varchar("matriculaId", { length: 64 }), // FK para matriculas (para horários pessoais)
  createdAt: timestamp("createdAt").defaultNow(),
});

// Matrículas (atualizada para suportar avaliações flexíveis)
export const matriculas = mysqlTable("matriculas", {
  id: varchar("id", { length: 64 }).primaryKey(),
  alunoId: varchar("alunoId", { length: 64 }).notNull(),
  disciplinaId: varchar("disciplinaId", { length: 64 }).notNull(),
  periodo: varchar("periodo", { length: 10 }).notNull(), // "2025.2"
  
  // Sistema de avaliação flexível
  metodoAvaliacaoId: varchar("metodoAvaliacaoId", { length: 64 }), // FK para metodos_avaliacao
  mediaCalculada: decimal("mediaCalculada", { precision: 5, scale: 2 }), // Média calculada automaticamente
  mediaMinima: decimal("mediaMinima", { precision: 5, scale: 2 }).default("5.00"), // Média mínima para aprovação
  frequenciaMinima: int("frequenciaMinima").default(75), // Frequência mínima (%)
  
  // Campos legados (mantidos para compatibilidade)
  nota1: decimal("nota1", { precision: 5, scale: 2 }),
  nota2: decimal("nota2", { precision: 5, scale: 2 }),
  nota3: decimal("nota3", { precision: 5, scale: 2 }),
  notaFinal: decimal("notaFinal", { precision: 5, scale: 2 }),
  media: decimal("media", { precision: 5, scale: 2 }), // Média final
  frequencia: int("frequencia"), // Frequência atual (%)
  faltas: int("faltas").default(0), // Número de faltas
  
  status: mysqlEnum("status", ["cursando", "aprovado", "reprovado", "trancado"]).default("cursando").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// NOVA TABELA: Métodos de Avaliação Personalizados
export const metodosAvaliacao = mysqlTable("metodos_avaliacao", {
  id: varchar("id", { length: 64 }).primaryKey(),
  matriculaId: varchar("matriculaId", { length: 64 }).notNull(), // FK para matriculas
  nome: varchar("nome", { length: 200 }).notNull(), // Ex: "2 Provas + 3 APs"
  descricao: text("descricao"), // Descrição detalhada
  formula: text("formula").notNull(), // JSON com a fórmula de cálculo
  tipo: mysqlEnum("tipo", ["media_simples", "media_ponderada", "media_com_substituicao", "personalizado"]).default("media_ponderada").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// NOVA TABELA: Avaliações Individuais
export const avaliacoes = mysqlTable("avaliacoes", {
  id: varchar("id", { length: 64 }).primaryKey(),
  metodoAvaliacaoId: varchar("metodoAvaliacaoId", { length: 64 }).notNull(), // FK para metodos_avaliacao
  nome: varchar("nome", { length: 200 }).notNull(), // "Prova 1", "AP 1", etc
  tipo: mysqlEnum("tipo", ["prova", "trabalho", "ap", "projeto", "seminario", "exercicio", "outro"]).default("prova").notNull(),
  peso: decimal("peso", { precision: 5, scale: 2 }).notNull(), // Peso na média
  notaObtida: decimal("notaObtida", { precision: 5, scale: 2 }), // Nota obtida
  notaMaxima: decimal("notaMaxima", { precision: 5, scale: 2 }).default("10.00").notNull(), // Nota máxima possível
  dataAvaliacao: date("dataAvaliacao"), // Data da avaliação
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// NOVA TABELA: Registro de Faltas
export const registroFaltas = mysqlTable("registro_faltas", {
  id: varchar("id", { length: 64 }).primaryKey(),
  matriculaId: varchar("matriculaId", { length: 64 }).notNull(), // FK para matriculas
  data: date("data").notNull(), // Data da falta
  justificada: boolean("justificada").default(false).notNull(),
  justificativa: text("justificativa"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// Comunicados e avisos
export const comunicados = mysqlTable("comunicados", {
  id: varchar("id", { length: 64 }).primaryKey(),
  titulo: varchar("titulo", { length: 300 }).notNull(),
  conteudo: text("conteudo").notNull(),
  autor: varchar("autor", { length: 200 }), // Nome do autor
  autorId: varchar("autorId", { length: 64 }), // ID do usuário autor
  tipo: mysqlEnum("tipo", ["geral", "academico", "administrativo", "evento", "urgente"]).default("geral").notNull(),
  prioridade: mysqlEnum("prioridade", ["baixa", "media", "alta"]).default("media").notNull(),
  publico: boolean("publico").default(true).notNull(), // Visível para todos
  dataPublicacao: timestamp("dataPublicacao").defaultNow(),
  dataExpiracao: timestamp("dataExpiracao"), // Opcional
  anexos: text("anexos"), // JSON com URLs de anexos
  visualizacoes: int("visualizacoes").default(0),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Conversas do chatbot
export const conversas = mysqlTable("conversas", {
  id: varchar("id", { length: 64 }).primaryKey(),
  usuarioId: varchar("usuarioId", { length: 64 }).notNull(),
  titulo: varchar("titulo", { length: 200 }), // Título gerado automaticamente
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Mensagens do chatbot
export const mensagens = mysqlTable("mensagens", {
  id: varchar("id", { length: 64 }).primaryKey(),
  conversaId: varchar("conversaId", { length: 64 }).notNull(),
  role: mysqlEnum("role", ["user", "assistant", "system"]).notNull(),
  conteudo: text("conteudo").notNull(),
  metadata: text("metadata"), // JSON com informações extras (ex: function calls)
  createdAt: timestamp("createdAt").defaultNow(),
});

// Uploads administrativos (planilhas, documentos)
export const uploads = mysqlTable("uploads", {
  id: varchar("id", { length: 64 }).primaryKey(),
  nome: varchar("nome", { length: 300 }).notNull(),
  tipo: mysqlEnum("tipo", ["planilha_horarios", "planilha_notas", "planilha_alunos", "documento", "outro"]).notNull(),
  url: varchar("url", { length: 500 }).notNull(), // URL no S3
  tamanho: int("tamanho"), // Bytes
  mimeType: varchar("mimeType", { length: 100 }),
  uploadPor: varchar("uploadPor", { length: 64 }).notNull(), // ID do usuário
  processado: boolean("processado").default(false).notNull(),
  erros: text("erros"), // JSON com erros de processamento
  createdAt: timestamp("createdAt").defaultNow(),
});

// Eventos e calendário acadêmico
export const eventos = mysqlTable("eventos", {
  id: varchar("id", { length: 64 }).primaryKey(),
  titulo: varchar("titulo", { length: 300 }).notNull(),
  descricao: text("descricao"),
  tipo: mysqlEnum("tipo", ["prova", "trabalho", "feriado", "evento", "prazo"]).notNull(),
  dataInicio: timestamp("dataInicio").notNull(),
  dataFim: timestamp("dataFim"),
  local: varchar("local", { length: 200 }),
  disciplinaId: varchar("disciplinaId", { length: 64 }), // Opcional, se for evento de disciplina
  createdAt: timestamp("createdAt").defaultNow(),
});

// Tipos exportados
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Disciplina = typeof disciplinas.$inferSelect;
export type InsertDisciplina = typeof disciplinas.$inferInsert;

export type Professor = typeof professores.$inferSelect;
export type InsertProfessor = typeof professores.$inferInsert;

export type Horario = typeof horarios.$inferSelect;
export type InsertHorario = typeof horarios.$inferInsert;

export type Matricula = typeof matriculas.$inferSelect;
export type InsertMatricula = typeof matriculas.$inferInsert;

export type MetodoAvaliacao = typeof metodosAvaliacao.$inferSelect;
export type InsertMetodoAvaliacao = typeof metodosAvaliacao.$inferInsert;

export type Avaliacao = typeof avaliacoes.$inferSelect;
export type InsertAvaliacao = typeof avaliacoes.$inferInsert;

export type RegistroFalta = typeof registroFaltas.$inferSelect;
export type InsertRegistroFalta = typeof registroFaltas.$inferInsert;

export type Comunicado = typeof comunicados.$inferSelect;
export type InsertComunicado = typeof comunicados.$inferInsert;

export type Conversa = typeof conversas.$inferSelect;
export type InsertConversa = typeof conversas.$inferInsert;

export type Mensagem = typeof mensagens.$inferSelect;
export type InsertMensagem = typeof mensagens.$inferInsert;

export type Upload = typeof uploads.$inferSelect;
export type InsertUpload = typeof uploads.$inferInsert;

export type Evento = typeof eventos.$inferSelect;
export type InsertEvento = typeof eventos.$inferInsert;

