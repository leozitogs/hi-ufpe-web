# Relatório técnico — Hi UFPE (codebase walkthrough)

_Gerado automaticamente em 2025-11-05 08:11_


## Visão geral / Overview

- **Stack detectada / Detected stack:** Node.js project with package.json detected, React, Vite, Tailwind CSS, TypeScript, Drizzle ORM, Express.js, MySQL client, Axios HTTP client, Vite config present, TypeScript config present, Drizzle ORM config present
- **Nome do projeto (package.json):** `hiufpe-app`
- **Versão (package.json):** `1.0.0`

## Estrutura de pastas (até 4 níveis) / Folder tree (up to 4 levels)

```text
hi_ufpe_extracted
└── Hi UFPE
    ├── .env
    ├── .env.example
    ├── .gitignore
    ├── .gitkeep
    ├── .prettierignore
    ├── .prettierrc
    ├── Comandos para rodar Hi UFPE.md
    ├── README.md
    ├── SETUP_BANCO_LOCAL.md
    ├── client
    │   ├── index.html
    │   ├── public
    │   │   └── .gitkeep
    │   └── src
    │       ├── App.tsx
    │       ├── _core
    │       ├── components
    │       ├── const.ts
    │       ├── contexts
    │       ├── hooks
    │       ├── index.css
    │       ├── lib
    │       ├── main.tsx
    │       └── pages
    ├── components.json
    ├── contributing.md
    ├── drizzle
    │   ├── 0000_blue_spacker_dave.sql
    │   ├── 0001_concerned_zaladane.sql
    │   ├── 0002_lethal_thunderball.sql
    │   ├── meta
    │   │   ├── 0000_snapshot.json
    │   │   ├── 0001_snapshot.json
    │   │   ├── 0002_snapshot.json
    │   │   └── _journal.json
    │   ├── migrations
    │   │   └── .gitkeep
    │   ├── relations.ts
    │   └── schema.ts
    ├── drizzle.config.ts
    ├── npmrc
    ├── package.json
    ├── patches
    │   └── wouter@3.7.1.patch
    ├── pnpm-lock.yaml
    ├── scripts
    │   ├── check_enrollments.ts
    │   ├── seed-fixed.ts
    │   └── test_chatbot.ts
    ├── server
    │   ├── _core
    │   │   ├── chatbot-functions.ts
    │   │   ├── context.ts
    │   │   ├── cookies.ts
    │   │   ├── dataApi.ts
    │   │   ├── env.ts
    │   │   ├── imageGeneration.ts
    │   │   ├── index.ts
    │   │   ├── llm.ts
    │   │   ├── notification.ts
    │   │   ├── oauth.ts
    │   │   ├── sdk.ts
    │   │   ├── systemRouter.ts
    │   │   ├── trpc.ts
    │   │   ├── types
    │   │   └── vite.ts
    │   ├── chat.router.ts
    │   ├── db.ts
    │   ├── routers.ts
    │   └── storage.ts
    ├── shared
    │   ├── _core
    │   │   └── errors.ts
    │   ├── const.ts
    │   └── types.ts
    ├── tsconfig.json
    ├── vercel.json
    ├── vercelignore
    ├── vite.config.ts
    ├── vite.config.ts.bak
    └── vitest.config.ts
```


## Scripts de execução (package.json)

- `dev` → `cross-env NODE_ENV=development tsx watch server/_core/index.ts`
- `build` → `vite build && esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist`
- `start` → `cross-env NODE_ENV=production node dist/index.js`
- `check` → `tsc --noEmit`
- `format` → `prettier --write .`
- `test` → `vitest run`
- `db:push` → `drizzle-kit generate && drizzle-kit migrate`

## Arquivos de ambiente / Environment files

- `Hi UFPE/.env` (1411 bytes)
- `Hi UFPE/.env.example` (575 bytes)

> Dica: crie um `.env.local` ou `.env` com as variáveis esperadas pela aplicação.

## Dependências (package.json)

- @aws-sdk/client-s3 `^3.693.0` (produção)
- @aws-sdk/s3-request-presigner `^3.693.0` (produção)
- @builder.io/vite-plugin-jsx-loc `^0.1.1` (dev)
- @radix-ui/react-accordion `^1.2.12` (produção)
- @radix-ui/react-alert-dialog `^1.1.15` (produção)
- @radix-ui/react-aspect-ratio `^1.1.7` (produção)
- @radix-ui/react-avatar `^1.1.10` (produção)
- @radix-ui/react-checkbox `^1.3.3` (produção)
- @radix-ui/react-collapsible `^1.1.12` (produção)
- @radix-ui/react-context-menu `^2.2.16` (produção)
- @radix-ui/react-dialog `^1.1.15` (produção)
- @radix-ui/react-dropdown-menu `^2.1.16` (produção)
- @radix-ui/react-hover-card `^1.1.15` (produção)
- @radix-ui/react-label `^2.1.7` (produção)
- @radix-ui/react-menubar `^1.1.16` (produção)
- @radix-ui/react-navigation-menu `^1.2.14` (produção)
- @radix-ui/react-popover `^1.1.15` (produção)
- @radix-ui/react-progress `^1.1.7` (produção)
- @radix-ui/react-radio-group `^1.3.8` (produção)
- @radix-ui/react-scroll-area `^1.2.10` (produção)
- @radix-ui/react-select `^2.2.6` (produção)
- @radix-ui/react-separator `^1.1.7` (produção)
- @radix-ui/react-slider `^1.3.6` (produção)
- @radix-ui/react-slot `^1.2.3` (produção)
- @radix-ui/react-switch `^1.2.6` (produção)
- @radix-ui/react-tabs `^1.1.13` (produção)
- @radix-ui/react-toggle `^1.1.10` (produção)
- @radix-ui/react-toggle-group `^1.1.11` (produção)
- @radix-ui/react-tooltip `^1.2.8` (produção)
- @tailwindcss/typography `^0.5.15` (dev)
- @tailwindcss/vite `^4.1.3` (dev)
- @tanstack/react-query `^5.90.2` (produção)
- @trpc/client `^11.6.0` (produção)
- @trpc/react-query `^11.6.0` (produção)
- @trpc/server `^11.6.0` (produção)
- @types/express `4.17.21` (dev)
- @types/node `^24.7.0` (dev)
- @types/react `^19.1.16` (dev)
- @types/react-dom `^19.1.9` (dev)
- @vitejs/plugin-react `^5.0.4` (dev)
- add `^2.0.6` (dev)
- autoprefixer `^10.4.20` (dev)
- axios `^1.12.0` (produção)
- class-variance-authority `^0.7.1` (produção)
- clsx `^2.1.1` (produção)
- cmdk `^1.1.1` (produção)
- cookie `^1.0.2` (produção)
- cross-env `^10.1.0` (dev)
- date-fns `^4.1.0` (produção)
- dotenv `^17.2.3` (produção)
- drizzle-kit `^0.31.4` (dev)
- drizzle-orm `^0.44.5` (produção)
- embla-carousel-react `^8.6.0` (produção)
- esbuild `^0.25.0` (dev)
- express `^4.21.2` (produção)
- framer-motion `^12.23.22` (produção)
- input-otp `^1.4.2` (produção)
- jose `6.1.0` (produção)
- lucide-react `^0.453.0` (produção)
- mysql2 `^3.15.0` (produção)
- nanoid `^5.1.5` (produção)
- next-themes `^0.4.6` (produção)
- node-fetch `^3.3.2` (dev)
- pnpm `^10.15.1` (dev)
- postcss `^8.4.47` (dev)
- prettier `^3.6.2` (dev)
- react `^19.1.1` (produção)
- react-day-picker `^9.11.1` (produção)
- react-dom `^19.1.1` (produção)
- react-hook-form `^7.64.0` (produção)
- react-resizable-panels `^3.0.6` (produção)
- recharts `^2.15.2` (produção)
- sonner `^2.0.7` (produção)
- superjson `^1.13.3` (produção)
- tailwind-merge `^3.3.1` (produção)
- tailwindcss `^4.1.14` (dev)
- tailwindcss-animate `^1.0.7` (produção)
- tsx `^4.19.1` (dev)
- tw-animate-css `^1.4.0` (dev)
- typescript `5.9.3` (dev)
- vaul `^1.1.2` (produção)
- vite `^7.1.7` (dev)
- vite-plugin-manus-runtime `^0.0.42` (dev)
- vitest `^2.1.4` (dev)
- wouter `^3.3.5` (produção)
- zod `^4.1.12` (produção)

## Arquivos-chave / Key config files

- `Hi UFPE/package.json`
- `Hi UFPE/tsconfig.json`
- `Hi UFPE/vite.config.ts`
- `Hi UFPE/drizzle.config.ts`
- `Hi UFPE/README.md`

## Exports (principais módulos e componentes)

- `Hi UFPE/client/src/_core/hooks/useAuth.ts` → useAuth
- `Hi UFPE/client/src/components/DashboardLayout.tsx` → DashboardLayout
- `Hi UFPE/client/src/components/DashboardLayoutSkeleton.tsx` → DashboardLayoutSkeleton
- `Hi UFPE/client/src/components/ManusDialog.tsx` → ManusDialog
- `Hi UFPE/client/src/components/ui/dialog.tsx` → useDialogComposition
- `Hi UFPE/client/src/const.ts` → APP_LOGO, APP_TITLE, getLoginUrl
- `Hi UFPE/client/src/contexts/ThemeContext.tsx` → ThemeProvider, useTheme
- `Hi UFPE/client/src/hooks/useComposition.ts` → useComposition
- `Hi UFPE/client/src/hooks/useMobile.tsx` → useIsMobile
- `Hi UFPE/client/src/hooks/usePersistFn.ts` → usePersistFn
- `Hi UFPE/client/src/lib/trpc.ts` → trpc
- `Hi UFPE/client/src/lib/utils.ts` → cn
- `Hi UFPE/client/src/pages/AdminPanel.tsx` → AdminPanel
- `Hi UFPE/client/src/pages/ComponentShowcase.tsx` → ComponentsShowcase
- `Hi UFPE/client/src/pages/Comunicados.tsx` → Comunicados
- `Hi UFPE/client/src/pages/Dashboard.tsx` → Dashboard
- `Hi UFPE/client/src/pages/Home.tsx` → Home
- `Hi UFPE/client/src/pages/Horarios.tsx` → Horarios
- `Hi UFPE/client/src/pages/Notas.tsx` → Notas
- `Hi UFPE/client/src/pages/NotFound.tsx` → NotFound
- `Hi UFPE/drizzle/schema.ts` → avaliacoes, comunicados, conversas, disciplinas, eventos, horarios, matriculas, mensagens (+5 mais)
- `Hi UFPE/server/_core/chatbot-functions.ts` → CHATBOT_FUNCTIONS, chatbotFunctions, executarFuncao, getChatbotFunctions
- `Hi UFPE/server/_core/context.ts` → createContext
- `Hi UFPE/server/_core/cookies.ts` → getSessionCookieOptions
- `Hi UFPE/server/_core/dataApi.ts` → callDataApi
- `Hi UFPE/server/_core/env.ts` → ENV
- `Hi UFPE/server/_core/imageGeneration.ts` → generateImage
- `Hi UFPE/server/_core/llm.ts` → invokeLLM
- `Hi UFPE/server/_core/notification.ts` → notifyOwner
- `Hi UFPE/server/_core/oauth.ts` → registerOAuthRoutes
- `Hi UFPE/server/_core/sdk.ts` → sdk
- `Hi UFPE/server/_core/systemRouter.ts` → systemRouter
- `Hi UFPE/server/_core/trpc.ts` → adminProcedure, protectedProcedure, publicProcedure, router
- `Hi UFPE/server/_core/types/cookie.d.ts` → parse
- `Hi UFPE/server/_core/vite.ts` → serveStatic, setupVite
- `Hi UFPE/server/chat.router.ts` → chatRouter
- `Hi UFPE/server/db.ts` → createAvaliacao, createComunicado, createConversa, createDisciplina, createEvento, createHorario, createMatricula, createMensagem (+36 mais)
- `Hi UFPE/server/routers.ts` → appRouter
- `Hi UFPE/server/storage.ts` → storageGet, storagePut
- `Hi UFPE/shared/_core/errors.ts` → BadRequestError, ForbiddenError, HttpError, NotFoundError, UnauthorizedError
- `Hi UFPE/shared/const.ts` → AXIOS_TIMEOUT_MS, COOKIE_NAME, NOT_ADMIN_ERR_MSG, ONE_YEAR_MS, UNAUTHED_ERR_MSG

## Explicação pasta a pasta (heurística) / Directory-by-directory explanation (heuristic)

### `Hi UFPE/` — Diretório do projeto; função específica deduzida pelos arquivos internos.
- Importante: `Hi UFPE/client/src/App.tsx`
- Importante: `Hi UFPE/client/src/main.tsx`
- Importante: `Hi UFPE/drizzle.config.ts`
- Importante: `Hi UFPE/server/_core/index.ts`
- Importante: `Hi UFPE/tsconfig.json`
- Importante: `Hi UFPE/vite.config.ts`
- Tipos de arquivo mais comuns aqui: TypeScript React (70), TypeScript (37), Unknown (9), JSON (8), Markdown (4)


## Trecho do README (início)

```
# Hi UFPE - Hub Inteligente 🎓

**Versão:** 1.0.0 (17 de Outubro de 2025)
**Status:** ✅ Pronto para Apresentação (Sprint 2)
**Repositório:** [github.com/leozitogs/hi-ufpe-web](github.com/leozitogs/hi-ufpe-web)

## 📋 Sumário Executivo

O **Hi UFPE** é um sistema acadêmico inteligente desenvolvido para revolucionar a experiência do estudante da Universidade Federal de Pernambuco (UFPE), oferecendo uma alternativa moderna, intuitiva e superior ao sistema SIGAA tradicional. O projeto se destaca pela integração de um **Assistente Virtual com Inteligência Artificial** que permite gerenciar disciplinas, notas, horários e frequência de forma natural e conversacional.

O diferencial central é o **Chatbot com IA** que, através da tecnologia de *Function Calling*, consegue executar ações no 
...
```