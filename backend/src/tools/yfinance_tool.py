# backend/src/tools/yfinance_tool.py

import yfinance as yf
import pandas as pd # Necessário para operações com DataFrame

def get_historical_data(ticker: str, period: str = "6mo") -> list | None:
    """
    Extrai dados históricos de uma ação usando yfinance e calcula médias móveis.

    Args:
        ticker (str): O símbolo do ticker da ação (ex: "MSFT").
        period (str): O período dos dados históricos (ex: "1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max").
                      O padrão é "6mo".

    Returns:
        list | None: Uma lista de dicionários contendo os dados históricos
                     (Date, Open, High, Low, Close, Volume, SMA_20, EMA_20)
                     ou None se nenhum dado for encontrado ou ocorrer um erro.
    """
    try:
        stock = yf.Ticker(ticker)

        # Obtém o histórico de preços da ação para o período definido
        hist = stock.history(period=period)

        if hist.empty:
            # Retorna None se não houver dados para o ticker/período
            return None

        # Reseta o índice do DataFrame para transformar a coluna de data em uma coluna normal
        hist.reset_index(inplace=True)

        # Renomeia a coluna 'Datetime' ou 'Date' para 'Date' consistente, se necessário
        # (yfinance retorna 'Date' a partir de certas versões/períodos, mas checamos)
        if 'Datetime' in hist.columns:
             hist.rename(columns={'Datetime': 'Date'}, inplace=True)


        # Calcula a Média Móvel Simples (SMA) de 20 períodos
        hist['SMA_20'] = hist['Close'].rolling(window=20).mean()

        # Calcula a Média Móvel Exponencial (EMA) de 20 períodos
        hist['EMA_20'] = hist['Close'].ewm(span=20, adjust=False).mean()

        # Converte a coluna de data para o formato string 'YYYY-MM-DD' para serialização JSON
        hist['Date'] = hist['Date'].dt.strftime('%Y-%m-%d')

        # Remove linhas com valores NaN que resultam dos cálculos de média móvel iniciais
        # (Os primeiros 19 dias não terão SMA/EMA 20)
        hist.dropna(subset=['SMA_20', 'EMA_20'], inplace=True)

        # Converte o DataFrame para uma lista de dicionários para ser facilmente serializado para JSON
        # O 'records' orienta a conversão para uma lista onde cada elemento é um dicionário de linha
        return hist.to_dict(orient='records')

    except Exception as e:
        print(f"Erro ao extrair dados para o ticker {ticker}: {e}")
        # Em uma API real, pode-se logar o erro detalhado
        return None

# Exemplo de como seria usado (para teste interno se necessário)
if __name__ == "__main__":
    # Este bloco só executa se você rodar o script diretamente
    data = get_historical_data("AAPL")
    if data:
        print(f"Dados para AAPL ({len(data)} registros):")
        print(data[:5]) # Imprime os primeiros 5 registros
    else:
        print("Não foi possível obter dados para AAPL.")

    data_invalid = get_historical_data("INVALIDTICKER")
    if data_invalid is None:
        print("\nTeste com ticker inválido: Retornou None, como esperado.")