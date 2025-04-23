import React, { useState } from 'react';
import styles from './StockAnalysisPage.module.css';

import { getHistoricalData, getAIAnalysis, getCompanyInfo } from '../../services/api';

import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';
import AnalysisDisplay from '../../components/AnalysisDisplay/AnalysisDisplay';
import CompanyInfoCard from '../../components/CompanyInfoCard/CompanyInfoCard';

import StockChart from '../../components/StockChart/StockChart';
import Modal from '../../components/Modal/Modal';


import { SETTINGS_STORAGE_KEY } from '../SettingsPage/SettingsPage';

import {
    generatePriceChartConfig,
    generateCandlestickChartConfig,
    generateMovingAveragesChartConfig,
    generateVolumeChartConfig
} from '../../utils/chartGenerators';

// ---  Importa a lista de tickers comuns ---
import { commonTickers } from '../../constants/tickers';


const StockAnalysisPage = () => {
  const [ticker, setTicker] = useState('');
  const [historicalData, setHistoricalData] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- Estado para controlar o Modal ---
  const [modalOpen, setModalOpen] = useState(false); // Controla se o modal está aberto
  const [modalChartConfig, setModalChartConfig] = useState(null); // Armazena a config do gráfico a ser mostrado no modal
  // --- Fim Estado do Modal ---

  // --- Estado para gerenciar sugestões de autocomplete ---
  const [suggestions, setSuggestions] = useState([]); // Lista de sugestões visíveis
  const [showSuggestions, setShowSuggestions] = useState(false); // Controla a visibilidade da lista de sugestões
  // --- Fim Estado de Sugestões ---

  const handleAnalyze = async () => {
    if (!ticker) {
      setError('Por favor, insira um código (símbolo do ticker).');
      setHistoricalData(null);
      setCompanyInfo(null);
      setAiAnalysis(null);
      return;
    }

    setError('');
    setHistoricalData(null);
    setCompanyInfo(null);
    setAiAnalysis(null);
    setLoading(true);

    let historicalDataPromise = null;
    let companyInfoPromise = null;
    let aiAnalysisPromise = null;

    try {
        historicalDataPromise = getHistoricalData(ticker);

        companyInfoPromise = getCompanyInfo(ticker);

        let isAIEnabled = false;
        let selectedModel = null;
        try {
             const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
             if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                isAIEnabled = settings.isAIEnabled ?? true;
                selectedModel = settings.selectedModel;
             }
        } catch (lsError) {
             console.error("Erro ao ler configurações de IA do localStorage:", lsError);
             isAIEnabled = false;
        }

        if (isAIEnabled && selectedModel) {
             aiAnalysisPromise = getAIAnalysis(ticker, selectedModel);
        } else {
             aiAnalysisPromise = Promise.resolve({ ai_analysis: "Análise de IA desabilitada nas configurações." });
        }

        try {
            const fetchedHistoricalDataResult = await historicalDataPromise;

            if (fetchedHistoricalDataResult === null) {
                setError(`Ticker "${ticker.toUpperCase()}" não encontrado ou sem dados históricos disponíveis.`);
                setHistoricalData(null);
                setCompanyInfo(null);
                setAiAnalysis(null);
                return;
            }
            setHistoricalData(fetchedHistoricalDataResult.historical_data);

            try {
                const companyInfoResult = await companyInfoPromise;
                setCompanyInfo(companyInfoResult?.company_info || null);
            } catch (infoError) {
                 console.error("Erro durante a chamada ou processamento da API de Informações da Empresa:", infoError);
                 setCompanyInfo(null);
            }

            try {
                const aiResult = await aiAnalysisPromise;
                setAiAnalysis(aiResult.ai_analysis);

            } catch (aiError) {
                 console.error("Erro durante a chamada ou processamento da API de IA:", aiError);
                 setAiAnalysis(`Erro ao obter análise de IA: ${aiError.message || 'Erro desconhecido na IA.'}`);
            }

        } catch (generalError) {
            console.error("Erro geral inesperado durante a análise:", generalError);
            setError(generalError.message || 'Ocorreu um erro inesperado.');
            setHistoricalData(null);
            setCompanyInfo(null);
            setAiAnalysis(null);
        } finally {
            setLoading(false);
        }
    }
    catch (fetchError) {
        console.error("Erro ao buscar dados:", fetchError);
        setError('Erro ao buscar dados. Verifique o ticker e tente novamente.');
        setLoading(false);
    }
  };


  // --- Handlers do Modal ---
  const handleExpandChart = (chartConfig) => {
    setModalChartConfig(chartConfig); // Salva a configuração do gráfico clicado
    setModalOpen(true); // Abre o modal
};

const handleCloseModal = () => {
    setModalOpen(false); // Fecha o modal
    setModalChartConfig(null); // Limpa a configuração ao fechar
};
// --- Fim Handlers do Modal ---

// --- NOVO: Handlers para Sugestões ---
const handleInputChange = (event) => {
  const value = event.target.value.toUpperCase(); // Converte para maiúsculas
  setTicker(value); // Atualiza o estado do ticker

  if (value.length > 0) {
    // Filtra a lista de tickers comuns
    const filteredSuggestions = commonTickers.filter(
      (ticker) => ticker.startsWith(value) // Filtra tickers que *começam* com o valor digitado
      // Ou use .includes(value) se quiser buscar em qualquer parte do ticker
    );
    setSuggestions(filteredSuggestions);
    setShowSuggestions(filteredSuggestions.length > 0); // Mostra a lista apenas se houver sugestões
  } else {
    // Se o input estiver vazio, limpa as sugestões e oculta a lista
    setSuggestions([]);
    setShowSuggestions(false);
  }
};

// Handler chamado ao clicar em uma sugestão (usa onMouseDown no JSX)
const handleSelectSuggestion = (suggestion) => {
  setTicker(suggestion); // Define o input com a sugestão clicada
  setSuggestions([]); // Limpa as sugestões
  setShowSuggestions(false); // Oculta a lista
  // Note: Não disparamos handleAnalyze automaticamente, o usuário clica no botão
};

// Handler chamado quando o input perde o foco
const handleBlur = () => {
    // Adiciona um pequeno delay antes de ocultar a lista.
    // Isso dá tempo para o evento onMouseDown na sugestão ser disparado antes do blur processar.
    // Sem delay, onBlur pode ocultar a lista antes que o clique na sugestão seja registrado.
    setTimeout(() => {
        setShowSuggestions(false);
    }, 100); // Delay de 100ms
};

 // Handler chamado quando o input ganha o foco (opcional: re-mostrar sugestões se houver texto)
 const handleFocus = () => {
      if (ticker.length > 0 && suggestions.length > 0) {
          // Opcional: Refiltrar ou apenas mostrar as últimas sugestões filtradas se o input não estiver vazio
          // setSuggestions(commonTickers.filter(t => t.startsWith(ticker))); // Refiltrar
           setShowSuggestions(suggestions.length > 0); // Apenas mostrar as últimas sugestões filtradas
      }
 };

// --- Fim Handlers para Sugestões ---

  const priceChartConfig = historicalData ? generatePriceChartConfig(historicalData, ticker.toUpperCase()) : null;
  const candlestickChartConfig = historicalData ? generateCandlestickChartConfig(historicalData, ticker.toUpperCase()) : null;
  const movingAveragesChartConfig = historicalData ? generateMovingAveragesChartConfig(historicalData, ticker.toUpperCase()) : null;
  const volumeChartConfig = historicalData ? generateVolumeChartConfig(historicalData, ticker.toUpperCase()) : null;

  const showInitialMessage = !loading && !error &&
                               !historicalData && companyInfo === null &&
                               (aiAnalysis === null || aiAnalysis === "Análise de IA desabilitada nas configurações.");


  
  return (
  <div className={styles.analysisPageContainer}>
    <h1 className={styles.pageTitle}>Análise de Ações: {ticker.toUpperCase()}</h1>

    {/* Seção de Input e Botão (Atualizada para incluir sugestões) */}
    <div className={styles.inputSection}>
      <div className={styles.tickerInputContainer}> {/* Container para input e lista de sugestões */}
          <input
            type="text"
            className={styles.tickerInput}
            placeholder="Digite o Código (símbolo do ticker)"
            value={ticker}
            onChange={handleInputChange} // Usa o novo handler
            onBlur={handleBlur} // Adiciona handler para quando perde o foco
            onFocus={handleFocus} // Adiciona handler para quando ganha o foco (opcional)
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAnalyze();
              }
            }}
          />
          {/* Lista de Sugestões - Renderiza condicionalmente */}
          {showSuggestions && suggestions.length > 0 && (
              <ul className={styles.suggestionsList}>
                  {suggestions.map((suggestion) => (
                      // Usa onMouseDown para selecionar, pois ele dispara antes do onBlur do input
                      <li
                          key={suggestion}
                          onMouseDown={() => handleSelectSuggestion(suggestion)} // Usa onMouseDown
                          className={styles.suggestionItem}
                      >
                          {suggestion}
                      </li>
                  ))}
              </ul>
          )}
      </div> {/* Fim Container para input e lista */}

      <button
        className={styles.analyzeButton}
        onClick={handleAnalyze}
        disabled={loading}
      >
        {loading ? 'Buscando...' : 'Analisar'}
      </button>
      {/* --- NOVO: Link para Lista de Tickers de Ações --- */}
        {/* Mostra o link SEMPRE, pois o objetivo é ajudar a encontrar tickers */}
        <a
           href="https://stockanalysis.com/stocks/" // Link para lista de ações
           target="_blank"
           rel="noopener noreferrer"
           className={styles.yahooLinkButton} // Reutiliza classe de estilo
        >
           Encontrar Tickers de Ações
        </a>
        {/* --- Fim NOVO --- */}
    </div> {/* Fim Seção de Input e Botão */}


    {/* Área de Status e Resultados (Container Grid) */}
    <div className={styles.resultsArea}>
      {loading && <LoadingIndicator message="Buscando dados e análise..." />}

      {error && <div className={`${styles.errorMessage} ${styles.gridItem}`}>{error}</div>}

      {!loading && !error && (
          <>
              {companyInfo !== null && (
                  <div className={`${styles.dashboardCard} ${styles.companyInfoCard} ${styles.gridItem}`}>
                      <CompanyInfoCard companyInfo={companyInfo} />
                  </div>
              )}

              {aiAnalysis !== null && (
                  <div className={`${styles.dashboardCard} ${styles.analysisCard} ${styles.gridItem}`}>
                      <AnalysisDisplay analysisText={aiAnalysis} />
                  </div>
              )}

              {historicalData && (
                  <>
                      {priceChartConfig && (
                        <div className={`${styles.dashboardCard} ${styles.chartCard} ${styles.gridItem}`}>
                            <StockChart data={priceChartConfig.data} layout={priceChartConfig.layout} title="Preço" onExpand={() => handleExpandChart(priceChartConfig)} />
                        </div>
                      )}
                      {candlestickChartConfig && (
                        <div className={`${styles.dashboardCard} ${styles.chartCard} ${styles.gridItem}`}>
                          <StockChart data={candlestickChartConfig.data} layout={candlestickChartConfig.layout} title="Candlestick" onExpand={() => handleExpandChart(candlestickChartConfig)} />
                        </div>
                      )}
                      {movingAveragesChartConfig && (
                          <div className={`${styles.dashboardCard} ${styles.chartCard} ${styles.gridItem}`}>
                            <StockChart data={movingAveragesChartConfig.data} layout={movingAveragesChartConfig.layout} title="Médias Móveis" onExpand={() => handleExpandChart(movingAveragesChartConfig)} />
                          </div>
                      )}
                      {volumeChartConfig && (
                          <div className={`${styles.dashboardCard} ${styles.chartCard} ${styles.gridItem}`}>
                            <StockChart data={volumeChartConfig.data} layout={volumeChartConfig.layout} title="Volume" onExpand={() => handleExpandChart(volumeChartConfig)} />
                          </div>
                      )}
                  </>
              )}

              {showInitialMessage && (
                    <div className={`${styles.initialMessage} ${styles.gridItem}`}>
                        Digite um código (símbolo do ticker) acima e clique em "Analisar" para visualizar os dados e a análise.
                    </div>
                )}

          </>
      )}

    </div>

    {/* Renderiza o Modal */}
    {modalOpen && modalChartConfig && (
        <Modal isOpen={modalOpen} onClose={handleCloseModal}>
            <StockChart
                data={modalChartConfig.data}
                layout={{ ...modalChartConfig.layout, title: modalChartConfig.layout.title + " (Expandido)" }}
                config={{ displayModeBar: true }}
            />
        </Modal>
    )}

  </div>
);
};

export default StockAnalysisPage;