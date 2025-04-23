// frontend/src/components/CryptoInfoCard/CryptoInfoCard.jsx

import React from 'react';
import styles from './CryptoInfoCard.module.css';

/**
 * Componente para exibir informações básicas de criptomoeda em um card.
 * Assume que recebe um objeto formatado similar ao retornado por yfinance.info para criptos.
 *
 * @param {Object|null} cryptoInfo - Objeto com informações da criptomoeda (ex: { symbol: 'BTC-USD', marketCap: '...' }).
 * @returns {JSX.Element|null} O componente renderizado ou null se não houver dados.
 */
const CryptoInfoCard = ({ cryptoInfo }) => {
  // Não renderiza nada se não houver dados válidos de cripto
  if (!cryptoInfo || Object.keys(cryptoInfo).length === 0) {
    return (
       <div className={styles.cryptoInfoContainer}> {/* Usar o mesmo container para mensagem */}
           <p className={styles.infoUnavailable}>Informações da criptomoeda não disponíveis.</p>
       </div>
    );
  }

  // Extrai os campos do objeto cryptoInfo (use .? para acessar seguro caso um campo falhe)
  // Nomes de campos baseados no que yfinance.info retorna para criptos
  const {
    symbol,
    shortName,
    longName,
    exchange, // Ex: CCC
    quoteType, // Ex: CRYPTO
    marketCap,
    circulatingSupply, // Suprimento circulante
    volume24Hr, // Volume 24h
    volumeAllCurrencies, // Volume total (se disponível)
    regularMarketPrice, // Preço atual (pode ser redundante com gráfico, mas útil aqui)
    fiftyTwoWeekHigh, fiftyTwoWeekLow, // Máxima/Mínima 52 semanas
    // Muitos campos de empresa (setor, industry, employees, website, summary) não existem para criptos
  } = cryptoInfo;


  // Funções de Formatação (adaptadas para valores cripto)
  const formatValue = (value, isCurrency = false, decimalPlaces = 2) => {
       if (value === undefined || value === null) return 'N/A';
       const formatted = isCurrency ? `$${value.toFixed(decimalPlaces)}` : value.toLocaleString();
        // Adicionar formatação para trilhões, bilhões, milhões se necessário para marketCap/volume grande
       return formatted;
   };

   const formatLargeValue = (value) => {
       if (value === undefined || value === null) return 'N/A';
       if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
       if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
       if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
       return `$${value.toFixed(2)}`;
   };


  return (
    <div className={styles.cryptoInfoContainer}>
      {/* Título do Card (Nome da Criptomoeda) */}
      <h2 className={styles.cryptoName}>{shortName || longName || symbol || 'Criptomoeda Desconhecida'}</h2>
       {/* Símbolo/Nome longo se diferente */}
       {(symbol || longName) && (symbol !== shortName && longName !== shortName) && (
           <p className={styles.symbolOrLongName}>{symbol || longName}</p>
       )}


      {/* Detalhes da Cripto em um formato de grid */}
      <div className={styles.detailsGrid}>
          {exchange && (
              <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Exchange:</span>
                  <span className={styles.detailValue}>{exchange}</span>
              </div>
          )}
           {quoteType && (
              <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Tipo:</span>
                  <span className={styles.detailValue}>{quoteType}</span>
              </div>
          )}
          {regularMarketPrice !== undefined && regularMarketPrice !== null && (
              <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Preço Atual:</span>
                  <span className={styles.detailValue}>{formatValue(regularMarketPrice, true, 2)}</span> {/* Preço com 2 casas */}
              </div>
          )}
           {marketCap !== undefined && marketCap !== null && (
               <div className={styles.detailItem}>
                   <span className={styles.detailLabel}>Market Cap:</span>
                   <span className={styles.detailValue}>{formatLargeValue(marketCap)}</span> {/* Market Cap formatado */}
               </div>
           )}
           {circulatingSupply !== undefined && circulatingSupply !== null && (
                <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Supr. Circulante:</span>
                    <span className={styles.detailValue}>{formatValue(circulatingSupply, false, 0)}</span> {/* Suprimento sem casas decimais */}
                </div>
           )}
            {volume24Hr !== undefined && volume24Hr !== null && (
                 <div className={styles.detailItem}>
                     <span className={styles.detailLabel}>Volume 24h:</span>
                     <span className={styles.detailValue}>{formatLargeValue(volume24Hr)}</span> {/* Volume formatado */}
                 </div>
             )}
             {fiftyTwoWeekHigh !== undefined && fiftyTwoWeekHigh !== null && (
                 <div className={styles.detailItem}>
                     <span className={styles.detailLabel}>Máx 52 Semanas:</span>
                     <span className={styles.detailValue}>{formatValue(fiftyTwoWeekHigh, true, 2)}</span>
                 </div>
             )}
             {fiftyTwoWeekLow !== undefined && fiftyTwoWeekLow !== null && (
                 <div className={styles.detailItem}>
                     <span className={styles.detailLabel}>Mín 52 Semanas:</span>
                     <span className={styles.detailValue}>{formatValue(fiftyTwoWeekLow, true, 2)}</span>
                 </div>
             )}

             {/* Adicionar outros campos se disponíveis e úteis */}
      </div>

    </div>
  );
};

export default CryptoInfoCard;