FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json* ./

RUN npm ci

COPY . .

RUN npm run build -- --configuration production

FROM nginx:1.25-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist/sakai-ng /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    find /usr/share/nginx/html -type f -print0 | xargs -0 chmod 644


COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
