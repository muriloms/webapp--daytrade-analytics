# backend/src/services/ai_service.py

import re
# Importa Groq para criar uma instância de modelo com o ID fornecido
from phi.model.groq import Groq
# Importa a instância do time de agentes (ainda precisamos dela para a configuração base e instruções)
from src.tools.phi_agent_setup import multi_ai_agent
# Importa as configurações para obter a API KEY
from src.config.config import settings


# A função agora aceita 'model_id'
async def get_ai_analysis(ticker: str, model_id: str) -> str:
    """
    Executa a análise de IA para um ticker, usando o time de agentes e um modelo LLM específico.

    Args:
        ticker (str): O símbolo do ticker da ação.
        model_id (str): O ID do modelo Groq a ser usado para esta análise (ex: "llama-3.1-70b-versatile").

    Returns:
        str: O texto da análise gerada pela IA, ou uma mensagem de erro/indisponibilidade.
    """
    # Embora o agente base tenha sido inicializado, ainda verificamos a API_KEY
    # Se a API_KEY não estiver configurada, phi_agent_setup pode ter deixado multi_ai_agent como None
    # Ou a chave pode ser inválida, causando erro na chamada run().
    if multi_ai_agent is None or not settings.GROQ_API_KEY:
        return "A análise de IA não está disponível. Verifique a configuração da API KEY."

    try:
        prompt = f"Resumir a recomendação do analista e compartilhar as últimas notícias para {ticker}"

        # --- MODIFICAÇÃO CHAVE ---
        # Criamos uma nova instância do modelo Groq com o model_id fornecido
        # e passamos ela para o argumento 'model' do método run().
        # Isso sobrescreve o modelo padrão configurado no agente apenas para esta execução.
        llm_for_run = Groq(id=model_id, api_key=settings.GROQ_API_KEY)

        # Executa o time de agentes, usando o modelo LLM especificado para esta rodada
        ai_response = await multi_ai_agent.run(prompt, model=llm_for_run)
        # --- FIM MODIFICAÇÃO CHAVE ---


        raw_analysis_content = ai_response.content

        # Limpa a resposta (a regex permanece a mesma)
        clean_response = re.sub(
            r"(Running:[\s\S]*?\n\n)|(^transfer_task_to_finance_ai_agent.*\n?)",
            "",
            raw_analysis_content,
            flags=re.MULTILINE
        ).strip()

        return clean_response if clean_response else "Análise de IA concluída, mas nenhum resumo detalhado foi gerado."


    except Exception as e:
        # Captura erros durante a execução do agente (erro da API Groq, modelo inválido, etc.)
        print(f"ERRO durante a execução do Agente de IA para {ticker} com modelo {model_id}: {e}")
        # Retorna uma mensagem de erro mais específica
        return f"Ocorreu um erro ao gerar a análise de IA para {ticker} com modelo {model_id}: {e}"

# O bloco if __name__ == "__main__": precisaria ser atualizado para testar
# passando um model_id válido. Exemplo (adaptado do anterior):
if __name__ == "__main__":
     import asyncio
     import os

     # Configura uma chave dummy se não estiver no .env apenas para permitir o teste
     # if os.getenv("GROQ_API_KEY") is None:
     #      print("Aviso: GROQ_API_KEY não definida. Testando get_ai_analysis sem agents reais.")
          # ... simulação de função get_ai_analysis se necessário ...

     async def main_ai_test():
         print("\n--- Testando Análise de IA para TSLA com modelo llama-3.1-70b-versatile ---")
         # CHAME A FUNÇÃO COM UM MODEL_ID VÁLIDO
         analysis = await get_ai_analysis("TSLA", "llama-3.1-70b-versatile") # Substitua por um ID válido
         print(analysis)

         print("\n--- Testando Análise de IA para GME com modelo llama-3.1-8b-instant ---")
         # CHAME A FUNÇÃO COM OUTRO MODEL_ID VÁLIDO
         analysis_less_common = await get_ai_analysis("GME", "llama-3.1-8b-instant") # Substitua por um ID válido
         print(analysis_less_common)

         # Exemplo de como lidar com um possível model_id inválido ou erro
         # try:
         #      print("\n--- Testando Análise de IA com modelo INVÁLIDO ---")
         #      analysis_invalid_model = await get_ai_analysis("AAPL", "modelo-invalido-xyz")
         #      print(analysis_invalid_model)
         # except Exception as e:
         #      print(f"Teste com modelo inválido capturou erro: {e}")


     asyncio.run(main_ai_test())