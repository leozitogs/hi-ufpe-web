import { drizzle as drizzleORM, type MySql2DrizzleConfig } from "drizzle-orm/mysql2";
import { createPool, type Pool } from "mysql2/promise";
import * as schema from "../../drizzle/schema";

let _db: ReturnType<typeof drizzleORM> | null = null;
let _pool: Pool | null = null;

export async function getDb() {
  if (_db) return _db;

  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn("[Database] DATABASE_URL not set");
    return null;
  }

  try {
    _pool = createPool(url);
    _db = drizzleORM(_pool as any, { schema, mode: "default" } as MySql2DrizzleConfig<typeof schema>);
    return _db;
  } catch (error) {
    console.warn("[Database] Failed to connect:", error);
    _db = null;
    return null;
  }
}