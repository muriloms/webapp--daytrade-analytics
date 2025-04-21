// frontend/src/pages/StockAnalysisPage/StockAnalysisPage.jsx

import React, { useState } from 'react'; // Não precisamos mais de useEffect aqui, pois leitura do LS é síncrona ou dentro do handler
import styles from './StockAnalysisPage.module.css';

// Importa as NOVAS funções do serviço de API
import { getHistoricalData, getAIAnalysis } from '../../services/api';
// Remove a importação antiga: import { analyzeStock } from '../../services/api';

// Importa componentes reutilizáveis
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';
import AnalysisDisplay from '../../components/AnalysisDisplay/AnalysisDisplay';

// Importa o componente de Gráfico
import StockChart from '../../components/StockChart/StockChart';

// Importa a chave de localStorage da página de Configurações
import { SETTINGS_STORAGE_KEY } from '../SettingsPage/SettingsPage'; // Importa a chave de localStorage

// --- Funções para Gerar Configurações Plotly (Permanecem as mesmas) ---
// ... código das funções generatePriceChartConfig, generateCandlestickChartConfig,
// generateMovingAveragesChartConfig, generateVolumeChartConfig ...
// (Mantenha o código destas funções como na Etapa 2.12)
// Exemplo (apenas a assinatura para lembrar):
const generatePriceChartConfig = (data, ticker) => { /* ... */ return { data: [], layout: {} } };
const generateCandlestickChartConfig = (data, ticker) => { /* ... */ return { data: [], layout: {} } };
const generateMovingAveragesChartConfig = (data, ticker) => { /* ... */ return { data: [], layout: {} } };
const generateVolumeChartConfig = (data, ticker) => { /* ... */ return { data: [], layout: {} } };

// --- Fim Funções para Gerar Configurações Plotly ---


const StockAnalysisPage = () => {
  // --- Estado da Página ---
  const [ticker, setTicker] = useState('');
  const [historicalData, setHistoricalData] = useState(null);
  // aiAnalysis agora pode ser null ou uma string (análise ou erro da IA)
  const [aiAnalysis, setAiAnalysis] = useState(null); // Use null como estado inicial
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // Erros gerais (principalmente dados históricos ou configuração)
  // Podemos adicionar um estado específico para erro da IA se quisermos mostrar ambos
  // const [aiError, setAiError] = useState('');
  // --- Fim Estado da Página ---


  // --- Função para Disparar a Análise ---
  const handleAnalyze = async () => {
    if (!ticker) {
      setError('Por favor, insira um código (símbolo do ticker).');
      setHistoricalData(null);
      setAiAnalysis(null); // Limpa também a análise de IA
      // setAiError(''); // Se usar erro específico
      return;
    }

    // Limpa estados anteriores e inicia o loading
    setError('');
    setHistoricalData(null);
    setAiAnalysis(null); // Limpa também a análise de IA
    // setAiError(''); // Se usar erro específico
    setLoading(true);

    let fetchedHistoricalData = null;

    try {
      // --- PRIMEIRA CHAMADA API: Buscar Dados Históricos ---
      console.log(`Buscando dados históricos para ${ticker.toUpperCase()}...`);
      fetchedHistoricalData = await getHistoricalData(ticker);

      if (fetchedHistoricalData === null) {
         // Ticker não encontrado ou sem dados históricos (tratado como 404 no serviço api.js)
         setError(`Ticker "${ticker.toUpperCase()}" não encontrado ou sem dados históricos disponíveis.`);
         setHistoricalData(null); // Garante limpo
         setAiAnalysis(null); // Garante limpo
         // setAiError(''); // Garante limpo
         return; // Para a execução aqui se não houver dados
      }

      // Se dados históricos encontrados, atualiza o estado
      setHistoricalData(fetchedHistoricalData.historical_data);
      console.log("Dados históricos carregados.");

      // --- Ler Configurações de IA ---
      let isAIEnabled = false;
      let selectedModel = null;
      try {
         const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
         if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            isAIEnabled = settings.isAIEnabled ?? true; // Lê estado, default true
            // A página de configurações já valida o modelo ao carregar/salvar,
            // mas podemos adicionar uma validação básica aqui tbm se quisermos ser super seguros.
            selectedModel = settings.selectedModel;
         }
         console.log(`Configurações de IA lidas: Habilitada=${isAIEnabled}, Modelo=${selectedModel}`);
      } catch (lsError) {
         console.error("Erro ao ler configurações de IA do localStorage:", lsError);
         // Continua sem IA se não puder ler as configurações
         isAIEnabled = false;
      }

      // --- SEGUNDA CHAMADA API (CONDICIONAL): Buscar Análise de IA ---
      if (isAIEnabled && selectedModel) {
          console.log(`Buscando análise de IA para ${ticker.toUpperCase()} com modelo ${selectedModel}...`);
          try {
              const aiResult = await getAIAnalysis(ticker, selectedModel);
              // O serviço getAIAnalysis retorna { ai_analysis: "..." } em sucesso ou erro string.
              setAiAnalysis(aiResult.ai_analysis);
              // setAiError(''); // Limpa erro específico da IA se houver

          } catch (aiApiError) {
              console.error("Erro na chamada da API (Análise IA):", aiApiError);
              // Se a chamada de IA falhar, NÃO limpamos os dados históricos.
              // Podemos definir um erro específico para a IA ou adicionar à mensagem geral.
              // Vamos definir uma mensagem de erro no estado aiAnalysis ou um estado separado.
              setAiAnalysis(`Erro ao obter análise de IA: ${aiApiError.message}`); // Define mensagem de erro no campo de análise
              // setAiError(`Erro ao obter análise de IA: ${aiApiError.message}`); // Se usar erro específico da IA
          }
           console.log("Chamada de análise de IA concluída (sucesso ou falha tratada).");
      } else {
          console.log("Análise de IA desabilitada nas configurações.");
          setAiAnalysis("Análise de IA desabilitada."); // Mensagem indicando que a IA está desabilitada
      }

    } catch (err) {
      // Captura erros que não foram tratados pelos serviços (ex: erro de rede antes de qualquer resposta)
      console.error("Erro inesperado durante a análise:", err);
      setError(err.message || 'Ocorreu um erro inesperado durante a análise.');
      // Garante que ambos os estados estejam limpos em caso de erro inesperado
      setHistoricalData(null);
      setAiAnalysis(null);
      // setAiError('');
    } finally {
      // Finaliza o estado de loading SEMPRE
      setLoading(false);
       console.log("Processo de análise finalizado.");
    }
  };
  // --- Fim Função de Análise ---


  // --- Geração das Configurações dos Gráficos ---
  const priceChartConfig = historicalData ? generatePriceChartConfig(historicalData, ticker.toUpperCase()) : null;
  const candlestickChartConfig = historicalData ? generateCandlestickChartConfig(historicalData, ticker.toUpperCase()) : null;
  const movingAveragesChartConfig = historicalData ? generateMovingAveragesChartConfig(historicalData, ticker.toUpperCase()) : null;
  const volumeChartConfig = historicalData ? generateVolumeChartConfig(historicalData, ticker.toUpperCase()) : null;
  // --- Fim Geração das Configurações ---


  return (
    <div className={styles.analysisPageContainer}>
      <h1 className={styles.pageTitle}>Análise de Ações</h1>

      {/* Seção de Input e Botão */}
      <div className={styles.inputSection}>
        <input
          type="text"
          className={styles.tickerInput}
          placeholder="Digite o Código (símbolo do ticker)"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAnalyze();
            }
          }}
        />
        <button
          className={styles.analyzeButton}
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? 'Buscando...' : 'Analisar'}
        </button>
      </div>

      {/* Área de Status e Resultados */}
      <div className={styles.resultsArea}>
        {loading && <LoadingIndicator message="Buscando dados e análise..." />}

        {/* Exibe o erro principal (geralmente de dados ou conexão) */}
        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* Exibe a análise de IA OU a mensagem de erro específica da IA */}
        {/* Usa o estado aiAnalysis para a mensagem de sucesso ou erro da IA */}
        {!loading && aiAnalysis !== null && (
             <AnalysisDisplay analysisText={aiAnalysis} />
        )}
        {/* Opcional: Se usar estado aiError separado:
        {aiError && <div className={styles.errorMessage}>{aiError}</div>}
        */}


        {/* Área dos Gráficos - Renderiza SOMENTE se houver dados históricos e não estiver carregando */}
        {!loading && historicalData && (
           <div className={styles.chartsSection}>
               <h2 className={styles.chartsTitle}>Visualização dos Dados</h2>

               {priceChartConfig && (
                  <StockChart data={priceChartConfig.data} layout={priceChartConfig.layout} />
               )}
               {candlestickChartConfig && (
                  <StockChart data={candlestickChartConfig.data} layout={candlestickChartConfig.layout} />
               )}
               {movingAveragesChartConfig && (
                   <StockChart data={movingAveragesChartConfig.data} layout={movingAveragesChartConfig.layout} />
               )}
                {volumeChartConfig && (
                   <StockChart data={volumeChartConfig.data} layout={volumeChartConfig.layout} />
                 )}

           </div>
        )}
        {/* Fim Área dos Gráficos */}

      </div>

    </div>
  );
};

export default StockAnalysisPage;