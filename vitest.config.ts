import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // Removemos os plugins do Replit que causavam erro
  plugins: [react()],
  
  // Define que a raiz do frontend é a pasta 'client'
  root: "client",
  
  build: {
    // Gera o build em client/dist
    outDir: "dist",
    emptyOutDir: true,
  },
  
  resolve: {
    alias: {
      // Ajusta os imports para apontar corretamente para dentro de client
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
});