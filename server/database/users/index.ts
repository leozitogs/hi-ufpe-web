import { eq } from "drizzle-orm";
import { users, type InsertUser } from "../../../drizzle/schema";
import { getDb } from "../connection";
import { ENV } from "../../_core/env";

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) throw new Error("User ID is required for upsert");
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { id: user.id };
    const updateSet: Record<string, unknown> = {};

    const fields = ["name", "email", "loginMethod", "matricula", "curso"] as const;
    fields.forEach(field => {
      const value = user[field];
      if (value !== undefined) {
        values[field] = value ?? null;
        updateSet[field] = value ?? null;
      }
    });

    if (user.periodo !== undefined) {
      values.periodo = user.periodo;
      updateSet.periodo = user.periodo;
    }
    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }

    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    } else {
      values.role = user.role;
      updateSet.role = user.role;
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  // Busca usuário pelo email para validação
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0];
}

export async function createUser(userData: InsertUser) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  
  if (!userData.id) throw new Error("User ID is required for creation");

  // Insere o novo usuário
  // NOTA: Certifique-se que sua tabela 'users' no schema.ts tem a coluna 'password'
  await db.insert(users).values(userData);
  return userData;
}