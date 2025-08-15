#!/bin/bash

# Install project dependencies, use CI=1 to avoid prompts
CI=1 pnpm install

pnpm run build
PGPASSWORD=password psql -h localhost -p 5440 -U postgres -f scripts/init-db.sql
pnpm --filter migrations db:setup
