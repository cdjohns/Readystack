# syntax=docker/dockerfile:1
#
# Multi-stage build for the ReadyStack web app.
# Uses Next.js "standalone" output (see apps/web/next.config.js) so the
# runtime image only needs the traced server bundle, not the full
# monorepo or pnpm store.

FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY packages/config/package.json packages/config/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/domain/package.json packages/domain/package.json
COPY packages/logger/package.json packages/logger/package.json
COPY packages/ui/package.json packages/ui/package.json
RUN pnpm install --frozen-lockfile

FROM base AS build
COPY --from=deps /app /app
COPY . .
RUN pnpm --filter @readystack/web build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /app/apps/web/public ./apps/web/public
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
