// frontend/src/App.jsx

// Importa os componentes necessários do react-router-dom
import { BrowserRouter } from 'react-router-dom'; // Não precisamos mais de Routes e Route aqui

// Importa o componente de Layout
import Layout from './components/Layout/Layout';

// Importa os estilos globais (já feito na Etapa 2.4, mantém aqui)
import './styles/global.css';


function App() {
  return (
    // BrowserRouter habilita o roteamento baseado na URL do navegador
    <BrowserRouter>
      {/* Renderiza o componente de Layout.
          O Layout interno definirá as Routes e renderizará o conteúdo da página. */}
      <Layout />
    </BrowserRouter>
  );
}

// Não precisamos dos estilos padrões gerados pelo Vite para o App.jsx,
// podemos limpar ou remover o arquivo App.css se não o fizemos na Etapa 2.4/2.6.

export default App;