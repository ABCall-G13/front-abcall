# Etapa 1: Construcción de la aplicación React
FROM node:20-alpine3.18 AS build
WORKDIR /app

# Aceptar argumento de construcción para la variable de entorno
ARG REACT_APP_BASE_URL

ARG REACT_APP_USER_SERVICE_URL

# Configurar la variable de entorno para la compilación de React
ENV REACT_APP_BASE_URL=$REACT_APP_BASE_URL

ENV REACT_APP_USER_SERVICE_URL=$REACT_APP_USER_SERVICE_URL

# Copiar archivos de configuración
COPY package*.json tsconfig.json ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente
COPY src ./src
COPY public ./public

# Construir la aplicación para producción
RUN npm run build

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine AS production

# Copiar los archivos construidos desde la etapa anterior
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 8080
EXPOSE 8080

# Iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
