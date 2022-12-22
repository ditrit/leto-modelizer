ARG proxy_url
# Develop stage
FROM node:18.12-alpine as develop-stage
ARG proxy_url
WORKDIR /app
COPY . .
RUN npm install -g npm@8.19.2
RUN npm install

# Build stage
FROM develop-stage as build-stage
ARG proxy_url
WORKDIR /app
RUN CORS_ISOMORPHIC_BASE_URL="${proxy_url}" npm run build

# Production stage
FROM nginx:1.18.0-alpine as production-stage
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
