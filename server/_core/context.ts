// server/_core/context.ts
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { ENV } from "./env";

/**
 * Contexto TRPC com fallback de usuário em DEV_MODE.
 *
 * Ordem:
 * 1) Tenta autenticar normalmente (cookies/OAuth) via sdk.authenticateRequest
 * 2) Se falhar e DEV_MODE=true, injeta usuário mock:
 *    - usa header "x-mock-user-id" se presente
 *    - senão usa ENV.ownerId (OWNER_OPEN_ID)
 */
export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  // 1) Autenticação real (se houver cookie/sessão)
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch {
    user = null;
  }

  // 2) Fallback DEV: se não autenticou e DEV_MODE=true
  if (!user && ENV.devMode) {
    // permite override por header (útil p/ scripts/cliente)
    const hdr =
      (opts.req.headers["x-mock-user-id"] ??
        opts.req.headers["x-user-id"]) || "";

    const headerUserId =
      Array.isArray(hdr) ? String(hdr[0] ?? "").trim() : String(hdr).trim();

    const mockId = headerUserId || ENV.ownerId;

    if (mockId) {
      const now = new Date();
      const mockUser: User = {
        id: mockId,
        name: "Dev User",
        email: "dev@local",
        loginMethod: "mock",
        role: "user",
        matricula: "0000000",
        curso: "Ciência da Computação",
        periodo: ENV.academicPeriod ?? "2025.2",
        createdAt: now,
        lastSignedIn: now,
        // ⚠️ não existe updatedAt no tipo User
      };
      user = mockUser;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
