import { eq, desc } from "drizzle-orm";
import { conversas, mensagens, type Conversa, type Mensagem } from "../../../drizzle/schema";
import { getDb } from "../connection";

export async function getConversasByUsuario(usuarioId: string): Promise<Conversa[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(conversas).where(eq(conversas.usuarioId, usuarioId)).orderBy(desc(conversas.updatedAt));
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
  return await db.select().from(mensagens).where(eq(mensagens.conversaId, conversaId)).orderBy(mensagens.createdAt);
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
  
  await db.update(conversas).set({ updatedAt: new Date() }).where(eq(conversas.id, data.conversaId));
  return id;
}