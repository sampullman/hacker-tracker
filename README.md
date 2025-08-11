# Hacker Tracker

Self-hosted app for alerts based on Hacker News posts and comments. Set up "trackers", which periodically alert you via email or Slack when keywords appear in content.

## Development

**Quick Setup**

```bash
# 1. Install dependencies
pnpm install

# 2. Setup everything (builds packages, starts databases, runs migrations)
pnpm run setup

# 3. Start development servers
pnpm run dev
```

**Manual Setup**

```bash
# Install dependencies
pnpm install

# Build shared packages first
pnpm run build

# Start PostgreSQL databases (dev + test)
pnpm run db:up

# Run database migrations
pnpm run db:setup

# Start development servers (frontend + backend)
pnpm run dev
```

**Individual Commands**

```bash
# Frontend only
pnpm run frontend

# Backend only
pnpm run backend

# Database management
pnpm run db:up          # Start PostgreSQL containers
pnpm run db:down        # Stop PostgreSQL containers
pnpm run db:setup       # Run migrations
pnpm run db:reset       # Drop schema and re-run migrations

# Database migrations
pnpm migration:create   # Create new migration
pnpm migration:generate # Generate migration from entity changes
pnpm run db:migrate     # Run pending migrations
pnpm run db:migrate:revert # Revert last migration

# Testing
pnpm run test:integration # Database integration tests
pnpm run test:e2e        # E2E UI tests
pnpm test               # All tests

# Code quality
pnpm run lint           # Lint all packages
pnpm run typecheck      # TypeScript type checking
```

**Project Structure**

- `packages/frontend/` - React frontend with Tailwind CSS and Material UI
- `packages/backend/` - Express API server with TypeORM
- `packages/shared-types/` - TypeScript types shared across packages
- `packages/migrations/` - TypeORM database migrations and entities
- `packages/integration-test/` - Vitest integration tests with Supertest
- `packages/e2e-test/` - Playwright end-to-end UI tests

**Database**

- Development: `hacker_tracker_dev` on port 5432
- Test: `hacker_tracker_test` on port 5433
- Both run in Docker containers via `docker-compose.dev.yml`

## Hosting

There are several methods of hosting:

1. Run via docker-compose
2. Deploy to a k8s cluster (see skaffold configuration)
3. Build the frontend/backend from source and host the bundles however you prefer

## Tech

- Pnpm is used for package management
- Vite is used for dev servers and production bundling

The React frontend includes:

- ✅ Splash page with app features and signup CTA
- 🔄 Sign in/register modal
- 🔄 Tracking page, with a list of active trackers
- 🔄 Create tracker modal
- 🔄 Admin page with users, keywords

### Frontend

React, Tailwind, Material UI

### Backend

Express, Passport.js, TypeORM, pg-boss, Postgres

### Testing

Vitest for unit and integration tests, Playwright for UI tests.
