import { Router } from 'express';
import type { Request, Response } from 'express';
import type { Tracker, CreateTrackerRequest, ApiResponse, PaginatedResponse } from 'shared-types';

const router = Router();

// TODO: Implement these routes after Tracker entity is created
router.get('/', async (req: Request, res: Response<ApiResponse<PaginatedResponse<Tracker>>>) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

router.post('/', async (req: Request<{}, ApiResponse<Tracker>, CreateTrackerRequest>, res: Response<ApiResponse<Tracker>>) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

router.get('/:id', async (req: Request, res: Response<ApiResponse<Tracker>>) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

router.put('/:id', async (req: Request, res: Response<ApiResponse<Tracker>>) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

router.delete('/:id', async (req: Request, res: Response<ApiResponse>) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

export { router as trackerRoutes };