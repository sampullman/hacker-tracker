# Docker Deployment Guide

This guide covers running Hacker Tracker with Docker in both development and production environments.

## Quick Start

### Production Stack

```bash
# Start full application stack
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop everything
docker-compose down
```

### Development with Docker Databases

```bash
# Start only databases
docker-compose -f docker-compose.dev.yml up -d

# Run migrations
pnpm run db:setup

# Start development servers (in another terminal)
pnpm run dev
```

## Environment Configuration

Create environment file:

```bash
cp .env.example .env
```

Important production settings:

- `JWT_SECRET`: Use a secure random string (32+ characters)
- `BCRYPT_ROUNDS`: Set to 12 for production (higher = more secure but slower)
- `NODE_ENV`: Set to `production` for optimizations

## Services

### PostgreSQL Database

- **Development & Test**: Port 5440 (hacker_tracker, hacker_tracker)
- **Production**: Port 5440 (hacker_tracker)
- Includes health checks and persistent volumes
- Both dev and test databases run on the same container instance

### Backend API

- **Port**: 3001
- Depends on PostgreSQL and migrations
- Includes health check endpoint `/health`
- Automatic restart on failure

### Migration Runner

- Runs once on startup to update database schema
- Exits after completing migrations
- Backend waits for successful completion

## Docker Commands

### Build Images

```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build backend
```

### Manage Data

```bash
# View database logs
docker-compose logs postgres

# Access database directly
docker-compose exec postgres psql -U postgres -d hacker_tracker

# Remove volumes (destroys data!)
docker-compose down -v
```

### Scaling

```bash
# Run multiple backend instances
docker-compose up -d --scale backend=3
```

## Troubleshooting

### Common Issues

**Backend fails to start:**

- Check database is healthy: `docker-compose logs postgres`
- Verify migrations completed: `docker-compose logs migrations`

**Database connection errors:**

- Ensure `DB_HOST=postgres` in production environment
- Check network connectivity: `docker-compose exec backend ping postgres`

**Password authentication failed error:**

1. Stop existing containers: `pnpm run db:down`
2. Start database and wait for readiness: `pnpm run db:start`
3. Initialize databases: `pnpm run db:init`
4. Run migrations: `pnpm run db:migrate`

**Integration test failures:**

1. Ensure Docker database is running: `pnpm run db:start`
2. Initialize test database: `pnpm run db:init`
3. Run tests: `pnpm run test:integration`

**Migration failures:**

- Check database permissions
- Review migration logs: `docker-compose logs migrations`

### Health Checks

```bash
# Check all services
docker-compose ps

# Test backend health
curl http://localhost:3001/health

# Check database
docker-compose exec postgres pg_isready -U postgres
```

## Production Recommendations

- Use Docker secrets for sensitive environment variables
- Set up log rotation and monitoring
- Configure backup strategy for PostgreSQL volumes
- Use a reverse proxy (nginx) for SSL termination
- Consider read replicas for high traffic

## Development Workflow

### Initial Setup

```bash
# 1. Start database and initialize
pnpm run db:setup

# 2. Run development servers
pnpm run dev

# 3. Run integration tests (in another terminal)
pnpm run test:integration
```

### Daily Development

```bash
# Start only the database (if not running)
pnpm run db:start

# Run your normal dev workflow
pnpm run dev
```

### Reset Database

```bash
# When you need a clean database
pnpm run db:reset
```

## Development Tips

- Mount code as volumes for hot reload during development
- Use separate networks for different environments
- Both test and development databases run in the same Docker container
- Integration tests automatically use the Docker database when properly configured
