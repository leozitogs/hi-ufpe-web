import os
import google.generativeai as genai
from dotenv import load_dotenv, find_dotenv

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv(dotenv_path=find_dotenv())

# Configuração global da API do Gemini
def _configure_gemini_api_globally():
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("A chave da API do Google Gemini não foi fornecida. "
                         "Por favor, defina a variável de ambiente GOOGLE_API_KEY "
                         "no arquivo .env.")
    genai.configure(api_key=api_key)
    print("API do Google Gemini configurada globalmente com sucesso.")

# Chama a configuração global uma única vez quando o módulo é importado
try:
    _configure_gemini_api_globally()
except ValueError as e:
    print(f"Erro na configuração global da API Gemini: {e}")

def list_gemini_models():
    """
    Lista os modelos Gemini disponíveis e suas capacidades.
    """
    print("Listando modelos Gemini disponíveis:")
    for m in genai.list_models():
        print(f"  Nome: {m.name}")
        print(f"    Descrição: {m.description}")
        print(f"    Versão: {m.version}")
        print(f"    Suporta generateContent: {"generateContent" in m.supported_generation_methods}")
        print(f"    Suporta countTokens: {"countTokens" in m.supported_generation_methods}")
        print("--------------------------------------------------")

def get_gemini_response(prompt, model_name="models/gemini-1.5-flash"):

    """
    Envia um prompt para o modelo Gemini e retorna a resposta.
    """
    try:
        # Instancia o modelo diretamente sem passar a API key novamente, confiando na configuração global
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Erro ao obter resposta do Gemini: {e}")
        return None

# Exemplo de uso (apenas para teste direto do módulo)
if __name__ == "__main__":
    try:
        list_gemini_models()
        test_prompt = "Qual é a capital da França?"
        response_text = get_gemini_response(test_prompt)
        if response_text:
            print(f"Prompt: {test_prompt}")
            print(f"Resposta do Gemini: {response_text}")
    except ValueError as ve:
        print(f"Erro de configuração: {ve}")
    except Exception as e:
        print(f"Ocorreu um erro: {e}")

