# backend/src/tools/phi_agent_setup.py

# Importa as classes necessárias do phi-agents e das ferramentas
from phi.agent import Agent
from phi.model.groq import Groq
from phi.tools.yfinance import YFinanceTools
from phi.tools.duckduckgo import DuckDuckGo

# Importa as configurações, incluindo a chave da API
from src.config.config import settings

# Variável para armazenar o time de agentes inicializado
multi_ai_agent = None

try:
    # Verifica se a chave GROQ está disponível antes de inicializar
    if not settings.GROQ_API_KEY:
        print("AVISO: GROQ_API_KEY não configurada. Agentes de IA não serão inicializados.")
    else:
        # Define os modelos a serem usados (verifique a disponibilidade na Groq)
        # Usaremos modelos comuns, ajuste se precisar de modelos específicos como deepseek-r1-distill
        groq_model_70b = "deepseek-r1-distill-llama-70b"#"llama-3.1-70b-versatile" # ou um modelo 70B equivalente disponível
        groq_model_8b = "llama-3.1-8b-instant"    # ou um modelo 8B equivalente disponível


        # Inicializa o Agente de Busca na Web
        dsa_agente_web_search = Agent(
            name="DSA Agente Web Search",
            role="Fazer busca na web",
            model=Groq(id=groq_model_8b, api_key=settings.GROQ_API_KEY),
            tools=[DuckDuckGo()],
            instructions=["Sempre inclua as fontes"],
            show_tool_calls=False,  # Desativa logs detalhados de tools nas respostas para API
            markdown=False         # Desativa markdown na saída direta do agente individual
        )

        # Inicializa o Agente Financeiro
        dsa_agente_financeiro = Agent(
            name="DSA Agente Financeiro",
            model=Groq(id=groq_model_70b, api_key=settings.GROQ_API_KEY),
            tools=[
                YFinanceTools(
                    stock_price=True,
                    analyst_recommendations=True,
                    stock_fundamentals=True,
                    company_news=True
                )
            ],
            instructions=["Use tabelas para mostrar os dados"],
            show_tool_calls=False,
            markdown=False
        )

        # Inicializa o Time de Agentes (Multi-Agente)
        multi_ai_agent = Agent(
            team=[dsa_agente_web_search, dsa_agente_financeiro],
            model=Groq(id=groq_model_70b, api_key=settings.GROQ_API_KEY), # O time usa um modelo
            instructions=[
                "Resuma a recomendação do analista e as últimas notícias.",
                "Sempre inclua as fontes.",
                "Use tabelas para mostrar os dados.",
                "Se a recomendação ou notícias não forem encontradas, indique isso claramente."
            ],
            show_tool_calls=False, # Desativa para a resposta final do time
            markdown=True          # Ativa markdown para a resposta final do time, útil para formatação do texto de análise
        )

        print("Agentes de IA inicializados com sucesso.")

except Exception as e:
    # Captura exceções durante a inicialização (ex: erro na chave, problema de conexão)
    print(f"ERRO ao inicializar Agentes de IA: {e}")
    # multi_ai_agent permanece None, indicando que não está disponível