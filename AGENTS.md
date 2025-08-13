# Agent Development Guide

This guide helps AI coding agents understand and work with the Hacker Tracker project effectively.

## Project Overview

Hacker Tracker is a full-stack web application for tracking keywords in Hacker News posts and comments. It provides email/Slack alerts when tracked terms appear.

**Tech Stack:**
- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS + Material UI
- **Backend:** Express.js + TypeScript + TypeORM + PostgreSQL
- **Auth:** JWT + bcrypt + Passport.js
- **Testing:** Vitest (integration) + Playwright (e2e)
- **Package Manager:** pnpm with workspaces

## Quick Agent Setup (Local Development)

**Prerequisites:** PostgreSQL must be installed locally (agents don't have Docker access).

```bash
# 1. Install and build
pnpm install && pnpm run build

# 2. Setup local database (adjust password as needed)
PGPASSWORD=postgres psql -h localhost -p 5432 -U postgres -f scripts/init-db.sql
pnpm --filter migrations db:setup

# 3. Start development
pnpm run frontend & pnpm run backend
```

## Project Architecture

### Monorepo Structure
```
packages/
├── frontend/          # React app (port 3050)
├── backend/           # Express API (port 3051)  
├── shared-types/      # TypeScript interfaces
├── migrations/        # Database schema & migrations
├── integration-test/  # API integration tests
└── e2e-test/         # Browser automation tests
```

### Database Schema
- **Users:** Authentication and role management
- **Trackers:** Keyword tracking configurations (future)
- **Alerts:** Notification records (future)

### API Endpoints (Current)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication  
- `GET /api/auth/me` - Current user profile
- `POST /api/auth/logout` - Session termination
- `GET /api/users` - User list (admin only)
- `PUT /api/users/:id` - User updates
- `DELETE /api/users/:id` - User deletion (admin only)

## Code Style & Conventions

### TypeScript
- Strict mode enabled across all packages
- Shared types in `packages/shared-types/`
- Interface naming: `User`, `CreateUserRequest`, `AuthResponse`
- Enum usage: `UserRole.USER`, `UserRole.ADMIN`

### Backend Patterns
- Route handlers use typed Request/Response interfaces
- Repository pattern with TypeORM entities
- JWT middleware for authentication
- bcrypt for password hashing (12 rounds)
- Error handling with custom middleware

### Frontend Patterns  
- React functional components with hooks
- Material UI components with Tailwind utilities
- Custom hooks for API integration
- Modal-based UI flow (signup/login)
- TypeScript interfaces for all props

### Database
- TypeORM with decorators
- Migration-first schema changes
- UUID primary keys
- Timestamps on all entities
- Enum types for roles/statuses

## Common Development Tasks

### Adding New API Endpoints
1. Define types in `packages/shared-types/`
2. Create route handler in `packages/backend/src/routes/`
3. Add route to main app in `packages/backend/src/index.ts`
4. Create integration test in `packages/integration-test/`

### Database Changes
1. Modify entity in `packages/migrations/src/entities/`
2. Generate migration: `pnpm migration:generate`
3. Review and edit migration file
4. Test with `pnpm run db:reset`

### Frontend Components
1. Create component in `packages/frontend/src/components/`
2. Use Material UI + Tailwind for styling
3. Import shared types from `shared-types`
4. Add to main app or modal flow

### Testing Strategy
- **Unit:** Component and utility testing
- **Integration:** API endpoint testing with real database
- **E2E:** Full user workflow testing with Playwright

## Database Commands Reference

### Local PostgreSQL
```bash
# Connect to database
PGPASSWORD=postgres psql -h localhost -p 5432 -U postgres -d hacker_tracker

# Reset database
PGPASSWORD=postgres psql -h localhost -p 5432 -U postgres -c "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;"
pnpm --filter migrations db:setup

# Create migration
pnpm migration:generate -- -n MigrationName
```

### Docker PostgreSQL (if available)
```bash
# Database management
pnpm run db:up      # Start container
pnpm run db:reset   # Reset schema
pnpm run db:down    # Stop container
```

## Environment Variables

Create `.env` from `.env.example`:

**Local Development:**
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres  
DB_PASSWORD=your_password
DB_NAME=hacker_tracker
JWT_SECRET=your-secret-key
```

**Docker Development:**
```bash
DB_HOST=localhost
DB_PORT=5440
# ... rest same
```

## Troubleshooting

### "Cannot connect to database"
- Verify PostgreSQL is running: `pg_isready -h localhost -p 5432`
- Check credentials in `.env`
- Ensure database exists: `PGPASSWORD=postgres psql -h localhost -p 5432 -U postgres -l`

### "Module not found" errors
- Build shared packages: `pnpm run build`
- Clean install: `rm -rf node_modules && pnpm install`

### Migration issues
- Check migration files in `packages/migrations/src/migrations/`
- Reset and retry: Database reset commands above
- Verify entity definitions match migrations

### Port conflicts
- Frontend (Vite): 3050
- Backend (Express): 3051  
- PostgreSQL: 5432 (local) or 5440 (Docker)

## Code Quality Tools

```bash
# Linting (ESLint + Prettier)
pnpm run lint

# Type checking
pnpm run typecheck  

# All tests
pnpm test

# Integration tests only
pnpm run test:integration
```

## File Navigation Tips

**Key files for understanding:**
- `packages/backend/src/index.ts` - Main server setup
- `packages/backend/src/routes/auth.ts` - Authentication logic
- `packages/frontend/src/components/AuthModal.tsx` - Login/signup UI
- `packages/shared-types/src/user.ts` - User type definitions
- `packages/migrations/src/entities/User.ts` - Database schema

**Configuration files:**
- `.env.example` - Environment variables template
- `package.json` - Root workspace commands
- `docker-compose.dev.yml` - Development database setup