# backend/src/services/stock_service.py

# Importa a ferramenta para buscar dados históricos
from src.tools.yfinance_tool import get_historical_data

# Importa o serviço de IA (este arquivo será criado na próxima etapa - 1.6)
# A função get_ai_analysis será definida em ai_service.py
from src.services.ai_service import get_ai_analysis

async def analyze_stock(ticker: str) -> dict | None:
    """
    Orquestra a busca por dados históricos e a análise de IA para um ticker.

    Args:
        ticker (str): O símbolo do ticker da ação.

    Returns:
        dict | None: Um dicionário contendo 'historical_data' (list de dicts)
                     e 'ai_analysis' (str), ou None se os dados históricos não forem encontrados.
    """
    # 1. Obter dados históricos usando a ferramenta yfinance
    historical_data = get_historical_data(ticker)

    # Verifica se os dados históricos foram encontrados
    if historical_data is None:
        print(f"Dados históricos não encontrados para o ticker: {ticker}")
        return None # Retorna None se os dados básicos não existirem

    # 2. Obter análise de IA usando o serviço de IA
    # Chamamos a função get_ai_analysis que criaremos em src/services/ai_service.py
    # Usamos await porque a execução do agente de IA é assíncrona
    ai_analysis = await get_ai_analysis(ticker)

    # 3. Retornar os resultados combinados
    return {
        "historical_data": historical_data,
        "ai_analysis": ai_analysis
    }

# Exemplo de como seria usado (para teste interno se necessário)
if __name__ == "__main__":
    # Este bloco só executa se você rodar o script diretamente
    # Para rodar async main, você precisa de um loop de eventos asyncio
    import asyncio

    async def main_test():
        # Substitua "AAPL" por outro ticker se desejar
        result = await analyze_stock("AAPL")
        if result:
            print("\n--- Resultado da Análise para AAPL ---")
            # Imprime os primeiros 3 registros de dados históricos
            print("Dados Históricos (Primeiros 3):", result["historical_data"][:3])
            print("\nAnálise de IA:")
            print(result["ai_analysis"])
        else:
            print("\nNão foi possível analisar AAPL.")

        # Teste com ticker inválido
        print("\n--- Teste com Ticker Inválido ---")
        result_invalid = await analyze_stock("INVALIDTICKER")
        if result_invalid is None:
             print("Teste com ticker inválido: Retornou None, como esperado.")


    # Executa a função assíncrona de teste
    asyncio.run(main_test())