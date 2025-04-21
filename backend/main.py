# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # Importa o middleware CORS
from src.routers import stock_routes # Importa o router de ações

# Cria a instância principal da aplicação FastAPI
app = FastAPI(
    title="Financial Analytics API", # Título para a documentação
    description="API para análise financeira com dados yfinance e IA phi-agents", # Descrição
    version="1.0.0", # Versão da API
    docs_url="/docs", # URL para a documentação interativa (Swagger UI)
    redoc_url="/redoc" # URL para a documentação alternativa (ReDoc)
)

# --- Configuração CORS ---
# O CORS (Cross-Origin Resource Sharing) é necessário para permitir que seu frontend
# (rodando em um endereço/porta diferente) acesse esta API.
# Em produção, ajuste allow_origins para a URL exata do seu frontend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permite todas as origens (TEMPORÁRIO para desenvolvimento)
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"], # Métodos HTTP permitidos
    allow_headers=["*"], # Permite todos os cabeçalhos na requisição
)
# --- Fim Configuração CORS ---


# --- Inclusão de Routers ---
# Inclui o router de ações na aplicação principal
# As rotas definidas em stock_routes.py serão adicionadas aqui
app.include_router(stock_routes.router)
# Você incluiria outros routers aqui futuramente (ex: bonds_routes.router)
# --- Fim Inclusão de Routers ---


# --- Endpoint Raiz (Opcional) ---
# Um endpoint simples para verificar se a API está rodando
@app.get("/")
async def read_root():
    """
    Endpoint raiz da API.
    """
    return {"message": "Financial Analytics API is running. Visit /docs for API documentation."}
# --- Fim Endpoint Raiz ---


# --- Configuração para Execução com Uvicorn ---
# Este bloco permite rodar o app usando 'python main.py' (embora 'uvicorn main:app' seja o usual)
if __name__ == "__main__":
    import uvicorn
    # Host "0.0.0.0" torna a API acessível externamente (ex: para um celular na mesma rede)
    # Ajuste se precisar rodar apenas localmente (ex: host="127.0.0.1")
    # port=8000 é a porta padrão do Uvicorn
    # reload=True habilita o reload automático do servidor em mudanças de código (ótimo para dev)
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)