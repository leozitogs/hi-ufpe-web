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

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  
  // [IMPORTANTE] Trust Proxy para cookies seguros no Render
  app.set("trust proxy", 1); 

  const server = createServer(app);

  // [IMPORTANTE] CORS simplificado para evitar conflitos
  app.use(cors({
    origin: true, // Aceita a origem que vier (já que agora é o mesmo domínio)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-trpc-source"]
  }));

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Configuração de Sessão
  app.use(session({
    secret: process.env.JWT_SECRET || "segredo-super-secreto",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: true, // Força HTTPS
      sameSite: 'none', 
      httpOnly: true,
      partitioned: true,
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

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    // === LÓGICA DE DETECÇÃO DO FRONTEND (ROBUSTA) ===
    
    // Lista de lugares onde o 'client/dist' pode estar escondido
    const possiblePaths = [
      path.resolve(__dirname, "../../client/dist"),       // Estrutura padrão local / source
      path.resolve(process.cwd(), "../client/dist"),      // Estrutura comum no Render (se rodar de 'server')
      path.resolve(process.cwd(), "client/dist"),         // Se rodar da raiz
      path.join(__dirname, "../../../client/dist")        // Se o build gerar server/dist/_core
    ];
    
    let clientDist = null;
    
    // Procura em cada caminho até achar o index.html
    for (const p of possiblePaths) {
      if (fs.existsSync(path.join(p, "index.html"))) {
        clientDist = p;
        break;
      }
    }
    
    // Logs para ajudar a gente a entender o que está acontecendo
    console.log("--- DIAGNÓSTICO DE DEPLOY ---");
    console.log("Diretório atual (CWD):", process.cwd());
    console.log("Diretório do arquivo (__dirname):", __dirname);
    
    if (clientDist) {
      console.log("✅ Frontend encontrado em:", clientDist);
      
      // Serve os arquivos estáticos (CSS, JS, Imagens)
      app.use(express.static(clientDist));
      
      // Qualquer rota que não seja API, manda para o index.html (SPA)
      app.get("*", (_req, res) => {
        res.sendFile(path.join(clientDist!, "index.html"));
      });
      
    } else {
      console.error("❌ ERRO CRÍTICO: Não foi possível encontrar a pasta 'client/dist' em nenhum dos caminhos tentados.");
      console.error("Caminhos testados:", possiblePaths);
      // Fallback simples para não ficar tela branca
      app.get("/", (req, res) => res.send("Backend is running, but Frontend build was not found. Check logs."));
    }
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);