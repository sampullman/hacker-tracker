import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import type { User } from 'shared-types';
import { config } from '../config/index.js';
import { getDataSource } from '../database/index.js';
import { UserEntity, UserRole } from '../database/entities/User.js';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const payload = jwt.verify(token, config.auth.jwtSecret) as { userId: string };
    
    const dataSource = getDataSource();
    const userRepository = dataSource.getRepository(UserEntity);
    
    const user = await userRepository.findOne({
      where: { id: payload.userId }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    (req as AuthenticatedRequest).user = {
      id: user.id,
      email: user.email,
      username: user.username,
      emailConfirmed: user.emailConfirmed,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export const requireRole = (role: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Authenticate the token first. We pass a no-op `next` handler so
    // `authenticateToken` doesn't automatically continue the request.
    await authenticateToken(req, res, () => {});

    // If the token was invalid `authenticateToken` will have already sent
    // a response. In that case we simply stop further processing to avoid
    // hanging requests.
    if (res.headersSent) {
      return;
    }

    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      return res.status(401).json({ error: 'Access token required' });
    }

    if (authReq.user.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

export const requireAdmin = requireRole('admin');

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, config.auth.jwtSecret) as { userId: string };
    
    const dataSource = getDataSource();
    const userRepository = dataSource.getRepository(UserEntity);
    
    const user = await userRepository.findOne({
      where: { id: payload.userId }
    });

    if (user) {
      (req as AuthenticatedRequest).user = {
        id: user.id,
        email: user.email,
        username: user.username,
        emailConfirmed: user.emailConfirmed,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    }
  } catch (error) {
    // Ignore token errors for optional auth
  }

  next();
};