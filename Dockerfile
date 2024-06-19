# Étape 1 : Construction de l'application Vue.js
FROM node:14-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Configuration Nginx pour servir l'application
FROM nginx:stable-alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copier la configuration Nginx
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copier les certificats SSL
COPY nginx/ssl/nginx.crt /etc/nginx/ssl/nginx.crt
COPY nginx/ssl/nginx.key /etc/nginx/ssl/nginx.key

# Exposer les ports 80 et 443 pour HTTP et HTTPS respectivement
EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
