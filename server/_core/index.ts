import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { setupVite } from "./vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  
  // 1. Trust Proxy: Essencial para o Render passar os cookies corretamente
  app.set("trust proxy", 1); 

  const server = createServer(app);

  // 2. CORS: Permite que o Frontend específico acesse e mande cookies
  // 2. CORS ATUALIZADO: Aceita tanto Localhost quanto Produção
  app.use(cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://hi-ufpe-web-1vms.onrender.com"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-trpc-source"]
  }));

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // 3. Sessão: Configurada para funcionar Cross-Site
  app.use(session({
    secret: process.env.JWT_SECRET || "segredo-super-secreto",
    resave: false,
    saveUninitialized: false,
    proxy: true, // Importante para SSL no Render
    cookie: {
      secure: process.env.NODE_ENV === "production", // Só exige HTTPS se estiver na nuvem
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax', // Relaxa a segurança localmente
      httpOnly: true,
      partitioned: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 30 // 30 dias
    }
  }));
  
  registerOAuthRoutes(app);
  
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Rota simples para verificar se o back está de pé
  app.get("/", (req, res) => {
    res.send("Backend API is running. Access via Frontend.");
  });

  const port = parseInt(process.env.PORT || "3000");
  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer().catch(console.error);