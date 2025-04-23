// frontend/src/pages/CryptoAnalysisPage/CryptoAnalysisPage.jsx

import React, { useState } from 'react';
import styles from './CryptoAnalysisPage.module.css';

// Importa as funções do serviço de API
// --- NOVO/Restaurado: Importa getCompanyInfo ---
import { getHistoricalData, getAIAnalysis, getCompanyInfo } from '../../services/api';

// Importa componentes reutilizáveis
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';
import AnalysisDisplay from '../../components/AnalysisDisplay/AnalysisDisplay';
// --- NOVO: Importa CryptoInfoCard ---
import CryptoInfoCard from '../../components/CryptoInfoCard/CryptoInfoCard';
// --- REMOVIDO: import CompanyInfoCard from '../../components/CompanyInfoCard/CompanyInfoCard'; ---
import Modal from '../../components/Modal/Modal';
import StockChart from '../../components/StockChart/StockChart';

// Importa a chave de localStorage da página de Configurações
import { SETTINGS_STORAGE_KEY } from '../SettingsPage/SettingsPage';

// Importa as funções de geração de configuração de gráfico
import {
    generatePriceChartConfig,
    generateCandlestickChartConfig,
    generateMovingAveragesChartConfig,
    generateVolumeChartConfig
} from '../../utils/chartGenerators';

// --- MODIFICADO: Importa a lista de tickers de cripto ---
import { commonCryptoTickers } from '../../constants/cryptoTickers';
// --- REMOVIDO: import { commonTickers } from '../../constants/tickers'; ---


// --- Renomeia o componente (mantém o mesmo) ---
const CryptoAnalysisPage = () => {
  // --- Estado da Página (Adicionado de volta estado para companyInfo) ---
  const [ticker, setTicker] = useState('');
  const [historicalData, setHistoricalData] = useState(null);
  // --- NOVO/Restaurado: Estado para informações da empresa (conterá info de cripto) ---
  const [companyInfo, setCompanyInfo] = useState(null); // Usando o mesmo nome de estado do StockPage
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalChartConfig, setModalChartConfig] = useState(null);
  // --- Fim Estado do Modal ---

  // --- Estado para gerenciar sugestões de autocomplete ---
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // --- Fim Estado de Sugestões ---


  // --- Função para Disparar a Análise (MODIFICADA para 3 chamadas concorrentes) ---
  const handleAnalyze = async () => {
    if (!ticker) {
      setError('Por favor, insira um código (símbolo da criptomoeda).');
      setHistoricalData(null);
      setCompanyInfo(null); // Limpa estado da empresa
      setAiAnalysis(null);
      setModalOpen(false);
      setModalChartConfig(null);
      return;
    }

    setError('');
    setHistoricalData(null);
    setCompanyInfo(null); // Limpa estado da empresa
    setAiAnalysis(null);
    setModalOpen(false);
    setModalChartConfig(null);
    setLoading(true);
    // Oculta sugestões ao analisar
    setSuggestions([]);
    setShowSuggestions(false);

    let historicalDataPromise = null;
    let companyInfoPromise = null; // Promise para informações da empresa
    let aiAnalysisPromise = null;

    try {
        // INICIA as chamadas (dados históricos E informações da empresa E IA) quase simultaneamente
        historicalDataPromise = getHistoricalData(ticker);
        companyInfoPromise = getCompanyInfo(ticker); // --- NOVO/Restaurado: Inicia busca por informações da empresa ---


        // Lê configurações de IA ANTES de iniciar a chamada de IA (se habilitada)
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

        // SE IA estiver habilitada e modelo selecionado, INICIA a chamada de IA (não aguarda aqui)
        if (isAIEnabled && selectedModel) {
             // Nota: A análise de IA para cripto com o backend atual usará DuckDuckGo
             // e pode não ser tão específica ou útil quanto para ações.
             aiAnalysisPromise = getAIAnalysis(ticker, selectedModel);
             console.log(`Iniciada busca por análise de IA para ${ticker.toUpperCase()} com modelo ${selectedModel} (Cripto)`);
        } else {
             aiAnalysisPromise = Promise.resolve({ ai_analysis: "Análise de IA desabilitada nas configurações ou não aplicável diretamente a criptomoedas com ferramentas atuais." });
             console.log("Análise de IA desabilitada nas configurações ou não aplicável diretamente a criptomoedas.");
        }

        // --- AGUARDAR E PROCESSAR RESULTADOS EM ORDEM LÓGICA ---
        try {
            // 1. Aguardar e processar Resultado dos Dados Históricos PRIMEIRO (mais crítico)
            const fetchedHistoricalDataResult = await historicalDataPromise;

            if (fetchedHistoricalDataResult === null) {
                // Se dados históricos NÃO encontrados (404), defina o erro principal e SAIA.
                // Isso limpa todos os resultados, incluindo info e IA.
                setError(`Ticker "${ticker.toUpperCase()}" não encontrado ou sem dados históricos disponíveis para criptomoeda.`);
                setHistoricalData(null);
                setCompanyInfo(null); // Garante limpo
                setAiAnalysis(null); // Garante limpo
                return; // <-- SAIA DA FUNÇÃO AQUI se dados principais não vierem
            }
            // Se dados históricos SUCESSO, atualize o estado. Gráficos podem renderizar.
            setHistoricalData(fetchedHistoricalDataResult.historical_data);
            console.log("Estado historicalData (Cripto) atualizado.");


            // 2. Aguardar e processar Resultado das Informações da Empresa
            try { // Try/catch para falha específica da chamada de info
                const companyInfoResult = await companyInfoPromise; // --- NOVO/Restaurado: Aguarda resultado da promise de info ---
                console.log("Resultado de informações da empresa (Cripto) recebido.");
                 // getCompanyInfo retorna { company_info: {...} } ou null on 404 ou lança erro
                setCompanyInfo(companyInfoResult?.company_info || null); // --- NOVO/Restaurado: Atualiza estado da empresa ---
                if (companyInfoResult === null) { console.log("Informações da criptomoeda 404 ou não encontradas."); } // Texto atualizado

            } catch (infoError) {
                 console.error("Erro durante a chamada ou processamento da API de Informações da Empresa (Cripto):", infoError); // Texto atualizado
                 setCompanyInfo(null); // Define estado da empresa como null em caso de erro na chamada de info
            }
            console.log("Processamento de informações da empresa (Cripto) concluído."); // Texto atualizado


            // 3. Aguardar e processar Resultado da Análise de IA
            try { // Try/catch para falha específica da chamada de IA
                const aiResult = await aiAnalysisPromise; // Aguarda o resultado da promise de IA (já iniciada)
                console.log("Resultado de análise de IA (Cripto) recebido.");
                setAiAnalysis(aiResult.ai_analysis); // Atualiza o estado com o resultado ou mensagem de erro da IA

            } catch (aiError) {
                 console.error("Erro durante a chamada ou processamento da API de IA (Cripto):", aiError);
                 setAiAnalysis(`Erro ao obter análise de IA: ${aiError.message || 'Erro desconhecido na IA para cripto.'}`);
            }
            console.log("Processamento de análise de IA (Cripto) concluído.");


        } catch (generalError) {
            console.error("Erro geral inesperado durante a análise (Cripto):", generalError);
            setError(generalError.message || 'Ocorreu um erro inesperado durante a análise de cripto.');
             // Em caso de erro geral inesperado, limpa todos os estados
            setHistoricalData(null);
            setCompanyInfo(null); // Garante limpo
            setAiAnalysis(null);
        } finally {
            // Este bloco SEMPRE executa após try/catch/return
            setLoading(false);
            console.log("handleAnalyze (Cripto) finalizado.");
        }
      }catch (initialError) {
        console.error("Erro inicial inesperado ao iniciar chamadas (Cripto):", initialError);
        setError(initialError.message || 'Ocorreu um erro inesperado ao iniciar as chamadas.');
        setLoading(false);
      }
  };
  // --- Fim Função de Análise (MODIFICADA) ---

  // --- Handlers do Modal (Mantêm os mesmos) ---
  const handleExpandChart = (chartConfig) => {
      setModalChartConfig(chartConfig);
      setModalOpen(true);
  };

  const handleCloseModal = () => {
      setModalOpen(false);
      setModalChartConfig(null);
  };
  // --- Fim Handlers do Modal ---


  // --- NOVO: Handlers para Sugestões (Adaptado para lista de cripto - mantém) ---
  const handleInputChange = (event) => {
    const value = event.target.value.toUpperCase();
    setTicker(value);

    if (value.length > 0) {
      const filteredSuggestions = commonCryptoTickers.filter(
        (ticker) => ticker.startsWith(value)
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setTicker(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleBlur = () => {
      setTimeout(() => {
          setShowSuggestions(false);
      }, 100);
  };

   const handleFocus = () => {
        if (ticker.length > 0 && suggestions.length > 0) {
             setShowSuggestions(suggestions.length > 0);
        }
   };
  // --- Fim Handlers para Sugestões (Adaptado) ---


  // --- Geração das Configurações dos Gráficos (Mantém as mesmas, funcionam com dados de cripto) ---
  const priceChartConfig = historicalData ? generatePriceChartConfig(historicalData, ticker.toUpperCase()) : null;
  const candlestickChartConfig = historicalData ? generateCandlestickChartConfig(historicalData, ticker.toUpperCase()) : null;
  const movingAveragesChartConfig = historicalData ? generateMovingAveragesChartConfig(historicalData, ticker.toUpperCase()) : null;
  const volumeChartConfig = historicalData ? generateVolumeChartConfig(historicalData, ticker.toUpperCase()) : null;
  // --- Fim Geração das Configurações ---

  // --- NOVO: Lógica para mensagem inicial (Adaptada - inclui checagem por companyInfo) ---
  // A mensagem inicial aparece se não estiver carregando, sem erro,
  // E sem dados históricos, SEM informações da empresa (cripto),
  // E a análise de IA está no estado inicial (null) ou na mensagem de desabilitada/não aplicável.
  const showInitialMessage = !loading && !error &&
                               !historicalData && companyInfo === null &&
                               (aiAnalysis === null ||
                                aiAnalysis === "Análise de IA desabilitada nas configurações." ||
                                aiAnalysis === "Análise de IA desabilitada nas configurações ou não aplicável diretamente a criptomoedas com ferramentas atuais.");


  return (
    // --- MODIFICADO: Classe de estilo (crypto) ---
    <div className={styles.cryptoAnalysisPageContainer}>
      {/* --- MODIFICADO: Título da página --- */}
      <h1 className={styles.pageTitle}>Análise de Criptomoedas: {ticker.toUpperCase()}</h1>

      {/* Seção de Input e Botão (Mantém estrutura, ajusta placeholder) */}
      <div className={styles.inputSection}>
        <div className={styles.tickerInputContainer}>
            <input
              type="text"
              className={styles.tickerInput}
              // --- MODIFICADO: Placeholder ---
              placeholder="Digite o Código (ex: BTC-USD)"
              value={ticker}
              onChange={handleInputChange} // Usa o handler adaptado
              onBlur={handleBlur}
              onFocus={handleFocus}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAnalyze();
                }
              }}
            />
            {/* Lista de Sugestões - Renderiza condicionalmente (usa a lista de cripto no handler) */}
            {showSuggestions && suggestions.length > 0 && (
                <ul className={styles.suggestionsList}>
                    {suggestions.map((suggestion) => (
                        <li
                            key={suggestion}
                            onMouseDown={() => handleSelectSuggestion(suggestion)}
                            className={styles.suggestionItem}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>

        <button
          className={styles.analyzeButton}
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? 'Buscando...' : 'Analisar'}
        </button>
        {/* --- NOVO: Link para Lista de Tickers de Cripto --- */}
        {/* Mostra o link SEMPRE */}
        <a
           href="https://finance.yahoo.com/crypto/" // Link para lista de criptos no Yahoo
           target="_blank"
           rel="noopener noreferrer"
           className={styles.yahooLinkButton} // Reutiliza classe de estilo
        >
           Encontrar Tickers de Cripto
        </a>
        {/* --- Fim NOVO --- */}

      </div> {/* Fim Seção de Input e Botão */}


      {/* Área de Status e Resultados (Container Grid) */}
      <div className={styles.resultsArea}>
        {loading && <LoadingIndicator message="Buscando dados e análise..." />}

        {error && <div className={`${styles.errorMessage} ${styles.gridItem}`}>{error}</div>}

        {!loading && !error && (
           <>
               {/* --- NOVO: Bloco de Informações da Criptomoeda --- */}
               {/* Usa o estado companyInfo (que conterá info de cripto) e o componente CryptoInfoCard */}
               {companyInfo !== null && (
                   // Usa a classe dashboardCard, a classe específica de grid item, E uma classe específica para info de cripto
                   <div className={`${styles.dashboardCard} ${styles.cryptoInfoCard} ${styles.gridItem}`}>
                       {/* Renderiza o componente de info, passando os dados */}
                       <CryptoInfoCard cryptoInfo={companyInfo} />
                   </div>
               )}

               {/* Bloco de Análise de IA (Mantém) */}
               {/* Renderiza se aiAnalysis NÃO for null */}
               {aiAnalysis !== null && (
                   // Usa a classe dashboardCard, a classe específica de grid item
                   // E a classe analysisCard (se ela contiver estilos visuais genéricos, não de posicionamento)
                   <div className={`${styles.dashboardCard} ${styles.analysisCard} ${styles.gridItem}`}> {/* Ajusta classes */}
                       <AnalysisDisplay analysisText={aiAnalysis} />
                   </div>
               )}

               {/* Blocos de Gráficos (Renderiza APENAS se houver dados históricos) */}
               {historicalData && (
                   <> {/* Fragmento para agrupar os gráficos, eles serão grid items */}
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
                         Digite um código (símbolo da criptomoeda) acima e clique em "Analisar" para visualizar os dados e a análise.
                     </div>
                 )}

           </>
        )}

      </div> {/* Fim resultsArea */}

      {/* Renderiza o Modal (Mantém o mesmo) */}
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

// --- Renomeia o componente exportado (mantém o mesmo) ---
export default CryptoAnalysisPage;