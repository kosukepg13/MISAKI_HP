import express from 'express';
import { body } from 'express-validator';
import * as mediaController from '../controllers/media';
import { authenticate, isEditor } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// 全てのメディアを取得（認証済み、編集者以上）
router.get('/', authenticate, isEditor, mediaController.getAllMedia as any);

// 特定のメディアを取得（認証済み、編集者以上）
router.get('/:id', authenticate, isEditor, mediaController.getMediaById as any);

// 新しいメディアをアップロード（認証済み、編集者以上）
router.post(
  '/',
  authenticate,
  isEditor,
  upload.single('file'), // ファイルアップロード
  [
    // バリデーションルール
    body('description')
      .optional()
      .trim(),
    body('type')
      .optional()
      .isIn(['image', 'document', 'video', 'other'])
      .withMessage('タイプは「image」「document」「video」「other」のいずれかを選択してください')
  ],
  mediaController.uploadMedia as any
);

// メディア情報を更新（認証済み、編集者以上）
router.put(
  '/:id',
  authenticate,
  isEditor,
  [
    // バリデーションルール
    body('description')
      .optional()
      .trim(),
    body('type')
      .optional()
      .isIn(['image', 'document', 'video', 'other'])
      .withMessage('タイプは「image」「document」「video」「other」のいずれかを選択してください')
  ],
  mediaController.updateMedia as any
);

// メディアを削除（認証済み、編集者以上）
router.delete(
  '/:id',
  authenticate,
  isEditor,
  mediaController.deleteMedia as any
);

export default router; 