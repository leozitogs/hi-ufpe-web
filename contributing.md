# 🤝 Guia de Contribuição para o Hi UFPE - Hub Inteligente 🎓

Seja bem-vindo(a) à equipe de desenvolvimento do **Hi UFPE**! Sua contribuição é fundamental para mantermos este sistema acadêmico inteligente à frente do SIGAA e oferecendo a melhor experiência aos estudantes.

Este guia detalha nosso fluxo de trabalho e padrões de código para garantir que todas as contribuições sejam integradas de forma fluida e sem interrupções.

---

## 1. ⚙️ Fluxo de Colaboração (Git Workflow)

Adotamos um fluxo de trabalho baseado em *feature branches* com uma camada de depuração dedicada, garantindo a estabilidade da versão principal.

### 1.1. Estrutura de Branches

| Branch | Propósito | Regra de Acesso |
| :--- | :--- | :--- |
| **`main`** | Versão de produção. Deve estar sempre estável e pronta para *deploy*. | Apenas *merge* de `develop` após aprovação e testes finais. |
| **`develop`** | Versão de integração e testes. Recebe as novas funcionalidades para depuração. | Recebe *merge* das *feature branches*. |
| **`[seu-nome-real]`** | *Feature Branch* individual de cada membro da equipe. | Onde o desenvolvimento ativo ocorre. Puxa de `main` e sobe para `develop`. |

### 1.2. Ciclo de Desenvolvimento

1.  **Início:** Puxe as últimas atualizações da branch **`main`** para a sua *feature branch* (`[seu-nome-real]`).
2.  **Desenvolvimento:** Implemente sua nova funcionalidade ou correção de bug em sua branch individual.
3.  **Integração e Teste:** Após concluir o desenvolvimento, suba suas alterações para a branch **`develop`**. Esta branch é o ambiente de testes e depuração da equipe.
4.  **Revisão:** **Recomendamos fortemente** que, antes de subir da `develop` para a `main`, você solicite a revisão de outro membro da equipe. Um olhar externo garante que a contribuição esteja livre de *side effects* e siga os padrões.
5.  **Produção:** Somente após a depuração completa na `develop` e a aprovação da equipe, a `develop` pode ser mesclada na **`main`**.

---

## 2. 📝 Convenções de Nomenclatura e Comunicação

Manter a clareza na comunicação é vital para um projeto *type-safe* e livre de erros.

### 2.1. Nomes de Branches

Nossos nomes de branches são diretos para facilitar a rastreabilidade:

*   **Branches Principais:** `main` e `develop`.
*   **Branches de Trabalho:** O nome da sua branch de desenvolvimento deve ser o seu **nome real** (ex: `leo-gomes`, `maria-silva`).

### 2.2. Mensagens de Commit

Mantenha as mensagens de *commit* **concisas e essenciais**. O objetivo é apenas registrar a mudança no repositório.

| Tipo de Mensagem | Exemplo |
| :--- | :--- |
| **Concisa** | `feat: adiciona rota de lancar_nota` |
| **Correção** | `fix: corrige erro de tipagem no trpc` |
| **Refatoração** | `refactor: unifica funcoes de db em um arquivo` |

Para qualquer **descrição detalhada** ou contexto da mudança, **NÃO** use a descrição do *commit*. Em vez disso, utilize nossos canais de comunicação no Discord:

*   **`#front-end`**: Para commits que afetam a interface (React, Tailwind, páginas).
*   **`#back-end`**: Para commits que afetam o servidor (Node.js, tRPC, Drizzle ORM, IA).

---

## 3. ✅ Checklist de Qualidade (Pré-Integração)

Antes de submeter seu código para a branch `develop`, garanta que você atendeu a todos os requisitos de qualidade. Pense neste como o seu **"Teste de Aceitação"** automatizado.

1.  **Funcionalidade Verificada:** Confirme que a funcionalidade que você implementou (ou o bug que corrigiu) está **funcionando corretamente** e atende ao requisito.
2.  **Estabilidade do Projeto:** Verifique se as novas adições não quebraram outras partes do sistema. Confirme que outros pontos do projeto que interagem com o seu código estão **estáveis**.
3.  **Teste de Ponta a Ponta (E2E):** Use o aplicativo como um usuário final. Navegue por diversas funcionalidades (Dashboard, Chatbot, Notas, Horários) para confirmar que as integrações entre o **Frontend e o Backend estão OK**.
4.  **Tipagem Limpa:** Execute o comando de verificação de tipagem para garantir a integridade do *type-safe*:
    ```bash
    pnpm check
    ```

---

## 4. 💻 Configuração do Ambiente Local

Para começar a contribuir, você precisará configurar o projeto em sua máquina. Para isso, siga o guia detalhado que já está disponível no nosso repositório, que foi considerado **"genuinamente bom"**!

Acesse o guia completo de configuração no **README.md** do repositório, na seção **"💻 Configuração e Instalação"**.

### Resumo dos Comandos Essenciais:

```bash
# 1. Instalar dependências
pnpm install

# 2. Aplicar schema do banco de dados (MySQL/TiDB)
pnpm db:push

# 3. Iniciar o servidor de desenvolvimento (Frontend e Backend)
pnpm dev
```

**Lembre-se:** O Hi UFPE utiliza **tRPC** e **Drizzle ORM** para garantir a tipagem de ponta a ponta. Certifique-se de que seu ambiente local está configurado corretamente para evitar erros de tipagem.

---

**Agradecemos por fazer parte desta revolução acadêmica!**

**Go Hi UFPE! 🎓✨**
