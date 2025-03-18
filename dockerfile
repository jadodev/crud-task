# Usa una imagen de Node.js
FROM node:20-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y lockfile
COPY package.json package-lock.json ./
RUN npm install --omit=dev --legacy-peer-deps

# Copiar el resto del código
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]
