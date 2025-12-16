import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session"; // [NOVO] Importar sessão
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

// ... (Funções isPortAvailable e findAvailablePort permanecem iguais) ...

// Adicionei as funções aqui para manter o contexto, se precisar copie do seu arquivo original
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

  // [CRÍTICO PARA RENDER] Diz ao Express que ele está atrás de um Proxy (Load Balancer)
  // Sem isso, cookies 'Secure' não funcionam.
  app.set("trust proxy", 1);

  app.use(cors({
    // Sua URL do Frontend (sem barra no final)
    origin: ["https://hi-ufpe-web-1vms.onrender.com", "http://localhost:5173"],
    credentials: true, // Permite cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-trpc-source"]
  }));

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // [NOVO] Configuração de Sessão Segura
  app.use(session({
    secret: process.env.JWT_SECRET || "segredo-super-secreto",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // True no Render (HTTPS), False local
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax', // 'none' permite Cross-Domain
      httpOnly: true,
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

  // ... (Resto do código setupVite e serveStatic permanece igual) ...
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    const clientDist = path.resolve(__dirname, "../../client/dist");
    const hasClientBuild = fs.existsSync(clientDist);
    const SERVE_CLIENT = process.env.SERVE_CLIENT === "true";

    if (SERVE_CLIENT || hasClientBuild) {
      console.log("Servindo client build de:", clientDist);
      app.use(express.static(clientDist));
      app.get("*", (_req, res, next) => {
        const indexFile = path.join(clientDist, "index.html");
        if (fs.existsSync(indexFile)) return res.sendFile(indexFile);
        return next();
      });
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