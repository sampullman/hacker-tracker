import { config as dotenvConfig } from "dotenv";
import path from "path";
import { existsSync } from "fs";

let isInitialized = false;

function findEnvPath(startDir: string): string {
  let currentDir = startDir;

  // Walk up directory tree until we find .env
  while (true) {
    const candidate = path.join(currentDir, ".env");
    if (existsSync(candidate)) {
      return candidate;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }
    currentDir = parentDir;
  }

  // Fallback to the start directory if no .env found
  return path.join(startDir, ".env");
}

export function initializeEnv(envPath?: string): void {
  if (!isInitialized) {
    const dotenvPath = envPath || findEnvPath(process.cwd());
    dotenvConfig({ path: dotenvPath });
    isInitialized = true;
  }
}

// Auto-initialize on import with default path
initializeEnv();
