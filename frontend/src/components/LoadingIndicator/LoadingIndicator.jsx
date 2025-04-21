// frontend/src/components/LoadingIndicator/LoadingIndicator.jsx

import React from 'react';
import styles from './LoadingIndicator.module.css';

const LoadingIndicator = ({ message = 'Carregando...' }) => {
  return (
    <div className={styles.loadingContainer}>
      {/* Você pode adicionar um spinner CSS aqui ou uma imagem de loading */}
      <div className={styles.spinner}></div> {/* Placeholder para um spinner visual */}
      <p className={styles.loadingText}>{message}</p>
    </div>
  );
};

export default LoadingIndicator;