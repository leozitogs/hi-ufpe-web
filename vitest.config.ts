import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  // 1. Define a pasta 'client' como a raiz do site
  root: "client",
  
  build: {
    // 2. Simples e direto: Salvar na pasta 'dist' (relativo ao root 'client')
    // Resultado final: /opt/render/project/src/client/dist
    outDir: "dist",
    emptyOutDir: true,
  },
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
});