import { startBoss, stopBoss, getBoss } from './boss';
import { registerAllJobs, scheduleAllJobs } from './jobs/index';
import { jobsConfig } from './config';

export * from './boss';
export * from './jobs/index';
export * from './config';

async function main(): Promise<void> {
  if (!jobsConfig.enabled) {
    console.log('[Jobs] Job processing is disabled. Set JOBS_ENABLED=true to enable.');
    process.exit(0);
  }

  try {
    console.log('[Jobs] Starting job processor...');
    
    await startBoss();
    
    await registerAllJobs();
    
    await scheduleAllJobs();
    
    console.log('[Jobs] Job processor started successfully');
    
    process.on('SIGTERM', async () => {
      console.log('[Jobs] SIGTERM received, shutting down gracefully...');
      await stopBoss();
      process.exit(0);
    });
    
    process.on('SIGINT', async () => {
      console.log('[Jobs] SIGINT received, shutting down gracefully...');
      await stopBoss();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('[Jobs] Failed to start job processor:', error);
    process.exit(1);
  }
}

// Check if this file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}