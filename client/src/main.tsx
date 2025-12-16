import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";

const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  // [CORREÇÃO FINAL] Agora que usamos Tokens, a autenticação é robusta.
  // Se der erro 401, o token é inválido/expirou. Devemos redirecionar de verdade.
  window.location.href = getLoginUrl(); 
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      // URL Absoluta (MANTENHA para Cross-Site)
      url: "https://hi-ufpe.onrender.com/api/trpc", 
      
      transformer: superjson,

      // [CRÍTICO] Injeta o Token salvo no LocalStorage no cabeçalho
      headers() {
        const token = localStorage.getItem("auth_token");
        return {
          // Se existir token, envia como Bearer. Se não, envia vazio.
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
      },

      // Mantemos credentials: "include" por compatibilidade, mas o header acima é quem manda.
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include", 
        });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);