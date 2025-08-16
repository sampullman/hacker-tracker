import { getBoss } from '../boss';
import { 
  PLACEHOLDER_JOB_NAME, 
  placeholderJobHandler, 
  schedulePlaceholderJob 
} from './placeholder-job';

export async function registerAllJobs(): Promise<void> {
  const boss = await getBoss();
  
  await boss.work(PLACEHOLDER_JOB_NAME, placeholderJobHandler);
  console.log('[Jobs] Registered handler for:', PLACEHOLDER_JOB_NAME);
}

export async function scheduleAllJobs(): Promise<void> {
  await schedulePlaceholderJob();
  console.log('[Jobs] All jobs scheduled');
}

export * from './placeholder-job';