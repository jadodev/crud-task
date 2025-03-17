# Usa una imagen oficial de Node.js
FROM node:20-alpine

# Instala PNPM globalmente
RUN corepack enable && corepack prepare pnpm@latest --activate

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instala solo dependencias de producción
RUN pnpm install --prod

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto (ajusta si usas otro)
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["pnpm", "start:prod"]
