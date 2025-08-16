# Claude Code Configuration

This file contains configuration and best practices for working with this project using Claude Code.

## Quick Setup Commands

### Initial Setup (run once)
```bash
# Install dependencies and build all packages
pnpm install
pnpm run build

# Initialize database
PGPASSWORD=password psql -h localhost -p 5440 -U postgres -f scripts/init-db.sql
pnpm --filter migrations db:setup
```

### Development Commands
```bash
# Start both frontend and backend servers
pnpm run frontend & pnpm run backend

# Or start them separately:
pnpm run frontend  # Port 3050
pnpm run backend   # Port 3051
```

### Database Reset (when needed)
```bash
# Reset database and re-run migrations
PGPASSWORD=password psql -h localhost -p 5440 -U postgres -c "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;"
pnpm --filter migrations db:setup
```

## Essential Commands

### Development

- `pnpm run frontend` - Start frontend (port 3050)
- `pnpm run backend` - Start backend (port 3051)

### Building

- `pnpm run build` - Build all packages (required before first run)
- `pnpm --filter shared-types build` - Build shared types only

### Database Management

- `pnpm --filter migrations db:setup` - Run migrations
- `pnpm --filter migrations db:reset` - Reset database and re-run migrations

### Code Quality

- `pnpm run lint` - Run ESLint across all packages
- `pnpm run typecheck` - Run TypeScript type checking

### Testing

- `pnpm run test:integration` - Run integration tests
- `pnpm run test:e2e` - Run end-to-end tests
- `pnpm test` - Run all tests

## Database Configuration

- **Host:** localhost
- **Port:** 5440
- **Database:** hacker_tracker
- **User:** postgres
- **Password:** password (set via PGPASSWORD environment variable)

## Project Structure

```
packages/
├── backend/           # Express API server
├── frontend/          # React app (Vite + Tailwind + MUI)
├── shared-types/      # Shared TypeScript types
├── migrations/        # Database migrations (TypeORM)
├── integration-test/  # Vitest integration tests
└── e2e-test/         # Playwright end-to-end tests
```

## Environment Configuration

Copy `.env.example` to `.env` and adjust if needed:
- Database is at localhost:5440
- Always change JWT_SECRET for production

## Common Issues & Solutions

1. **"Cannot connect to database"**
   - Ensure PostgreSQL is running at localhost:5440
   - Check password is set correctly: `PGPASSWORD=password`
2. **"Module not found" errors**
   - Run `pnpm run build` to build shared-types package
3. **Migration errors**
   - Reset database and re-run migrations (see Database Reset above)
4. **Port conflicts**
   - Frontend: 3050, Backend: 3051, PostgreSQL: 5440
5. **Playwright test failures**
   - Ensure both frontend and backend are running
   - Database should have migrations applied
   - Run `pnpm run build` after code changes

## Code Style

- ESLint + Prettier configured across all packages
- TypeScript strict mode enabled
- React + Material UI components
- Express.js with TypeORM for backend
- Shared types package for type consistency
