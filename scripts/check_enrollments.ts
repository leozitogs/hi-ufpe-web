// scripts/check_enrollments.ts
import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { and, eq } from "drizzle-orm";            // ✅ importa daqui
import * as schema from "../drizzle/schema";

async function main() {
  const url = process.env.DATABASE_URL!;
  const owner = process.env.OWNER_OPEN_ID!;
  const periodo = process.env.PERIODO_ATUAL ?? "2025.2";

  if (!url || !owner) {
    console.error("Faltam variáveis: DATABASE_URL e/ou OWNER_OPEN_ID");
    process.exit(1);
  }

  const db = drizzle(url, { schema, mode: "default" });

  const { matriculas, disciplinas } = schema;

  const rows = await db
    .select({
      codigo: disciplinas.codigo,
      nome: disciplinas.nome,
      periodo: matriculas.periodo,
    })
    .from(matriculas)
    .leftJoin(disciplinas, eq(disciplinas.id, matriculas.disciplinaId))
    .where(and(eq(matriculas.alunoId, owner), eq(matriculas.periodo, periodo)));

  console.log(`OWNER_OPEN_ID=${owner} | PERIODO=${periodo}`);
  console.table(rows);

  if (rows.length === 0) {
    console.log("⚠️ Nenhuma matrícula encontrada para esse usuário/período.");
    process.exit(2);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
