import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth';
import { authenticate, isAdmin } from '../middleware/auth';

const router = express.Router();

// ユーザー登録
router.post(
  '/register',
  [
    // バリデーションルール
    body('username')
      .isLength({ min: 3, max: 20 })
      .withMessage('ユーザー名は3〜20文字で入力してください')
      .trim(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('パスワードは6文字以上で入力してください'),
    body('name')
      .notEmpty()
      .withMessage('名前を入力してください')
      .trim(),
    body('email')
      .isEmail()
      .withMessage('有効なメールアドレスを入力してください')
      .normalizeEmail(),
    body('role')
      .optional()
      .isIn(['admin', 'editor'])
      .withMessage('ロールは「admin」または「editor」のいずれかを選択してください')
  ],
  authenticate as any,  // 認証済みユーザーのみ新規ユーザー登録可能
  isAdmin as any,       // 管理者権限を持つユーザーのみ
  authController.register as any
);

// ログイン
router.post(
  '/login',
  [
    // バリデーションルール
    body('username')
      .notEmpty()
      .withMessage('ユーザー名を入力してください')
      .trim(),
    body('password')
      .notEmpty()
      .withMessage('パスワードを入力してください')
  ],
  authController.login as any
);

// プロフィール取得 (認証済みユーザーのみ)
router.get('/profile', authenticate as any, authController.getProfile as any);

// 初期管理者アカウント作成 (開発環境のみ)
if (process.env.NODE_ENV !== 'production') {
  router.post('/init-admin', authController.createInitialAdmin as any);
  router.post('/reset-admin', authController.resetAdminCredentials as any);
}

export default router; 