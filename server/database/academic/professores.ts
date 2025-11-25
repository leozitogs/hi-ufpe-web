import { eq } from "drizzle-orm";
import { professores, type Professor } from "../../../drizzle/schema";
import { getDb } from "../connection";

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