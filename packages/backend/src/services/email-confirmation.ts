import { getDataSource } from '../database/index.js';
import { EmailConfirmationEntity } from '../database/entities/EmailConfirmation.js';
import { UserEntity } from '../database/entities/User.js';
import PgBoss from 'pg-boss';
import { getDatabaseUrl, getServerConfig } from 'shared-backend/config';

export class EmailConfirmationService {
  private static generateCode(): string {
    // Generate a 6-digit numeric code
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async createConfirmationCode(userId: string, transaction?: any): Promise<string> {
    const dataSource = getDataSource();
    const repository = dataSource.getRepository(EmailConfirmationEntity);
    
    // Generate code
    const code = this.generateCode();
    
    // Set expiration to 15 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);
    
    // Create confirmation record
    const confirmation = repository.create({
      userId,
      code,
      expiresAt,
      used: false
    });
    
    if (transaction) {
      await transaction.save(confirmation);
    } else {
      await repository.save(confirmation);
    }
    
    return code;
  }

  static async sendConfirmationEmail(
    userId: string,
    email: string,
    username: string,
    code: string,
    boss: PgBoss
  ): Promise<void> {
    // Send job to email queue
    const jobData = {
      userId,
      email,
      username,
      code
    };
    
    await boss.send('send-email-confirmation', jobData, {
      retryLimit: 3,
      retryDelay: 60,
    });
  }

  static async verifyCode(userId: string, code: string): Promise<boolean> {
    const dataSource = getDataSource();
    const confirmationRepo = dataSource.getRepository(EmailConfirmationEntity);
    const userRepo = dataSource.getRepository(UserEntity);
    
    // Find valid confirmation
    const confirmation = await confirmationRepo.findOne({
      where: {
        userId,
        code,
        used: false
      }
    });
    
    if (!confirmation) {
      return false;
    }
    
    // Check if expired
    if (new Date() > confirmation.expiresAt) {
      return false;
    }
    
    // Mark as used and update user
    await dataSource.transaction(async (manager) => {
      await manager.update(EmailConfirmationEntity, confirmation.id, { used: true });
      await manager.update(UserEntity, userId, { emailConfirmed: true });
    });
    
    return true;
  }

  static async getLatestCodeForTesting(userId: string): Promise<string | null> {
    const serverConfig = getServerConfig();
    if (!serverConfig.isDevelopment && !serverConfig.isTest) {
      throw new Error('This method is only available in development/test environments');
    }
    
    const dataSource = getDataSource();
    const repository = dataSource.getRepository(EmailConfirmationEntity);
    
    const confirmation = await repository.findOne({
      where: {
        userId,
        used: false
      },
      order: {
        createdAt: 'DESC'
      }
    });
    
    return confirmation?.code || null;
  }

  static async cleanupExpiredCodes(): Promise<void> {
    const dataSource = getDataSource();
    const repository = dataSource.getRepository(EmailConfirmationEntity);
    
    await repository
      .createQueryBuilder()
      .delete()
      .where('expiresAt < :now', { now: new Date() })
      .orWhere('used = true AND createdAt < :oldDate', {
        oldDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours
      })
      .execute();
  }
}