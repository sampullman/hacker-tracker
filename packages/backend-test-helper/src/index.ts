export * from './job-trigger';

import { JobTrigger } from './job-trigger';

let globalJobTrigger: JobTrigger | null = null;

export function getJobTrigger(): JobTrigger {
  if (!globalJobTrigger) {
    globalJobTrigger = new JobTrigger();
  }
  return globalJobTrigger;
}

export async function cleanupJobTrigger(): Promise<void> {
  if (globalJobTrigger) {
    await globalJobTrigger.disconnect();
    globalJobTrigger = null;
  }
}