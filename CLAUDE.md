# Claude Code Configuration

This file contains configuration and best practices for working with this project using Claude Code.

## Quick Setup Commands

For **LOCAL DEVELOPMENT** (coding agents without Docker):
```bash
# Setup project from scratch
pnpm install
pnpm run build
PGPASSWORD=your_password psql -h localhost -p 5432 -U postgres -f scripts/init-db.sql
pnpm --filter migrations db:setup
pnpm run frontend & pnpm run backend

# Reset database state
PGPASSWORD=your_password psql -h localhost -p 5432 -U postgres -c "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;"
pnpm --filter migrations db:setup
```

For **DOCKER DEVELOPMENT**:
```bash
# Setup project from scratch
pnpm run setup

# Reset database state
pnpm run db:reset
```

## Essential Commands

### Development
- `pnpm run dev` - Start frontend and backend (Docker mode)
- `pnpm run frontend` - Start only frontend (port 3050)
- `pnpm run backend` - Start only backend (port 3051)

### Building
- `pnpm run build` - Build all packages (required before first run)
- `pnpm --filter shared-types build` - Build shared types only

### Database Management
- `pnpm run db:setup` - Run migrations (Docker mode)
- `pnpm run db:reset` - Reset database and re-run migrations (Docker mode)  
- `pnpm --filter migrations db:setup` - Run migrations (local mode)
- `pnpm --filter migrations db:reset` - Reset database (local mode)

### Code Quality
- `pnpm run lint` - Run ESLint across all packages
- `pnpm run typecheck` - Run TypeScript type checking

### Testing
- `pnpm run test:integration` - Run integration tests
- `pnpm run test:e2e` - Run end-to-end tests
- `pnpm test` - Run all tests

## Database Configuration

### Local PostgreSQL (Coding Agents)
- **Host:** localhost
- **Port:** 5432 (standard PostgreSQL port)
- **Database:** hacker_tracker
- **User:** postgres
- **Password:** Set via PGPASSWORD environment variable

### Docker PostgreSQL
- **Host:** localhost  
- **Port:** 5440
- **Database:** hacker_tracker
- **User:** postgres
- **Password:** postgres

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

Copy `.env.example` to `.env` and adjust:
- For local development: Use localhost:5432 for database
- For Docker development: Use localhost:5440 for database
- Always change JWT_SECRET for production

## Common Issues & Solutions

1. **"Cannot connect to database"**
   - Ensure PostgreSQL is running locally or `pnpm run db:up` for Docker
   
2. **"Module not found" errors**
   - Run `pnpm run build` to build shared-types package
   
3. **Migration errors**
   - Reset database: `pnpm run db:reset` or local equivalent
   
4. **Port conflicts**
   - Frontend: 3050, Backend: 3051, PostgreSQL: 5440 (Docker) or 5432 (local)

## Code Style

- ESLint + Prettier configured across all packages
- TypeScript strict mode enabled
- React + Material UI components
- Express.js with TypeORM for backend
- Shared types package for type consistency