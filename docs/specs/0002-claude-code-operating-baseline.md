# RS-0002: Claude Code Operating Baseline

## Goal

Create the initial Claude Code operating baseline for ReadyStack.

This work defines how Claude Code should operate inside the `readystack` repository before it is used to generate the runnable application baseline, infrastructure artifacts, CI/CD workflows, deployment procedures, or production documentation.

## Context

ReadyStack is both a reusable production application blueprint and a baseline repository for TypeScript web applications.

Claude Code should be treated as an implementation assistant that works from version-controlled project rules, specs, and branch workflows. It should not act as an unconstrained code generator.

This operating baseline ensures that future Claude Code work follows ReadyStack architectural principles, uses the LifeCloud-style branch process, makes scoped changes, runs validation, and updates documentation when appropriate.

## Scope

This change updates the repository guidance used by Claude Code.

Included:

* Improve `CLAUDE.md`
* Define Claude Code operating rules
* Define the spec-first workflow
* Define branch expectations
* Define validation expectations
* Define documentation expectations
* Define initial command file expectations for future `/rs-*` workflows

Not included:

* Implementing the runnable pnpm monorepo
* Implementing the Next.js app
* Implementing Docker or Docker Compose behavior
* Implementing Terraform
* Implementing GitHub Actions
* Implementing production deployment
* Fully completing all `/rs-*` command files

## Required Files

This change should update:

```text
CLAUDE.md
docs/specs/0002-claude-code-operating-baseline.md
```

Future follow-up changes should populate:

```text
.claude/commands/rs-state.md
.claude/commands/rs-ticket.md
.claude/commands/rs-spec.md
.claude/commands/rs-implement.md
.claude/commands/rs-pr-check.md
.claude/commands/rs-master-merge.md
.claude/commands/rs-onboard.md
.claude/commands/rs-review.md
.claude/commands/rs-deploy-check.md
.claude/commands/rs-release-reset.md
```

## Claude Code Role

Claude Code should act as a senior implementation assistant for ReadyStack.

Claude Code should:

* Read the current repo state before making changes.
* Work from explicit specs, tickets, or documented instructions.
* Preserve ReadyStack architectural boundaries.
* Prefer small, reviewable changes.
* Use the existing repository structure.
* Run relevant validation commands before declaring work complete.
* Update documentation when changing architecture, infrastructure, workflows, operations, or developer procedures.
* Surface uncertainty instead of guessing.
* Explain what changed and how it was validated.

Claude Code should not:

* Introduce new frameworks without an ADR or explicit approval.
* Make broad unrelated changes.
* Scatter business logic across inappropriate layers.
* Treat generated code as complete without validation.
* Skip documentation updates when behavior or workflows change.
* Make direct changes to `release` or `master`.
* Invent production infrastructure or secrets.
* Store secrets in source control.

## Core ReadyStack Principles

Claude Code must follow these principles:

* Prefer clarity over cleverness.
* Prefer boring, durable tools over unnecessary novelty.
* Prefer a modular monolith unless there is a clear reason to split services.
* Keep business logic in version-controlled Node.js TypeScript modules.
* Do not hide business rules in React components, Terraform, database triggers, GitHub Actions, or cloud functions.
* Keep application code, infrastructure, deployment automation, and documentation as separate concerns.
* Design for local developer productivity, repeatable environments, secure defaults, rollback, testability, and observability.

## Default Technology Direction

Unless a spec says otherwise, Claude Code should assume:

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

* No direct commits to `release` or `master`.
* All implementation work starts on a dev branch.
* Dev branches are normally created from `release`.
* The dev branch is merged into `release` through a pull request.
* A master-merge branch is created from the same dev branch.
* The master-merge branch is merged into `master` through a separate pull request.
* The master-merge branch should contain the same logical change as the dev branch.
* Conflict resolution is allowed on the master-merge branch.
* Unrelated cleanup is not allowed in the master-merge branch.
* During major releases, `release` is recreated from `master`.

## Spec-First Workflow

Claude Code should normally work from a spec or ticket.

Preferred flow:

```text
1. Read the relevant spec or ticket.
2. Inspect the current repo state.
3. Summarize the intended change.
4. Identify likely files to modify.
5. Make scoped changes.
6. Run relevant validation.
7. Report changes, validation results, risks, and follow-up work.
```

If the requested work is unclear, Claude Code should ask for clarification or document assumptions before making large changes.

## Validation Expectations

Claude Code should identify applicable validation commands before finishing work.

Expected validation commands may include:

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

Not every command will exist during the early foundation phase.

If a command does not exist yet, Claude Code should say so clearly and explain whether that is expected for the current phase.

## Documentation Expectations

Claude Code should update documentation when changes affect:

* Architecture
* Repository structure
* Local development
* Environment variables
* Infrastructure
* CI/CD
* Deployment
* Rollback
* Security
* Testing
* Observability
* Claude Code workflows
* ReadyStack commands
* Developer onboarding

Documentation should be practical, close to the code, and written for future developers who do not have access to the original conversation context.

## Security Guardrails

Claude Code must follow these guardrails:

* Do not commit secrets.
* Do not invent placeholder secrets that look real.
* Use `.env.example` for documented environment variables.
* Keep staging and production secrets separate.
* Prefer least-privilege IAM when infrastructure is introduced.
* Avoid direct production changes from developer machines.
* Validate inputs at server boundaries.
* Enforce authorization server-side.
* Treat authentication and authorization as separate concerns.

## Initial Command Direction

ReadyStack should eventually provide `/rs-*` Claude Code commands.

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

## Acceptance Criteria

This change is complete when:

* `docs/specs/0002-claude-code-operating-baseline.md` exists.
* `CLAUDE.md` gives Claude Code clear ReadyStack operating rules.
* The branch model is documented in `CLAUDE.md`.
* The spec-first workflow is documented in `CLAUDE.md`.
* Validation expectations are documented in `CLAUDE.md`.
* Security and documentation guardrails are documented in `CLAUDE.md`.
* The next spec can focus on the runnable baseline monorepo.

## Risks

* Too much guidance could make Claude Code overly cautious.
* Too little guidance could allow Claude Code to overbuild or violate architectural boundaries.
* The branch model differs from common GitHub Flow and must be repeated clearly.
* Early command files may become stale if not tied to actual usage.

## Open Questions

* Should every `/rs-*` command be fully implemented before the runnable baseline?
* Should `/rs-state` be the first fully detailed command?
* Should command files be short prompts or detailed operating procedures?
* Should Claude Code be allowed to update specs while implementing them, or should spec changes require separate review?
* Should branch cleanup be included in `/rs-pr-check` or `/rs-master-merge`?

## Next Step

After this change is merged to `release` and master-merged to `master`, create:

```text
RS-0003: Runnable Baseline Monorepo Specification
```

That spec should define the minimal pnpm monorepo, Next.js app placeholder, package scripts, Docker baseline, Docker Compose PostgreSQL service, `.env.example`, health check, and validation commands.

