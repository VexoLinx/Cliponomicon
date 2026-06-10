# --- ETAPA DE CONSTRUCCIÓN DEL FRONTEND ---
FROM node:20-alpine AS frontend-build
WORKDIR /usr/src/app
# 1. Definir argumentos primero
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
# 2. Copiar archivos de dependencias
COPY package.json package-lock.json ./
# 3. Instalar (sin los montajes complejos por ahora para descartar fallos de red/permisos)
RUN npm ci

# 4. Copiar el resto y compilar
COPY . .
RUN npm run build

# --- ETAPA FINAL: FRONTEND (NGINX) ---
FROM nginx:alpine AS frontend
COPY --from=frontend-build /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# --- ETAPA FINAL: BRIDGE (NODE.JS) ---
FROM node:20-alpine AS bridge
WORKDIR /app

# Copiamos desde la carpeta Api_puente
COPY Api_puente/package*.json ./
RUN npm install --omit=dev

COPY Api_puente/ .

EXPOSE 3000
CMD ["node", "src/index.js"]
