import { getBoss } from '../boss.js';
import { getServerConfig } from 'shared-backend/config';

export const EMAIL_CONFIRMATION_JOB_NAME = 'send-email-confirmation';

export interface EmailConfirmationJobData {
  userId: string;
  email: string;
  username: string;
  code: string;
}

export async function emailConfirmationJobHandler(jobs: any[]): Promise<void> {
  for (const job of jobs) {
    const data = job.data as EmailConfirmationJobData;
    
    console.log('[EmailConfirmationJob] Processing email confirmation for:', data.email);
    console.log('[EmailConfirmationJob] User ID:', data.userId);
    console.log('[EmailConfirmationJob] Username:', data.username);
    
    const serverConfig = getServerConfig();
    
    if (serverConfig.isDevelopment || serverConfig.isTest) {
      // In development/test, just log the code
      console.log('[EmailConfirmationJob] DEVELOPMENT MODE - Confirmation code:', data.code);
      console.log('[EmailConfirmationJob] Email would be sent to:', data.email);
      
      // Store code in a way tests can access it
      if (serverConfig.isTest) {
        // Store in global for test access
        (global as any).__lastEmailConfirmationCode = data.code;
        (global as any).__lastEmailConfirmationUserId = data.userId;
      }
    } else {
      // Production email sending (stub for now)
      console.log('[EmailConfirmationJob] PRODUCTION MODE - Sending email to:', data.email);
      // TODO: Implement actual email sending
      // await sendEmail({
      //   to: data.email,
      //   subject: 'Confirm your email',
      //   body: `Your confirmation code is: ${data.code}`
      // });
    }
    
    console.log('[EmailConfirmationJob] Completed successfully for:', data.email);
  }
}

export async function registerEmailConfirmationJob(): Promise<void> {
  const boss = await getBoss();
  
  // Create the queue if it doesn't exist
  await boss.createQueue(EMAIL_CONFIRMATION_JOB_NAME);
  
  // Register the handler
  await boss.work(EMAIL_CONFIRMATION_JOB_NAME, emailConfirmationJobHandler);
  console.log('[Jobs] Registered handler for:', EMAIL_CONFIRMATION_JOB_NAME);
}

export async function triggerEmailConfirmationJob(data: EmailConfirmationJobData): Promise<string | null> {
  const boss = await getBoss();
  
  const jobId = await boss.send(EMAIL_CONFIRMATION_JOB_NAME, data, {
    retryLimit: 3,
    retryDelay: 60,
  });
  
  console.log('[EmailConfirmationJob] Triggered job with ID:', jobId);
  return jobId;
}