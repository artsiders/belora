# =============================================================================
# Stage 1: Base Alpine avec Node 20 & PNPM
# =============================================================================
FROM node:20-alpine AS base

# Dépendances système requises pour Alpine et Prisma
RUN apk add --no-cache libc6-compat openssl wget

# Activation PNPM
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# =============================================================================
# Stage 2: Dépendances & Génération Prisma Client
# =============================================================================
FROM base AS deps
WORKDIR /app

# Copie des manifestes de dépendances et schéma Prisma
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Installation déterministe avec cache pnpm
RUN pnpm install --frozen-lockfile

# Génération du client Prisma
RUN pnpm prisma generate

# =============================================================================
# Stage 3: Build de l'Application Next.js (Mode Standalone)
# =============================================================================
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables de build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Compilation Next.js (standalone output)
RUN pnpm build

# =============================================================================
# Stage 4: Image Finale Légère de Production (Runner Non-Root)
# =============================================================================
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl wget

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Utilisateur système non-root sécurisé
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copie des fichiers publics et statiques
COPY --from=builder /app/public ./public

# Configuration des permissions pour le cache Next.js
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copie des artefacts standalone compilés
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

# Healthcheck natif
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
