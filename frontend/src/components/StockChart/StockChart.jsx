// frontend/src/components/StockChart/StockChart.jsx

import React from 'react';
import Plot from 'react-plotly.js';
import styles from './StockChart.module.css';

// --- Adiciona a prop onExpand ---
const StockChart = ({ data, layout, config, title, onExpand }) => {
  // Não renderiza nada ou mensagem se não houver dados
  if (!data || data.length === 0) {
    return (
        <div className={styles.chartContainer}>
           <p className={styles.noDataMessage}>Sem dados para exibir o gráfico.</p>
        </div>
    );
  }

  // Configuração padrão para o Plotly, mescla com o fornecido
  const defaultPlotlyConfig = {
    displayModeBar: false,
    responsive: true,
  };

  // Layout padrão, mescla com o fornecido
   const defaultLayout = {
      font: {
          family: 'var(--font-family-primary)',
          color: 'var(--color-text-light)'
      },
      paper_bgcolor: 'var(--color-background-card)',
      plot_bgcolor: 'var(--color-background-dark)',
      margin: { t: 40, r: 20, l: 40, b: 30 },
      hovermode: 'x unified',
      xaxis: {
        showgrid: false,
        zeroline: false,
        color: 'var(--color-text-medium)',
        tickfont: { color: 'var(--color-text-dark)' },
        title: { font: { color: 'var(--color-text-medium)' } }
      },
       yaxis: {
        showgrid: true,
        gridcolor: 'var(--color-border)',
        zeroline: false,
         color: 'var(--color-text-medium)',
         tickfont: { color: 'var(--color-text-dark)' },
          title: { font: { color: 'var(--color-text-medium)' } }
      },
      legend: {
          font: { color: 'var(--color-text-light)' }
      },
      autosize: true,
   };


  const finalLayout = { ...defaultLayout, ...layout };
  const finalConfig = { ...defaultPlotlyConfig, ...config };

  // --- Manipulador de clique para o botão Expandir ---
  const handleExpandClick = () => {
      // Chama a função onExpand passada via prop, passando os dados e config do gráfico
      if (onExpand) {
          onExpand({ data, layout, config });
      }
  };
  // --- Fim Manipulador ---


  return (
    // Container para aplicar estilos, agora com position: relative para posicionamento absoluto interno
    <div className={styles.chartContainer}>
      {/* Botão ou ícone de Expandir - Renderiza SOMENTE se a prop onExpand for fornecida */}
      {onExpand && (
          <button
              className={styles.expandButton}
              onClick={handleExpandClick}
              title="Expandir Gráfico" // Tooltip
          >
              ↗ {/* Símbolo simples de expandir */}
          </button>
      )}

      {/* O componente Plot renderiza o gráfico */}
      <Plot
        data={data}
        layout={finalLayout}
        config={finalConfig}
        style={{ width: '100%', height: finalLayout?.height || 300 }}
      />
    </div>
  );
};

export default StockChart;