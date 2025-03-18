# Usa una imagen de Node.js
FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos del proyecto al contenedor
COPY . .

# Instala las dependencias
RUN npm install

# Instala el CLI de NestJS globalmente
RUN npm install -g @nestjs/cli

# Expón el puerto donde la app correrá
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start"]