// frontend/src/pages/HomePage/HomePage.jsx

import React from 'react';
import styles from './HomePage.module.css'; // Importa os estilos CSS Module

const HomePage = () => {
  return (
    <div className={styles.homeContainer}> {/* Container da página inicial */}
      <h1 className={styles.title}>Bem-vindo ao Fourbank Financial Analytics</h1>
      <p className={styles.subtitle}>
        Sua plataforma para análise em tempo real do mercado de ações com o poder da Inteligência Artificial.
      </p>
      <div className={styles.contentCard}>
        <p>
          Utilize o menu lateral para navegar:
        </p>
        <ul>
          <li><strong>Análise de Ações:</strong> Obtenha dados históricos, gráficos e insights gerados por IA para tickers específicos.</li>
          <li><strong>Títulos (Em Breve):</strong> Funcionalidade futura para análise de outros instrumentos financeiros.</li>
        </ul>
        <p className={styles.descriptionText}>
          Esta plataforma foi desenvolvida como um projeto demonstrativo utilizando FastAPI para o backend (extração de dados, agentes de IA) e React com Vite para o frontend web (interface do usuário, gráficos interativos).
        </p>
      </div>
       <p className={styles.footerText}>
           Explore as funcionalidades e veja como a análise de dados e a IA podem auxiliar nas suas decisões.
       </p>
    </div>
  );
};

export default HomePage;