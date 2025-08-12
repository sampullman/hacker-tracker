import { Router } from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { CreateUserRequest, LoginRequest, AuthResponse, ApiResponse, User } from 'shared-types';
import { config } from '../config/index.js';
import { getDataSource } from '../database/index.js';
import { UserEntity, UserRole } from '../database/entities/User.js';
import { authenticateToken, type AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

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

    const user = userRepository.create({
      email,
      username,
      passwordHash,
      emailConfirmed: false,
      role: 'user'
    });

    const savedUser = await userRepository.save(user);

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
        token
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
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
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

export { router as authRoutes };