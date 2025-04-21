// frontend/src/components/StockChart/StockChart.jsx

import React from 'react';
// Importa o componente Plot da biblioteca react-plotly.js
import Plot from 'react-plotly.js';
import styles from './StockChart.module.css'; // Importa os estilos CSS Module

const StockChart = ({ data, layout, config, title }) => {
  // Verifica se há dados para renderizar o gráfico
  if (!data || data.length === 0) {
    // Você pode retornar null, uma mensagem, ou um placeholder
    return (
        <div className={styles.chartContainer}>
           <p className={styles.noDataMessage}>Sem dados para exibir o gráfico.</p>
        </div>
    );
  }

  // Configuração padrão para o Plotly, se não for fornecida
  // displayModeBar: false remove a barra de ferramentas do Plotly
  const defaultPlotlyConfig = {
    displayModeBar: false,
    responsive: true, // Tenta ser responsivo por padrão
     // Outras configurações padrão aqui se necessário
  };

  // Layout padrão, mescla com o layout fornecido
   const defaultLayout = {
      // Exemplo de layout padrão que pode ser sobrescrito
      // title: title || '', // O título principal deve vir do 'layout' prop
      font: {
          family: 'var(--font-family-primary)', // Usa a fonte do tema
          color: 'var(--color-text-light)' // Cor do texto do tema
      },
      paper_bgcolor: 'var(--color-background-card)', // Fundo da área do gráfico (fora do plot)
      plot_bgcolor: 'var(--color-background-dark)', // Fundo da área de plotagem
      margin: { t: 40, r: 20, l: 40, b: 30 }, // Margens padrão
      hovermode: 'x unified', // Comportamento do hover
      xaxis: {
        showgrid: false, // Remove grid do eixo X
        zeroline: false, // Remove linha zero do eixo X
        color: 'var(--color-text-medium)', // Cor dos labels/tick marks do eixo X
        tickfont: {
            color: 'var(--color-text-dark)' // Cor dos ticks
        },
        title: {
            font: {
                color: 'var(--color-text-medium)' // Cor do título do eixo
            }
        }
      },
       yaxis: {
        showgrid: true, // Mantém grid do eixo Y
        gridcolor: 'var(--color-border)', // Cor do grid do eixo Y
        zeroline: false,
         color: 'var(--color-text-medium)', // Cor dos labels/tick marks do eixo Y
         tickfont: {
             color: 'var(--color-text-dark)' // Cor dos ticks
         },
          title: {
             font: {
                 color: 'var(--color-text-medium)' // Cor do título do eixo
             }
         }
      },
      legend: {
          font: {
              color: 'var(--color-text-light)' // Cor do texto da legenda
          }
          // Outras configs de posição da legenda virão do layout prop
      },
      // Layout responsivo básico
      autosize: true,
      // height: 300, // Altura padrão, pode ser sobrescrita
   };


  // Mescla as configurações padrão com as props recebidas
  const finalLayout = { ...defaultLayout, ...layout };
  const finalConfig = { ...defaultPlotlyConfig, ...config };


  return (
    <div className={styles.chartContainer}> {/* Container para aplicar estilos */}
      {/* O componente Plot renderiza o gráfico */}
      <Plot
        data={data} // Dados do gráfico (array de traces)
        layout={finalLayout} // Configurações de layout
        config={finalConfig} // Configurações gerais do Plotly
        // style={{ width: '100%', height: '100%' }} // Ocupa o container
        style={{ width: '100%', height: layout?.height || 300 }} // Usa altura do layout ou default
      />
    </div>
  );
};

export default StockChart;