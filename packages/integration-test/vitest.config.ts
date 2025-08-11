import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    timeout: 30000,
    hookTimeout: 30000,
    teardownTimeout: 30000,
  },
});