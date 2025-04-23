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

# --- Função para Informações da Empresa ---
def get_company_info(ticker: str) -> dict | None:
    """
    Extrai informações básicas da empresa para um dado ticker usando yfinance.

    Args:
        ticker (str): O símbolo do ticker da empresa (ex: "MSFT").

    Returns:
        dict | None: Um dicionário contendo informações selecionadas da empresa
                     (como nome, setor, indústria, funcionários, website, resumo)
                     ou None se o ticker for inválido ou as informações não forem encontradas.
    """
    try:
        stock = yf.Ticker(ticker)
        # O dicionário .info pode ser grande, extraímos campos úteis
        info = stock.info

        # yfinance pode retornar um dicionário vazio ou com poucos dados para tickers inválidos ou com problemas
        if not info or info.get('regularMarketPrice') is None:
             print(f"Informações básicas não encontradas para o ticker: {ticker}")
             return None # Indica que o ticker pode ser inválido ou sem dados info


        # Extrai campos chave. Use .get() com valor padrão (None) caso o campo não exista.
        company_info = {
            "symbol": info.get('symbol'), # Adiciona o símbolo para referência
            "shortName": info.get('shortName'), # Nome curto da empresa
            "longName": info.get('longName'),   # Nome completo da empresa
            "sector": info.get('sector'),       # Setor da indústria
            "industry": info.get('industry'),   # Indústria específica
            "fullTimeEmployees": info.get('fullTimeEmployees'), # Número de funcionários
            "website": info.get('website'),       # Website da empresa
            # Campos adicionais úteis, verificar se existem e não são muito longos
            "marketCap": info.get('marketCap'), # Capitalização de mercado
            "country": info.get('country'), # País
            # "longBusinessSummary": info.get('longBusinessSummary'), # Resumo longo do negócio (pode ser muito grande)
        }

        # Filtra campos que vieram como None ou vazios se desejar
        # company_info = {k: v for k, v in company_info.items() if v is not None and v != ''}

        # Podemos adicionar uma verificação extra se os campos essenciais estiverem faltando
        if not company_info.get("shortName") and not company_info.get("longName"):
             print(f"Nome da empresa não encontrado para o ticker: {ticker}")
             return None # Considera inválido se nem o nome for encontrado

        return company_info

    except Exception as e:
        print(f"Erro ao extrair informações da empresa para o ticker {ticker}: {e}")
        # Em uma API real, logar o erro detalhado aqui
        return None

if __name__ == "__main__":
    import asyncio

    async def main_test_info():
        print("\n--- Testando get_historical_data para AAPL ---")
        data = get_historical_data("AAPL")
        print(f"Dados históricos: {len(data)} registros" if data else "Nenhum dado histórico encontrado.")
        if data: print(data[:2]) # Imprime os primeiros 2

        print("\n--- Testando get_company_info para AAPL ---")
        info = get_company_info("AAPL")
        print(f"Informações da Empresa para AAPL:" if info else "Nenhuma informação encontrada.")
        if info: print(info)

        print("\n--- Testando get_company_info para ticker INVÁLIDO ---")
        info_invalid = get_company_info("INVALIDTICKERXYZ")
        print(f"Informações da Empresa para INVÁLIDO:" if info_invalid else "Nenhuma informação encontrada, como esperado.")


    # Para rodar este teste, execute o arquivo diretamente com python
    # Não precisa de asyncio.run para funções sync como get_company_info
    # Remova o asyncio.run se rodar a função sync isoladamente
    main_test_info() # Chame a função de teste diretamente (é sync)