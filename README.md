# Hi UFPE - Hub Inteligente 🎓

**Versão:** 1.0.4 (15 de Dezembro de 2025)
**Status:** ✅ Pronto para Apresentação e Deploy (Sprint 5)
**Repositório:** [github.com/leozitogs/hi-ufpe-web](github.com/leozitogs/hi-ufpe-web)

## 📋 Sumário Executivo

O **Hi UFPE** é um sistema acadêmico inteligente desenvolvido para revolucionar a experiência do estudante da Universidade Federal de Pernambuco (UFPE), oferecendo uma alternativa moderna, intuitiva e superior ao sistema SIGAA tradicional. O projeto se destaca pela integração de um **Assistente Virtual com Inteligência Artificial** que permite gerenciar disciplinas, notas, horários e frequência de forma natural e conversacional.

O diferencial central é o **Chatbot com IA** que, através da tecnologia de *Function Calling*, consegue executar ações no sistema (como lançar notas ou registrar faltas) e fornecer cálculos e previsões automáticas, transformando tarefas burocráticas em interações simples por linguagem natural.

---

## 🎯 Contexto e Problemática (Pesquisa Acadêmica)

Este projeto nasceu da necessidade de solucionar problemas sistêmicos encontrados em sistemas acadêmicos legados, como o SIGAA, conforme validado por uma extensa pesquisa primária e secundária.

### Desafios do Sistema Acadêmico Atual (SIGAA)

| Aspecto | Problema Identificado (Pesquisa Primária e Secundária) |
| :--- | :--- |
| **Interface e Usabilidade** | Mal organizada, antiquada, confusa e pouco intuitiva. Dificuldade em localizar dados essenciais. |
| **Instabilidade** | Quedas frequentes, especialmente em períodos críticos (matrículas). |
| **Acessibilidade** | Falta de uma versão mobile funcional e dificuldade de acesso para pessoas com deficiência (falha em cumprir eMAG). |
| **Gestão de Dados** | Dependência de administradores para cadastrar dados, falta de autonomia para o aluno. |
| **Comunicação** | Falta de clareza e canais de suporte eficientes, exigindo que o aluno recorra a fontes externas. |

### Solução Proposta: Hi UFPE

O **Hi UFPE** adota metodologias ágeis (Design Thinking e Scrum) e uma arquitetura moderna para oferecer:

1.  **Autonomia Total (Self-Service):** O aluno gerencia suas próprias disciplinas, métodos de avaliação e horários.
2.  **Flexibilidade:** Sistema de avaliação totalmente configurável por disciplina.
3.  **Inteligência Artificial:** Interação conversacional via chatbot para tarefas acadêmicas.
4.  **UX Superior:** Interface moderna, responsiva e centrada no usuário.

---

## 🚀 Funcionalidades Principais

O sistema foi concebido com uma abordagem **Self-Service**, garantindo total autonomia ao aluno na gestão de seus dados acadêmicos.

### 1. Gestão Acadêmica Autônoma

| Funcionalidade | Descrição Detalhada |
| :--- | :--- |
| **Self-Service de Disciplinas** | O aluno adiciona, configura e gerencia suas próprias disciplinas, incluindo a configuração de carga horária e professor. |
| **Sistema de Avaliação Flexível** | Permite configurar o método de avaliação por disciplina (ex: "2 Provas + 3 APs"), definindo pesos e tipos de avaliação (prova, trabalho, AP). |
| **Cálculo Automático de Médias** | Média calculada em tempo real com base na fórmula personalizada, atualizando o status (Aprovado/Reprovado) instantaneamente. |
| **Grade de Horários Automática** | Visualização em grade semanal gerada automaticamente ao adicionar horários, com detecção de conflitos. |
| **Registro de Faltas** | Gestão de frequência, permitindo o registro de faltas e o cálculo da frequência em tempo real, com alertas de risco. |
| **Dashboard Interativo** | Visão geral e personalizável do status acadêmico, alertas e próximas aulas. |
| **Painel Administrativo** | Interface para upload de planilhas (horários, notas, alunos) e gestão de comunicados (para professores/administradores). |

### 2. Chatbot Inteligente com IA (Diferencial Competitivo)

O assistente virtual utiliza a **API do ChatGPT da OpenAI (modelo GPT-4o-mini)** e o recurso de *Function Calling* para interagir com o sistema, transformando comandos de voz ou texto em ações no banco de dados.

#### Funções de IA (Function Calling) Implementadas:

| Função | Descrição | Exemplo de Interação |
| :--- | :--- | :--- |
| `lancar_nota` | Lança nota em uma avaliação específica. | *"Tirei 8.5 na prova 1 de Desenvolvimento de Software"* |
| `registrar_falta` | Registra falta em uma disciplina. | *"Faltei na aula de Banco de Dados hoje"* |
| `consultar_media` | Consulta a média atual em uma disciplina. | *"Qual minha média em Desenvolvimento de Software?"* |
| `calcular_projecao` | Calcula a nota mínima necessária para aprovação. | *"Quanto preciso tirar na próxima prova para passar?"* |
| `simular_nota` | Simula a média final com uma nota hipotética. | *"Se eu tirar 7 na prova 2, qual será minha média final?"* |
| `consultar_faltas` | Consulta o número de faltas e a frequência. | *"Quantas faltas eu tenho em Banco de Dados?"* |
| `consultar_proxima_aula` | Informa a próxima aula do aluno. | *"Tenho aula amanhã?"* |
| `consultar_situacao_geral` | Fornece um resumo do status em todas as disciplinas. | *"Qual minha situação em todas as disciplinas?"* |

#### Insights e Alertas Automáticos:

O chatbot fornece **insights e alertas proativos** sobre a situação acadêmica do aluno, como:
*   **Alerta de Risco:** Notificação quando a média está abaixo do limite.
*   **Alerta de Frequência:** Aviso quando o aluno se aproxima do limite de faltas.
*   **Aprovação:** Mensagens de parabéns ao atingir a média.
*   **Lembretes:** Alertas de provas e aulas.

---

## 🎯 Diferenciais Competitivos

O **Hi UFPE** se posiciona como uma solução superior ao SIGAA, focando na experiência e autonomia do estudante.

| Aspecto | SIGAA | Hi UFPE |
|:--------|:------|:--------|
| **Interface** | Antiga, burocrática | Moderna, intuitiva (React + TailwindCSS) |
| **Gestão de Dados** | Dependente do Administrador | **Self-service** (Aluno gerencia) |
| **Consultas** | Navegação de menus complexos | **Chatbot com IA** (Linguagem Natural) |
| **Cálculo de Média** | Manual | **Automático** |
| **Avaliação Flexível** | ❌ Não suporta | ✅ Suporte total por disciplina |
| **Inteligência Artificial** | ❌ Não possui | ✅ **ChatGPT da OpenAI com Function Calling** |
| **Insights** | ❌ Não possui | ✅ Alertas automáticos e projeções de notas |

---

## 👥 Estrutura da Equipe (sCIna)

O projeto foi desenvolvido sob a metodologia **Scrum**, com uma estrutura de equipe bem definida para otimizar o fluxo de trabalho e a entrega de valor.

| Papel (Estrutura Ágil) | Responsabilidade Principal |
| :--- | :--- |
| **Product Owner (PO)** | Definir a visão do produto, gerenciar o *backlog* e garantir o alinhamento com as necessidades dos usuários. |
| **Scrum Master** | Facilitar os rituais, remover impedimentos e garantir a adesão aos processos ágeis. |
| **Líder Técnico / UX Lead** | Referência para decisões técnicas e de design, garantindo a qualidade e viabilidade das soluções. |
| **Equipe de Desenvolvimento** | Grupo multifuncional responsável pela pesquisa, design, implementação e validação do produto. |

**Ferramentas de Colaboração:** Trello (Gestão de Tarefas), Google Meet/Whatsapp (Comunicação), Google Drive/GitHub (Documentação).

---

## 🤝 Guia de Contribuição (CONTRIBUTING.md)

Para contribuir com o projeto, consulte o arquivo `CONTRIBUTING.md` para detalhes sobre o fluxo de trabalho Git, convenções de nomenclatura e o **Checklist de Qualidade (Pré-Integração)**.

---

## 🚀 Próximos Passos (Roadmap Futuro)

1.  **App Mobile** - Versão nativa para iOS e Android.
2.  **Notificações Push** - Alertas em tempo real.
3.  **Análise de Desempenho** - Gráficos e estatísticas avançadas.
4.  **Gamificação** - Badges relevantes e conquistas motivadoras.

---

# 👨‍💻 Dev Guide

Este guia contém informações técnicas detalhadas para desenvolvedores que desejam contribuir ou trabalhar com o projeto. Para instruções de instalação rápida, vá para [Configuração e Instalação (Guia Detalhado)](#-configuração-e-instalação-guia-detalhada).

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 18+** & **TypeScript** - Biblioteca de UI e tipagem
- **Tailwind CSS 3** - Estilização utilitária
- **shadcn/ui** - Componentes de interface reutilizáveis
- **Wouter** - Roteamento leve e performático
- **TanStack Query (React Query)** - Gestão de estado assíncrono e cache
- **Lucide React** - Biblioteca de ícones
- **date-fns** - Manipulação e formatação de datas
- **Vite** - Build tool e bundler rápido

### Backend
- **Node.js** - Ambiente de execução
- **Express** - Framework web
- **tRPC v11** - API type-safe end-to-end
- **Zod** - Validação de schemas e inferência de tipos
- **Drizzle ORM** - Queries type-safe e performáticas
- **MySQL / TiDB Cloud** - Banco de dados relacional

### IA & Integrações
- **OpenAI API (GPT-4o-mini)** - Chatbot com *Function Calling*
- **AWS S3** - Armazenamento de arquivos (Uploads)
- **Google OAuth** - Autenticação social

### DevOps & Qualidade
- **TypeScript** - Verificação estática estrita
- **Vitest** - Testes unitários e de integração
- **Drizzle Kit** - Gestão e migração de banco de dados
- **SonarLint** - Análise estática de código e métricas de qualidade
- **Prettier** - Padronização e formatação de código

---

## Estrutura de Pastas

Consulte relatorio_hi_ufpe.md para detalhes completos. Aqui está um resumo:

```
hi-ufpe-web/
├── client/                           # Frontend (React)
│   ├── index.html                    # Entrada HTML
│   ├── public/                       # Assets estáticos
│   └── src/
│       ├── _core/                    # Lógica core interna do cliente
│       ├── components/               # Componentes visuais (shadcn/ui + custom)
│       ├── contexts/                 # Context API (ThemeContext, Auth)
│       ├── hooks/                    # Custom React hooks
│       ├── lib/                      # Bibliotecas e utilitários (tRPC, Auth, Query)
│       ├── pages/                    # Páginas da aplicação (Roteamento)
│       ├── tests/                    # Suíte de Testes (Vitest)
│       │   ├── components/           # Testes de componentes
│       │   ├── hooks/                # Testes de hooks
│       │   ├── pages/                # Testes de páginas
│       │   ├── unit/                 # Testes unitários gerais
│       │   └── setup.ts              # Configuração do ambiente de teste
│       ├── App.tsx                   # Componente raiz
│       ├── main.tsx                  # Ponto de entrada (Bootstrap)
│       └── const.ts                  # Constantes do frontend
│
├── server/                           # Backend (Node.js + tRPC)
│   ├── _core/                        # Núcleo do sistema
│   │   ├── types/                    # Definições de tipos (Cookies, etc)
│   │   ├── chatbot-functions.ts      # Function Calling da IA
│   │   ├── context.ts                # Contexto das requisições
│   │   ├── llm.ts                    # Integração com OpenAI (ChatGPT)
│   │   ├── oauth.ts                  # Autenticação OAuth
│   │   └── trpc.ts                   # Configuração do tRPC
│   ├── database/                     # Camada de Acesso a Dados (DAL)
│   │   ├── academic/                 # Queries acadêmicas (notas, turmas)
│   │   ├── communication/            # Queries de chat e avisos
│   │   ├── system/                   # Queries de sistema
│   │   ├── users/                    # Queries de usuários
│   │   └── connection.ts             # Conexão com o Banco (Drizzle)
│   ├── tests/                        # Testes de integração/unitários do back
│   ├── utils/                        # Regras de Negócio Puras
│   │   ├── calculos.ts               # Algoritmos de média e aprovação
│   │   └── horarios.ts               # Lógica de grade horária
│   ├── routers.ts                    # Roteador Principal tRPC
│   └── storage.ts                    # Serviço de Upload (S3)
│
├── drizzle/                          # Migrações e Schema do Banco
│   ├── migrations/                   # Arquivos .sql gerados
│   ├── meta/                         # Metadados do Drizzle
│   ├── relations.ts                  # Relacionamentos entre tabelas
│   └── schema.ts                     # Definição das tabelas
│
├── scripts/                          # Scripts de Automação
│   ├── check_enrollments.ts          # Auditoria de matrículas
│   ├── seed-fixed.ts                 # Popula banco com dados iniciais
│   └── test_chatbot.ts               # Teste isolado do bot
│
├── shared/                           # Código Isomórfico (Front + Back)
│   ├── _core/                        # Tratamento de erros
│   ├── const.ts                      # Constantes compartilhadas (Cookies, URLs)
│   └── types.ts                      # Tipos TypeScript compartilhados
│
├── patches/                          # Correções em dependências (pnpm patch)
│
├── .env.example                      # Template de variáveis de ambiente
├── .gitignore                        # Arquivos ignorados pelo Git
├── components.json                   # Configuração do shadcn/ui
├── contributing.md                   # Guia de contribuição
├── drizzle.config.ts                 # Configuração do Drizzle Kit
├── package.json                      # Dependências e scripts do projeto
├── pnpm-lock.yaml                    # Lockfile de versões (pnpm)
├── README.md                         # Documentação do projeto
├── tsconfig.json                     # Configuração TypeScript
├── vercel.json                       # Configuração de Deploy
├── vite.config.ts                    # Configuração do Vite (Build)
└── vitest.config.ts                  # Configuração dos Testes (Vitest)
```

---

## 🏗️ Arquitetura Técnica e Stack

O projeto segue uma arquitetura moderna e *full-stack*, utilizando o conceito de *type-safety* de ponta a ponta, essencial para a robustez de um sistema acadêmico.

### Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                    │
│  ├─ Páginas (Dashboard, Chat, Disciplinas, Admin)           │
│  ├─ Componentes (shadcn/ui + custom)                        │
│  └─ Estado (TanStack Query + Context)                       │
└────────────────┬────────────────────────────────────────────┘
                 │ tRPC (type-safe API calls)
                 ↓
┌─────────────────────────────────────────────────────────────┐
│                        Backend (Node.js)                    │
│  ├─ Routers Modularizados (server/routers/*.ts)             │
│  │   └─ auth, chat, disciplinas, matriculas...              │
│  ├─ Business Logic (server/utils & server/_core)            │
│  └─ Data Access Layer (server/database/*.ts)                │
└────────────────┬────────────────────────────────────────────┘
                 │ Drizzle ORM (Queries Tipadas)
                 ↓
┌─────────────────────────────────────────────────────────────┐
│                       MySQL Database                        │
│  ├─ users, disciplinas, professores                         │
│  ├─ horarios, matriculas, avaliacoes                        │
│  ├─ registro_faltas, comunicados                            │
│  └─ conversas, mensagens                                    │
└─────────────────────────────────────────────────────────────┘
```


### Estrutura do Banco de Dados (Drizzle ORM)

O schema do banco de dados (`drizzle/schema.ts`) foi atualizado para suportar todas as funcionalidades de avaliação flexível e registro de faltas, totalizando **10 tabelas principais**:

| Tabela | Descrição |
| :--- | :--- |
| `users` | Usuários do sistema (alunos, professores, admin). |
| `disciplinas` | Disciplinas (oficiais e criadas por alunos), incluindo carga horária. |
| `professores` | Cadastro de professores. |
| `horarios` | Grade horária das disciplinas, com dia da semana e sala. |
| `matriculas` | Matrículas dos alunos, incluindo `mediaCalculada` e `faltas`. |
| `metodos_avaliacao` | Armazena métodos de avaliação personalizados (ex: "2 Provas + 3 APs"). |
| `avaliacoes` | Avaliações individuais (provas, APs, trabalhos) com `peso` e `notaObtida`. |
| `registro_faltas` | Registro detalhado das faltas dos alunos. |
| `comunicados` | Avisos e comunicados importantes. |
| `conversas` + `mensagens` | Histórico de conversas do chatbot. |

### Integração Backend (tRPC)

As rotas do backend são gerenciadas pelo **tRPC**, garantindo que as chamadas de API sejam tipadas de ponta a ponta (client ↔ server). As rotas de gestão acadêmica (disciplinas, avaliações, faltas, matrículas) foram criadas com o objetivo de serem consumidas tanto pelo frontend quanto pelo *Function Calling* do chatbot.

---

## 💻 Configuração e Instalação (Guia Detalhado)

Este guia é essencial para replicar o ambiente de desenvolvimento localmente e democratizar o uso acadêmico do repositório.

### Pré-requisitos

* **Node.js** (v18+)
* **pnpm**
* **Git**
* **MySQL** (para ambiente local, pode ser via MySQL Community Server ou XAMPP)

### Guia de Instalação Local

1.  **Instalar pnpm:**
    ```bash
    npm install -g pnpm
    ```

2.  **Clonar e Instalar Dependências:**
    ```bash
    git clone [https://github.com/leozitogs/hi-ufpe-web.git](https://github.com/leozitogs/hi-ufpe-web.git)
    cd hi-ufpe-web
    pnpm install
    ```

3.  **Configurar Banco de Dados Local (MySQL):**
    * Crie um banco de dados chamado `hiufpe` (via MySQL CLI ou phpMyAdmin).
    * Crie o arquivo `.env` na raiz do projeto com a string de conexão, por exemplo: `DATABASE_URL=mysql://root:root123@localhost:3306/hiufpe`.
    * **Usuários de Teste:** O projeto pode ser testado com usuários de exemplo após o `seed` (ex: `admin@ufpe.br` / `admin123`).

4.  **Inicializar Banco de Dados (Drizzle ORM):**
    * **Comandos Drizzle para Gestão do Schema:**

    | Comando | Função |
    | :--- | :--- |
    | `pnpm drizzle-kit generate` | Gera o arquivo de *migration* (SQL) a partir do `drizzle/schema.ts` para capturar as mudanças no banco. |
    | `pnpm drizzle-kit migrate` | Aplica as *migrations* geradas no banco de dados. **Recomendado para ambientes de produção.** |
    | `pnpm db:push` | Aplica o schema Drizzle diretamente no banco de dados. **Recomendado para desenvolvimento local.** |

    * **Execução:**
    ```bash
    # 1. Aplicar schema (cria as tabelas)
    pnpm db:push
    
    # 2. Popula o banco com dados reais do CIn 2025.2 (Opcional, mas recomendado)
    pnpm tsx scripts/seed-fixed.ts
    ```

5.  **Iniciar o Servidor de Desenvolvimento:**
    ```bash
    pnpm dev
    ```
    * **Frontend:** `http://localhost:5173`
    * **Backend:** `http://localhost:3000`


### Schema com Drizzle ORM

O schema está definido em `drizzle/schema.ts`, utilizando a sintaxe `mysql-core`:

```typescript
import { mysqlTable, int, varchar, timestamp } from "drizzle-orm/mysql-core";

// Exemplo simplificado
export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  email: varchar('email', { length: 255 }).unique(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const disciplinas = mysqlTable('disciplinas', {
  id: int('id').primaryKey().autoincrement(),
  codigo: varchar('codigo', { length: 50 }),
  nome: varchar('nome', { length: 255 }),
  creditos: int('creditos'),
  userId: int('user_id').references(() => users.id),
});

### Relacionamentos

Definidos em drizzle/relations.ts para facilitar queries aninhadas (Join):

````typescript
import { relations } from "drizzle-orm";
import { users, disciplinas, matriculas, horarios, avaliacoes } from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  disciplinas: many(disciplinas),
  matriculas: many(matriculas),
}));

export const disciplinasRelations = relations(disciplinas, ({ many, one }) => ({
  horarios: many(horarios),
  avaliacoes: many(avaliacoes),
  usuario: one(users, {
    fields: [disciplinas.userId],
    references: [users.id],
  }),
}));
````

### Migrations

Quando alterar o schema (`drizzle/schema.ts`):

```bash
# 1. Gerar arquivo de migração SQL
pnpm drizzle-kit generate

# 2. Revisar o arquivo criado em drizzle/migrations/000X_*.sql

# 3. Aplicar as mudanças no banco de dados
pnpm db:push
```

### Queries com Drizzle

No projeto, as queries são modularizadas em server/database/. Um exemplo de como a sintaxe funciona:

````typescript
import { db } from '../server/database/connection';
import { disciplinas } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

// SELECT
const userDisciplinas = await db
  .select()
  .from(disciplinas)
  .where(eq(disciplinas.userId, userId));

// INSERT
await db.insert(disciplinas).values({
  codigo: 'CIN0130',
  nome: 'Sistemas Digitais',
  creditos: 4,
  userId: 1,
});

// UPDATE
await db
  .update(disciplinas)
  .set({ nome: 'Novo Nome' })
  .where(eq(disciplinas.id, id));

// DELETE
await db
  .delete(disciplinas)
  .where(eq(disciplinas.id, id));
````

---

### Scripts de Desenvolvimento Úteis

| Comando | Descrição |
| :--- | :--- |
| `pnpm install` | **Instala as dependências** do projeto (executar primeiro). |
| `pnpm start` | Inicia o servidor de desenvolvimento (frontend e backend). |
| `pnpm dev` | Inicia o servidor de desenvolvimento (frontend e backend). |
| `pnpm build` | Gera a *build* de produção. |
| `pnpm db:push` | Sincroniza o schema do Drizzle com o banco de dados. |
| `pnpm db:studio` | Abre o painel visual do Drizzle para explorar os dados. |
| `pnpm tsx scripts/seed-fixed.ts` | Popula o banco com dados de exemplo. |
| `pnpm check` | Executa a verificação de tipos em todo o projeto. |
| `pnpm drizzle-kit generate` | **Gera a migration** baseada nas mudanças do schema. |
| `pnpm drizzle-kit migrate` | **Aplica a migration** pendentes no banco. |

---

### Checklist de Qualidade (Pré-Integração)

1.  **Funcionalidade Verificada:** A nova funcionalidade implementada funciona corretamente e atende aos requisitos.
2.  **Estabilidade do Projeto:** O código novo não quebrou funcionalidades existentes (regressão).
3.  **Teste de Ponta a Ponta (E2E):** Navegação manual pelo aplicativo confirmando que Frontend e Backend conversam sem erros.
4.  **Tipagem Limpa:** Execução bem-sucedida do comando `pnpm check` (sem erros de TypeScript).

---

**Desenvolvido com ❤️ pela equipe sCina**

**Disciplina:** Desenvolvimento de Software  
**Curso:** Ciência da Computação - UFPE  
**Período:** 2025.2
