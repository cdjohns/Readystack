# Claude Code Guidance for ReadyStack

You are working in the ReadyStack repository.

ReadyStack is a reusable production application baseline and development operating model for TypeScript web applications. It is intended to provide a practical starting point for local development, testing, infrastructure, deployment, operations, documentation, and AI-assisted development workflows.

## Project Identity

Repository name:

```text
readystack
```

Project name:

```text
ReadyStack
```

Command prefix:

```text
rs
```

Claude command prefix:

```text
/rs-*
```

## Core Operating Rules

Follow these rules unless a specific approved spec says otherwise:

* Prefer clarity over cleverness.
* Prefer boring, durable, well-understood tools.
* Prefer a modular monolith unless there is a clear reason to split services.
* Keep business logic in version-controlled Node.js TypeScript modules.
* Do not scatter business rules across React components, Terraform, database triggers, GitHub Actions, or cloud functions.
* Keep application code, infrastructure, deployment automation, and documentation as separate concerns.
* Make small, reviewable changes.
* Work from explicit specs or tickets.
* Read the current repo state before changing files.
* Run relevant validation commands before declaring work complete.
* Update documentation when changing architecture, infrastructure, workflows, operations, or developer procedures.
* Surface uncertainty instead of guessing.

## Default Technology Direction

Unless a spec or ADR says otherwise, assume:

```text
Language: TypeScript
Runtime: Node.js
Web app: Next.js
Package manager: pnpm
Repository model: simple monorepo
Deployable artifact: Docker image
Production platform: AWS
Infrastructure as Code: Terraform
CI/CD: GitHub Actions
Runtime: ECS Fargate
Container registry: ECR
Database: RDS PostgreSQL
Object storage: S3
Secrets: Secrets Manager or SSM Parameter Store
Logs and metrics: CloudWatch
DNS: Route 53
TLS: ACM
```

## Architecture Boundaries

ReadyStack should keep responsibilities clear.

Application code:

* Owns business rules.
* Owns authorization decisions.
* Owns input validation at server boundaries.
* Owns service orchestration.
* Owns integration logic.
* Produces structured logs.

Database:

* Stores durable system-of-record data.
* Enforces integrity through constraints, keys, uniqueness, indexes, and referential integrity.
* Does not hide application business workflows in triggers or stored procedures unless explicitly approved.

Terraform:

* Defines infrastructure.
* Defines IAM, networking, compute, storage, DNS, TLS, secrets resources, and observability resources.
* Does not contain application business logic.
* Does not contain environment-specific hacks that belong in application configuration.

GitHub Actions:

* Runs validation.
* Builds artifacts.
* Deploys approved artifacts.
* Enforces release workflow.
* Does not contain application business rules.

React and UI components:

* Render interface behavior.
* Collect user input.
* Call server-side application boundaries.
* Should not become the home for core business rules or authorization enforcement.

## Branch Model

ReadyStack uses a LifeCloud-style dual-track branch model.

Branches:

```text
release = next deployable release
master  = future integration line
dev/*   = implementation branches
mm/*    = master-merge branches
```

Rules:

* Do not commit directly to `release`.
* Do not commit directly to `master`.
* Create implementation branches from `release` unless the work is explicitly future-only.
* Merge dev branches to `release` through pull requests.
* Create a master-merge branch from the same dev branch.
* Merge the master-merge branch to `master` through a separate pull request.
* Keep the master-merge branch focused on the same logical change as the dev branch.
* Allow conflict resolution on the master-merge branch.
* Do not add unrelated cleanup to the master-merge branch.
* During major releases, recreate `release` from `master`.

Normal change flow:

```text
release
  -> dev/RS-####-short-description
       -> PR to release
       -> mm/RS-####-short-description
            -> PR to master
```

## Spec-First Workflow

Prefer a spec-first workflow.

Before implementation:

1. Read the relevant spec or ticket.
2. Inspect the repo state.
3. Identify the target branch and changed files.
4. Summarize the implementation plan.
5. Identify validation commands.
6. Call out assumptions and open questions.

During implementation:

1. Make scoped changes.
2. Avoid unrelated refactors.
3. Preserve architectural boundaries.
4. Keep files organized according to the documented repository structure.
5. Update documentation when behavior or workflow changes.

Before completion:

1. Run relevant validation commands.
2. Report which validations passed.
3. Report which validations could not be run.
4. Summarize changed files.
5. Identify risks and follow-up work.

## Expected Repository Areas

ReadyStack uses this baseline structure:

```text
apps/
  web/
packages/
  config/
  db/
  domain/
  logger/
  ui/
infra/
  terraform/
    modules/
    envs/
      staging/
      production/
db/
  migrations/
  seeds/
scripts/
docs/
  blueprint/
  adr/
  specs/
  runbooks/
  workflows/
.claude/
  commands/
.github/
  workflows/
```

## Validation Expectations

Use validation commands appropriate to the current stage of the repository.

Expected commands may include:

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm test
pnpm build
docker build -t readystack:local .
docker compose up -d
terraform fmt -check
terraform validate
```

During the foundation phase, some commands may not exist yet.

When a command does not exist:

* Say that it does not exist.
* Explain whether that is expected.
* Do not claim validation passed.
* Recommend the ticket or spec where the missing validation should be introduced.

## Documentation Rules

Update documentation when changes affect:

* Architecture
* Repository structure
* Local development
* Environment variables
* Database behavior
* Infrastructure
* CI/CD
* Deployment
* Rollback
* Security
* Testing
* Observability
* Claude Code workflows
* ReadyStack command behavior
* Developer onboarding

Documentation should be practical and close to the code.

Prefer specific commands, paths, and examples over vague guidance.

## Security Guardrails

Do not commit secrets.

Use `.env.example` for documented environment variables.

Keep staging and production secrets separate.

Prefer least-privilege IAM when infrastructure is introduced.

Prefer private networking for sensitive resources.

Use TLS for production traffic.

Validate inputs at server boundaries.

Enforce authorization server-side.

Treat authentication and authorization as separate concerns.

Do not assume the authentication provider too early. Evaluate Cognito, Auth.js, Clerk, and other providers through an explicit decision process.

Avoid direct production changes from developer machines.

## Working With Specs

Specs live in:

```text
docs/specs/
```

Specs should generally include:

```text
Goal
Context
Scope
Non-goals
Requirements
Proposed implementation
Likely files
Validation
Acceptance criteria
Risks
Open questions
```

When implementing a spec, do not silently change the spec’s intent. If implementation reveals a better approach, document the recommendation and ask for confirmation before making broad changes.

## Working With ADRs

Architecture Decision Records live in:

```text
docs/adr/
```

Create or update an ADR when a change introduces or changes a significant architectural decision, such as:

* Authentication provider
* ORM or query builder
* Migration tool
* Runtime platform
* Background job approach
* Email provider
* Feature flag approach
* Error tracking service
* Preview environment strategy
* Major infrastructure pattern

Do not introduce major new tools or frameworks without an ADR or explicit approval.

## Claude Command Direction

ReadyStack uses `/rs-*` commands for repeatable Claude Code workflows.

Command files live in:

```text
.claude/commands/
```

Initial command intent:

```text
/rs-state
Inspect current repo state, branch, changed files, package scripts, docs, and likely next action.

/rs-ticket
Turn a user request into a ReadyStack implementation ticket.

/rs-spec
Create or refine a detailed implementation spec.

/rs-implement
Implement an approved spec or ticket with scoped changes and validation.

/rs-pr-check
Run or guide pre-PR validation.

/rs-master-merge
Guide creation of the master-merge branch from the dev branch and prepare the PR to master.

/rs-onboard
Guide a new developer through local setup and dependency checks.

/rs-review
Review current changes for correctness, architecture, security, tests, and docs.

/rs-deploy-check
Verify readiness before staging or production deployment.

/rs-release-reset
Guide the major-release reset where `release` is recreated from `master`.
```

## Completion Report Format

When finishing a task, report:

```text
Summary
- What changed

Files changed
- Important files modified or created

Validation
- Commands run
- Results
- Commands not run and why

Risks
- Known concerns or assumptions

Next steps
- Recommended follow-up
```

Do not say work is complete if validation was skipped, failed, or could not be run. Say exactly what is known.

