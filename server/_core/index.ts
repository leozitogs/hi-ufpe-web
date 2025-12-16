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
  
  // 1. Trust Proxy (Essencial para Cookies no Render)
  app.set("trust proxy", 1); 

  const server = createServer(app);

  // 2. CORS (Permite APENAS o seu Frontend externo)
  app.use(cors({
    origin: "https://hi-ufpe-web-1vms.onrender.com", // URL EXATA do Frontend (sem barra no final)
    credentials: true, // Permite cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-trpc-source"]
  }));

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // 3. Sessão (Configurada para Cross-Site)
  app.use(session({
    secret: process.env.JWT_SECRET || "segredo-super-secreto",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: true, // Força HTTPS
      sameSite: 'none', // Permite cookie entre domínios diferentes
      httpOnly: true,
      partitioned: true, // CRÍTICO: Permite login em abas novas do Chrome
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

  // Removida toda a lógica de servir "client/dist". O Backend agora é só API.
  app.get("/", (req, res) => {
    res.send("Backend is running (API Only). Access via Frontend.");
  });

  const port = parseInt(process.env.PORT || "3000");
  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer().catch(console.error);