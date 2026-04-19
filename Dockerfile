# ETAPA 1: Construcción (Build)
FROM node:24.11.1-alpine AS build
WORKDIR /usr/src/app

# Instalamos dependencias usando caché para ir más rápido
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copiamos el resto y generamos la carpeta /dist
COPY . .
RUN npm run build

# ETAPA 2: Servidor de Producción (Nginx)
FROM nginx:alpine AS final
# Copiamos los archivos estáticos desde la etapa de build
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Exponemos el puerto 80 (estándar de Nginx)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]