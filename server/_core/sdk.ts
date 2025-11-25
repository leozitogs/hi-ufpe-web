import { type User } from "../../drizzle/schema";
// REFATORADO: Importa direto da pasta database
import { getUser } from "../database/users";
import { getDb } from "../database/connection";
import { ENV } from "./env";
import * as jose from "jose";

// Segredo para JWT (usando o mesmo do env ou fallback)
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "segredo-local-dev");

export const sdk = {
  async authenticateRequest(req: any): Promise<User | null> {
    const token = req.cookies?.["auth_token"] || req.headers?.["authorization"]?.replace("Bearer ", "");
    
    if (!token) return null;

    try {
      // Verifica o token JWT
      const { payload } = await jose.jwtVerify(token, JWT_SECRET);
      const userId = payload.sub as string;

      if (!userId) return null;

      // Busca usuário no banco novo
      const user = await getUser(userId);
      return user || null;

    } catch (err) {
      // Token inválido ou expirado
      return null;
    }
  },

  async getUserInfo(accessToken: string) {
    // Simulação de fetch de dados do provedor OAuth (Google/GitHub)
    // Em produção, aqui teria um fetch('https://www.googleapis.com/userinfo'...)
    return {
      openId: "user_mock_oauth",
      name: "Usuário OAuth",
      email: "oauth@example.com",
      platform: "oauth",
      loginMethod: "oauth"
    };
  },

  async exchangeCodeForToken(code: string, state: string) {
    // Simulação de troca de código por token
    return { accessToken: "mock_access_token" };
  },

  async createSessionToken(userId: string, options: { name: string; expiresInMs: number }) {
    return await new jose.SignJWT({ sub: userId, name: options.name })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1y") // Expira em 1 ano (simplificado)
      .sign(JWT_SECRET);
  }
};