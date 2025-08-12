import { Router } from 'express';
import type { Request, Response } from 'express';
import type { User, ApiResponse } from 'shared-types';
import { getDataSource } from '../database/index.js';
import { UserEntity, UserRole } from '../database/entities/User.js';
import { authenticateToken, requireAdmin, type AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAdmin, async (req: Request, res: Response<ApiResponse<User[]>>) => {
  try {
    const dataSource = getDataSource();
    const userRepository = dataSource.getRepository(UserEntity);

    const users = await userRepository.find({
      order: { createdAt: 'DESC' }
    });

    const userResponses: User[] = users.map(user => ({
      id: user.id,
      email: user.email,
      username: user.username,
      emailConfirmed: user.emailConfirmed,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    res.status(200).json({ data: userResponses });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authenticateToken, async (req: Request, res: Response<ApiResponse<User>>) => {
  try {
    const { id } = req.params;
    const authReq = req as AuthenticatedRequest;
    
    if (!authReq.user) {
      return res.status(401).json({ error: 'Access token required' });
    }

    if (authReq.user.id !== id && authReq.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const dataSource = getDataSource();
    const userRepository = dataSource.getRepository(UserEntity);

    const user = await userRepository.findOne({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userResponse: User = {
      id: user.id,
      email: user.email,
      username: user.username,
      emailConfirmed: user.emailConfirmed,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(200).json({ data: userResponse });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticateToken, async (req: Request, res: Response<ApiResponse<User>>) => {
  try {
    const { id } = req.params;
    const { username, emailConfirmed, role } = req.body;
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const dataSource = getDataSource();
    const userRepository = dataSource.getRepository(UserEntity);

    const user = await userRepository.findOne({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (authReq.user.id !== id && authReq.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (username && username !== user.username) {
      const existingUser = await userRepository.findOne({
        where: { username }
      });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      user.username = username;
    }

    if (emailConfirmed !== undefined && authReq.user.role === 'admin') {
      user.emailConfirmed = emailConfirmed;
    }

    if (role !== undefined && authReq.user.role === 'admin') {
      user.role = role;
    }

    const updatedUser = await userRepository.save(user);

    const userResponse: User = {
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
      emailConfirmed: updatedUser.emailConfirmed,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };

    res.status(200).json({ data: userResponse });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', requireAdmin, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;

    const dataSource = getDataSource();
    const userRepository = dataSource.getRepository(UserEntity);

    const user = await userRepository.findOne({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await userRepository.remove(user);

    res.status(200).json({ data: { message: 'User deleted successfully' } });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as userRoutes };