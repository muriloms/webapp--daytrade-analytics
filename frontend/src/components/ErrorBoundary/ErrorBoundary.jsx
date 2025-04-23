// frontend/src/components/ErrorBoundary/ErrorBoundary.jsx

import React from 'react';
// Importa estilos locais para a UI de fallback
import styles from './ErrorBoundary.module.css';

/**
 * Componente Error Boundary para capturar erros na árvore de componentes filhos.
 * Exibe uma UI de fallback em caso de erro de renderização.
 *
 * @extends React.Component
 */
class ErrorBoundary extends React.Component {
  /**
   * Construtor da classe.
   * @param {object} props - As props do componente.
   */
  constructor(props) {
    super(props);
    // Define o estado inicial: sem erro
    this.state = { hasError: false, error: null };
  }

  /**
   * Método estático que é chamado se um erro ocorrer durante a renderização de um componente filho.
   * Retorna um objeto para atualizar o estado e fazer com que a próxima renderização exiba a UI de fallback.
   * @param {Error} error - O erro que foi lançado.
   * @returns {{ hasError: true, error: Error }} Objeto para atualizar o estado.
   */
  static getDerivedStateFromError(error) {
    // Atualiza o estado para que a próxima renderização mostre a UI de fallback
    return { hasError: true, error: error };
  }

  /**
   * Método chamado após um erro ser capturado. Usado para realizar efeitos colaterais, como logar informações do erro.
   * Este método é chamado na fase de "commit", após a renderização do fallback.
   * @param {Error} error - O erro que foi lançado.
   * @param {React.ErrorInfo} errorInfo - Objeto contendo informações sobre o componente que lançou o erro (ex: componentStack).
   */
  componentDidCatch(error, errorInfo) {
    // Você pode logar o erro para um serviço de relatório de erros
    console.error("ErrorBoundary capturou um erro:", error, errorInfo);
    // Opcional: você pode querer salvar mais detalhes do erro no estado
    // para exibi-los na UI de fallback (especialmente em ambiente de desenvolvimento)
    // this.setState({ errorInfo: errorInfo });
  }

  /**
   * O método renderiza a UI do componente.
   * @returns {React.ReactNode} A UI a ser renderizada.
   */
  render() {
    // Se o estado indicar que houve um erro...
    if (this.state.hasError) {
      // Renderiza uma UI de fallback customizada.
      return (
        <div className={styles.errorFallback}>
          <h3 className={styles.errorTitle}>Algo deu errado ao renderizar este conteúdo.</h3>
          <p className={styles.errorMessage}>Não foi possível exibir esta seção devido a um erro inesperado.</p>
          {/* Opcional: Mostrar detalhes do erro em ambiente de desenvolvimento */}
          {/* {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ whiteSpace: 'pre-wrap', color: 'var(--color-error)' }}>
                  <summary>Detalhes do Erro:</summary>
                  {this.state.error.message}
                  <br />
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
              </details>
          )} */}
        </div>
      );
    }

    // Se não houver erro, renderiza os componentes filhos normalmente.
    return this.props.children;
  }
}

export default ErrorBoundary;