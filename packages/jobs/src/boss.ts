import PgBoss from 'pg-boss';
import { getDatabaseConnectionString, jobsConfig } from './config';

let bossInstance: PgBoss | null = null;

export async function getBoss(): Promise<PgBoss> {
  if (!bossInstance) {
    const connectionString = getDatabaseConnectionString();
    
    bossInstance = new PgBoss({
      connectionString,
      retryLimit: jobsConfig.retryLimit,
      retryDelay: jobsConfig.retryDelay,
      archiveCompletedAfterSeconds: jobsConfig.archiveCompletedAfterSeconds,
      deleteAfterDays: jobsConfig.deleteArchivedAfterDays,
      monitorStateIntervalSeconds: 30,
      maintenanceIntervalSeconds: 120,
    });

    bossInstance.on('error', (error: Error) => {
      console.error('[PgBoss] Error:', error);
    });

    bossInstance.on('monitor-states', (states: any) => {
      console.log('[PgBoss] Monitor states:', states);
    });
  }

  return bossInstance;
}

export async function startBoss(): Promise<void> {
  if (!jobsConfig.enabled) {
    console.log('[PgBoss] Jobs are disabled. Set JOBS_ENABLED=true to enable.');
    return;
  }

  const boss = await getBoss();
  await boss.start();
  console.log('[PgBoss] Started successfully');
}

export async function stopBoss(): Promise<void> {
  if (bossInstance) {
    await bossInstance.stop();
    console.log('[PgBoss] Stopped successfully');
    bossInstance = null;
  }
}