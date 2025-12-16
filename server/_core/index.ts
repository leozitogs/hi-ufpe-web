import "dotenv/config";
import express from "express";
import cors from "cors"; // [NOVO] Importação do CORS
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
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
  const server = createServer(app);

  // [NOVO] Configuração do CORS - Crítico para deploy separado
  // Isso permite que o seu Frontend converse com o Backend
  /*/ descomentar quando terminar debug
  app.use(cors({
    origin: [
      "http://localhost:5173",                      // Seu ambiente local
      "https://hi-ufpe-web-1vms.onrender.com",      // Seu Frontend no Render (Copiado do seu print)
      process.env.ALLOWED_ORIGIN || ""              // Flexibilidade via env var
    ].filter(Boolean),
    credentials: true, // Permite envio de Cookies/Sessão entre domínios
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-trpc-source"]
  }));
  /*/

  app.use(cors({
  origin: true, 
  credentials: true,
  }));

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
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
    // Em produção: sirva o build do client se existir (client/dist).
    // Em dev: não sirva estático (Vite cuida do front).
    const clientDist = path.resolve(__dirname, "../../client/dist");
    const hasClientBuild = fs.existsSync(clientDist);

    const SERVE_CLIENT = process.env.SERVE_CLIENT === "true";

    // Nota: Em deploy separado (Frontend no Static Site do Render), 
    // o SERVE_CLIENT geralmente é false, mas mantemos a lógica caso queira servir tudo junto.
    if (SERVE_CLIENT || hasClientBuild) {
      console.log("Servindo client build de:", clientDist);
      app.use(express.static(clientDist));
      app.get("*", (_req, res, next) => {
        const indexFile = path.join(clientDist, "index.html");
        if (fs.existsSync(indexFile)) return res.sendFile(indexFile);
        return next();
      });
    } else {
      console.log("[Static] Modo API-Only ou nenhum build encontrado.");
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