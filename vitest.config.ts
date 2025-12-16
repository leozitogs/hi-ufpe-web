import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  // 1. Onde está o código fonte? Na pasta client
  root: "client", 
  build: {
    // 2. Onde salvar o site pronto? Forçamos ser em client/dist
    // O path.resolve garante que ele não jogue na raiz por engano
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