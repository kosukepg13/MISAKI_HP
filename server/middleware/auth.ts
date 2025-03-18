import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// リクエストにユーザー情報を追加する拡張インターフェース
export interface AuthRequest extends Request {
  user?: any;
}

// JWTトークンを検証して認証するミドルウェア
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // ヘッダーからトークンを取得
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ error: '認証が必要です' });
      return;
    }
    
    // トークンの検証
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
    
    // デコードされたユーザーIDでユーザーを検索
    const user = await User.findById(decoded.id);
    
    if (!user) {
      res.status(401).json({ error: 'ユーザーが見つかりません' });
      return;
    }
    
    // リクエストにユーザー情報を追加
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: '認証に失敗しました' });
    return;
  }
};

// 管理者権限を確認するミドルウェア
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({ error: '認証が必要です' });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({ error: '管理者権限が必要です' });
    return;
  }
  next();
};

// 編集者以上の権限を確認するミドルウェア
export const isEditor = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({ error: '認証が必要です' });
    return;
  }

  if (!['admin', 'editor'].includes(req.user.role)) {
    res.status(403).json({ error: '編集者以上の権限が必要です' });
    return;
  }
  next();
}; 