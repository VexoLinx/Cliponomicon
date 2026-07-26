# Usar una imagen ligera de Node.js
FROM node:20-alpine

# Crear el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias para aprovechar la caché de Docker
COPY package*.json ./

# Instalar dependencias (solo producción para reducir tamaño)
RUN npm install --omit=dev

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto que usa la aplicación
EXPOSE 3000

# Comando para arrancar la aplicación
CMD ["node", "src/index.js"]
