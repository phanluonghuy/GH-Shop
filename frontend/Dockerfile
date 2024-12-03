FROM node:22.7.0-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Disable telemetry to reduce unnecessary logs
ENV NEXT_TELEMETRY_DISABLED=1

# Disable SWC Minification (optional)
RUN echo 'module.exports = { swcMinify: false }' > next.config.js

RUN npm run build

FROM node:22.7.0-alpine

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 3000

CMD ["npm", "run", "start"]
