// frontend/src/services/api.js

import axios from 'axios';
import { API_BASE_URL } from '../constants/config';

// Cria uma instância do axios com a URL base da API
const api = axios.create({
  baseURL: API_BASE_URL,
  // Você pode adicionar outras configurações globais do axios aqui
});

/**
 * Busca apenas dados históricos de ações para um dado ticker.
 * Corresponde ao endpoint GET /api/v1/stocks/data/{ticker}
 *
 * @param {string} ticker O símbolo do ticker da ação.
 * @returns {Promise<object|null>} Uma Promise que resolve com um objeto contendo
 * 'historical_data' (array), ou null em caso de erro 404.
 * @throws {Error} Lança um erro se a requisição falhar por outros motivos (rede, servidor 5xx).
 */
const getHistoricalData = async (ticker) => {
  try {
    const endpoint = `/api/v1/stocks/data/${ticker}`;
    console.log(`Chamando API (Dados Históricos): ${API_BASE_URL}${endpoint}`);

    const response = await api.get(endpoint);

    console.log("Resposta da API (Dados Históricos) recebida:", response.data);

    return response.data; // Deve conter { historical_data: [...] }

  } catch (error) {
    console.error("Erro na chamada da API (Dados Históricos):", error);

    if (error.response) {
      console.error("Status do erro (Dados Históricos):", error.response.status);
      console.error("Dados do erro (Dados Históricos):", error.response.data);

      if (error.response.status === 404) {
        // Ticker não encontrado ou sem dados históricos
        console.log(`Dados históricos para "${ticker}" não encontrados.`);
        return null; // Indica especificamente 404
      } else {
         const errorMessage = error.response.data.detail || `Erro da API (Dados Históricos): Status ${error.response.status}`;
         throw new Error(errorMessage);
      }
    } else if (error.request) {
      console.error("Nenhuma resposta recebida da API (Dados Históricos).");
      throw new Error("Erro de conexão com o backend ao buscar dados históricos.");
    } else {
      console.error("Erro ao configurar a requisição (Dados Históricos):", error.message);
      throw new Error(`Erro ao processar requisição de dados históricos: ${error.message}`);
    }
  }
};


/**
 * Busca a análise de IA para um dado ticker, usando um modelo LLM específico.
 * Corresponde ao endpoint POST /api/v1/stocks/analyze/{ticker}
 *
 * @param {string} ticker O símbolo do ticker da ação.
 * @param {string} modelId O ID do modelo LLM Groq a ser usado.
 * @returns {Promise<object>} Uma Promise que resolve com um objeto contendo 'ai_analysis' (string).
 * @throws {Error} Lança um erro se a requisição falhar (rede, servidor 5xx, ou erro reportado pelo serviço de IA).
 */
const getAIAnalysis = async (ticker, modelId) => {
   if (!modelId) {
       console.warn("Tentativa de chamar getAIAnalysis sem modelId.");
       throw new Error("ID do modelo de IA não especificado.");
   }

  try {
    const endpoint = `/api/v1/stocks/analyze/${ticker}`;
    console.log(`Chamando API (Análise IA): ${API_BASE_URL}${endpoint} com modelo ${modelId}`);

    // Faz a requisição POST, enviando o modelId no corpo
    const response = await api.post(endpoint, { model_id: modelId });

    console.log("Resposta da API (Análise IA) recebida:", response.data);

    return response.data; // Deve conter { ai_analysis: "..." }

  } catch (error) {
    console.error("Erro na chamada da API (Análise IA):", error);

     if (error.response) {
      console.error("Status do erro (Análise IA):", error.response.status);
      console.error("Dados do erro (Análise IA):", error.response.data);

      // O endpoint de IA no backend retorna 500 se o serviço de IA falhar internamente
      // ou se o modelo for inválido, e inclui a mensagem de erro no detail.
      const errorMessage = error.response.data.detail || `Erro da API (Análise IA): Status ${error.response.status}`;
      throw new Error(errorMessage);

    } else if (error.request) {
      console.error("Nenhuma resposta recebida da API (Análise IA).");
      throw new Error("Erro de conexão com o backend ao buscar análise de IA.");
    } else {
      console.error("Erro ao configurar a requisição (Análise IA):", error.message);
      throw new Error(`Erro ao processar requisição de análise de IA: ${error.message}`);
    }
  }
};


// Exporta as novas funções
export {
  getHistoricalData,
  getAIAnalysis
};