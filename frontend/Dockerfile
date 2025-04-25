# Usa uma imagem Node.js para construir o aplicativo React (Etapa 1)
FROM node:lts-alpine as builder

WORKDIR /app

# Copia package.json e lock file primeiro (para cache)
COPY package.json package-lock.json* ./
# Se você estiver usando yarn, use: COPY package.json yarn.lock ./

# Instala as dependências do Node.js
RUN npm install
# Se você estiver usando yarn, use: RUN yarn install

# Copia o restante do código do frontend
COPY . .

# Constrói o aplicativo React/Vite (Gera a pasta 'dist')
RUN npm run build


# Usa uma imagem Nginx leve para servir os arquivos estáticos (Etapa 2)
FROM nginx:alpine

# Copia os arquivos de construção da pasta 'dist' (da etapa 'builder')
# para o diretório de serviço padrão do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expõe a porta em que o Nginx irá servir (porta padrão HTTP)
EXPOSE 80

# O comando padrão do Nginx já serve arquivos do diretório default
# CMD ["nginx", "-g", "daemon off;"] # Este é o CMD padrão do Nginx, não precisa ser explicitado