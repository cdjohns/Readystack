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

This repository is currently in the foundation definition phase.

## Branch Model

ReadyStack uses a dual-track branch model:

- `release` represents the next deployable release.
- `master` represents the future integration line.
- Code changes are developed on dev branches.
- Dev branches are merged into `release` through pull requests.
- A master-merge branch is created from the same dev branch and merged into `master`.
- During major release resets, `release` is recreated from `master`.

## Command Prefix

ReadyStack Claude Code commands use the `/rs-*` prefix.
