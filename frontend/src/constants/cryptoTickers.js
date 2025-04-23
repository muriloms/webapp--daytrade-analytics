// frontend/src/constants/cryptoTickers.js

/**
 * Lista estática de tickers de criptomoedas comuns para uso em autocomplete.
 * Formato geralmente é SYMBOL-CURRENCY (ex: BTC-USD).
 */
const commonCryptoTickers = [
    "BTC-USD", "ETH-USD", "DOGE-USD", "XRP-USD", "ADA-USD",
    "SOL-USD", "DOT-USD", "LTC-USD", "BCH-USD", "LINK-USD",
    "XLM-USD", "TRX-USD", "VET-USD", "ETC-USD", "FIL-USD",
    // Adicione outros pares de cripto-moeda conforme necessário,
    // verificando se o yfinance suporta o par específico.
    // Ex: "ETH-EUR", "BTC-BRL", etc.
  ];
  
  // Exporta a lista para ser usada em outros módulos
  export { commonCryptoTickers };