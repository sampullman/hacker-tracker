import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const jobsConfig = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5440'),
    database: process.env.DB_NAME || 'hacker_tracker',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
  },
  enabled: process.env.JOBS_ENABLED === 'true',
  retryLimit: parseInt(process.env.JOBS_RETRY_LIMIT || '3'),
  retryDelay: parseInt(process.env.JOBS_RETRY_DELAY || '60'),
  archiveCompletedAfterSeconds: parseInt(process.env.JOBS_ARCHIVE_AFTER || '3600'),
  deleteArchivedAfterDays: parseInt(process.env.JOBS_DELETE_AFTER || '7'),
};

export function getDatabaseConnectionString(): string {
  const { host, port, database, user, password } = jobsConfig.database;
  return `postgres://${user}:${password}@${host}:${port}/${database}`;
}