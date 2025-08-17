import { startBoss, stopBoss, getBoss } from './boss.js';
import { registerAllJobs, scheduleAllJobs } from './jobs/index.js';
import { jobsConfig } from './config.js';

export * from './boss.js';
export * from './jobs/index.js';
export * from './config.js';

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