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
  app.set("trust proxy", 1); 
  const server = createServer(app);

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.use(session({
    secret: process.env.JWT_SECRET || "segredo",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: { secure: true, sameSite: 'none', httpOnly: true, partitioned: true, maxAge: 2592000000 }
  }));
  
  registerOAuthRoutes(app);
  app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    // [CORREÇÃO] Aponta exatamente para onde configuramos o vite.config.ts
    // Como estamos rodando de 'dist/index.js' (backend), precisamos subir um nível e entrar em client/dist
    // OU usar o caminho absoluto baseado na raiz do projeto.
    
    // Tentativa 1: Caminho relativo padrão do Render
    const possiblePaths = [
      path.resolve(process.cwd(), "client/dist"), // Caminho mais provável no Render
      path.resolve(__dirname, "../../client/dist") // Caminho relativo local
    ];

    let clientDist = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(path.join(p, "index.html"))) {
        clientDist = p;
        break;
      }
    }

    if (clientDist) {
      console.log("✅ Frontend servido de:", clientDist);
      app.use(express.static(clientDist));
      app.get("*", (_req, res) => res.sendFile(path.join(clientDist!, "index.html")));
    } else {
      console.error("❌ Erro: Pasta client/dist não encontrada após build corrigido.");
      console.log("Procurado em:", possiblePaths);
      app.get("/", (req, res) => res.send("Frontend building... Please wait for next deploy if this persists."));
    }
  }

  const port = parseInt(process.env.PORT || "3000");
  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer().catch(console.error);