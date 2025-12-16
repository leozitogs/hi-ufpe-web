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
  app.set("trust proxy", 1); 

  const server = createServer(app);

  app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-trpc-source"]
  }));

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.use(session({
    secret: process.env.JWT_SECRET || "segredo-super-secreto",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: true, 
      sameSite: 'none', 
      httpOnly: true,
      partitioned: true,
      maxAge: 1000 * 60 * 60 * 24 * 30 
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
    // === MODO DETETIVE: LISTAR ARQUIVOS PARA ACHAR O FRONTEND ===
    console.log("\n🕵️ --- INICIANDO INSPEÇÃO DE ARQUIVOS ---");
    const root = process.cwd();
    console.log("📂 Raiz do projeto (CWD):", root);
    
    try {
      // 1. O que tem na raiz?
      const rootFiles = fs.readdirSync(root);
      console.log("📄 Arquivos na Raiz:", rootFiles);

      // 2. A pasta 'client' existe?
      if (rootFiles.includes("client")) {
        const clientPath = path.join(root, "client");
        const clientFiles = fs.readdirSync(clientPath);
        console.log("📂 Conteúdo de /client:", clientFiles);

        // 3. A pasta 'dist' existe dentro de 'client'?
        if (clientFiles.includes("dist")) {
           console.log("✅ Pasta /client/dist encontrada!");
           const distPath = path.join(clientPath, "dist");
           const distFiles = fs.readdirSync(distPath);
           console.log("📄 Conteúdo de /client/dist:", distFiles);

           if (distFiles.includes("index.html")) {
             console.log("🎉 index.html ENCONTRADO! Servindo frontend...");
             app.use(express.static(distPath));
             app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
           } else {
             console.log("❌ index.html NÃO está na pasta dist.");
             app.get("/", (req, res) => res.send("Pasta dist encontrada, mas index.html sumiu."));
           }
        } else {
           console.log("❌ Pasta 'dist' NÃO encontrada dentro de /client.");
           console.log("Verifique se o build gerou uma pasta com outro nome (ex: build, out).");
           app.get("/", (req, res) => res.send("Frontend build folder (dist) not found inside client. Check logs."));
        }
      } else {
         console.log("❌ Pasta 'client' NÃO encontrada na raiz.");
         app.get("/", (req, res) => res.send("Client folder not found in root."));
      }
    } catch (e) {
      console.error("💥 Erro fatal ao listar arquivos:", e);
      app.get("/", (req, res) => res.send("Erro ao listar arquivos do servidor."));
    }
    console.log("🕵️ --- FIM DA INSPEÇÃO ---\n");
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