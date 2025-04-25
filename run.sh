#!/bin/bash

# script `./run.sh` na raiz do projeto

# Define a variável de ambiente DOCKER_BUILDKIT=1 para usar a nova engine de build
# (Geralmente já habilitado, mas bom para garantir multi-stage builds otimizados)
export DOCKER_BUILDKIT=1

# Verifica se o arquivo .env existe na pasta backend e avisa se não
if [ ! -f ./backend/.env ]; then
  echo "ERRO: Arquivo ./backend/.env não encontrado!"
  echo "Crie este arquivo e adicione GROQ_API_KEY=\"sua_chave_groq_aqui\" nele."
  exit 1
fi

# Constrói as imagens (se necessário) e inicia os serviços definidos no docker-compose.yml
# -d: Executa os contêineres em modo detached (em segundo plano)
# --build: Garante que as imagens sejam construídas antes de iniciar (útil para a primeira vez ou após mudanças no código/dockerfile)
echo "Construindo e iniciando os contêineres com Docker Compose..."
docker compose up --build -d

# Verifica se os contêineres foram iniciados com sucesso (opcional)
if [ $? -eq 0 ]; then
  echo ""
  echo "--------------------------------------------------------"
  echo "Projeto iniciado com sucesso!"
  echo "Backend API acessível em: http://localhost:8000"
  echo "Frontend App acessível em: http://localhost"
  echo "--------------------------------------------------------"
else
  echo ""
  echo "ERRO: Falha ao iniciar os contêineres."
  echo "Verifique as mensagens de erro acima."
fi

# Para parar os contêineres: docker compose down
# Para ver os logs: docker compose logs -f