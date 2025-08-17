import { config as dotenvConfig } from 'dotenv';
import path from 'path';

// Initialize dotenv once for the entire application
let isInitialized = false;

export function initializeEnv(envPath?: string): void {
  if (!isInitialized) {
    const dotenvPath = envPath || path.resolve(process.cwd(), '.env');
    dotenvConfig({ path: dotenvPath });
    isInitialized = true;
  }
}

// Auto-initialize on import with default path
initializeEnv();