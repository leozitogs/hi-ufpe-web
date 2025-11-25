// scripts/seed-fixed.ts
import "dotenv/config";
import { randomUUID } from "node:crypto";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { and, eq, sql } from "drizzle-orm";

import * as schema from "../drizzle/schema";

const { users, disciplinas, horarios, matriculas, professores } = schema;

type InsertUser = typeof schema.users.$inferInsert;
type InsertDisciplina = typeof schema.disciplinas.$inferInsert;
type InsertHorario = typeof schema.horarios.$inferInsert;
type InsertMatricula = typeof schema.matriculas.$inferInsert;
type InsertProfessor = typeof schema.professores.$inferInsert;

import type { MySql2Database } from "drizzle-orm/mysql2";
type DB = MySql2Database<typeof schema>;

const PERIODO = "2025.2";
const MOCK_ID = process.env.OWNER_OPEN_ID || "mock_user_id";

// --- IDs Fixos para Professores (para vincular fácil) ---
const PROF_KIEV = "prof_kiev";
const PROF_VINICIUS = "prof_vinicius";
const PROF_PAULO = "prof_paulo";
const PROF_SERGIO = "prof_sergio";

const DIA_MAP: Record<string, InsertHorario["diaSemana"]> = {
  seg: "Segunda-feira",
  ter: "Terça-feira",
  qua: "Quarta-feira",
  qui: "Quinta-feira",
  sex: "Sexta-feira",
};

type Hor = {
  d: keyof typeof DIA_MAP;
  ini: string;
  fim: string;
  sala?: string | null;
};

type DiscDef = {
  codigo: string;
  nome: string;
  cargaHoraria?: number | null;
  professorId?: string; // <--- Campo Novo!
  horarios: Hor[];
};

// --- OFERTA ATUALIZADA COM PROFESSORES ---
const OFERTA: DiscDef[] = [
  {
    codigo: "CIN0135",
    nome: "ESTRUTURAS DE DADOS ORIENTADAS A OBJETOS",
    cargaHoraria: 60,
    professorId: PROF_SERGIO,
    horarios: [
      { d: "ter", ini: "08:00", fim: "09:50", sala: "Grad05" },
      { d: "qui", ini: "10:00", fim: "11:50", sala: "CIn" },
    ],
  },
  {
    codigo: "CIN0136",
    nome: "DESENVOLVIMENTO DE SOFTWARE",
    cargaHoraria: 60,
    professorId: PROF_VINICIUS,
    horarios: [
      { d: "seg", ini: "08:00", fim: "09:50", sala: "Grad05" },
      { d: "seg", ini: "10:00", fim: "11:50", sala: "CIn" },
    ],
  },
  {
    codigo: "MA026",
    nome: "CALCULO DIFERENCIAL E INTEGRAL 1",
    cargaHoraria: 60,
    professorId: PROF_PAULO,
    horarios: [
      { d: "qua", ini: "08:00", fim: "09:50", sala: "CIn" },
      { d: "sex", ini: "10:00", fim: "11:50", sala: "CIn" },
    ],
  },
  {
    codigo: "CIN0134",
    nome: "ARQUITETURA DE COMPUTADORES E SISTEMAS OPERACIONAIS",
    cargaHoraria: 60,
    professorId: PROF_KIEV,
    horarios: [
      { d: "qua", ini: "10:00", fim: "11:50", sala: "E112" },
      { d: "sex", ini: "08:00", fim: "09:50", sala: "E233" },
    ],
  },
];

// ===== helpers =====

async function upsertUser(db: DB, u: InsertUser) {
  await db.insert(users).values(u).onDuplicateKeyUpdate({ set: u });
}

// Helper Novo: Criar Professor
async function upsertProfessor(db: DB, p: InsertProfessor) {
  await db.insert(professores).values(p).onDuplicateKeyUpdate({
    set: { nome: sql`VALUES(nome)`, departamento: sql`VALUES(departamento)` }
  });
}

async function getDiscByCodigo(db: DB, codigo: string) {
  const [row] = await db
    .select({ id: disciplinas.id })
    .from(disciplinas)
    .where(eq(disciplinas.codigo, codigo))
    .limit(1);
  return row?.id ?? null;
}

async function upsertDisciplina(db: DB, def: DiscDef) {
  const id = randomUUID();

  const base: InsertDisciplina = {
    id,
    codigo: def.codigo,
    nome: def.nome,
    cargaHoraria: def.cargaHoraria ?? null,
    professorId: def.professorId, // <--- Salvando o vínculo
    oficial: true,
  };

  await db
    .insert(disciplinas)
    .values(base)
    .onDuplicateKeyUpdate({
      set: {
        nome: sql`VALUES(nome)`,
        cargaHoraria: sql`VALUES(cargaHoraria)`,
        professorId: sql`VALUES(professorId)`, // <--- Atualiza se já existir
        oficial: sql`VALUES(oficial)`,
        updatedAt: sql`NOW()`,
      },
    });

  const discId = (await getDiscByCodigo(db, def.codigo))!;
  
  // Limpa horários antigos para evitar duplicidade ao rodar de novo
  await db.delete(horarios).where(eq(horarios.disciplinaId, discId));

  for (const h of def.horarios) {
    const row: InsertHorario = {
      id: randomUUID(),
      disciplinaId: discId,
      diaSemana: DIA_MAP[h.d],
      horaInicio: h.ini,
      horaFim: h.fim,
      sala: h.sala ?? "CIn",
      periodo: PERIODO,
    };
    await db.insert(horarios).values(row);
  }

  return discId;
}

async function ensureMatricula(db: DB, alunoId: string, disciplinaId: string) {
  const [m] = await db
    .select({ id: matriculas.id })
    .from(matriculas)
    .where(and(
      eq(matriculas.alunoId, alunoId),
      eq(matriculas.disciplinaId, disciplinaId),
      eq(matriculas.periodo, PERIODO),
    )).limit(1);

  if (m?.id) return m.id;

  const row: InsertMatricula = {
    id: randomUUID(),
    alunoId,
    disciplinaId,
    periodo: PERIODO,
    status: "cursando",
    faltas: 0,
  };

  await db.insert(matriculas).values(row);
  return row.id!;
}

// ===== main =====

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("❌ DATABASE_URL não definida no .env");
    process.exit(1);
  }

  const pool = mysql.createPool(url);
  const db: DB = drizzle(pool, { schema, mode: "default" });

  try {
    console.log("🌱 Seed 2025.2 — com Professores (CIn)\n");

    // 1. Criar Professores
    console.log("👨‍🏫 Criando professores...");
    await upsertProfessor(db, { id: PROF_KIEV, nome: "Kiev Gama", departamento: "CIn", email: "kiev@cin.ufpe.br" });
    await upsertProfessor(db, { id: PROF_VINICIUS, nome: "Vinícius Garcia", departamento: "CIn", email: "vinicius@cin.ufpe.br" });
    await upsertProfessor(db, { id: PROF_PAULO, nome: "Paulo Salgado", departamento: "Matemática", email: "paulo@dmat.ufpe.br" });
    await upsertProfessor(db, { id: PROF_SERGIO, nome: "Sérgio Soares", departamento: "CIn", email: "sergio@cin.ufpe.br" });

    // 2. Usuários
    const now = new Date();
    await upsertUser(db, {
      id: MOCK_ID,
      name: "Usuário Mock",
      email: "mock@example.com",
      loginMethod: "mock",
      role: "user",
      matricula: "20231234",
      curso: "Ciência da Computação",
      periodo: "3",
      createdAt: now,
      lastSignedIn: now,
    });

    // 3. Disciplinas + Horários
    const ids: Record<string, string> = {};
    for (const def of OFERTA) {
      const id = await upsertDisciplina(db, def);
      ids[def.codigo] = id;
      console.log(`  • ${def.codigo} – ${def.nome} (Prof definido)`);
    }

    // 4. Matrículas
    for (const cod of ["CIN0135", "CIN0136", "MA026", "CIN0134"]) {
      await ensureMatricula(db, MOCK_ID, ids[cod]);
    }

    console.log("\n✅ Seed concluído com sucesso!");
    
  } catch (e) {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();