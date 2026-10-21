# Imagen del backend (Node.js + Express)
FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production

# Instalar dependencias primero para aprovechar la caché de Docker
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar el código fuente
COPY . .

# Carpeta donde se guardan las fotos/firmas
RUN mkdir -p uploads && chown -R node:node /app
USER node

EXPOSE 4000
CMD ["node", "app.js"]
