# hacker-tracker

Self-hosted app for alerts based on Hacker News posts and comments. Set up "trackers", which periodically alert you via email or Slack when keywords appear in content.

## Development

**Setup**
```bash
pnpm install
```

**Run**
```bash
# Frontend
pnpm run frontend
# API & services
pnpm run backend
```

## Hosting

There are several methods of hosting:
1. Run via docker-compose
2. Deploy to a k8s cluster (see skaffold configuration)
3. Build the frontend/backend from source and host the bundles however you prefer

## Tech

- Pnpm is used for package management
- Vite is used for dev servers and production bundling

The React frontend has several pages:
- Splash page with some details about app features
- Sign in/register modal
- Tracking page, with a list of active trackers
- Create tracker modal
- Admin page with users, keywords, 

### Frontend

React, Tailwind, Material UI

### Backend

Express, Passport.js, TypeORM, pg-boss, Postgres

### Testing

Vitest for unit and integration tests, Playwright for UI tests.
