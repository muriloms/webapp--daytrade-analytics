// frontend/src/components/Layout/Layout.jsx

// Importa NavLink (em vez de apenas Link) e os outros componentes necessários
import { NavLink, Routes, Route } from 'react-router-dom';
import styles from './Layout.module.css';

// Importa as páginas que serão renderizadas no conteúdo
import HomePage from '../../pages/HomePage/HomePage';
import StockAnalysisPage from '../../pages/StockAnalysisPage/StockAnalysisPage';
// Importa a nova página de Configurações
import SettingsPage from '../../pages/SettingsPage/SettingsPage'; // Importa a página de Configurações


const Layout = () => {

  // Função para determinar se o link está ativo e aplicar a classe de estilo
  const getNavLinkClass = ({ isActive }) => {
    return `${styles.navLink} ${isActive ? styles.active : ''}`;
  };

  return (
    <div className={styles.layoutContainer}> {/* Container principal (Flex) */}

      {/* Barra Lateral (Menu) */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
             <h2 className={styles.appTitle}>DSA Analytics</h2>
        </div>
        <nav className={styles.navigation}>
          <ul>
            {/* Link para a Página Inicial */}
            <li>
              <NavLink to="/" className={getNavLinkClass} end>
                Início
              </NavLink>
            </li>
            {/* Link para a Página de Análise de Ações */}
            <li>
              <NavLink to="/stocks" className={getNavLinkClass}>
                Análise de Ações
              </NavLink>
            </li>
            {/* Placeholder para futuras páginas */}
            <li>
              <NavLink to="/bonds" className={getNavLinkClass}>
                Títulos (Em Breve)
              </NavLink>
            </li>
            {/* --- NOVO: Link para a Página de Configurações --- */}
            <li>
              <NavLink to="/settings" className={getNavLinkClass}>
                Configurações
              </NavLink>
            </li>
            {/* --- FIM NOVO --- */}
          </ul>
        </nav>
         {/* Rodapé da Sidebar */}
         <div className={styles.sidebarFooter}>
             <p>© 2023 DSA</p>
         </div>
      </aside>

      {/* Área de Conteúdo Principal */}
      <main className={styles.mainContent}>
        {/* As rotas permanecem aqui */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stocks" element={<StockAnalysisPage />} />
          {/* --- NOVO: Rota para a Página de Configurações --- */}
          <Route path="/settings" element={<SettingsPage />} /> {/* Adiciona a rota para SettingsPage */}
          {/* --- FIM NOVO --- */}
          {/* Rotas futuras... */}
          {/* <Route path="/bonds" element={<BondsPage />} /> */}

           {/* Rota 404 */}
           <Route path="*" element={<div className={styles.notFound}>404 Página Não Encontrada</div>} />
        </Routes>
      </main>

    </div>
  );
};

export default Layout;