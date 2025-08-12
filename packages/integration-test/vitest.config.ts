import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    timeout: 30000,
    hookTimeout: 30000,
    teardownTimeout: 30000,
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    env: {
      DB_HOST: "localhost",
      DB_PORT: "5440",
      DB_NAME: "hacker_tracker",
      DB_USERNAME: "postgres",
      DB_PASSWORD: "postgres",
      DB_SSL: "false",
    },
  },
});
