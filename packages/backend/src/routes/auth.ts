import { Router } from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import PgBoss from 'pg-boss';
import type { CreateUserRequest, LoginRequest, AuthResponse, ApiResponse, User } from 'shared-types';
import { config } from '../config/index.js';
import { getDataSource } from '../database/index.js';
import { UserEntity, UserRole } from '../database/entities/User.js';
import { EmailConfirmationEntity } from '../database/entities/EmailConfirmation.js';
import { authenticateToken, type AuthenticatedRequest } from '../middleware/auth.js';
import { EmailConfirmationService } from '../services/email-confirmation.js';
import { getDatabaseUrl } from 'shared-backend/config';

const router = Router();

// Initialize pg-boss for job queueing
let pgBoss: PgBoss | null = null;

async function getPgBoss(): Promise<PgBoss> {
  if (!pgBoss) {
    pgBoss = new PgBoss({
      connectionString: getDatabaseUrl(),
      // We only need to send jobs, not process them
      noSupervisor: true,
      noScheduling: true,
    } as any);
    await pgBoss.start();
  }
  return pgBoss;
}

router.post('/register', async (req: Request<{}, ApiResponse<AuthResponse>, CreateUserRequest>, res: Response<ApiResponse<AuthResponse>>) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Email, username, and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    const dataSource = getDataSource();
    const userRepository = dataSource.getRepository(UserEntity);

    const existingUser = await userRepository.findOne({
      where: [{ email }, { username }]
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return res.status(400).json({ error: `User with this ${field} already exists` });
    }

    const passwordHash = await bcrypt.hash(password, config.auth.bcryptRounds);
    
    // Use transaction to ensure atomicity
    const savedUser = await dataSource.transaction(async (manager) => {
      // Create user
      const user = manager.create(UserEntity, {
        email,
        username,
        passwordHash,
        emailConfirmed: false,
        role: 'user'
      });
      
      const savedUser = await manager.save(user);
      
      // Create confirmation code
      const code = await EmailConfirmationService.createConfirmationCode(savedUser.id, manager);
      
      // Queue email job (this will be committed with the transaction)
      const boss = await getPgBoss();
      await EmailConfirmationService.sendConfirmationEmail(
        savedUser.id,
        savedUser.email,
        savedUser.username,
        code,
        boss
      );
      
      return savedUser;
    });

    const token = jwt.sign(
      { userId: savedUser.id },
      config.auth.jwtSecret,
      { expiresIn: config.auth.jwtExpiresIn } as jwt.SignOptions
    );

    const userResponse: User = {
      id: savedUser.id,
      email: savedUser.email,
      username: savedUser.username,
      emailConfirmed: savedUser.emailConfirmed,
      role: savedUser.role,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt
    };

    res.status(201).json({
      data: {
        user: userResponse,
        token,
        requiresEmailConfirmation: true
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req: Request<{}, ApiResponse<AuthResponse>, LoginRequest>, res: Response<ApiResponse<AuthResponse>>) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const dataSource = getDataSource();
    const userRepository = dataSource.getRepository(UserEntity);

    const user = await userRepository.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id },
      config.auth.jwtSecret,
      { expiresIn: config.auth.jwtExpiresIn } as jwt.SignOptions
    );

    const userResponse: User = {
      id: user.id,
      email: user.email,
      username: user.username,
      emailConfirmed: user.emailConfirmed,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(200).json({
      data: {
        user: userResponse,
        token,
        requiresEmailConfirmation: !user.emailConfirmed
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/confirm-email', async (req: Request<{}, ApiResponse<{ success: boolean }>, { userId: string; code: string }>, res: Response<ApiResponse<{ success: boolean }>>) => {
  try {
    const { userId, code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({ error: 'User ID and confirmation code are required' });
    }

    const success = await EmailConfirmationService.verifyCode(userId, code);

    if (!success) {
      return res.status(400).json({ error: 'Invalid or expired confirmation code' });
    }

    res.status(200).json({
      data: { success: true }
    });
  } catch (error) {
    console.error('Email confirmation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/resend-confirmation', authenticateToken, async (req: Request, res: Response<ApiResponse<{ success: boolean }>>) => {
  try {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (authReq.user.emailConfirmed) {
      return res.status(400).json({ error: 'Email already confirmed' });
    }

    const dataSource = getDataSource();
    
    // Create new confirmation code
    const code = await EmailConfirmationService.createConfirmationCode(authReq.user.id);
    
    // Queue email job
    const boss = await getPgBoss();
    await EmailConfirmationService.sendConfirmationEmail(
      authReq.user.id,
      authReq.user.email,
      authReq.user.username,
      code,
      boss
    );

    res.status(200).json({
      data: { success: true }
    });
  } catch (error) {
    console.error('Resend confirmation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', async (req: Request, res: Response<ApiResponse>) => {
  res.status(200).json({ 
    data: { message: 'Logged out successfully' }
  });
});

router.get('/me', authenticateToken, async (req: Request, res: Response<ApiResponse<User>>) => {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.user) {
    return res.status(401).json({ error: 'User not found' });
  }

  res.status(200).json({
    data: authReq.user
  });
});

// Test helper endpoint (only in development/test)
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  router.get('/test/confirmation-code/:userId', async (req: Request<{ userId: string }>, res: Response<ApiResponse<{ code: string | null }>>) => {
    try {
      const code = await EmailConfirmationService.getLatestCodeForTesting(req.params.userId);
      res.status(200).json({ data: { code } });
    } catch (error) {
      console.error('Test helper error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}

export { router as authRoutes };