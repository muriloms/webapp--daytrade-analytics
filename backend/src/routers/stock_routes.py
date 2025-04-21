# backend/src/routers/stock_routes.py

from fastapi import APIRouter, HTTPException, Path, Body # Importa Body para ler o corpo da requisição

# Importa a ferramenta para buscar dados históricos diretamente
from src.tools.yfinance_tool import get_historical_data
# Importa o serviço de IA
from src.services.ai_service import get_ai_analysis
# Importa o modelo Pydantic para a requisição de IA
from src.models.ai_models import AIAnalysisRequest

# Cria uma instância do APIRouter com o prefixo
router = APIRouter(
    prefix="/api/v1/stocks",
    tags=["stocks"] # Mantém a tag para organização na documentação
)

# --- Novo Endpoint para Dados Históricos (GET) ---
@router.get("/data/{ticker}")
async def get_stock_historical_data(
    ticker: str = Path(..., title="Stock Ticker Symbol", min_length=1)
):
    """
    Retorna apenas dados históricos de ações para um dado ticker.

    Args:
        ticker (str): O símbolo do ticker da ação (ex: "MSFT", "AAPL").

    Returns:
        dict: Um dicionário contendo 'historical_data' (list de dicts).

    Raises:
        HTTPException: 404 Not Found se os dados para o ticker não forem encontrados.
    """
    print(f"Recebida requisição GET por dados históricos para ticker: {ticker}")

    # Chama a função da ferramenta para obter apenas os dados históricos
    historical_data = get_historical_data(ticker)

    # Verifica se os dados foram encontrados
    if historical_data is None:
        print(f"Dados históricos não encontrados para o ticker: {ticker}")
        raise HTTPException(status_code=404, detail=f"Dados históricos não encontrados para: {ticker}")

    print(f"Dados históricos encontrados para o ticker: {ticker}")
    return {"historical_data": historical_data}

# --- Novo Endpoint para Análise de IA (POST) ---
@router.post("/analyze/{ticker}")
async def get_stock_ai_analysis(
    ticker: str = Path(..., title="Stock Ticker Symbol", min_length=1),
    # Recebe o corpo da requisição, validado pelo modelo AIAnalysisRequest
    request_body: AIAnalysisRequest = Body(...)
):
    """
    Retorna a análise de IA para um dado ticker, usando o modelo LLM especificado.

    Args:
        ticker (str): O símbolo do ticker da ação (ex: "MSFT", "AAPL").
        request_body (AIAnalysisRequest): Corpo da requisição contendo o ID do modelo LLM.

    Returns:
        dict: Um dicionário contendo 'ai_analysis' (str).

    Raises:
        HTTPException: 500 Internal Server Error se ocorrer um erro durante a análise de IA.
                       (Observação: o serviço já retorna string de erro em caso de falha da IA)
    """
    print(f"Recebida requisição POST por análise de IA para ticker: {ticker}")

    # Extrai o ID do modelo do corpo da requisição validado pelo Pydantic
    model_id = request_body.model_id
    print(f"Modelo de IA solicitado: {model_id}")


    # Chama a função do serviço de IA com o ticker e o ID do modelo
    # O serviço já trata erros internos da IA e retorna uma string de erro
    ai_analysis_result = await get_ai_analysis(ticker, model_id)

    # O serviço retorna uma string (análise ou mensagem de erro).
    # Envolvemos a string em um dicionário para consistência do formato da resposta JSON.
    return {"ai_analysis": ai_analysis_result}

# Você pode adicionar outros endpoints relacionados a ações aqui futuramente
# Ex: /api/v1/stocks/{ticker}/fundamentals (GET)
# Ex: /api/v1/stocks/{ticker}/news (GET)