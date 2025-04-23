// frontend/src/components/AnalysisDisplay/AnalysisDisplay.jsx

import React, { useState } from 'react'; // Importa useState
import ReactMarkdown from 'react-markdown';
import styles from './AnalysisDisplay.module.css';
// --- NOVO: Importa o componente Modal ---
import Modal from '../Modal/Modal'; // O caminho é '..' pois Modal está um nível acima
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';


// Define o limite de frases a serem exibidas no card inicial
const SENTENCE_LIMIT = 1;

/**
 * Componente para exibir texto de análise gerado por IA, com truncamento e opção de ler mais em modal.
 *
 * @param {string|null} analysisText - O texto completo da análise (pode conter markdown).
 * @returns {JSX.Element|null} O componente renderizado ou null se não houver texto.
 */
const AnalysisDisplay = ({ analysisText }) => {
  // --- NOVO: Estado para controlar o modal de texto completo ---
  const [showFullModal, setShowFullModal] = useState(false);
  // --- Fim Estado do Modal ---

  // Não renderiza nada se não houver texto ou for apenas espaço em branco
  if (!analysisText || analysisText.trim() === '') {
    return null;
  }

  // --- NOVO: Lógica de Truncamento ---
  // Uma forma simples de tentar truncar por frases. Pode não ser perfeita para todos os textos.
  // Busca por texto que não seja . ! ? seguido por . ! ?
  const sentences = analysisText.match(/[^.!?]+[.!?]+/g) || [];

  let isTruncated =true// sentences.length > SENTENCE_LIMIT;
  let textToDisplay = analysisText; // Começa com o texto completo
  console.log(`Texto original: ${analysisText}`);
  if (isTruncated) {
      // Junta as primeiras SENTENCE_LIMIT frases e adiciona "..."
      textToDisplay = sentences.slice(0, SENTENCE_LIMIT).join(' ').trim() + '...';
  }
  // --- Fim Lógica de Truncamento ---


  // --- NOVO: Handlers do Modal de Texto Completo ---
  const handleReadMoreClick = () => {
      setShowFullModal(true); // Abre o modal
  };

  const handleCloseModal = () => {
      setShowFullModal(false); // Fecha o modal
  };
  // --- Fim Handlers do Modal ---


  return (
    <div className={styles.analysisContainer}>
      <h2 className={styles.analysisTitle}>Análise Gerada Por IA</h2>
      {/* Renderiza o texto (truncado ou completo no card) usando ReactMarkdown */}
      <div className={styles.markdownContent}>
      <ErrorBoundary>
            <ReactMarkdown children={textToDisplay}>
            </ReactMarkdown>
         </ErrorBoundary>
      </div>

      {/* --- NOVO: Botão "Leia mais..." --- */}
      {/* Mostra o botão somente se o texto original foi truncado */}
      {isTruncated && (
          <button
              className={styles.readMoreButton}
              onClick={handleReadMoreClick}
          >
              Leia mais...
          </button>
      )}
      {/* --- Fim NOVO --- */}

      {/* --- NOVO: Renderiza o Modal com o texto completo --- */}
      {/* Renderiza o Modal SOMENTE se showFullModal for true */}
      {showFullModal && (
          <Modal isOpen={showFullModal} onClose={handleCloseModal}>
              {/* Conteúdo do modal: Título e o texto completo renderizado com ReactMarkdown */}
              <div className={styles.fullAnalysisModalContent}> {/* Container para o conteúdo do modal */}
                 <h2 className={styles.modalTitle}>Análise Completa</h2> {/* Título no modal */}
                 <div className={styles.markdownFullContent}> {/* Container para o texto completo */}
                    <ErrorBoundary>
                      <ReactMarkdown children={analysisText}>
                      </ReactMarkdown>
                  </ErrorBoundary>
                 </div>
              </div>
          </Modal>
      )}
      {/* --- Fim NOVO: Renderiza o Modal --- */}

    </div>
  );
};

export default AnalysisDisplay;