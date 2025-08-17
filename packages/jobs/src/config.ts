import { getDatabaseConfig, getJobsConfig } from 'shared-backend/config';

// Re-export using shared-backend configuration
export const jobsConfig = getJobsConfig();

export function getDatabaseConnectionString(): string {
  const dbConfig = getDatabaseConfig();
  const { host, port, database, username, password } = dbConfig;
  return `postgres://${username}:${password}@${host}:${port}/${database}`;
}