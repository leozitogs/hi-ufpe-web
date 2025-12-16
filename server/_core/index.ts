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
    // === CONFIGURAÇÃO CORRIGIDA DE PRODUÇÃO ===
    
    // Caminho absoluto para a pasta client/dist baseado na raiz do projeto.
    // No Render, process.cwd() retorna a raiz do repositório (/opt/render/project/src),
    // então montamos o caminho direto para a pasta do frontend.
    const clientDist = path.join(process.cwd(), "client/dist");

    console.log("🔍 Verificando pasta do frontend:", clientDist);

    // Verifica se o index.html existe lá dentro
    if (fs.existsSync(path.join(clientDist, "index.html"))) {
      console.log("✅ Frontend encontrado! Servindo arquivos...");
      
      // Serve arquivos estáticos (JS, CSS, Imagens)
      app.use(express.static(clientDist));
      
      // Qualquer outra rota (que não seja API) vai para o index.html (SPA)
      app.get("*", (_req, res) => {
        res.sendFile(path.join(clientDist, "index.html"));
      });
    } else {
      console.error(`❌ Erro: O arquivo index.html não foi encontrado em: ${clientDist}`);
      console.error("Verifique se o build do Vite foi configurado para 'client/dist'.");
      
      // Fallback com mensagem de erro clara
      app.get("/", (req, res) => res.status(500).send(`
        <div style="font-family: sans-serif; text-align: center; padding: 2rem;">
          <h1>Erro no Backend</h1>
          <p>O servidor iniciou, mas não encontrou a pasta do site em:</p>
          <code style="background: #eee; padding: 5px; border-radius: 4px;">${clientDist}</code>
          <p>Verifique os logs do Render para ver onde o 'vite build' salvou os arquivos.</p>
        </div>
      `));
    }
  }

  const port = parseInt(process.env.PORT || "3000");
  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer().catch(console.error);