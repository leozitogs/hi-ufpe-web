import pandas as pd
from gemini_integration import get_gemini_response
from data_processor import process_uploaded_file, read_google_sheet_data, read_google_doc_text, authenticate_google_apis
import os
from dotenv import load_dotenv, find_dotenv

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv(dotenv_path=find_dotenv())

class Chatbot:
    def __init__(self, service_account_file=None):
        self.data_store = {}
        self.sheets_service = None
        self.docs_service = None
        if service_account_file:
            self.sheets_service, self.docs_service = authenticate_google_apis(service_account_file)

    def load_data(self, source_type, identifier, file_path=None, range_name=None):
        """
        Carrega dados de diferentes fontes para o chatbot.
        source_type: 'local_file', 'google_sheet', 'google_doc'
        identifier: Nome para referenciar os dados (ex: 'disciplinas', 'horarios') ou ID do Google Sheet/Doc
        file_path: Caminho para o arquivo local (se source_type='local_file')
        range_name: Intervalo da planilha (se source_type='google_sheet')
        """
        if source_type == 'local_file':
            if file_path:
                df = process_uploaded_file(file_path)
                if not df.empty:
                    self.data_store[identifier] = df
                    print(f"Dados do arquivo local '{file_path}' carregados como '{identifier}'.")
                else:
                    print(f"Falha ao carregar dados do arquivo local '{file_path}'.")
            else:
                print("Caminho do arquivo não fornecido para source_type 'local_file'.")
        elif source_type == 'google_sheet':
            if self.sheets_service and identifier and range_name:
                spreadsheet_id = identifier # Aqui o identifier é o spreadsheet_id
                df = read_google_sheet_data(self.sheets_service, spreadsheet_id, range_name)
                if not df.empty:
                    self.data_store[identifier] = df
                    print(f"Dados da Google Sheet '{spreadsheet_id}' carregados como '{identifier}'.")
                else:
                    print(f"Falha ao carregar dados da Google Sheet '{spreadsheet_id}'.")
            else:
                print("Serviço Sheets não autenticado ou parâmetros ausentes para 'google_sheet'.")
        elif source_type == 'google_doc':
            if self.docs_service and identifier:
                document_id = identifier # Aqui o identifier é o document_id
                text_content = read_google_doc_text(self.docs_service, document_id)
                if text_content:
                    self.data_store[identifier] = text_content
                    print(f"Conteúdo do Google Doc '{document_id}' carregado como '{identifier}'.")
                else:
                    print(f"Falha ao carregar conteúdo do Google Doc '{document_id}'.")
            else:
                print("Serviço Docs não autenticado ou parâmetros ausentes para 'google_doc'.")
        else:
            print(f"Tipo de fonte '{source_type}' não suportado.")

    def get_context_from_data(self, query):
        """
        Gera um contexto relevante a partir dos dados carregados com base na query.
        Esta é uma implementação simplificada e pode ser expandida com técnicas de RAG.
        """
        context = ""
        for identifier, data in self.data_store.items():
            if isinstance(data, pd.DataFrame):
                # Converte DataFrame para string para o Gemini
                context += f"\nDados da tabela '{identifier}':\n{data.to_string(index=False)}\n"
            elif isinstance(data, str):
                # Adiciona conteúdo de texto diretamente
                context += f"\nConteúdo do documento '{identifier}':\n{data}\n"
        return context

    def chat(self, user_query):
        """
        Processa a query do usuário, gera contexto e obtém resposta do Gemini.
        """
        context = self.get_context_from_data(user_query)
        
        # Prompt de engenharia para o Gemini
        full_prompt = f"""
        Você é um assistente prestativo. Use as informações fornecidas abaixo para responder à pergunta do usuário.
        Se a resposta não puder ser encontrada nas informações fornecidas, diga que você não tem essa informação.

        Informações fornecidas:
        {context}

        Pergunta do usuário: {user_query}
        Resposta:
        """
        print(f"DEBUG: Prompt enviado ao Gemini: {full_prompt[:500]}...") # Limita o print para não poluir o console
        response = get_gemini_response(full_prompt, model_name="models/gemini-pro")
        return response

# Exemplo de uso (será adaptado para as interfaces Admin/Aluno)
if __name__ == '__main__':
    # Substitua pelo caminho do seu arquivo JSON da conta de serviço
    SERVICE_ACCOUNT_FILE = os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE")

    # A configuração da API do Gemini agora é feita globalmente em gemini_integration.py
    # Removida a chamada configure_gemini_api() e o DEBUG da API key aqui.

    if not SERVICE_ACCOUNT_FILE or not os.path.exists(SERVICE_ACCOUNT_FILE):
        print("AVISO: GOOGLE_SERVICE_ACCOUNT_FILE não configurado ou arquivo não encontrado. "
              "A funcionalidade de Google Sheets/Docs não estará disponível.")
        chatbot = Chatbot()
    else:
        chatbot = Chatbot(service_account_file=SERVICE_ACCOUNT_FILE)

    # --- Exemplo de carregamento de dados (simulando upload do admin) ---
    # Crie um arquivo CSV local para simular o upload manual para o Drive
    test_local_csv_file = "disciplinas.csv"
    with open(test_local_csv_file, "w") as f:
        f.write("Disciplina,Local,Professor\nMatematica,Sala 101,Prof. Ana\nPortugues,Sala 202,Prof. Bruno\nHistoria,Sala 303,Prof. Carla")
    
    # O upload para o Drive agora é manual. Você deve fazer o upload de 'disciplinas.csv'
    # para o seu Google Drive, obter o SPREADSHEET_ID da planilha resultante e compartilhá-la.
    # Substitua '1DFeW5z7gD5jgbw5TkeeKWTIcn9cHT4w5ChCW3BfDRB0' pelo ID da planilha que você carregou manualmente.
    # E 'disciplinas!A:Z' pelo nome da aba e range corretos.
    YOUR_UPLOADED_SHEET_ID = "1DFeW5z7gD5jgbw5TkeeKWTIcn9cHT4w5ChCW3BfDRB0" # <-- SUBSTITUA ESTE ID
    YOUR_SHEET_RANGE_NAME = "disciplinas!A:Z" # <-- AJUSTE O NOME DA ABA E RANGE SE NECESSÁRIO

    if YOUR_UPLOADED_SHEET_ID and YOUR_UPLOADED_SHEET_ID != "YOUR_UPLOADED_SHEET_ID_HERE":
        print(f"Carregando dados da Google Sheet ID: {YOUR_UPLOADED_SHEET_ID}")
        chatbot.load_data('google_sheet', YOUR_UPLOADED_SHEET_ID, range_name=YOUR_SHEET_RANGE_NAME)
    else:
        print("AVISO: YOUR_UPLOADED_SHEET_ID_HERE não foi substituído ou é inválido. Nenhuma planilha será carregada.")

    # --- Interação do Chatbot (simulando aluno) ---
    print("\nChatbot iniciado. Digite sua pergunta ou 'sair' para encerrar.")
    while True:
        user_input = input("Você: ")
        if user_input.lower() == 'sair':
            break
        response = chatbot.chat(user_input)
        print(f"Chatbot: {response}")

