FROM node:20-alpine as builder

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm ci

# Copie du code source et build TypeScript
COPY . .
RUN npm run build

FROM node:20-alpine as runner

WORKDIR /app

ENV NODE_ENV=production

# Copie de la build TypeScript
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Installation uniquement des dépendances de runtime
RUN npm ci --omit=dev

# Création d'un volume pour la base de données SQLite
RUN mkdir -p /app/data
VOLUME ["/app/data"]

EXPOSE 3001

CMD ["node", "dist/app.js"]
