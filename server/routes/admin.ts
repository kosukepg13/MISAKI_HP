import express from 'express';
import { authenticate, isAdmin } from '../middleware/auth';
import { getStats } from '../controllers/admin';

const router = express.Router();

router.get('/stats', authenticate as any, isAdmin as any, getStats as any);

export default router;
