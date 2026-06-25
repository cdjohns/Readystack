# RS-0003: Runnable Baseline Monorepo Specification

## Goal

Define the first runnable ReadyStack baseline monorepo.

This spec describes the minimal application, package, local development, Docker, environment, documentation, and validation structure that should be implemented in the next change.

RS-0003 is a specification only. The actual implementation should happen in RS-0004.

## Context

ReadyStack is both:

1. A reusable production application development blueprint.
2. A baseline repository that demonstrates and enforces that blueprint.

The repository already has:

* Initial foundation definition.
* Claude Code operating guidance.
* LifeCloud-style branch workflow.
* Documentation structure.
* Claude command directory structure.
* Initial app, package, infrastructure, database, script, and workflow directories.

The next step is to define the smallest useful runnable baseline so Claude Code can implement it without inventing the architecture.

The baseline should be simple, but it should establish a production-shaped structure that future ReadyStack work can build on.

## Scope

This spec defines the target structure and behavior for the first runnable ReadyStack baseline.

Included:

* pnpm workspace structure.
* Root package scripts.
* Minimal Next.js web app.
* Shared TypeScript package scaffolding.
* TypeScript configuration.
* ESLint and Prettier baseline.
* Vitest testing baseline.
* Dockerfile for the web app.
* Docker Compose with local PostgreSQL.
* Environment variable example.
* Health check route.
* README local development instructions.
* Validation commands.
* Acceptance criteria for RS-0004 implementation.

Not included:

* Real product domain.
* Authentication provider.
* Authorization model.
* ORM or query builder decision.
* Migration tool decision.
* Production Terraform resources.
* GitHub Actions workflows.
* ECS deployment.
* RDS implementation.
* ECR implementation.
* Secrets Manager or SSM integration.
* CloudWatch dashboards.
* Preview environments.
* Background jobs.
* Email provider.
* Feature flags.

## Non-Goals

RS-0004 should not turn the baseline into a real product application.

Do not introduce:

* User accounts.
* Login flows.
* Organization or tenant concepts.
* Product-specific business objects.
* Real database schema beyond placeholder directories.
* Production AWS resources.
* Real secrets.
* Complex UI systems.
* A custom design system.
* Complex test infrastructure.
* End-to-end testing.
* External service integrations.

The purpose of the runnable baseline is to prove the repository structure, local development path, build path, Docker path, and validation commands.

## Required Repository Shape

The implementation should preserve and begin to populate this structure:

```text
readystack/
  apps/
    web/
  packages/
    config/
    db/
    domain/
    logger/
    ui/
  db/
    migrations/
    seeds/
  docs/
    specs/
  Dockerfile
  docker-compose.yml
  package.json
  pnpm-workspace.yaml
  tsconfig.base.json
  .env.example
  .gitignore
  README.md
```

The implementation may add supporting files where needed, such as:

```text
.eslintrc.cjs
.prettierrc
.prettierignore
.vitest/
vitest.config.ts
```

or equivalent modern configuration files.

Any added files should be justified by the baseline requirements.

## Package Manager

ReadyStack must use `pnpm`.

Required root files:

```text
package.json
pnpm-workspace.yaml
```

The workspace must include:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

The implementation should avoid npm, Yarn, and mixed package manager lockfiles.

Expected lockfile:

```text
pnpm-lock.yaml
```

Do not commit:

```text
package-lock.json
yarn.lock
```

## Node.js Version

The baseline should use a current LTS-compatible Node.js version.

Recommended default:

```text
Node.js 22
```

The implementation should add an `.nvmrc` file:

```text
22
```

The README should instruct developers to use the configured Node.js version.

## Root Package Configuration

The root `package.json` should define the repository as private:

```json
{
  "private": true
}
```

It should include a package manager declaration similar to:

```json
{
  "packageManager": "pnpm@10.25.0"
}
```

If the exact local pnpm version differs, use the version installed and document it.

## Root Package Scripts

The root `package.json` should provide a consistent command surface.

Required scripts:

```json
{
  "dev": "pnpm --filter @readystack/web dev",
  "build": "pnpm -r build",
  "typecheck": "pnpm -r typecheck",
  "lint": "pnpm -r lint",
  "test": "pnpm -r test",
  "format": "prettier --check .",
  "format:write": "prettier --write ."
}
```

Recommended additional scripts:

```json
{
  "docker:build": "docker build -t readystack:local .",
  "compose:up": "docker compose up -d postgres",
  "compose:down": "docker compose down",
  "compose:logs": "docker compose logs -f postgres"
}
```

The implementation should not create scripts that pretend to validate something they do not validate.

If a script is intentionally minimal, that should be acceptable, but it must still execute successfully.

## Package Naming

Use scoped package names:

```text
@readystack/web
@readystack/config
@readystack/db
@readystack/domain
@readystack/logger
@readystack/ui
```

Each package should set `"private": true` unless there is a specific reason not to.

## Next.js App Baseline

Create a minimal Next.js application under:

```text
apps/web/
```

The app should:

* Use TypeScript.
* Use the App Router.
* Provide a simple home page.
* Provide a health check route.
* Be runnable locally with `pnpm dev`.
* Be buildable with `pnpm build`.
* Use package name `@readystack/web`.

Minimum routes:

```text
/
 /api/health
```

The home page should identify the app as ReadyStack and indicate that the baseline app is running.

The health check route should return JSON similar to:

```json
{
  "status": "ok",
  "service": "readystack-web"
}
```

The health route:

* Must not require authentication.
* Must not require database access in this baseline.
* Must be suitable for future load balancer, smoke test, and deployment health checks.

Recommended health route response fields:

```json
{
  "status": "ok",
  "service": "readystack-web",
  "environment": "development"
}
```

The implementation may include `environment` only if configuration handling is already clean.

## Next.js App Configuration

The app should include a minimal Next.js configuration.

Recommended files:

```text
apps/web/package.json
apps/web/next.config.js
apps/web/tsconfig.json
apps/web/app/page.tsx
apps/web/app/api/health/route.ts
```

If the implementation uses `src/app` instead of `app`, it must do so consistently and document the choice.

Preferred default:

```text
apps/web/app/
```

This keeps the baseline simple.

## Shared Package Baseline

Create minimal package scaffolding for:

```text
packages/config
packages/db
packages/domain
packages/logger
packages/ui
```

Each package should include:

```text
package.json
src/index.ts
tsconfig.json
```

Each package should have scripts compatible with the root recursive commands:

```json
{
  "build": "tsc -p tsconfig.json",
  "typecheck": "tsc -p tsconfig.json --noEmit",
  "lint": "eslint .",
  "test": "vitest run --passWithNoTests"
}
```

If package build outputs are created, they should go to `dist/` and should be ignored by Git.

## `@readystack/config`

Purpose:

Provide typed access to configuration values.

Baseline behavior:

* Export a minimal environment helper.
* Avoid a full configuration framework.
* Avoid loading secrets directly.
* Avoid production-specific assumptions.

Example responsibilities:

```text
getNodeEnv()
getAppEnv()
```

The package may expose a simple `AppEnvironment` type.

Do not introduce a validation library such as Zod unless specifically approved or justified in RS-0004.

## `@readystack/logger`

Purpose:

Provide a minimal logger abstraction.

Baseline behavior:

* Console-backed logging is acceptable.
* Log entries should be structured enough to evolve toward production logging.
* Avoid adding a heavy logging dependency too early.

Example exported API:

```ts
logger.info("message", { key: "value" });
logger.warn("message", { key: "value" });
logger.error("message", { key: "value" });
```

Do not introduce external log shipping.

Do not introduce CloudWatch-specific code in this baseline.

## `@readystack/domain`

Purpose:

Provide a placeholder for future business and domain logic.

Baseline behavior:

* Export at least one simple function or constant so the package builds.
* Do not introduce a real product domain.
* Do not create user, account, tenant, billing, or task models yet.

This package establishes where future business logic belongs.

## `@readystack/db`

Purpose:

Provide a placeholder for future database access.

Baseline behavior:

* Export a placeholder value or function.
* Do not select an ORM.
* Do not select a migration tool.
* Do not create a database schema.
* Do not connect to PostgreSQL yet unless explicitly required by RS-0004.

This package establishes where database access will belong after the data access decision is made.

## `@readystack/ui`

Purpose:

Provide a placeholder for shared UI components.

Baseline behavior:

* Export a minimal placeholder component or type.
* Avoid creating a design system.
* Avoid adding a component library.

If React types are needed, keep dependencies minimal.

## TypeScript Configuration

Create a shared root TypeScript configuration:

```text
tsconfig.base.json
```

The base config should prioritize:

* Strict TypeScript.
* Modern JavaScript target.
* Consistent module resolution.
* Compatibility with Next.js.
* No emit by default where appropriate.

Each package and app should extend the base config.

Each shared package should be able to run:

```bash
pnpm --filter @readystack/<package> typecheck
```

Root command must work:

```bash
pnpm typecheck
```

## Workspace Imports

The implementation should support clean workspace imports.

Examples:

```ts
import { logger } from "@readystack/logger";
import { getNodeEnv } from "@readystack/config";
```

Use pnpm workspace dependencies where appropriate:

```json
{
  "dependencies": {
    "@readystack/config": "workspace:*",
    "@readystack/logger": "workspace:*"
  }
}
```

The baseline does not need every package to depend on every other package.

Keep dependencies minimal and intentional.

## Linting

Use ESLint for linting.

Minimum expectations:

* `pnpm lint` succeeds.
* Linting covers app and package source files.
* Generated output and dependency directories are ignored.
* Configuration is simple and understandable.

Avoid complex custom lint rules in the baseline.

The implementation may use the current recommended ESLint setup for Next.js and TypeScript, but it should not overbuild.

## Formatting

Use Prettier for formatting.

Required files:

```text
.prettierrc
.prettierignore
```

Root scripts:

```bash
pnpm format
pnpm format:write
```

`pnpm format` must succeed after RS-0004 implementation.

The Prettier configuration should be minimal.

## Testing

Use Vitest for shared package tests.

Minimum expectations:

* `pnpm test` succeeds.
* At least one simple test exists.
* Tests are fast.
* Tests are deterministic.
* Tests do not require network access.
* Tests do not require Docker.
* Tests do not require PostgreSQL.

A simple test in one package is acceptable for the baseline.

Example:

```text
packages/domain/src/index.test.ts
```

Next.js app tests may be deferred, but the app must not break the root test command.

## Docker Baseline

Create a root `Dockerfile` for the web app.

The Dockerfile should:

* Build the app from the monorepo.
* Use pnpm.
* Produce a runnable container image.
* Avoid copying unnecessary local files.
* Use `.dockerignore`.
* Be suitable as the future deployable artifact.

Required files:

```text
Dockerfile
.dockerignore
```

Required validation:

```bash
docker build -t readystack:local .
```

The first implementation does not need advanced production optimization, but it should be directionally correct.

Preferred direction:

* Use a multi-stage Dockerfile.
* Install dependencies in a dependency stage.
* Build the Next.js app in a build stage.
* Run the app in a runtime stage.
* Expose port `3000`.

If Next.js standalone output is used, document it in comments or README.

If standalone output is deferred, explain why.

## Docker Compose Baseline

Update `docker-compose.yml` to provide local PostgreSQL.

Required service:

```text
postgres
```

Required defaults:

```text
POSTGRES_USER=readystack
POSTGRES_PASSWORD=readystack
POSTGRES_DB=readystack_local
```

Required port mapping:

```text
5432:5432
```

Use a named volume for local database data.

Suggested volume:

```text
readystack_postgres_data
```

The Compose setup does not need to run the web app yet.

Required validation:

```bash
docker compose up -d postgres
docker compose ps
```

The PostgreSQL service should be suitable for later migration and integration test work.

## Environment Variables

Update:

```text
.env.example
```

Minimum variables:

```text
NODE_ENV=development
DATABASE_URL=postgresql://readystack:readystack@localhost:5432/readystack_local
```

Optional variable:

```text
NEXT_PUBLIC_APP_NAME=ReadyStack
```

Rules:

* Do not commit `.env`.
* Do not commit real secrets.
* `.env.example` should document names and safe local defaults only.

## `.gitignore`

Ensure `.gitignore` excludes:

```text
node_modules/
.pnpm-store/
.next/
dist/
build/
coverage/
.env
.env.*
!.env.example
.DS_Store
.terraform/
*.tfstate
*.tfstate.*
terraform.tfvars
*.tfvars
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
```

It may also exclude editor and OS files.

## Database Directory

Keep these directories:

```text
db/migrations/
db/seeds/
```

For this baseline, they may remain placeholder directories.

If Git does not track empty directories, add `.gitkeep` files where appropriate.

Do not choose a migration tool in RS-0004 unless a separate decision is approved.

Do not create schema migrations yet.

## README Updates

Update `README.md` with practical local setup instructions.

Minimum sections:

```text
Project overview
Repository status
Prerequisites
Install dependencies
Start local dependencies
Run development server
Run validation commands
Branch model summary
Claude Code workflow summary
Troubleshooting
```

Prerequisites should include:

* Git.
* Node.js.
* pnpm.
* Docker.
* Docker Compose.

The README should include concrete commands:

```bash
pnpm install
docker compose up -d postgres
pnpm dev
pnpm typecheck
pnpm lint
pnpm test
pnpm build
docker build -t readystack:local .
```

The README should state that the app should be available at:

```text
http://localhost:3000
```

The README should state that the health endpoint should be available at:

```text
http://localhost:3000/api/health
```

## Local Development Expectations

After RS-0004, a new developer should be able to run:

```bash
pnpm install
docker compose up -d postgres
pnpm dev
```

Then visit:

```text
http://localhost:3000
```

The developer should also be able to check the health route:

```text
http://localhost:3000/api/health
```

The local PostgreSQL service should start, even if the web app does not use it yet.

## Validation Commands

RS-0004 implementation must make these commands work:

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

If any command cannot be made to work, the implementation must explain why and identify the required follow-up ticket.

## Claude Code Implementation Expectations for RS-0004

When implementing RS-0004, Claude Code should:

1. Read this spec.
2. Read `CLAUDE.md`.
3. Inspect the current repo state.
4. Summarize the implementation plan before changing files.
5. Make scoped changes only.
6. Avoid selecting deferred tools such as ORM, auth provider, migration tool, or production AWS resources.
7. Run validation commands.
8. Report validation results clearly.
9. Identify any commands that could not be run.
10. Update README and relevant docs.

Claude Code should not:

* Introduce a product domain.
* Add authentication.
* Add production infrastructure.
* Add GitHub Actions.
* Add deployment automation.
* Add external services.
* Commit secrets.
* Make broad unrelated refactors.

## Likely Files for RS-0004

RS-0004 will likely create or update:

```text
package.json
pnpm-workspace.yaml
pnpm-lock.yaml
.nvmrc
tsconfig.base.json
.eslintrc.cjs
.prettierrc
.prettierignore
.gitignore
.env.example
Dockerfile
.dockerignore
docker-compose.yml
README.md

apps/web/package.json
apps/web/next.config.js
apps/web/tsconfig.json
apps/web/app/page.tsx
apps/web/app/api/health/route.ts

packages/config/package.json
packages/config/tsconfig.json
packages/config/src/index.ts

packages/db/package.json
packages/db/tsconfig.json
packages/db/src/index.ts

packages/domain/package.json
packages/domain/tsconfig.json
packages/domain/src/index.ts
packages/domain/src/index.test.ts

packages/logger/package.json
packages/logger/tsconfig.json
packages/logger/src/index.ts

packages/ui/package.json
packages/ui/tsconfig.json
packages/ui/src/index.ts

db/migrations/.gitkeep
db/seeds/.gitkeep
```

The exact config filenames may vary if the selected tool versions require newer naming conventions.

## Acceptance Criteria

RS-0004 will be complete when:

* `pnpm install` succeeds.
* `pnpm typecheck` succeeds.
* `pnpm lint` succeeds.
* `pnpm test` succeeds.
* `pnpm build` succeeds.
* `pnpm format` succeeds.
* `docker build -t readystack:local .` succeeds.
* `docker compose up -d postgres` starts PostgreSQL.
* `docker compose ps` shows PostgreSQL running.
* `apps/web` contains a minimal runnable Next.js app.
* `/` returns a simple ReadyStack page.
* `/api/health` returns a JSON health response.
* Shared packages exist with minimal TypeScript entry points.
* At least one simple Vitest test exists.
* `.env.example` documents required local variables.
* README explains local setup and validation.
* No secrets are committed.
* No real product domain is introduced.
* No ORM is selected.
* No auth provider is selected.
* No migration tool is selected.
* No production AWS resources are implemented.
* No GitHub Actions workflows are implemented unless explicitly approved in a follow-up spec.

## Risks

* The baseline could accidentally become too product-specific.
* Claude Code may choose unnecessary libraries unless RS-0004 is explicit.
* Next.js setup may add defaults that need to be reconciled with ReadyStack conventions.
* Docker setup can become overcomplicated too early.
* Shared packages may become placeholders with little value if not kept minimal but real.
* Choosing an ORM, auth provider, or migration tool too early could lock in decisions before proper evaluation.
* Recursive pnpm scripts can fail if app and package scripts are inconsistent.
* Lint and TypeScript configuration can become noisy if overconfigured too early.

## Open Questions

* Should the baseline use Next.js generated defaults or a hand-created minimal app?
* Should Next.js use `app/` or `src/app/`?
* Should Vitest be configured at the root, per package, or both?
* Should Prettier be included immediately or deferred?
* Should Docker Compose eventually run both PostgreSQL and the web app?
* Should the Dockerfile use Next.js standalone output from the start?
* Which migration tool should be evaluated later?
* Which data access approach should be evaluated later?
* Should the first CI workflow be specified immediately after the runnable baseline?
* Should `/rs-onboard` be implemented before or after the runnable baseline?

## Recommended Follow-Up Specs

After RS-0003 is merged into `release` and master-merged into `master`, create:

```text
RS-0004: Implement Runnable Baseline Monorepo
```

After RS-0004, likely follow-up specs are:

```text
RS-0005: Pull Request Validation Workflow
RS-0006: Local Developer Onboarding Workflow
RS-0007: Database Migration Tool Decision
RS-0008: Application Architecture Baseline
RS-0009: Terraform Skeleton Specification
```

## Next Step

Merge this spec through the standard ReadyStack branch process:

```text
dev/RS-0003-runnable-baseline-monorepo-spec -> release
mm/RS-0003-runnable-baseline-monorepo-spec -> master
```

Then create RS-0004 to implement the runnable baseline monorepo using this spec.

