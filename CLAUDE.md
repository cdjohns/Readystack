# Claude Code Guidance for ReadyStack

You are working in the ReadyStack repository.

ReadyStack is a reusable production application baseline and development operating model for TypeScript applications.

## Core Rules

- Prefer clarity over cleverness.
- Prefer a modular monolith unless there is a clear reason to split services.
- Keep business logic in version-controlled Node.js TypeScript modules.
- Do not scatter business rules across React components, Terraform, database triggers, GitHub Actions, or cloud functions.
- Keep infrastructure, deployment automation, application code, and documentation as separate concerns.
- Make small, reviewable changes.
- Work from explicit specs or tickets.
- Run validation commands before declaring work complete.
- Surface uncertainty instead of guessing.
- Update documentation when changing architecture, infrastructure, workflows, or developer procedures.

## Default Technology Direction

- TypeScript
- Node.js
- Next.js
- pnpm monorepo
- Docker
- AWS
- Terraform
- GitHub Actions
- ECS Fargate
- ECR
- RDS PostgreSQL
- S3
- Secrets Manager or SSM Parameter Store
- CloudWatch
- Route 53
- ACM

## Branch Model

ReadyStack uses a LifeCloud-style dual-track branch model.

- `release` is the next deployable release branch.
- `master` is the future integration branch.
- All implementation work starts on a dev branch.
- The dev branch is merged into `release` through a PR.
- A master-merge branch is created from the same dev branch and merged into `master` through a separate PR.
- During major releases, `release` is recreated from `master`.

Never commit directly to `release` or `master`.
