// frontend/src/utils/chartGenerators.js

/**
 * Gera a configuração para o gráfico de linha do preço de fechamento.
 * @param {Array<Object>} data - Dados históricos da API.
 * @param {string} ticker - Símbolo do ticker.
 * @returns {{data: Array<Object>, layout: Object}|null} Configuração Plotly ou null se dados inválidos.
 */
export const generatePriceChartConfig = (data, ticker) => { // Adicionado 'export'
    // Ensure data is valid and has 'Date' and 'Close'
    if (!data || data.length === 0 || data.some(item => item.Close === undefined || item.Date === undefined)) {
      return null;
    }
    // Mapeia os dados da API para arrays separados para Plotly
    const dates = data.map(item => item.Date);
    const closes = data.map(item => item.Close);
  
    const plotData = [{
      x: dates,
      y: closes,
      type: 'scatter',
      mode: 'lines+markers', // Mostra linha e marcadores nos pontos de dados
      marker: { color: 'var(--color-accent)' }, // Cor do tema (usará variável CSS global)
      name: 'Preço de Fechamento',
      hovertemplate: // Formato customizado para o tooltip
          '<b>Data:</b> %{x}<br>' +
          '<b>Fechamento:</b> %{y:.2f}<br>' + // Formata para 2 casas decimais
          '<extra></extra>', // Remove o texto padrão extra
    }];
  
    const layout = {
      title: `${ticker} Preços das Ações (Últimos 6 Meses)`,
      xaxis: { title: 'Data' },
      yaxis: { title: 'Preço (USD)' },
       // Cores e fontes são definidas no componente StockChart como defaults e podem usar variáveis CSS globais
    };
  
    return { data: plotData, layout };
  };
  
  /**
   * Gera a configuração para o gráfico de candlestick.
   * @param {Array<Object>} data - Dados históricos da API.
   * @param {string} ticker - Símbolo do ticker.
   * @returns {{data: Array<Object>, layout: Object}|null} Configuração Plotly ou null se dados inválidos.
   */
  export const generateCandlestickChartConfig = (data, ticker) => { // Adicionado 'export'
     if (!data || data.length === 0 || data.some(item => item.Open === undefined || item.High === undefined || item.Low === undefined || item.Close === undefined || item.Date === undefined)) {
       return null;
     }
    const dates = data.map(item => item.Date);
    const open = data.map(item => item.Open);
    const high = data.map(item => item.High);
    const low = data.map(item => item.Low);
    const close = data.map(item => item.Close);
  
    const plotData = [{
      x: dates,
      open: open,
      high: high,
      low: low,
      close: close,
      type: 'candlestick',
      name: `${ticker} Candlestick`,
       increasing: { line: { color: 'var(--color-success)' } }, // Cor verde para alta (variável CSS)
       decreasing: { line: { color: 'var(--color-secondary)' } }, // Cor vermelha para baixa (variável CSS)
       hoverlabel: {
          bgcolor: 'var(--color-background-dark)', // Fundo escuro no hoverlabel (variável CSS)
          bordercolor: 'var(--color-border)', // (variável CSS)
          font: {
             color: 'var(--color-text-light)' // Texto claro no hoverlabel (variável CSS)
          }
       },
       hovertemplate: // Formato customizado para o tooltip
           '<b>Data:</b> %{x}<br>' +
           '<b>Abertura:</b> %{open:.2f}<br>' +
           '<b>Máxima:</b> %{high:.2f}<br>' +
           '<b>Mínima:</b> %{low:.2f}<br>' +
           '<b>Fechamento:</b> %{close:.2f}<br>' +
           '<extra></extra>',
    }];
  
    const layout = {
      title: `${ticker} Candlestick Chart (Últimos 6 Meses)`,
      xaxis: {
          title: 'Data',
          rangeslider: { visible: false }
      },
      yaxis: { title: 'Preço (USD)' },
       // Cores e fontes gerais definidas no StockChart ou defaults Plotly
    };
  
    return { data: plotData, layout };
  };
  
  /**
   * Gera a configuração para o gráfico de médias móveis.
   * @param {Array<Object>} data - Dados históricos da API (com SMA/EMA calculados).
   * @param {string} ticker - Símbolo do ticker.
   * @returns {{data: Array<Object>, layout: Object}|null} Configuração Plotly ou null se dados inválidos.
   */
  export const generateMovingAveragesChartConfig = (data, ticker) => { // Adicionado 'export'
      // Filter out rows where SMA/EMA are null/undefined
      const filteredData = data.filter(item => item.SMA_20 != null && item.EMA_20 != null);
  
      if (!filteredData || filteredData.length === 0 || filteredData.some(item => item.Close === undefined || item.Date === undefined || item.SMA_20 === undefined || item.EMA_20 === undefined)) {
        return null; // Retorna null se não houver dados após filtrar ou faltarem chaves básicas
      }
  
     const dates = filteredData.map(item => item.Date);
     const closes = filteredData.map(item => item.Close);
     const sma20 = filteredData.map(item => item.SMA_20);
     const ema20 = filteredData.map(item => item.EMA_20);
  
     const plotData = [
       {
         x: dates,
         y: closes,
         type: 'scatter',
         mode: 'lines',
         name: 'Fechamento',
         line: { color: 'var(--color-text-medium)' }, // Cor neutra (variável CSS)
          hovertemplate: '<b>Data:</b> %{x}<br><b>Fechamento:</b> %{y:.2f}<extra></extra>',
       },
       {
         x: dates,
         y: sma20,
         type: 'scatter',
         mode: 'lines',
         name: 'SMA 20',
         line: { color: 'var(--color-primary)' }, // Cor primária (variável CSS)
          hovertemplate: '<b>Data:</b> %{x}<br><b>SMA 20:</b> %{y:.2f}<extra></extra>',
       },
       {
         x: dates,
         y: ema20,
         type: 'scatter',
         mode: 'lines',
         name: 'EMA 20',
         line: { color: 'var(--color-accent)' }, // Cor de acento (variável CSS)
          hovertemplate: '<b>Data:</b> %{x}<br><b>EMA 20:</b> %{y:.2f}<extra></extra>',
       }
     ];
  
     const layout = {
       title: `${ticker} Médias Móveis (SMA 20, EMA 20)`,
       xaxis: { title: 'Data' },
       yaxis: { title: 'Preço (USD)' },
        // Posição da legenda - override no default do StockChart
       legend: { orientation: "h", yanchor: "bottom", y: 1.02, xanchor: "right", x: 1 },
        // Cores e fontes gerais definidas no StockChart ou defaults Plotly
     };
  
     return { data: plotData, layout };
   };
  
  /**
   * Gera a configuração para o gráfico de volume de negociação.
   * @param {Array<Object>} data - Dados históricos da API.
   * @param {string} ticker - Símbolo do ticker.
   * @returns {{data: Array<Object>, layout: Object}|null} Configuração Plotly ou null se dados inválidos.
   */
   export const generateVolumeChartConfig = (data, ticker) => { // Adicionado 'export'
      if (!data || data.length === 0 || data.some(item => item.Volume === undefined || item.Date === undefined)) {
        return null;
      }
     const dates = data.map(item => item.Date);
     const volume = data.map(item => item.Volume);
  
     const plotData = [{
       x: dates,
       y: volume,
       type: 'bar',
       name: 'Volume',
       marker: { color: 'var(--color-secondary)' }, // Cor secundária para o volume (variável CSS)
        hovertemplate: '<b>Data:</b> %{x}<br><b>Volume:</b> %{y:,}<extra></extra>', // Formato volume com vírgula
     }];
  
     const layout = {
       title: `${ticker} Volume de Negociação`,
       xaxis: { title: 'Data' },
       yaxis: { title: 'Volume' },
        // Cores e fontes gerais definidas no StockChart ou defaults Plotly
     };
  
     return { data: plotData, layout };
   };