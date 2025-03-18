import express from 'express';
import { body } from 'express-validator';
import * as newsController from '../controllers/news';
import { authenticate, isEditor } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// 全てのニュース記事を取得（公開されているもののみ、認証不要）
router.get('/', newsController.getAllNews as any);

// 特定のニュース記事を取得（公開されているもののみ、認証不要）
router.get('/:id', newsController.getNewsById as any);

// 新しいニュース記事を作成（認証済み、編集者以上）
router.post(
  '/',
  authenticate,
  isEditor,
  upload.single('image'), // 画像アップロード
  [
    // バリデーションルール
    body('title')
      .notEmpty()
      .withMessage('タイトルを入力してください')
      .isLength({ max: 200 })
      .withMessage('タイトルは200文字以内で入力してください')
      .trim(),
    body('content')
      .notEmpty()
      .withMessage('内容を入力してください'),
    body('summary')
      .notEmpty()
      .withMessage('要約を入力してください')
      .isLength({ max: 500 })
      .withMessage('要約は500文字以内で入力してください')
      .trim(),
    body('publishDate')
      .optional()
      .isISO8601()
      .withMessage('有効な日付を入力してください'),
    body('isPublished')
      .optional()
      .isBoolean()
      .withMessage('公開ステータスは真偽値で指定してください'),
    body('category')
      .optional()
      .isIn(['announcement', 'event', 'performance', 'other'])
      .withMessage('カテゴリーは「announcement」「event」「performance」「other」のいずれかを選択してください')
  ],
  newsController.createNews as any
);

// ニュース記事を更新（認証済み、編集者以上）
router.put(
  '/:id',
  authenticate,
  isEditor,
  upload.single('image'), // 画像アップロード
  [
    // バリデーションルール
    body('title')
      .optional()
      .isLength({ max: 200 })
      .withMessage('タイトルは200文字以内で入力してください')
      .trim(),
    body('content')
      .optional(),
    body('summary')
      .optional()
      .isLength({ max: 500 })
      .withMessage('要約は500文字以内で入力してください')
      .trim(),
    body('publishDate')
      .optional()
      .isISO8601()
      .withMessage('有効な日付を入力してください'),
    body('isPublished')
      .optional()
      .isBoolean()
      .withMessage('公開ステータスは真偽値で指定してください'),
    body('category')
      .optional()
      .isIn(['announcement', 'event', 'performance', 'other'])
      .withMessage('カテゴリーは「announcement」「event」「performance」「other」のいずれかを選択してください')
  ],
  newsController.updateNews as any
);

// ニュース記事を削除（認証済み、編集者以上）
router.delete(
  '/:id',
  authenticate,
  isEditor,
  newsController.deleteNews as any
);

export default router; 