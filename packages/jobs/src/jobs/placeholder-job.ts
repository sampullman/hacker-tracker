import { getBoss } from '../boss';

export const PLACEHOLDER_JOB_NAME = 'placeholder-job';

export interface PlaceholderJobData {
  message?: string;
  timestamp?: string;
}

export async function placeholderJobHandler(jobs: any[]): Promise<void> {
  for (const job of jobs) {
    const data = job.data as PlaceholderJobData;
    
    console.log('[PlaceholderJob] Running at:', new Date().toISOString());
    console.log('[PlaceholderJob] Job ID:', job.id);
    console.log('[PlaceholderJob] Data:', data);
    
    if (data?.message) {
      console.log('[PlaceholderJob] Custom message:', data.message);
    }
    
    console.log('[PlaceholderJob] Completed successfully');
  }
}

export async function schedulePlaceholderJob(): Promise<void> {
  const boss = await getBoss();
  
  await boss.createQueue(PLACEHOLDER_JOB_NAME);
  console.log('[PlaceholderJob] Queue created');
  
  await boss.schedule(
    PLACEHOLDER_JOB_NAME,
    '*/10 * * * *',
    { message: 'Scheduled placeholder job execution' },
    {
      tz: 'UTC',
    }
  );
  
  console.log('[PlaceholderJob] Scheduled to run every 10 minutes');
}

export async function triggerPlaceholderJob(data?: PlaceholderJobData): Promise<string | null> {
  const boss = await getBoss();
  
  const jobData: PlaceholderJobData = {
    message: data?.message || 'Manual trigger',
    timestamp: data?.timestamp || new Date().toISOString(),
  };
  
  const jobId = await boss.send(PLACEHOLDER_JOB_NAME, jobData);
  console.log('[PlaceholderJob] Manually triggered job:', jobId);
  
  return jobId;
}