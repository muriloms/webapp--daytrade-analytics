// frontend/src/pages/SettingsPage/SettingsPage.jsx

import React, { useState, useEffect } from 'react'; // Importa useState e useEffect
import styles from './SettingsPage.module.css'; // Importa os estilos CSS Module

// Chave para armazenar/recuperar as configurações no localStorage
export const SETTINGS_STORAGE_KEY = 'dsa_financial_analytics_settings';

const SettingsPage = () => {
  // --- Estado das Configurações ---
  // Define os modelos LLM disponíveis para escolha (IDs Groq)
  const availableModels = [
    { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant' },
    { id: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B Versatile' },
    // Usando um ID comum que existia no código original como terceira opção
    { id: 'deepseek-r1-distill-llama-70b', name: 'DeepSeek 70B (Original)' },
     // Nota: Verifique a disponibilidade atual dos modelos Groq e ajuste aqui.
  ];

  // Estado para controlar se a análise de IA está habilitada
  const [isAIEnabled, setIsAIEnabled] = useState(true); // Default: habilitado

  // Estado para o modelo LLM Groq selecionado
  const [selectedModel, setSelectedModel] = useState(availableModels[0].id); // Default: primeiro modelo da lista
  // --- Fim Estado das Configurações ---


  // --- Efeito para Carregar Configurações do localStorage ---
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setIsAIEnabled(settings.isAIEnabled ?? true); // Use saved value or default true
        // Valida se o modelo salvo ainda está na lista de disponíveis
        const isValidModel = availableModels.some(model => model.id === settings.selectedModel);
        setSelectedModel(isValidModel ? settings.selectedModel : availableModels[0].id); // Use saved valid model or default
      }
    } catch (error) {
      console.error("Erro ao carregar configurações do localStorage:", error);
      // Em caso de erro, usa os valores default definidos no useState
    }
  }, []); // Array de dependências vazio: executa apenas uma vez ao montar o componente


  // --- Efeito para Salvar Configurações no localStorage ---
  useEffect(() => {
    try {
      const settingsToSave = {
        isAIEnabled: isAIEnabled,
        selectedModel: selectedModel,
      };
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsToSave));
      // console.log("Configurações salvas:", settingsToSave); // Log para debug
    } catch (error) {
      console.error("Erro ao salvar configurações no localStorage:", error);
      // Pode-se adicionar um feedback visual para o usuário aqui
    }
  }, [isAIEnabled, selectedModel]); // Array de dependências: executa quando isAIEnabled ou selectedModel mudam


  // --- Handlers de Mudança ---
  const handleToggleAI = () => {
    setIsAIEnabled(prevState => !prevState); // Inverte o estado
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value); // Atualiza o estado com o valor do radio button selecionado
  };
  // --- Fim Handlers de Mudança ---


  return (
    <div className={styles.settingsPageContainer}> {/* Container da página */}
      <h1 className={styles.pageTitle}>Configurações de Análise</h1>

      {/* Seção Habilitar/Desabilitar IA */}
      <div className={styles.settingsSection}>
        <h2 className={styles.sectionTitle}>Inteligência Artificial Groq</h2>
        <label className={styles.toggleLabel}>
          Habilitar Análise de IA:
          {/* Checkbox simples estilizado como toggle se desejar */}
          <input
            type="checkbox"
            className={styles.toggleInput}
            checked={isAIEnabled}
            onChange={handleToggleAI}
          />
          {/* Opcional: adicionar um slider visual customizado aqui */}
        </label>
      </div>

      {/* Seção Escolher Modelo LLM (Visível apenas se IA estiver habilitada) */}
      {isAIEnabled && (
        <div className={styles.settingsSection}>
          <h2 className={styles.sectionTitle}>Escolha do Modelo LLM Groq</h2>
          <p className={styles.sectionDescription}>
            Selecione o modelo de linguagem da Groq a ser utilizado para gerar a análise.
          </p>
          <div className={styles.modelOptions}>
            {availableModels.map(model => (
              <label key={model.id} className={styles.modelOptionLabel}>
                <input
                  type="radio"
                  name="llmModel" // Mesmo nome para que apenas um seja selecionado por vez
                  value={model.id}
                  checked={selectedModel === model.id} // Checa se este radio button está selecionado
                  onChange={handleModelChange} // Chama o handler ao mudar
                  className={styles.radioInput}
                />
                {model.name}
              </label>
            ))}
          </div>
        </div>
      )}

       {/* Opcional: Adicionar uma seção de "Configurações Salvas" exibindo os valores atuais */}
        {/* <div className={styles.settingsSection}>
            <h2 className={styles.sectionTitle}>Configurações Atuais (Debug)</h2>
            <p>IA Habilitada: {isAIEnabled ? 'Sim' : 'Não'}</p>
            <p>Modelo Selecionado: {selectedModel}</p>
        </div> */}

    </div>
  );
};

export default SettingsPage;