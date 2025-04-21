// frontend/src/constants/config.js

// URL base da sua API Backend
// Se o backend estiver rodando localmente na porta 8000 (padrão do Uvicorn), use:
const API_BASE_URL = 'http://localhost:8000';

// Se você precisar acessar de outro dispositivo na rede local
// (ex: celular físico testando um web app no navegador do celular)
// substitua 'localhost' pelo IP da sua máquina na rede local (ex: 'http://192.168.1.100:8000')
// Em produção, esta URL seria a URL do seu backend online.


export {
  API_BASE_URL
};