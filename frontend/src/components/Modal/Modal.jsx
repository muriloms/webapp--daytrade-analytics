// frontend/src/components/Modal/Modal.jsx

import React from 'react';
import styles from './Modal.module.css'; // Importa os estilos CSS Module

/**
 * Componente de Modal reutilizável.
 * Exibe um conteúdo em uma sobreposição centralizada na tela.
 *
 * @param {boolean} isOpen - Se o modal está aberto (true) ou fechado (false).
 * @param {function} onClose - Função a ser chamada quando o modal deve ser fechado.
 * @param {React.ReactNode} children - O conteúdo a ser exibido dentro do modal.
 * @returns {JSX.Element|null} O componente modal renderizado ou null se estiver fechado.
 */
const Modal = ({ isOpen, onClose, children }) => {
  // Não renderiza o modal se não estiver aberto
  if (!isOpen) {
    return null;
  }

  // Manipulador para fechar o modal ao clicar no overlay,
  // mas não fechar ao clicar dentro do conteúdo do modal
  const handleOverlayClick = (event) => {
    // Verifica se o clique foi exatamente no overlay, não em um filho
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Renderiza o modal
  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        {/* Opcional: Botão de fechar dentro do modal */}
        {/* <button className={styles.closeButton} onClick={onClose}>X</button> */}
        {children} {/* Renderiza o conteúdo passado via props */}
      </div>
    </div>
  );
};

export default Modal;