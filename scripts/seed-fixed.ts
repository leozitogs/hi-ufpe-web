// scripts/seed-fixed.ts
import "dotenv/config";
import { randomUUID } from "node:crypto";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { and, eq, sql } from "drizzle-orm";

// 👉 importa o schema inteiro como objeto
import * as schema from "../drizzle/schema";
// desestrutura as tabelas para facilitar
const { users, disciplinas, horarios, matriculas } = schema;

// 👉 tipos inferidos direto das tabelas (garante aderência ao seu schema.ts)
type InsertUser = typeof schema.users.$inferInsert;
type InsertDisciplina = typeof schema.disciplinas.$inferInsert;
type InsertHorario = typeof schema.horarios.$inferInsert;
type InsertMatricula = typeof schema.matriculas.$inferInsert;

// 👉 tipagem do DB p/ mysql2 + seu schema
import type { MySql2Database } from "drizzle-orm/mysql2";
type DB = MySql2Database<typeof schema>;

/**
 * Seed aderente ao schema (2025.2 – turno manhã)
 * - Cria/atualiza: admin_cin, aluno_teste1, mock_user_id
 * - Disciplinas: CIN0135, CIN0136, MA026, CIN0134
 * - Horários (manhã) com diaSemana por extenso (ENUM do schema)
 * - Matrícula do mock_user_id nas quatro disciplinas
 *
 * Observações do schema:
 *  - disciplinas NÃO tem 'periodo'; 'periodo' fica em horarios e matriculas
 *  - matriculas usa 'alunoId' (não 'usuarioId')
 *  - horarios.diaSemana é ENUM: "Segunda-feira"..."Sexta-feira"
 */

const PERIODO = "2025.2";
const MOCK_ID = process.env.OWNER_OPEN_ID || "mock_user_id";

// Map curto → ENUM do schema (por extenso)
const DIA_MAP: Record<string, InsertHorario["diaSemana"]> = {
  seg: "Segunda-feira",
  ter: "Terça-feira",
  qua: "Quarta-feira",
  qui: "Quinta-feira",
  sex: "Sexta-feira",
};

type Hor = {
  d: keyof typeof DIA_MAP; // seg/ter/qua/qui/sex
  ini: string; // "HH:MM"
  fim: string; // "HH:MM"
  sala?: string | null;
};

type DiscDef = {
  codigo: string;
  nome: string;
  cargaHoraria?: number | null;
  horarios: Hor[];
};

const OFERTA: DiscDef[] = [
  // CIN0135 — Estruturas de Dados Orientadas a Objetos
  {
    codigo: "CIN0135",
    nome: "ESTRUTURAS DE DADOS ORIENTADAS A OBJETOS",
    cargaHoraria: 60,
    horarios: [
      { d: "ter", ini: "08:00", fim: "09:50", sala: "Grad05" },
      { d: "qui", ini: "10:00", fim: "11:50", sala: "CIn" },
    ],
  },
  // CIN0136 — Desenvolvimento de Software
  {
    codigo: "CIN0136",
    nome: "DESENVOLVIMENTO DE SOFTWARE",
    cargaHoraria: 60,
    horarios: [
      { d: "seg", ini: "08:00", fim: "09:50", sala: "Grad05" },
      { d: "seg", ini: "10:00", fim: "11:50", sala: "CIn" },
    ],
  },
  // MA026 — Cálculo Diferencial e Integral 1
  {
    codigo: "MA026",
    nome: "CALCULO DIFERENCIAL E INTEGRAL 1",
    cargaHoraria: 60,
    horarios: [
      { d: "qua", ini: "08:00", fim: "09:50", sala: "CIn" },
      { d: "sex", ini: "10:00", fim: "11:50", sala: "CIn" },
    ],
  },
  // CIN0134 — Arquitetura de Computadores e SO
  {
    codigo: "CIN0134",
    nome: "ARQUITETURA DE COMPUTADORES E SISTEMAS OPERACIONAIS",
    cargaHoraria: 60,
    horarios: [
      { d: "qua", ini: "10:00", fim: "11:50", sala: "E112" },
      { d: "sex", ini: "08:00", fim: "09:50", sala: "E233" },
    ],
  },
];

// ===== helpers ===============================================================

async function upsertUser(db: DB, u: InsertUser) {
  await db
    .insert(users)
    .values(u)
    .onDuplicateKeyUpdate({
      set: {
        name: sql`VALUES(name)`,
        email: sql`VALUES(email)`,
        loginMethod: sql`VALUES(loginMethod)`,
        role: sql`VALUES(role)`,
        matricula: sql`VALUES(matricula)`,
        curso: sql`VALUES(curso)`,
        periodo: sql`VALUES(periodo)`,
        lastSignedIn: sql`NOW()`,
      },
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
    oficial: true,
  };

  await db
    .insert(disciplinas)
    .values(base)
    .onDuplicateKeyUpdate({
      set: {
        nome: sql`VALUES(nome)`,
        cargaHoraria: sql`VALUES(cargaHoraria)`,
        oficial: sql`VALUES(oficial)`,
        updatedAt: sql`NOW()`,
      },
    });

  const discId = (await getDiscByCodigo(db, def.codigo))!;
  // limpa horários anteriores para simplicidade/idempotência
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
    .where(
      and(
        eq(matriculas.alunoId, alunoId),
        eq(matriculas.disciplinaId, disciplinaId),
        eq(matriculas.periodo, PERIODO),
      ),
    )
    .limit(1);

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

// ===== main ==================================================================

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("❌ DATABASE_URL não definida no .env");
    process.exit(1);
  }

  // ✅ use Pool (o driver do drizzle/mysql2 espera Pool)
  const pool = mysql.createPool(url);

  // ✅ tipagem e schema corretos
  const db: DB = drizzle(url, { schema, mode: "default" });

  try {
    console.log("🌱 Seed 2025.2 — manhã (CIn)\n");

    // 1) Usuários base
    const now = new Date();
    await upsertUser(db, {
      id: "admin_cin",
      name: "Administrador CIn",
      email: "admin@cin.ufpe.br",
      loginMethod: "local",
      role: "admin",
      matricula: null,
      curso: "Ciência da Computação",
      periodo: "9",
      createdAt: now,
      lastSignedIn: now,
    });

    await upsertUser(db, {
      id: "aluno_teste1",
      name: "João Silva",
      email: "joao@cin.ufpe.br",
      loginMethod: "local",
      role: "user",
      matricula: "20231001",
      curso: "Ciência da Computação",
      periodo: "3",
      createdAt: now,
      lastSignedIn: now,
    });

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

    // 2) Disciplinas + horários
    const ids: Record<string, string> = {};
    for (const def of OFERTA) {
      const id = await upsertDisciplina(db, def);
      ids[def.codigo] = id;
      console.log(`  • ${def.codigo} – ${def.nome} (id: ${id})`);
    }

    // 3) Matrículas do mock
    for (const cod of ["CIN0135", "CIN0136", "MA026", "CIN0134"]) {
      const id = await ensureMatricula(db, MOCK_ID, ids[cod]);
      console.log(`  ✓ matrícula garantida: ${MOCK_ID} → ${cod} (id: ${id})`);
    }

    console.log("\n✅ Seed concluído com sucesso!");
    console.log("Dica: exporte OWNER_OPEN_ID=mock_user_id antes de testar o chatbot.");
    process.exit(0);
  } catch (e) {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  } finally {
    // nada a fechar quando usa connection string
  }
}

main();
