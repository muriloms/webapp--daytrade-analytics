// frontend/src/components/Layout/Layout.jsx

// Importa NavLink e os outros componentes necessários
import { NavLink, Routes, Route } from 'react-router-dom';
import styles from './Layout.module.css';

// Importa as páginas que serão renderizadas no conteúdo
import HomePage from '../../pages/HomePage/HomePage';
import StockAnalysisPage from '../../pages/StockAnalysisPage/StockAnalysisPage';
import SettingsPage from '../../pages/SettingsPage/SettingsPage';
// --- NOVO: Importa a página de CriptoAnálise ---
import CryptoAnalysisPage from '../../pages/CryptoAnalysisPage/CryptoAnalysisPage';


const Layout = () => {

  // Função para determinar se o link está ativo e aplicar a classe de estilo
  const getNavLinkClass = ({ isActive }) => {
    return `${styles.navLink} ${isActive ? styles.active : ''}`;
  };

  return (
    <div className={styles.layoutContainer}>
      {/* Barra Lateral (Menu) */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
             <h2 className={styles.appTitle}>Fourbank Analytics</h2>
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
            {/* --- NOVO: Link para a Página de CriptoAnálise --- */}
             <li>
              <NavLink to="/crypto" className={getNavLinkClass}>
                Análise de Cripto
              </NavLink>
            </li>
            {/* --- FIM NOVO --- */}
            {/* Placeholder para futuras páginas */}
            <li>
              <NavLink to="/bonds" className={getNavLinkClass}>
                Títulos (Em Breve)
              </NavLink>
            </li>
            {/* Link para a Página de Configurações */}
            <li>
              <NavLink to="/settings" className={getNavLinkClass}>
                Configurações
              </NavLink>
            </li>
          </ul>
        </nav>
         {/* Rodapé da Sidebar */}
         <div className={styles.sidebarFooter}>
             <p>© 2025 Foursys | Lab Un 2</p>
         </div>
      </aside>

      {/* Área de Conteúdo Principal */}
      <main className={styles.mainContent}>
        {/* As rotas permanecem aqui */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stocks" element={<StockAnalysisPage />} />
          {/* --- NOVO: Rota para a Página de CriptoAnálise --- */}
          <Route path="/crypto" element={<CryptoAnalysisPage />} /> {/* Adiciona a rota para CryptoAnalysisPage */}
          {/* --- FIM NOVO --- */}
          {/* Rota para a Página de Configurações */}
          <Route path="/settings" element={<SettingsPage />} />
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