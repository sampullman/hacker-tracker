# Use Node.js Alpine for smaller image
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/backend/package.json ./packages/backend/
COPY packages/shared-types/package.json ./packages/shared-types/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/shared-types ./packages/shared-types
COPY packages/backend ./packages/backend

# Build shared types first
RUN pnpm --filter shared-types build

# Build backend
RUN pnpm --filter backend build

# Production stage
FROM node:18-alpine AS production

# Install curl for healthchecks
RUN apk add --no-cache curl

# Install pnpm
RUN npm install -g pnpm

# Create app user
RUN addgroup -g 1001 -S nodejs && adduser -S backend -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/backend/package.json ./packages/backend/
COPY packages/shared-types/package.json ./packages/shared-types/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built code
COPY --from=base /app/packages/shared-types/dist ./packages/shared-types/dist
COPY --from=base /app/packages/backend/dist ./packages/backend/dist

# Change ownership
RUN chown -R backend:nodejs /app

# Switch to app user
USER backend

# Expose port
EXPOSE 3051

# Start the application
CMD ["node", "packages/backend/dist/index.js"]