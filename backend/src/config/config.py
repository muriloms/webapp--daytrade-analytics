# backend/src/config/config.py

import os
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env (se existir)
# load_dotenv() busca pelo arquivo .env no diretório atual e nos pais
load_dotenv()

class Settings:
    """
    Classe para carregar as configurações do ambiente.
    """
    # Carrega a chave da API Groq da variável de ambiente
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY")

    # Validação simples para garantir que a chave GROQ está presente
    if not GROQ_API_KEY:
        # Em um ambiente de produção, você pode querer logar isso ou lidar de forma diferente
        print("ERRO: Variável de ambiente GROQ_API_KEY não configurada!")
        # Opcional: exit(1) para parar a aplicação se a chave for essencial
        # Neste exemplo, a API pode iniciar, mas as funcionalidades de IA falharão sem a chave.


# Instância global das configurações
settings = Settings()