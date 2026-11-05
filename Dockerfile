FROM node:16-bullseye-slim AS build
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci --no-audit --no-fund
COPY tsconfig*.json tslint.json images.d.ts ./
COPY public ./public
COPY src ./src
ENV PUBLIC_URL=/
RUN npm run build

FROM nginxinc/nginx-unprivileged:stable-alpine
COPY deploymentstuff/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
