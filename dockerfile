# Usa una imagen de Node.js con PNPM habilitado
FROM node:20

# Configura el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos necesarios para instalar dependencias
COPY package.json pnpm-lock.yaml ./

# Habilita Corepack para usar PNPM
RUN corepack enable \
  && pnpm install --frozen-lockfile

# Copia el resto del código
COPY . .

# Expone el puerto en el que corre la app NestJS
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["pnpm", "start"]
