// frontend/src/components/AnalysisDisplay/AnalysisDisplay.jsx

import React from 'react';
import ReactMarkdown from 'react-markdown'; // Importa o renderizador de markdown
import styles from './AnalysisDisplay.module.css'; // Importa os estilos CSS Module

const AnalysisDisplay = ({ analysisText }) => {
  // Se não houver texto ou for apenas espaço em branco, não renderiza nada
  if (!analysisText || analysisText.trim() === '') {
    return null;
  }

  return (
    <div className={styles.analysisContainer}>
      <h2 className={styles.analysisTitle}>Análise Gerada Por IA</h2>
      {/* ReactMarkdown renderiza o texto, interpretando markdown */}
      <div className={styles.markdownContent}>
         <ReactMarkdown>
            {analysisText}
         </ReactMarkdown>
      </div>
    </div>
  );
};

export default AnalysisDisplay;