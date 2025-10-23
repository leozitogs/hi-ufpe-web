// scripts/test_chatbot.ts
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import SuperJSON from "superjson";
import type { AppRouter } from "../server/routers";

async function main() {
  const url = process.env.TEST_TRPC_URL ?? "http://localhost:3000/api/trpc";
  const mockUser = process.env.OWNER_OPEN_ID ?? "dev-owner";
  const conversaIdEnv = process.env.TEST_CONVERSA_ID || undefined;
  const periodo = process.env.PERIODO_ATUAL || "2025.2";

  const client = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url,
        transformer: SuperJSON, // tRPC v11: transformer deve ficar no link
        headers: {
          "x-mock-user-id": mockUser, // backend lê este header em DEV
        },
      }),
    ],
  });

  // (opcional) healthcheck para validar o transformer e a rota
  // const h = await client.health.query();
  // console.log("[health]", h);

  // se já possuir conversa fixa, use-a; senão pode criar/pegar a existente
  const conversaId = conversaIdEnv ?? undefined;

  const resposta = await client.chat.enviarMensagem.mutate({
    conversaId,
    mensagem:
      "Quero ver minha situação geral e registrar 1 falta em Desenvolvimento de Software hoje.",
  });

  console.log("Assistant:", resposta.resposta);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
