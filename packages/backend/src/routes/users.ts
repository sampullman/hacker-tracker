import { Router } from 'express';
import type { Request, Response } from 'express';
import type { User, ApiResponse } from 'shared-types';

const router = Router();

// TODO: Implement these routes after User entity is created
router.get('/me', async (req: Request, res: Response<ApiResponse<User>>) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

router.get('/:id', async (req: Request, res: Response<ApiResponse<User>>) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

export { router as userRoutes };