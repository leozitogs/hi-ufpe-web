# Relatório Explicativo — Hi UFPE (file-by-file, explicativo)

> Objetivo: explicar **cada pasta e cada arquivo**, em linguagem simples, e mostrar como se conectam.


### Glossário rápido (quick glossary)
- **Tela/Screen**: página que você vê (ex.: Página Inicial, Perfil).
- **Componente/Component**: pedaço de tela reaproveitável (um botão, um card).
- **Rota/Route**: caminho para uma tela (ex.: /login abre a Tela de Login).
- **Estado/State**: informações guardadas na memória do app (ex.: usuário logado).
- **Serviço/API**: porta de entrada para buscar/enviar dados (como falar com um servidor).
- **Build**: processo que transforma código em site rápido para publicar.


## Pasta: `Hi UFPE`

### `Hi UFPE/.env`
- **Tipo/Type:** `(sem extensão)` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.

### `Hi UFPE/.env.example`
- **Tipo/Type:** `.example` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.

### `Hi UFPE/.gitignore`
- **Tipo/Type:** `(sem extensão)` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.

### `Hi UFPE/.gitkeep`
- **Tipo/Type:** `(sem extensão)` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.

### `Hi UFPE/.prettierignore`
- **Tipo/Type:** `(sem extensão)` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.

### `Hi UFPE/.prettierrc`
- **Tipo/Type:** `(sem extensão)` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.

### `Hi UFPE/Comandos para rodar Hi UFPE.md`
- **Tipo/Type:** `.md` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Texto explicativo (documentação).

### `Hi UFPE/components.json`
- **Tipo/Type:** `.json` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Arquivo de dados ou configurações em formato de texto.

### `Hi UFPE/contributing.md`
- **Tipo/Type:** `.md` · **Tamanho:** ~5 KB
- **Para que serve / What it does:** Texto explicativo (documentação).

### `Hi UFPE/drizzle.config.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Definição/estrutura do banco de dados (tabelas e campos).
• **Banco:** descreve tabelas e campos (estrutura dos dados).

### `Hi UFPE/npmrc`
- **Tipo/Type:** `(sem extensão)` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.

### `Hi UFPE/package.json`
- **Tipo/Type:** `.json` · **Tamanho:** ~3 KB
- **Para que serve / What it does:** Lista o nome do projeto, comandos de uso e 'bibliotecas' que ele precisa.
• **Comandos prontos (scripts):** dev, build, start, check, format, test, db:push (atalhos para rodar/testar/publicar).
• **Bibliotecas usadas (principais):** @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, @radix-ui/react-accordion, @radix-ui/react-alert-dialog, @radix-ui/react-aspect-ratio, @radix-ui/react-avatar, @radix-ui/react-checkbox, @radix-ui/react-collapsible, @radix-ui/react-context-menu, @radix-ui/react-dialog, @radix-ui/react-dropdown-menu, @radix-ui/react-hover-card…

### `Hi UFPE/pnpm-lock.yaml`
- **Tipo/Type:** `.yaml` · **Tamanho:** ~249 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.

### `Hi UFPE/README.md`
- **Tipo/Type:** `.md` · **Tamanho:** ~13 KB
- **Para que serve / What it does:** Texto explicativo (documentação).

### `Hi UFPE/SETUP_BANCO_LOCAL.md`
- **Tipo/Type:** `.md` · **Tamanho:** ~7 KB
- **Para que serve / What it does:** Texto explicativo (documentação).

### `Hi UFPE/tsconfig.json`
- **Tipo/Type:** `.json` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Ajustes do TypeScript (checagem e organização do código).

### `Hi UFPE/vercel.json`
- **Tipo/Type:** `.json` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Arquivo de dados ou configurações em formato de texto.

### `Hi UFPE/vercelignore`
- **Tipo/Type:** `(sem extensão)` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.

### `Hi UFPE/vite.config.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Configurações para transformar o código em site rápido (Vite).
• **É chamado por (usado por):** Hi UFPE/server/_core/vite.ts

### `Hi UFPE/vite.config.ts.bak`
- **Tipo/Type:** `.bak` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Configurações para transformar o código em site rápido (Vite).

### `Hi UFPE/vitest.config.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.


## Pasta: `Hi UFPE/client`

_Função da pasta: código da interface (frontend). As telas são montadas aqui._

### `Hi UFPE/client/index.html`
- **Tipo/Type:** `.html` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Porta de entrada do site. É a página base onde a aplicação aparece.


## Pasta: `Hi UFPE/drizzle`

_Função da pasta: estrutura de banco de dados (tabelas, migrações)._ 

### `Hi UFPE/drizzle/0000_blue_spacker_dave.sql`
- **Tipo/Type:** `.sql` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Definição/estrutura do banco de dados (tabelas e campos).

### `Hi UFPE/drizzle/0001_concerned_zaladane.sql`
- **Tipo/Type:** `.sql` · **Tamanho:** ~4 KB
- **Para que serve / What it does:** Definição/estrutura do banco de dados (tabelas e campos).

### `Hi UFPE/drizzle/0002_lethal_thunderball.sql`
- **Tipo/Type:** `.sql` · **Tamanho:** ~3 KB
- **Para que serve / What it does:** Definição/estrutura do banco de dados (tabelas e campos).

### `Hi UFPE/drizzle/relations.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Definição/estrutura do banco de dados (tabelas e campos).
• **Conecta-se a (usa):** Hi UFPE/drizzle/schema.ts

### `Hi UFPE/drizzle/schema.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~11 KB
- **Para que serve / What it does:** Definição/estrutura do banco de dados (tabelas e campos).
• **Banco:** descreve tabelas e campos (estrutura dos dados).
• **É chamado por (usado por):** 8 arquivo(s) (ex.: Hi UFPE/drizzle/relations.ts, Hi UFPE/scripts/check_enrollments.ts, Hi UFPE/scripts/seed-fixed.ts, Hi UFPE/server/_core/chatbot-functions.ts, Hi UFPE/server/_core/context.ts, Hi UFPE/server/_core/sdk.ts…)


## Pasta: `Hi UFPE/patches`

### `Hi UFPE/patches/wouter@3.7.1.patch`
- **Tipo/Type:** `.patch` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.


## Pasta: `Hi UFPE/scripts`

### `Hi UFPE/scripts/check_enrollments.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.
• **Banco:** descreve tabelas e campos (estrutura dos dados).
• **Conecta-se a (usa):** Hi UFPE/drizzle/schema.ts

### `Hi UFPE/scripts/seed-fixed.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~7 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.
• **Banco:** descreve tabelas e campos (estrutura dos dados).
• **Conecta-se a (usa):** Hi UFPE/drizzle/schema.ts

### `Hi UFPE/scripts/test_chatbot.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.
• **Conecta-se a (usa):** Hi UFPE/server/routers.ts


## Pasta: `Hi UFPE/server`

_Função da pasta: servidor/API (conversas com o banco e lógica de negócio)._ 

### `Hi UFPE/server/chat.router.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~6 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.
• **Banco:** descreve tabelas e campos (estrutura dos dados).
• **Conecta-se a (usa):** Hi UFPE/drizzle/schema.ts, Hi UFPE/server/_core/chatbot-functions.ts, Hi UFPE/server/_core/env.ts, Hi UFPE/server/_core/llm.ts, Hi UFPE/server/_core/trpc.ts, Hi UFPE/server/db.ts
• **É chamado por (usado por):** Hi UFPE/server/routers.ts

### `Hi UFPE/server/db.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~24 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.
• **Banco:** descreve tabelas e campos (estrutura dos dados).
• **Conecta-se a (usa):** Hi UFPE/drizzle/schema.ts, Hi UFPE/server/_core/env.ts
• **É chamado por (usado por):** Hi UFPE/server/_core/chatbot-functions.ts, Hi UFPE/server/_core/oauth.ts, Hi UFPE/server/_core/sdk.ts, Hi UFPE/server/chat.router.ts, Hi UFPE/server/routers.ts

### `Hi UFPE/server/routers.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~18 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.
• **Conecta-se a (usa):** 8 arquivo(s) (ex.: Hi UFPE/server/_core/chatbot-functions.ts, Hi UFPE/server/_core/cookies.ts, Hi UFPE/server/_core/llm.ts, Hi UFPE/server/_core/systemRouter.ts, Hi UFPE/server/_core/trpc.ts, Hi UFPE/server/chat.router.ts…)
• **É chamado por (usado por):** Hi UFPE/client/src/lib/trpc.ts, Hi UFPE/scripts/test_chatbot.ts, Hi UFPE/server/_core/index.ts

### `Hi UFPE/server/storage.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~2 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.
• **Busca de dados:** conversa com o servidor/serviço externo para trazer informações.
• **Conecta-se a (usa):** Hi UFPE/server/_core/env.ts
• **É chamado por (usado por):** Hi UFPE/server/routers.ts


## Pasta: `Hi UFPE/shared`

### `Hi UFPE/shared/const.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.

### `Hi UFPE/shared/types.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.
• **Banco:** descreve tabelas e campos (estrutura dos dados).


## Pasta: `Hi UFPE/client/public`

_Função da pasta: código da interface (frontend). As telas são montadas aqui._

_Função da pasta: arquivos visíveis/publicados (ícones, imagens, index.html)._ 

### `Hi UFPE/client/public/.gitkeep`
- **Tipo/Type:** `(sem extensão)` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.


## Pasta: `Hi UFPE/client/src`

_Função da pasta: código da interface (frontend). As telas são montadas aqui._

### `Hi UFPE/client/src/App.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.
• **Rotas/Telas:** organiza caminhos como menu de um app (ex.: /login, /perfil).
• **Conecta-se a (usa):** 9 arquivo(s) (ex.: Hi UFPE/client/src/components/ErrorBoundary.tsx, Hi UFPE/client/src/contexts/ThemeContext.tsx, Hi UFPE/client/src/pages/AdminPanel.tsx, Hi UFPE/client/src/pages/Chat.tsx, Hi UFPE/client/src/pages/Comunicados.tsx, Hi UFPE/client/src/pages/Dashboard.tsx…)
• **É chamado por (usado por):** Hi UFPE/client/src/main.tsx

### `Hi UFPE/client/src/const.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.
• **É chamado por (usado por):** Hi UFPE/client/src/main.tsx

### `Hi UFPE/client/src/index.css`
- **Tipo/Type:** `.css` · **Tamanho:** ~5 KB
- **Para que serve / What it does:** Estilos/visual (cores, espaçamentos, tipografia).
• **É chamado por (usado por):** Hi UFPE/client/src/main.tsx

### `Hi UFPE/client/src/main.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Ponto de partida da tela. Liga o código à página e carrega as telas/rotas.
• **Busca de dados:** conversa com o servidor/serviço externo para trazer informações.
• **Conecta-se a (usa):** Hi UFPE/client/src/App.tsx, Hi UFPE/client/src/const.ts, Hi UFPE/client/src/index.css


## Pasta: `Hi UFPE/drizzle/meta`

_Função da pasta: estrutura de banco de dados (tabelas, migrações)._ 

### `Hi UFPE/drizzle/meta/0000_snapshot.json`
- **Tipo/Type:** `.json` · **Tamanho:** ~2 KB
- **Para que serve / What it does:** Definição/estrutura do banco de dados (tabelas e campos).

### `Hi UFPE/drizzle/meta/0001_snapshot.json`
- **Tipo/Type:** `.json` · **Tamanho:** ~22 KB
- **Para que serve / What it does:** Definição/estrutura do banco de dados (tabelas e campos).

### `Hi UFPE/drizzle/meta/0002_snapshot.json`
- **Tipo/Type:** `.json` · **Tamanho:** ~30 KB
- **Para que serve / What it does:** Definição/estrutura do banco de dados (tabelas e campos).

### `Hi UFPE/drizzle/meta/_journal.json`
- **Tipo/Type:** `.json` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Definição/estrutura do banco de dados (tabelas e campos).


## Pasta: `Hi UFPE/drizzle/migrations`

_Função da pasta: estrutura de banco de dados (tabelas, migrações)._ 

### `Hi UFPE/drizzle/migrations/.gitkeep`
- **Tipo/Type:** `(sem extensão)` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Definição/estrutura do banco de dados (tabelas e campos).


## Pasta: `Hi UFPE/server/_core`

_Função da pasta: servidor/API (conversas com o banco e lógica de negócio)._ 

### `Hi UFPE/server/_core/chatbot-functions.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~19 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.
• **Banco:** descreve tabelas e campos (estrutura dos dados).
• **Conecta-se a (usa):** Hi UFPE/drizzle/schema.ts, Hi UFPE/server/db.ts
• **É chamado por (usado por):** Hi UFPE/server/chat.router.ts, Hi UFPE/server/routers.ts

### `Hi UFPE/server/_core/context.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.
• **Banco:** descreve tabelas e campos (estrutura dos dados).
• **Conecta-se a (usa):** Hi UFPE/drizzle/schema.ts, Hi UFPE/server/_core/env.ts, Hi UFPE/server/_core/sdk.ts
• **É chamado por (usado por):** Hi UFPE/server/_core/index.ts, Hi UFPE/server/_core/trpc.ts

### `Hi UFPE/server/_core/cookies.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.
• **É chamado por (usado por):** Hi UFPE/server/_core/oauth.ts, Hi UFPE/server/routers.ts

### `Hi UFPE/server/_core/dataApi.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.
• **Busca de dados:** conversa com o servidor/serviço externo para trazer informações.
• **Conecta-se a (usa):** Hi UFPE/server/_core/env.ts

### `Hi UFPE/server/_core/env.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.
• **É chamado por (usado por):** 9 arquivo(s) (ex.: Hi UFPE/server/_core/context.ts, Hi UFPE/server/_core/dataApi.ts, Hi UFPE/server/_core/imageGeneration.ts, Hi UFPE/server/_core/llm.ts, Hi UFPE/server/_core/notification.ts, Hi UFPE/server/_core/sdk.ts…)

### `Hi UFPE/server/_core/imageGeneration.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~2 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.
• **Busca de dados:** conversa com o servidor/serviço externo para trazer informações.
• **Conecta-se a (usa):** Hi UFPE/server/_core/env.ts

### `Hi UFPE/server/_core/index.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~2 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.
• **Conecta-se a (usa):** Hi UFPE/server/_core/context.ts, Hi UFPE/server/_core/oauth.ts, Hi UFPE/server/_core/vite.ts, Hi UFPE/server/routers.ts

### `Hi UFPE/server/_core/llm.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~8 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.
• **Busca de dados:** conversa com o servidor/serviço externo para trazer informações.
• **Conecta-se a (usa):** Hi UFPE/server/_core/env.ts
• **É chamado por (usado por):** Hi UFPE/server/chat.router.ts, Hi UFPE/server/routers.ts

### `Hi UFPE/server/_core/notification.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~3 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.
• **Busca de dados:** conversa com o servidor/serviço externo para trazer informações.
• **Conecta-se a (usa):** Hi UFPE/server/_core/env.ts
• **É chamado por (usado por):** Hi UFPE/server/_core/systemRouter.ts

### `Hi UFPE/server/_core/oauth.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.
• **Conecta-se a (usa):** Hi UFPE/server/_core/cookies.ts, Hi UFPE/server/_core/sdk.ts, Hi UFPE/server/db.ts
• **É chamado por (usado por):** Hi UFPE/server/_core/index.ts

### `Hi UFPE/server/_core/sdk.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~9 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.
• **Busca de dados:** conversa com o servidor/serviço externo para trazer informações.
• **Banco:** descreve tabelas e campos (estrutura dos dados).
• **Conecta-se a (usa):** Hi UFPE/drizzle/schema.ts, Hi UFPE/server/_core/env.ts, Hi UFPE/server/_core/types/manusTypes.ts, Hi UFPE/server/db.ts
• **É chamado por (usado por):** Hi UFPE/server/_core/context.ts, Hi UFPE/server/_core/oauth.ts

### `Hi UFPE/server/_core/systemRouter.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.
• **Conecta-se a (usa):** Hi UFPE/server/_core/notification.ts, Hi UFPE/server/_core/trpc.ts
• **É chamado por (usado por):** Hi UFPE/server/routers.ts

### `Hi UFPE/server/_core/trpc.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.
• **Conecta-se a (usa):** Hi UFPE/server/_core/context.ts
• **É chamado por (usado por):** Hi UFPE/server/_core/systemRouter.ts, Hi UFPE/server/chat.router.ts, Hi UFPE/server/routers.ts

### `Hi UFPE/server/_core/vite.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.
• **Conecta-se a (usa):** Hi UFPE/vite.config.ts
• **É chamado por (usado por):** Hi UFPE/server/_core/index.ts


## Pasta: `Hi UFPE/shared/_core`

### `Hi UFPE/shared/_core/errors.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.


## Pasta: `Hi UFPE/client/src/components`

_Função da pasta: código da interface (frontend). As telas são montadas aqui._

### `Hi UFPE/client/src/components/DashboardLayout.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~10 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).
• **Conecta-se a (usa):** Hi UFPE/client/src/components/DashboardLayoutSkeleton.tsx, Hi UFPE/client/src/components/ui/button.tsx

### `Hi UFPE/client/src/components/DashboardLayoutSkeleton.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).
• **Conecta-se a (usa):** Hi UFPE/client/src/components/ui/skeleton.tsx
• **É chamado por (usado por):** Hi UFPE/client/src/components/DashboardLayout.tsx

### `Hi UFPE/client/src/components/ErrorBoundary.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).
• **É chamado por (usado por):** Hi UFPE/client/src/App.tsx

### `Hi UFPE/client/src/components/ManusDialog.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~2 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).


## Pasta: `Hi UFPE/client/src/contexts`

_Função da pasta: código da interface (frontend). As telas são montadas aqui._

### `Hi UFPE/client/src/contexts/ThemeContext.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.
• **É chamado por (usado por):** Hi UFPE/client/src/App.tsx


## Pasta: `Hi UFPE/client/src/hooks`

_Função da pasta: código da interface (frontend). As telas são montadas aqui._

### `Hi UFPE/client/src/hooks/useComposition.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~2 KB
- **Para que serve / What it does:** Função reutilizável para lógica de tela (ex.: carregar dados, validar formulário).
• **Conecta-se a (usa):** Hi UFPE/client/src/hooks/usePersistFn.ts

### `Hi UFPE/client/src/hooks/useMobile.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Função reutilizável para lógica de tela (ex.: carregar dados, validar formulário).

### `Hi UFPE/client/src/hooks/usePersistFn.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Função reutilizável para lógica de tela (ex.: carregar dados, validar formulário).
• **É chamado por (usado por):** Hi UFPE/client/src/hooks/useComposition.ts


## Pasta: `Hi UFPE/client/src/lib`

_Função da pasta: código da interface (frontend). As telas são montadas aqui._

### `Hi UFPE/client/src/lib/trpc.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Funções auxiliares que deixam o resto do código mais simples.
• **Conecta-se a (usa):** Hi UFPE/server/routers.ts
• **É chamado por (usado por):** Hi UFPE/client/src/pages/Chat.tsx, Hi UFPE/client/src/pages/Notas.tsx

### `Hi UFPE/client/src/lib/utils.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Funções auxiliares que deixam o resto do código mais simples.


## Pasta: `Hi UFPE/client/src/pages`

_Função da pasta: código da interface (frontend). As telas são montadas aqui._

### `Hi UFPE/client/src/pages/AdminPanel.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~2 KB
- **Para que serve / What it does:** Tela específica do app (rota).
• **É chamado por (usado por):** Hi UFPE/client/src/App.tsx

### `Hi UFPE/client/src/pages/Chat.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~11 KB
- **Para que serve / What it does:** Tela específica do app (rota).
• **Conecta-se a (usa):** Hi UFPE/client/src/_core/hooks/useAuth.ts, Hi UFPE/client/src/lib/trpc.ts
• **É chamado por (usado por):** Hi UFPE/client/src/App.tsx

### `Hi UFPE/client/src/pages/ComponentShowcase.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~55 KB
- **Para que serve / What it does:** Tela específica do app (rota).

### `Hi UFPE/client/src/pages/Comunicados.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~2 KB
- **Para que serve / What it does:** Tela específica do app (rota).
• **É chamado por (usado por):** Hi UFPE/client/src/App.tsx

### `Hi UFPE/client/src/pages/Dashboard.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~24 KB
- **Para que serve / What it does:** Tela específica do app (rota).
• **É chamado por (usado por):** Hi UFPE/client/src/App.tsx

### `Hi UFPE/client/src/pages/Home.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~22 KB
- **Para que serve / What it does:** Tela específica do app (rota).
• **É chamado por (usado por):** Hi UFPE/client/src/App.tsx

### `Hi UFPE/client/src/pages/Horarios.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~2 KB
- **Para que serve / What it does:** Tela específica do app (rota).
• **É chamado por (usado por):** Hi UFPE/client/src/App.tsx

### `Hi UFPE/client/src/pages/Notas.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~2 KB
- **Para que serve / What it does:** Tela específica do app (rota).
• **Conecta-se a (usa):** Hi UFPE/client/src/_core/hooks/useAuth.ts, Hi UFPE/client/src/lib/trpc.ts
• **É chamado por (usado por):** Hi UFPE/client/src/App.tsx

### `Hi UFPE/client/src/pages/NotFound.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Tela específica do app (rota).


## Pasta: `Hi UFPE/server/_core/types`

_Função da pasta: servidor/API (conversas com o banco e lógica de negócio)._ 

### `Hi UFPE/server/_core/types/cookie.d.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.

### `Hi UFPE/server/_core/types/manusTypes.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Parte do projeto; o nome indica sua função no contexto.
• **É chamado por (usado por):** Hi UFPE/server/_core/sdk.ts


## Pasta: `Hi UFPE/client/src/_core/hooks`

_Função da pasta: código da interface (frontend). As telas são montadas aqui._

### `Hi UFPE/client/src/_core/hooks/useAuth.ts`
- **Tipo/Type:** `.ts` · **Tamanho:** ~2 KB
- **Para que serve / What it does:** Função reutilizável para lógica de tela (ex.: carregar dados, validar formulário).
• **Busca de dados:** conversa com o servidor/serviço externo para trazer informações.
• **É chamado por (usado por):** Hi UFPE/client/src/pages/Chat.tsx, Hi UFPE/client/src/pages/Notas.tsx


## Pasta: `Hi UFPE/client/src/components/ui`

_Função da pasta: código da interface (frontend). As telas são montadas aqui._

### `Hi UFPE/client/src/components/ui/accordion.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~2 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/alert-dialog.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~3 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/alert.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/aspect-ratio.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/avatar.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/badge.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/breadcrumb.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~2 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/button-group.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~2 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/button.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~2 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).
• **É chamado por (usado por):** Hi UFPE/client/src/components/DashboardLayout.tsx

### `Hi UFPE/client/src/components/ui/calendar.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~7 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/card.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~2 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/carousel.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~5 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/chart.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~10 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/checkbox.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/collapsible.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/command.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~4 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/context-menu.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~8 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/dialog.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~6 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/drawer.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~4 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/dropdown-menu.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~8 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/empty.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~2 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/field.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~6 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/form.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~3 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/hover-card.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/input-group.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~5 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/input-otp.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~2 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/input.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~2 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/item.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~4 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/kbd.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/label.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/menubar.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~8 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/navigation-menu.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~6 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/pagination.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~2 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/popover.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/progress.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/radio-group.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/resizable.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~2 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/scroll-area.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/select.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~6 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/separator.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/sheet.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~4 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/sidebar.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~22 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/skeleton.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).
• **É chamado por (usado por):** Hi UFPE/client/src/components/DashboardLayoutSkeleton.tsx

### `Hi UFPE/client/src/components/ui/slider.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~2 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/sonner.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/spinner.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~0 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/switch.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/table.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~2 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/tabs.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/textarea.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~2 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/toggle-group.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/toggle.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).

### `Hi UFPE/client/src/components/ui/tooltip.tsx`
- **Tipo/Type:** `.tsx` · **Tamanho:** ~1 KB
- **Para que serve / What it does:** Peça visual reutilizável (um 'lego' da interface).
