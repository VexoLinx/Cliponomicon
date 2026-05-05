# ETAPA 1: Construcción (Build)
FROM node:18-alpine AS build 
WORKDIR /usr/src/app

# Definimos el argumento que recibiremos desde fuera
# Importante: Debe empezar por VITE_ para que Vite lo incluya en el bundle
ARG VITE_API_URL

# Hacemos que la variable esté disponible para el proceso de Node
ENV VITE_API_URL=$VITE_API_URL

# Instalamos dependencias
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copiamos el resto del código
COPY . .

# Al ejecutar build, Vite leerá el ENV VITE_API_URL y lo "quemará" en el JS
RUN npm run build

# ETAPA 2: Servidor de Producción (Nginx)
FROM nginx:alpine AS final
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]