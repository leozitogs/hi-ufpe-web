import { eq, desc } from "drizzle-orm";
import { registroFaltas, matriculas, disciplinas, type InsertRegistroFalta, type RegistroFalta } from "../../../drizzle/schema";
import { getDb } from "../connection";

async function recalcularFrequencia(matriculaId: string): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const [matricula] = await db.select().from(matriculas).where(eq(matriculas.id, matriculaId));
  if (!matricula) return;

  const [disciplina] = await db.select().from(disciplinas).where(eq(disciplinas.id, matricula.disciplinaId));
  if (!disciplina) return;

  const faltas = await db.select().from(registroFaltas).where(eq(registroFaltas.matriculaId, matriculaId));
  const totalFaltas = faltas.length;
  const totalAulas = Number(disciplina.cargaHoraria);
  
  let frequencia = 100;
  if (totalAulas > 0) {
    frequencia = Math.round(((totalAulas - totalFaltas) / totalAulas) * 100);
  }

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
  await db.insert(registroFaltas).values({ ...falta, id });
  await recalcularFrequencia(falta.matriculaId);
  
  const [result] = await db.select().from(registroFaltas).where(eq(registroFaltas.id, id));
  return result;
}

export async function getFaltasByMatricula(matriculaId: string): Promise<RegistroFalta[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(registroFaltas).where(eq(registroFaltas.matriculaId, matriculaId)).orderBy(desc(registroFaltas.data));
}

export async function deleteFalta(id: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [falta] = await db.select().from(registroFaltas).where(eq(registroFaltas.id, id));
  await db.delete(registroFaltas).where(eq(registroFaltas.id, id));
  if (falta) await recalcularFrequencia(falta.matriculaId);
}