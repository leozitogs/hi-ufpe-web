import { eq, and } from "drizzle-orm";
import { disciplinas, matriculas, type Disciplina, type InsertDisciplina } from "../../../drizzle/schema"; // Ajuste o nome da tabela se for 'disciplinas' no schema
import { getDb } from "../connection";

// Nota: Assumindo que a exportação no schema é 'disciplinas'
import { disciplinas as disciplinasTable } from "../../../drizzle/schema";

export async function getDisciplinas(): Promise<Disciplina[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(disciplinasTable).orderBy(disciplinasTable.codigo);
}

export async function getDisciplina(id: string): Promise<Disciplina | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(disciplinasTable).where(eq(disciplinasTable.id, id)).limit(1);
  return result[0] || null;
}

export async function createDisciplina(disciplina: InsertDisciplina): Promise<Disciplina> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = disciplina.id || `disc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  await db.insert(disciplinasTable).values({ ...disciplina, id });
  
  const [result] = await db.select().from(disciplinasTable).where(eq(disciplinasTable.id, id));
  return result;
}

export async function getDisciplinasByAluno(alunoId: string, periodo?: string): Promise<Disciplina[]> {
  const db = await getDb();
  if (!db) return [];
  
  let conditions = eq(matriculas.alunoId, alunoId);
  if (periodo) {
    conditions = and(eq(matriculas.alunoId, alunoId), eq(matriculas.periodo, periodo)) as any;
  }
  
  const results = await db
    .select({ disciplina: disciplinasTable })
    .from(disciplinasTable)
    .innerJoin(matriculas, eq(disciplinasTable.id, matriculas.disciplinaId))
    .where(conditions);
  
  return results.map(r => r.disciplina);
}

export async function updateDisciplina(id: string, data: Partial<InsertDisciplina>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(disciplinasTable).set(data).where(eq(disciplinasTable.id, id));
}

export async function deleteDisciplina(id: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Lógica de delete em cascata seria melhor no banco, mas mantendo a lógica original:
  // Importar 'horarios' aqui se necessário para deletar, ou mover para um serviço unificado.
  // Para simplicidade e evitar dependências circulares, este arquivo foca na tabela disciplinas.
  // Se a lógica de deleção envolver outras tabelas (horarios, matriculas), 
  // recomenda-se fazer isso na camada de Serviço (Router) ou importar as tabelas aqui apenas para deleção.
  
  const { horarios, matriculas } = await import("../../../drizzle/schema");
  
  await db.delete(matriculas).where(eq(matriculas.disciplinaId, id));
  await db.delete(horarios).where(eq(horarios.disciplinaId, id));
  await db.delete(disciplinasTable).where(eq(disciplinasTable.id, id));
}