import { sql, and } from "drizzle-orm";
import { eventos, type Evento } from "../../../drizzle/schema";
import { getDb } from "../connection";

export async function getEventos(inicio?: Date, fim?: Date): Promise<Evento[]> {
  const db = await getDb();
  if (!db) return [];
  
  if (inicio && fim) {
    return await db.select().from(eventos)
      .where(and(sql`${eventos.dataInicio} >= ${inicio}`, sql`${eventos.dataInicio} <= ${fim}`))
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
  await db.insert(eventos).values({ id, ...data });
  return id;
}