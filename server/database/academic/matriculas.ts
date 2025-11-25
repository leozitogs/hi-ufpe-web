import { eq, and } from "drizzle-orm";
import { matriculas, disciplinas, professores, avaliacoes, metodosAvaliacao, registroFaltas, type Matricula, type InsertMatricula } from "../../../drizzle/schema";
import { getDb } from "../connection";

export async function getMatriculasByAluno(alunoId: string, periodo?: string) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = periodo 
    ? and(eq(matriculas.alunoId, alunoId), eq(matriculas.periodo, periodo))
    : eq(matriculas.alunoId, alunoId);
  
  return await db
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
  await db.insert(matriculas).values({ ...matricula, id });
  const [result] = await db.select().from(matriculas).where(eq(matriculas.id, id));
  return result;
}

export async function updateMatricula(id: string, data: Partial<InsertMatricula>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(matriculas).set({ ...data, updatedAt: new Date() }).where(eq(matriculas.id, id));
}

export async function deleteMatricula(id: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [matricula] = await db.select().from(matriculas).where(eq(matriculas.id, id));
  if (matricula?.metodoAvaliacaoId) {
    await db.delete(avaliacoes).where(eq(avaliacoes.metodoAvaliacaoId, matricula.metodoAvaliacaoId));
    await db.delete(metodosAvaliacao).where(eq(metodosAvaliacao.id, matricula.metodoAvaliacaoId));
  }
  await db.delete(registroFaltas).where(eq(registroFaltas.matriculaId, id));
  await db.delete(matriculas).where(eq(matriculas.id, id));
}