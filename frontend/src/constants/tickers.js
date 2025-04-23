// frontend/src/constants/tickers.js

/**
 * Lista estática de tickers de ações comuns para uso em autocomplete.
 * Esta lista não é exaustiva nem atualizada em tempo real do mercado.
 */
const commonTickers = [
    "AAPL", "MSFT", "GOOG", "AMZN", "TSLA", "NVDA", "FB", "META", // Tech Giants
    "BRK-B", "JPM", "V", "MA", "BAC", "WFC", // Finance
    "JNJ", "UNH", "PFE", "ABBV", "MRK", // Healthcare
    "XOM", "CVX", "SHEL", "BHP", // Energy (ajustar conforme o mercado)
    "WMT", "HD", "PG", "KO", "PEP", // Consumer Staples/Discretionary
    "BABA", "TCEHY", "TM", "SONY", // International (ajustar conforme interesse)
    "NFLX", "ADBE", "CRM", "INTC", "AMD", "QCOM", // More Tech
    "VZ", "T", "TMUS", // Telecom
    // Adicione outros tickers que você considere relevantes
  ];
  
  // Exporta a lista para ser usada em outros módulos
  export { commonTickers };