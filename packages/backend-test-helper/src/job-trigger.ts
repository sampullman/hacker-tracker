import PgBoss from 'pg-boss';
import { getDatabaseUrl } from 'shared-backend/config';

export class JobTrigger {
  private boss: PgBoss | null = null;
  private started: boolean = false;

  constructor(private connectionString?: string) {
    if (!connectionString) {
      this.connectionString = getDatabaseUrl();
    }
  }

  async connect(): Promise<void> {
    if (this.boss) {
      return;
    }

    this.boss = new PgBoss({
      connectionString: this.connectionString!,
      supervise: false,
      schedule: false,
    });

    await this.boss.start();
    this.started = true;
    console.log('[JobTrigger] Connected to pg-boss');
  }

  async disconnect(): Promise<void> {
    if (this.boss && this.started) {
      await this.boss.stop();
      this.boss = null;
      this.started = false;
      console.log('[JobTrigger] Disconnected from pg-boss');
    }
  }

  async triggerJob(name: string, data?: any): Promise<string | null> {
    if (!this.boss || !this.started) {
      await this.connect();
    }

    const jobId = await this.boss!.send(name, data || {});
    console.log(`[JobTrigger] Triggered job '${name}' with ID: ${jobId}`);
    return jobId;
  }

  async triggerJobWithOptions(name: string, data?: any, options?: any): Promise<string | null> {
    if (!this.boss || !this.started) {
      await this.connect();
    }

    const jobId = await this.boss!.send(name, data || {}, options);
    console.log(`[JobTrigger] Triggered job '${name}' with ID: ${jobId} and options:`, options);
    return jobId;
  }

  async getJobStatus(jobId: string): Promise<any> {
    if (!this.boss || !this.started) {
      await this.connect();
    }

    // Use a placeholder queue name for job status lookups
    const job = await this.boss!.getJobById('placeholder-job', jobId);
    return job;
  }

  async completeJob(jobId: string, data?: any): Promise<void> {
    if (!this.boss || !this.started) {
      await this.connect();
    }

    await this.boss!.complete(jobId, data);
    console.log(`[JobTrigger] Marked job ${jobId} as complete`);
  }

  async failJob(jobId: string, error?: any): Promise<void> {
    if (!this.boss || !this.started) {
      await this.connect();
    }

    await this.boss!.fail(jobId, error);
    console.log(`[JobTrigger] Marked job ${jobId} as failed`);
  }

  async triggerPlaceholderJob(message?: string): Promise<string | null> {
    return this.triggerJob('placeholder-job', {
      message: message || 'Test trigger from backend-test-helper',
      timestamp: new Date().toISOString(),
    });
  }
}