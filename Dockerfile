# ── Base ─────────────────────────────────────────────────────────────────────
FROM node:20-bookworm-slim AS base
WORKDIR /app
# openssl est requis par Prisma (moteur de requêtes/migration).
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# ── Dépendances (dev incluses pour le build) ─────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ── Build ────────────────────────────────────────────────────────────────────
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate && npm run build

# ── Runner (image finale) ────────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
# On embarque l'application complète : Next (.next), client Prisma généré,
# schéma + migrations, et la CLI Prisma/tsx pour migrer & seeder au démarrage.
COPY --from=build /app ./
EXPOSE 3000
CMD ["npm", "run", "start"]
