# ReadyStack

ReadyStack is a reusable production application development blueprint and baseline repository for TypeScript web applications.

It is designed to provide a practical starting point for:

- Local development
- Application architecture
- Testing
- Docker-based deployment
- AWS infrastructure
- Terraform
- GitHub Actions CI/CD
- Release and rollback procedures
- Claude Code-assisted development workflows

## Repository Status

This repository contains the first runnable ReadyStack baseline (RS-0004): a pnpm workspace with a minimal Next.js app, shared TypeScript packages, Docker build, and local PostgreSQL via Docker Compose. No authentication, ORM, migration tool, or production infrastructure has been selected yet.

## Prerequisites

- Git
- Node.js 22 (see `.nvmrc`)
- pnpm (see `packageManager` in `package.json`)
- Docker
- Docker Compose

## Install Dependencies

```bash
pnpm install
```

## Start Local Dependencies

Start local PostgreSQL (the web app does not use it yet, but the service is available for future work):

```bash
docker compose up -d postgres
docker compose ps
```

## Run Development Server

```bash
pnpm dev
```

The app is available at:

```text
http://localhost:3000
```

The health check route is available at:

```text
http://localhost:3000/api/health
```

## Run Validation Commands

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm format
docker build -t readystack:local .
docker compose up -d postgres
docker compose ps
```

`pnpm format:write` will reformat files in place.

## Repository Structure

```text
apps/web/        Next.js app (@readystack/web)
packages/config/  Typed environment helpers (@readystack/config)
packages/logger/  Minimal structured logger (@readystack/logger)
packages/domain/  Placeholder for future business logic (@readystack/domain)
packages/db/      Placeholder for future database access (@readystack/db)
packages/ui/      Placeholder for shared UI (@readystack/ui)
db/migrations/    Reserved for a future migration tool
db/seeds/         Reserved for future local seed data
```

## Docker

The root `Dockerfile` builds `apps/web` using a multi-stage pnpm build and Next.js [standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output), so the runtime image only contains the traced server bundle rather than the full monorepo.

```bash
docker build -t readystack:local .
docker run --rm -p 3000:3000 readystack:local
```

## Branch Model

ReadyStack uses a dual-track branch model:

- `release` represents the next deployable release.
- `master` represents the future integration line.
- Code changes are developed on dev branches.
- Dev branches are merged into `release` through pull requests.
- A master-merge branch is created from the same dev branch and merged into `master`.
- During major release resets, `release` is recreated from `master`.

## Claude Code Workflow Summary

ReadyStack Claude Code commands use the `/rs-*` prefix (see `.claude/commands/`) to drive the spec-first workflow: `/rs-ticket`, `/rs-spec`, `/rs-implement`, `/rs-pr-check`, `/rs-review`, `/rs-master-merge`, `/rs-deploy-check`, `/rs-release-reset`, `/rs-onboard`, `/rs-state`.

## Troubleshooting

- **`pnpm install` fails with a version error**: confirm your local Node.js version matches `.nvmrc` and that pnpm is installed (`corepack enable` is usually sufficient).
- **`next dev` can't reach the database**: this baseline does not connect the web app to PostgreSQL yet; `docker compose ps` should still show `postgres` running and accepting connections on `5432`.
- **Docker build fails copying `apps/web/public`**: that directory must exist (even if empty) for the Dockerfile's `COPY` step to succeed.
- **Port `3000` or `5432` already in use**: stop the conflicting process or change the published port mapping locally (do not commit port changes meant only for your machine).

## Command Prefix

ReadyStack Claude Code commands use the `/rs-*` prefix.
