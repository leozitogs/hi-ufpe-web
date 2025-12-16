import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  // 1. Define que os arquivos do site estão na pasta 'client'
  root: "client",
  
  build: {
    // 2. FORÇA o Vite a salvar o site pronto em 'client/dist' (Caminho Absoluto)
    // Isso casa perfeitamente com o que configuramos no backend
    outDir: path.resolve(__dirname, "client/dist"),
    emptyOutDir: true,
  },
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
});