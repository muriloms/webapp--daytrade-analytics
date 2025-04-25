:: ./run.bat na raiz do projeto

@echo off
echo Verificando arquivo .env do backend...

if not exist .\backend\.env (
  echo ERRO: Arquivo .\backend\.env não encontrado!
  echo Crie este arquivo e adicione GROQ_API_KEY="sua_chave_groq_aqui" nele.
  exit /b 1
)

echo Construindo e iniciando os contêineres com Docker Compose...
docker compose up --build -d

if %errorlevel% neq 0 (
  echo.
  echo ERRO: Falha ao iniciar os contêineres.
  echo Verifique as mensagens de erro acima.
  exit /b %errorlevel%
)

echo.
echo --------------------------------------------------------
echo Projeto iniciado com sucesso!
echo Backend API acessivel em: http://localhost:8000
echo Frontend App acessivel em: http://localhost
echo --------------------------------------------------------
exit /b 0

:: Para parar os conteineres: docker compose down
:: Para ver os logs: docker compose logs -f