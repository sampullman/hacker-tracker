import './env.js'; // Ensure environment is initialized

export interface JobsConfig {
  enabled: boolean;
  retryLimit: number;
  retryDelay: number;
  archiveCompletedAfterSeconds: number;
  deleteAfterDays: number;
}

export function getJobsConfig(): JobsConfig {
  return {
    enabled: process.env.JOBS_ENABLED === 'true',
    retryLimit: parseInt(process.env.JOBS_RETRY_LIMIT || '3', 10),
    retryDelay: parseInt(process.env.JOBS_RETRY_DELAY || '60', 10),
    archiveCompletedAfterSeconds: parseInt(process.env.JOBS_ARCHIVE_AFTER || '3600', 10),
    deleteAfterDays: parseInt(process.env.JOBS_DELETE_AFTER || '7', 10),
  };
}