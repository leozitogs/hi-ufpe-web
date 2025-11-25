import { eq } from "drizzle-orm";
import { metodosAvaliacao, avaliacoes, matriculas, type MetodoAvaliacao, type InsertMetodoAvaliacao, type Avaliacao, type InsertAvaliacao } from "../../../drizzle/schema";
import { getDb } from "../connection";

// --- MÉTODOS DE AVALIAÇÃO ---

export async function createMetodoAvaliacao(metodo: InsertMetodoAvaliacao): Promise<MetodoAvaliacao> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = metodo.id || `metodo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  await db.insert(metodosAvaliacao).values({ ...metodo, id });
  await db.update(matriculas).set({ metodoAvaliacaoId: id }).where(eq(matriculas.id, metodo.matriculaId));
  
  const [result] = await db.select().from(metodosAvaliacao).where(eq(metodosAvaliacao.id, id));
  return result;
}

export async function getMetodoAvaliacaoByMatricula(matriculaId: string): Promise<MetodoAvaliacao | null> {
  const db = await getDb();
  if (!db) return null;
  const [result] = await db.select().from(metodosAvaliacao).where(eq(metodosAvaliacao.matriculaId, matriculaId));
  return result || null;
}

export async function updateMetodoAvaliacao(id: string, data: Partial<InsertMetodoAvaliacao>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(metodosAvaliacao).set({ ...data, updatedAt: new Date() }).where(eq(metodosAvaliacao.id, id));
}

// --- AVALIAÇÕES ---

export async function createAvaliacao(avaliacao: InsertAvaliacao): Promise<Avaliacao> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = avaliacao.id || `aval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  await db.insert(avaliacoes).values({ ...avaliacao, id });
  
  const [result] = await db.select().from(avaliacoes).where(eq(avaliacoes.id, id));
  await recalcularMedia(avaliacao.metodoAvaliacaoId);
  return result;
}

export async function getAvaliacoesByMetodo(metodoAvaliacaoId: string): Promise<Avaliacao[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(avaliacoes).where(eq(avaliacoes.metodoAvaliacaoId, metodoAvaliacaoId));
}

export async function updateAvaliacao(id: string, data: Partial<InsertAvaliacao>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [avaliacao] = await db.select().from(avaliacoes).where(eq(avaliacoes.id, id));
  await db.update(avaliacoes).set({ ...data, updatedAt: new Date() }).where(eq(avaliacoes.id, id));
  
  if (avaliacao) await recalcularMedia(avaliacao.metodoAvaliacaoId);
}

export async function deleteAvaliacao(id: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [avaliacao] = await db.select().from(avaliacoes).where(eq(avaliacoes.id, id));
  await db.delete(avaliacoes).where(eq(avaliacoes.id, id));
  
  if (avaliacao) await recalcularMedia(avaliacao.metodoAvaliacaoId);
}

// Função auxiliar interna (não exportada para manter encapsulamento, ou exportada se necessário)
async function recalcularMedia(metodoAvaliacaoId: string): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const [metodo] = await db.select().from(metodosAvaliacao).where(eq(metodosAvaliacao.id, metodoAvaliacaoId));
  if (!metodo) return;

  const avaliacoesLista = await db.select().from(avaliacoes).where(eq(avaliacoes.metodoAvaliacaoId, metodoAvaliacaoId));
  
  let media = 0;
  if (metodo.tipo === "media_ponderada") {
    let somaNotas = 0;
    let somaPesos = 0;
    avaliacoesLista.forEach(aval => {
      if (aval.notaObtida !== null) {
        somaNotas += Number(aval.notaObtida) * Number(aval.peso);
        somaPesos += Number(aval.peso);
      }
    });
    media = somaPesos > 0 ? somaNotas / somaPesos : 0;
  } else if (metodo.tipo === "media_simples") {
    const notasValidas = avaliacoesLista.filter(a => a.notaObtida !== null);
    const soma = notasValidas.reduce((acc, a) => acc + Number(a.notaObtida), 0);
    media = notasValidas.length > 0 ? soma / notasValidas.length : 0;
  }

  await db.update(matriculas).set({
    mediaCalculada: media.toFixed(2),
    media: media.toFixed(2),
    updatedAt: new Date(),
  }).where(eq(matriculas.id, metodo.matriculaId));

  // Atualização de status
  const [matricula] = await db.select().from(matriculas).where(eq(matriculas.id, metodo.matriculaId));
  if (matricula) {
    const mediaMinima = Number(matricula.mediaMinima) || 5.0;
    const frequenciaMinima = matricula.frequenciaMinima || 75;
    const frequenciaAtual = matricula.frequencia || 0;
    let status: "cursando" | "aprovado" | "reprovado" = "cursando";
    const todasLancadas = avaliacoesLista.every(a => a.notaObtida !== null);
    if (todasLancadas) {
      status = (media >= mediaMinima && frequenciaAtual >= frequenciaMinima) ? "aprovado" : "reprovado";
    }
    await db.update(matriculas).set({ status, updatedAt: new Date() }).where(eq(matriculas.id, metodo.matriculaId));
  }
}