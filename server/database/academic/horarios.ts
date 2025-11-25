import { eq, and } from "drizzle-orm";
import { horarios, disciplinas, professores, matriculas, type Horario, type InsertHorario } from "../../../drizzle/schema";
import { getDb } from "../connection";

export async function getHorarios(periodo?: string): Promise<Horario[]> {
  const db = await getDb();
  if (!db) return [];
  
  if (periodo) {
    return await db.select().from(horarios)
      .where(eq(horarios.periodo, periodo))
      .orderBy(horarios.diaSemana, horarios.horaInicio);
  }
  return await db.select().from(horarios).orderBy(horarios.diaSemana, horarios.horaInicio);
}

export async function getHorariosByAluno(alunoId: string, periodo: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      horario: horarios,
      disciplina: disciplinas,
      professor: professores,
    })
    .from(horarios)
    .innerJoin(matriculas, eq(horarios.disciplinaId, matriculas.disciplinaId))
    .innerJoin(disciplinas, eq(horarios.disciplinaId, disciplinas.id))
    .innerJoin(professores, eq(horarios.professorId, professores.id))
    .where(and(
        eq(matriculas.alunoId, alunoId),
        eq(matriculas.periodo, periodo),
        eq(horarios.periodo, periodo)
    ))
    .orderBy(horarios.diaSemana, horarios.horaInicio);
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
  await db.insert(horarios).values({ ...horario, id });
  const [result] = await db.select().from(horarios).where(eq(horarios.id, id));
  return result;
}

export async function deleteHorario(id: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(horarios).where(eq(horarios.id, id));
}