# Usa uma imagem base Python leve
FROM python:3.11-slim

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o arquivo de requisitos primeiro para cache
COPY requirements.txt .

# Instala as dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do código da aplicação
COPY src/ ./src/
COPY main.py .

# Expõe a porta em que a aplicação FastAPI irá rodar
EXPOSE 8000

# Comando para iniciar a aplicação FastAPI com Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]