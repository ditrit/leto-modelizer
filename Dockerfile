ARG proxy_url
# Develop stage
FROM node:18.12-alpine as develop-stage
ARG proxy_url
RUN apk update
RUN apk upgrade
RUN apk add git
WORKDIR /app
COPY . .
RUN rm -rf node_modules
RUN npm install -g npm@8.19.2
RUN npm install

# Build stage
FROM develop-stage as build-stage
ARG proxy_url
WORKDIR /app
RUN npm run plugin:install -- repository-name="terrator-plugin" repository-url="https://github.com/ditrit/terrator-plugin.git#0.7.1"
RUN npm run plugin:install -- repository-name="githubator-plugin" repository-url="https://github.com/ditrit/githubator-plugin.git#0.3.0"
RUN npm run plugin:init
RUN npm run build

# Production stage
FROM nginx:1.18.0-alpine as production-stage
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
