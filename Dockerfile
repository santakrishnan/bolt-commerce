# syntax=docker/dockerfile:1

# Base stage - install dependencies
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.29.2 --activate
WORKDIR /app
ENV PNPM_HOME=/usr/local/bin

# Dependencies stage
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/
COPY packages/ui-theme/package.json ./packages/ui-theme/
COPY packages/utils/package.json ./packages/utils/
COPY packages/config/typescript/package.json ./packages/config/typescript/
COPY packages/config/vitest/package.json ./packages/config/vitest/

RUN pnpm install --frozen-lockfile --prefer-offline

# Builder stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build all packages and apps
RUN pnpm build

# Remove dev dependencies
RUN pnpm prune --prod

# Runner stage - production image
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
