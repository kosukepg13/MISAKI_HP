import { Response } from 'express';
import News from '../models/News';
import Schedule from '../models/Schedule';
import Media from '../models/Media';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const [newsCount, scheduleCount, mediaCount, userCount] = await Promise.all([
      News.countDocuments(),
      Schedule.countDocuments(),
      Media.countDocuments(),
      User.countDocuments()
    ]);

    res.json({ newsCount, scheduleCount, mediaCount, userCount });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
};
