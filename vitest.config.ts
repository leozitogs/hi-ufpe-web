import { defineConfig } from "vitest/config";
import path from "path";
// Importe o plugin do React
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react() as any], // <--- ADICIONE ISSO AQUI
  root: path.resolve(import.meta.dirname),
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./client/tests/setup.ts"],
    include: [
      "server/**/*.test.ts", 
      "server/**/*.spec.ts",
      "client/**/*.test.ts",
      "client/**/*.test.tsx", // Garanta que .tsx está aqui
      "client/**/*.spec.ts",
      "client/**/*.spec.tsx"
    ],
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@server": path.resolve(__dirname, "./server"),
      "@shared": path.resolve(__dirname, "./shared"),
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
});