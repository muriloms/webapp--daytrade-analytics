# backend/src/models/ai_models.py

from pydantic import BaseModel # Importa a classe base para modelos

class AIAnalysisRequest(BaseModel):
    """
    Modelo Pydantic para validar a requisição POST para análise de IA.
    Define os dados esperados no corpo da requisição.
    """
    # Campo para o ID do modelo LLM a ser usado na análise
    model_id: str

    # Exemplo de como você poderia adicionar outros campos no futuro:
    # additional_params: dict | None = None # Parâmetros adicionais para a chamada da IA

    class Config:
        # Configurações opcionais para o modelo Pydantic
        # schema_extra é útil para a documentação Swagger/OpenAPI, fornecendo um exemplo
        schema_extra = {
            "example": {
                "model_id": "deepseek-r1-distill-llama-70b"
            }
        }