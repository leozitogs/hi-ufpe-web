import { eq, desc } from "drizzle-orm";
import { uploads, type Upload } from "../../../drizzle/schema";
import { getDb } from "../connection";

export async function getUploads(limit = 100): Promise<Upload[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(uploads).orderBy(desc(uploads.createdAt)).limit(limit);
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
  await db.update(uploads).set({ processado: true, erros: erros || null }).where(eq(uploads.id, id));
}