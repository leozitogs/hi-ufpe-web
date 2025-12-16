import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { ENV } from "./env";
import { COOKIE_NAME } from "@shared/const"; // [NOVO] Necessário para mapear o token

/**
 * Contexto TRPC com fallback de usuário Mock controlável.
 *
 * Lógica de Prioridade:
 * 1) Verifica Header Authorization (Bearer Token) e injeta como cookie se existir.
 * 2) Tenta autenticar via Cookie/OAuth (sdk.authenticateRequest).
 * 3) Se falhar e a flag USE_MOCK_USER estiver 'true' (ou devMode ativo), injeta o Mock.  
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

  // [NOVO] PASSO 1 DA MIGRAÇÃO: Suporte a Token via Header
  // Verifica se o frontend enviou "Authorization: Bearer <token>"
  const authHeader = opts.req.headers.authorization;
  if (authHeader) {
    const parts = authHeader.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      const token = parts[1];
      
      // Injeta o token nos cookies da requisição.
      // Assim, o sdk.authenticateRequest abaixo vai ler esse token e validá-lo
      // achando que veio de um cookie, sem precisarmos alterar o SDK.
      opts.req.cookies = opts.req.cookies || {};
      opts.req.cookies[COOKIE_NAME] = token;
    }
  }

  // 1) Tenta Autenticação Real (Agora funciona com Cookie OU Header)
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (e) {
    // Log opcional para debug de auth real
    // console.debug("[Auth] Failed to authenticate via SDK:", e);
    user = null;
  }

  // 2) Fallback para Usuário Mock (Se não logou + Configuração permite)
  // Nota: USE_MOCK_USER="false" desabilita o mock explicitamente
  const shouldInjectMock = !user && (process.env.USE_MOCK_USER === "true" || (ENV.devMode && process.env.USE_MOCK_USER !== "false"));

  if (shouldInjectMock) {
    // Permite trocar o ID do mock via header (útil para testes de diferentes usuários)
    const hdr =
      (opts.req.headers["x-mock-user-id"] ??
        opts.req.headers["x-user-id"]) || "";

    const headerUserId =
      Array.isArray(hdr) ? String(hdr[0] ?? "").trim() : String(hdr).trim();

    const mockId = headerUserId || ENV.ownerId || "mock_user_id";

    if (mockId) {
      const now = new Date();
      
      // Cria o usuário Mock com dados seguros
      const mockUser: User = {
        id: mockId,
        name: "Dev User (Mock)",
        email: "dev@local",
        password: null, 
        loginMethod: "mock",
        role: "admin",
        matricula: "0000000",
        curso: "Ciência da Computação",
        periodo: ENV.academicPeriod ?? "2025.2",
        createdAt: now,
        lastSignedIn: now,
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