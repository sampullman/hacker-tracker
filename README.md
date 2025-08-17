# Hacker Tracker

Self-hosted app for alerts based on Hacker News posts and comments. Set up "trackers", which periodically alert you via email or Slack when keywords appear in content.

## Development

### Local Environment (No Docker)

**Prerequisites:** PostgreSQL must be installed and running locally.

**Quick Setup**

```bash
# 1. Install dependencies
pnpm install

# 2. Setup database (create databases and run migrations)
# Note: Requires local PostgreSQL instance
PGPASSWORD=password psql -h localhost -p 5440 -U postgres -f scripts/init-db.sql
pnpm --filter migrations db:setup

# 3. Build shared packages
pnpm run build

# 4. Start development servers
pnpm run frontend & pnpm run backend
```

**Manual Local Setup**

```bash
# Install dependencies
pnpm install

# Build shared packages first
pnpm run build

# Setup local databases (requires PostgreSQL running locally)
PGPASSWORD=password psql -h localhost -p 5440 -U postgres -f scripts/init-db.sql

# Run database migrations
pnpm --filter migrations db:setup

# Start development servers
pnpm run frontend & pnpm run backend
```

### Docker Environment

**Quick Docker Setup**

```bash
# 1. Install dependencies
pnpm install

# 2. Setup everything (builds packages, starts databases, runs migrations)
pnpm run setup

# 3. Start development servers
pnpm run dev
```

**Manual Docker Setup**

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

- Development: `hacker_tracker` on port 5440
- Both run in Docker containers via `docker-compose.dev.yml`

## Production Deployment

### Docker Compose (Recommended)

```bash
# Run complete application stack
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Configuration

Copy the environment template and customize:

```bash
cp .env.example .env
```

Key settings:

- `JWT_SECRET`: Change for production (use secure random string)
- `DB_*`: Database connection settings
- `BCRYPT_ROUNDS`: Password hashing strength (10-12 for production)

### Email Service

This project uses [MailerSend](https://www.mailersend.com/) for transactional emails. To set it up:

1.  **Sign up:** Create a free account on the [MailerSend website](https://www.mailersend.com/signup).
2.  **Verify your domain:** Follow their documentation to add and verify a sending domain. This is required to send emails.
3.  **Get API Token:** Generate an API token from the MailerSend dashboard under **Domains -> Your Domain -> API**.
4.  **Configure Environment:** Add the token to your `.env` file:

    ```
    MAILERSEND_API_KEY=your-api-token-here
    ```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Create user account
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### User Management (Admin/Self only)

- `GET /api/users` - List users (admin only)
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

## Hosting Options

1. **Docker Compose** (recommended): Use included docker-compose.yml
2. **Container Orchestration**: Deploy to Kubernetes/Docker Swarm
3. **Manual Build**: Build packages and deploy to your infrastructure

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
