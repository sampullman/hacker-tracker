# Use Node.js Alpine for smaller image
FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/migrations/package.json ./packages/migrations/
COPY packages/shared-types/package.json ./packages/shared-types/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/shared-types ./packages/shared-types
COPY packages/migrations ./packages/migrations

# Build shared types first
RUN pnpm --filter shared-types build

# Build migrations
RUN pnpm --filter migrations build

# Set working directory to migrations
WORKDIR /app/packages/migrations

# Default command (can be overridden)
CMD ["pnpm", "run", "migration:run"]