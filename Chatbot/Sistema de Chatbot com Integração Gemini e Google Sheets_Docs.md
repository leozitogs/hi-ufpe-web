# Sistema de Chatbot com Integração Gemini e Google Sheets/Docs

Este projeto demonstra um sistema de chatbot em Python que se integra à API do Google Gemini para responder a perguntas com base em dados fornecidos em planilhas do Google Sheets ou documentos do Google Docs, além de arquivos locais (CSV/XLSX).

## Funcionalidades

*   **Processamento de Dados Flexível**: Carrega dados de:
    *   Arquivos locais (`.csv`, `.xlsx`).
    *   Planilhas do Google Sheets (via `SPREADSHEET_ID`).
    *   Documentos do Google Docs (via `DOCUMENT_ID`).
*   **Integração com Google Gemini**: Utiliza a API do Google Gemini para processar perguntas do usuário e gerar respostas contextuais baseadas nos dados carregados.
*   **Chatbot Interativo**: Permite ao usuário fazer perguntas em linguagem natural e receber respostas informativas.
*   **Configuração Segura**: Gerencia chaves de API e credenciais de conta de serviço através de um arquivo `.env`.

## Configuração do Ambiente

Siga os passos abaixo para configurar e executar o projeto.

### 1. Pré-requisitos

Certifique-se de ter o Python 3.8+ e `pip` instalados em sua máquina.

### 2. Clonar o Repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd <nome_do_seu_repositorio>
```

### 3. Instalar Dependências

Instale as bibliotecas Python necessárias:

```bash
pip install google-api-python-client google-auth-oauthlib google-auth-httplib2 pandas openpyxl google-generativeai python-dotenv
```

### 4. Configuração das APIs do Google

Este projeto utiliza as APIs do Google Gemini, Google Sheets e Google Docs. Você precisará configurar as credenciais para cada uma.

#### a. Chave da API do Google Gemini

1.  Acesse o [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Crie uma nova chave de API ou use uma existente.
3.  Copie esta chave.

#### b. Credenciais da Conta de Serviço para Google Sheets e Google Docs

1.  Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2.  Crie um novo projeto ou selecione um existente.
3.  No menu de navegação, vá para **"APIs e serviços" > "Biblioteca"**.
4.  Pesquise e ative as seguintes APIs:
    *   `Google Sheets API`
    *   `Google Docs API`
5.  No menu de navegação, vá para **"APIs e serviços" > "Credenciais"**.
6.  Clique em **"Criar credenciais"** e selecione **"Conta de serviço"**.
7.  Siga as instruções para criar a conta de serviço. Conceda as permissões necessárias (por exemplo, **"Leitor de Planilhas"** e **"Leitor de Documentos"** para as APIs de Sheets e Docs, respectivamente).
8.  Após a criação, você terá a opção de baixar um arquivo JSON com as chaves da conta de serviço. Salve este arquivo em um local seguro no seu projeto (ex: na raiz do projeto).

### 5. Configurar o Arquivo `.env`

Crie um arquivo chamado `.env` na raiz do seu projeto (no mesmo diretório onde estão `chatbot.py` e `gemini_integration.py`) e adicione as seguintes linhas, substituindo os placeholders pelos seus valores reais:

```dotenv
GOOGLE_API_KEY="SUA_CHAVE_DA_API_GEMINI"
GOOGLE_SERVICE_ACCOUNT_FILE="C:\caminho\para\seu\arquivo_de_conta_de_servico.json"
```

*   `SUA_CHAVE_DA_API_GEMINI`: A chave que você obteve no Google AI Studio.
*   `C:\caminho\para\seu\arquivo_de_conta_de_servico.json`: O caminho **absoluto** para o arquivo JSON da sua conta de serviço.

**Importante**: Adicione `.env` ao seu arquivo `.gitignore` para evitar que suas credenciais sejam enviadas para o repositório.

### 6. Preparar a Planilha Google Sheets

Para que o chatbot possa ler os dados de uma planilha Google Sheets:

1.  **Faça o upload manual** do arquivo `disciplinas.csv` (que é gerado pelo script `chatbot.py` na primeira execução) para o seu Google Drive. O Google Drive o converterá automaticamente para uma planilha Google Sheets.
2.  **Obtenha o `SPREADSHEET_ID`** dessa nova planilha. Abra a planilha no seu navegador; o ID é a parte da URL entre `/d/` e `/edit` (ex: `https://docs.google.com/spreadsheets/d/SEU_SPREADSHEET_ID_AQUI/edit`).
3.  **Compartilhe a planilha** com o e-mail da sua conta de serviço (o `client_email` do seu arquivo JSON) com permissão de **"Leitor"**.
4.  **Atualize o `chatbot.py`**: Abra o arquivo `chatbot.py` e substitua o placeholder `YOUR_UPLOADED_SHEET_ID_HERE` pelo `SPREADSHEET_ID` que você obteve:

    ```python
    YOUR_UPLOADED_SHEET_ID = "SEU_SPREADSHEET_ID_AQUI" # <-- SUBSTITUA ESTE ID
    YOUR_SHEET_RANGE_NAME = "disciplinas!A:Z" # <-- AJUSTE O NOME DA ABA E RANGE SE NECESSÁRIO
    ```

## Como Executar

Com todas as configurações feitas, você pode executar o chatbot:

```bash
python chatbot.py
```

O script criará um arquivo `disciplinas.csv` localmente, carregará os dados da sua planilha Google Sheets (com o ID que você configurou) e iniciará o chatbot. Você poderá então fazer perguntas com base nos dados da planilha.

**Exemplos de perguntas:**

*   `qual o local da disciplina de matemática?`
*   `quem dá aula de português?`
*   `onde é a aula de história?`

Para sair do chatbot, digite `sair`.

## Solução de Problemas: Erro `404 models/gemini-pro is not found`

Durante o desenvolvimento, encontramos um erro persistente onde o modelo `gemini-pro` não era encontrado pela API, mesmo após a configuração correta. A solução foi **mudar para o modelo `gemini-1.5-flash`**.

O arquivo `gemini_integration.py` já está configurado para usar `models/gemini-1.5-flash` como padrão. Se você encontrar problemas semelhantes com outros modelos, pode ser necessário verificar a disponibilidade do modelo em sua região ou tentar um modelo diferente.

---

Desenvolvido por Manus AI.
