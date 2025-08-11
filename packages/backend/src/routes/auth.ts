import { Router } from 'express';
import type { Request, Response } from 'express';
import type { CreateUserRequest, LoginRequest, AuthResponse, ApiResponse } from 'shared-types';

const router = Router();

// TODO: Implement these routes after User entity is created
router.post('/register', async (req: Request<{}, ApiResponse<AuthResponse>, CreateUserRequest>, res: Response<ApiResponse<AuthResponse>>) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

router.post('/login', async (req: Request<{}, ApiResponse<AuthResponse>, LoginRequest>, res: Response<ApiResponse<AuthResponse>>) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

router.post('/logout', async (req: Request, res: Response<ApiResponse>) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

export { router as authRoutes };