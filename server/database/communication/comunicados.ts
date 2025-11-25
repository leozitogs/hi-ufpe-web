import { eq, desc } from "drizzle-orm";
import { comunicados, type Comunicado } from "../../../drizzle/schema";
import { getDb } from "../connection";

export async function getComunicados(limit = 50): Promise<Comunicado[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(comunicados).where(eq(comunicados.publico, true)).orderBy(desc(comunicados.dataPublicacao)).limit(limit);
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