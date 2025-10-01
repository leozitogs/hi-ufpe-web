import os
import pandas as pd
from google.oauth2 import service_account
from googleapiclient.discovery import build
# from googleapiclient.http import MediaFileUpload # Não é mais necessário para upload direto

# Define o escopo das APIs que serão acessadas
# Revertido para escopos de leitura, já que o upload será manual
SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets.readonly", 
    "https://www.googleapis.com/auth/documents.readonly"
]

def process_uploaded_file(file_path):
    """
    Processa um arquivo carregado (XLSX ou CSV).
    Retorna um DataFrame pandas com os dados.
    """
    _, file_extension = os.path.splitext(file_path)

    if file_extension == ".xlsx":
        try:
            df = pd.read_excel(file_path)
            return df
        except Exception as e:
            print(f"Erro ao ler o arquivo XLSX: {e}")
            return pd.DataFrame()
    elif file_extension == ".csv":
        try:
            df = pd.read_csv(file_path)
            return df
        except Exception as e:
            print(f"Erro ao ler o arquivo CSV: {e}")
            return pd.DataFrame()
    else:
        print(f"Formato de arquivo não suportado: {file_extension}")
        return pd.DataFrame()

def authenticate_google_apis(service_account_file):
    """
    Autentica com as APIs do Google usando um arquivo de conta de serviço.
    Retorna os objetos de serviço da Sheets e Docs API.
    """
    creds = service_account.Credentials.from_service_account_file(
        service_account_file, scopes=SCOPES)
    sheets_service = build("sheets", "v4", credentials=creds)
    docs_service = build("docs", "v1", credentials=creds)
    # drive_service não é mais retornado aqui
    return sheets_service, docs_service

# upload_file_to_drive foi removida, pois o upload será manual

def read_google_sheet_data(service, spreadsheet_id, range_name):
    """
    Lê dados de uma planilha Google Sheets.
    Retorna um DataFrame pandas com os dados.
    """
    try:
        result = service.spreadsheets().values().get(
            spreadsheetId=spreadsheet_id, range=range_name).execute()
        values = result.get("values", [])

        if not values:
            print("Nenhum dado encontrado.")
            return pd.DataFrame()
        else:
            df = pd.DataFrame(values[1:], columns=values[0])
            return df
    except Exception as e:
        print(f"Erro ao ler a planilha: {e}")
        return pd.DataFrame()

def read_google_doc_text(service, document_id):
    """
    Extrai o texto de um documento do Google Docs.
    Retorna o texto como uma string.
    """
    try:
        document = service.documents().get(documentId=document_id).execute()
        doc_content = document.get("body").get("content")
        text = ""
        for value in doc_content:
            if "paragraph" in value:
                elements = value.get("paragraph").get("elements")
                for elem in elements:
                    text += elem.get("textRun", {}).get("content", "")
        return text
    except Exception as e:
        print(f"Erro ao ler o documento: {e}")
        return ""

