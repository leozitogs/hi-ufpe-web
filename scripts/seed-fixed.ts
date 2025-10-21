import 'dotenv/config';

/**
 * Script para popular o banco de dados com dados REAIS
 * Baseado na planilha: Publicação Oferta Graduação CIn 25.2
 * Execute: pnpm tsx scripts/seed-fixed.ts
 */

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { 
  users, 
  disciplinas, 
  professores, 
  horarios, 
  matriculas, 
  comunicados 
} from "../drizzle/schema";

async function seed() {
  console.log("🌱 Populando banco com dados reais do CIn 2025.2...\n");

  // Criar conexão MySQL
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const db = drizzle(connection);

  try {
    // 1. Criar usuários de teste
    console.log("👥 Criando usuários...");
    await db.insert(users).values([
      {
        id: "admin_cin",
        name: "Administrador CIn",
        email: "admin@cin.ufpe.br",
        loginMethod: "local",
        role: "admin",
        matricula: null,
        curso: null,
        periodo: null,
        createdAt: new Date(),
        lastSignedIn: new Date(),
      },
      {
        id: "aluno_teste1",
        name: "João Silva",
        email: "joao@cin.ufpe.br",
        loginMethod: "local",
        role: "user",
        matricula: "20231001",
        curso: "Ciência da Computação",
        periodo: "3",
        createdAt: new Date(),
        lastSignedIn: new Date(),
      },
      {
        id: "mock_user_id",
        name: "Usuário Mock",
        email: "mock@example.com",
        loginMethod: "mock",
        role: "user",
        matricula: "20231234",
        curso: "Ciência da Computação",
        periodo: "3",
        createdAt: new Date(),
        lastSignedIn: new Date(),
      }
    ]).onDuplicateKeyUpdate({ set: { lastSignedIn: new Date() } });

    console.log("✅ Usuários criados!\n");

    console.log("🎉 Seed concluído com sucesso!");
    
  } catch (error) {
    console.error("❌ Erro ao popular banco:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

seed();
