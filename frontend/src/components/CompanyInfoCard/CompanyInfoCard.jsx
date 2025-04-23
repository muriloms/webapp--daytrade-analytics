// frontend/src/components/CompanyInfoCard/CompanyInfoCard.jsx

import React from 'react';
import styles from './CompanyInfoCard.module.css'; // Importa os estilos CSS Module

/**
 * Componente para exibir informações básicas da empresa em um card.
 *
 * @param {Object|null} companyInfo - Objeto com informações da empresa (ex: { shortName: '...', sector: '...' }).
 * @returns {JSX.Element|null} O componente renderizado ou null se não houver dados.
 */
const CompanyInfoCard = ({ companyInfo }) => {
  // Não renderiza nada se não houver dados da empresa válidos
  if (!companyInfo || Object.keys(companyInfo).length === 0) {
    return (
       <div className={styles.companyInfoContainer}> {/* Usar o mesmo container para mensagem */}
           <p className={styles.infoUnavailable}>Informações da empresa não disponíveis.</p>
       </div>
    );
  }

  // Extrai os campos do objeto companyInfo (use .? para acessar seguro caso um campo falhe)
  const {
    shortName,
    longName,
    sector,
    industry,
    fullTimeEmployees,
    website,
    marketCap,
    country
  } = companyInfo; // Desestruturação dos campos esperados

  // Formata Market Cap para melhor legibilidade (ex: $1.23B)
  const formatMarketCap = (cap) => {
      if (cap === undefined || cap === null) return 'N/A';
      if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
      if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
      if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
      return `$${cap.toFixed(2)}`;
  };

   // Formata Número de Funcionários
   const formatEmployees = (employees) => {
       if (employees === undefined || employees === null) return 'N/A';
       return employees.toLocaleString(); // Adiciona separadores de milhar
   };


  return (
    // O container principal será envolvido pela classe .dashboardCard na página que o usa
    <div className={styles.companyInfoContainer}>
      {/* Título do Card (Nome da Empresa) */}
      <h2 className={styles.companyName}>{shortName || longName || 'Empresa Desconhecida'}</h2>
      {/* Nome completo (opcional, se for diferente do curto) */}
      {longName && longName !== shortName && (
         <p className={styles.longName}>{longName}</p>
      )}


      {/* Detalhes da Empresa em um formato de lista ou blocos */}
      <div className={styles.detailsGrid}> {/* Usa Grid Interno para detalhes */}
          {sector && (
              <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Setor:</span>
                  <span className={styles.detailValue}>{sector}</span>
              </div>
          )}
          {industry && (
               <div className={styles.detailItem}>
                   <span className={styles.detailLabel}>Indústria:</span>
                   <span className={styles.detailValue}>{industry}</span>
               </div>
           )}
           {country && (
               <div className={styles.detailItem}>
                   <span className={styles.detailLabel}>País:</span>
                   <span className={styles.detailValue}>{country}</span>
               </div>
           )}
          {fullTimeEmployees !== undefined && fullTimeEmployees !== null && (
               <div className={styles.detailItem}>
                   <span className={styles.detailLabel}>Funcionários:</span>
                   <span className={styles.detailValue}>{formatEmployees(fullTimeEmployees)}</span>
               </div>
           )}
           {marketCap !== undefined && marketCap !== null && (
                <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Market Cap:</span>
                    <span className={styles.detailValue}>{formatMarketCap(marketCap)}</span>
                </div>
            )}
            {website && (
                 <div className={styles.detailItemFull}> {/* Item que ocupa largura total se o grid tiver 2 colunas */}
                     <span className={styles.detailLabel}>Website:</span>
                     {/* Link para o website */}
                     <a href={website} target="_blank" rel="noopener noreferrer" className={styles.detailValueLink}>
                         {website.replace(/^https?:\/\/(www\.)?/, '')} {/* Exibe URL limpa */}
                     </a>
                 </div>
             )}
             {/* Opcional: Resumo longo do negócio (longBusinessSummary) */}
             {/* {longBusinessSummary && (
                 <div className={`${styles.detailItemFull} ${styles.businessSummary}`}>
                      <span className={styles.detailLabel}>Resumo:</span>
                      <p className={styles.detailValue}>{longBusinessSummary}</p>
                 </div>
             )} */}
      </div>

    </div>
  );
};

export default CompanyInfoCard;