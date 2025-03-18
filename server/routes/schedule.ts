import express from 'express';
import { body } from 'express-validator';
import * as scheduleController from '../controllers/schedule';
import { authenticate, isEditor } from '../middleware/auth';

const router = express.Router();

// 全てのスケジュールを取得（アクティブなもののみ、認証不要）
router.get('/', scheduleController.getAllSchedules as any);

// 特定のスケジュールを取得（アクティブなもののみ、認証不要）
router.get('/:id', scheduleController.getScheduleById as any);

// 新しいスケジュールを作成（認証済み、編集者以上）
router.post(
  '/',
  authenticate,
  isEditor,
  [
    // バリデーションルール
    body('title')
      .notEmpty()
      .withMessage('タイトルを入力してください')
      .trim(),
    body('description')
      .notEmpty()
      .withMessage('詳細説明を入力してください'),
    body('instructor')
      .notEmpty()
      .withMessage('講師名を入力してください')
      .trim(),
    body('studio')
      .notEmpty()
      .withMessage('スタジオ名を入力してください')
      .trim(),
    body('level')
      .optional()
      .isIn(['beginner', 'intermediate', 'advanced', 'all'])
      .withMessage('レベルは「beginner」「intermediate」「advanced」「all」のいずれかを選択してください'),
    body('dayOfWeek')
      .isInt({ min: 0, max: 6 })
      .withMessage('曜日は0（日曜日）〜6（土曜日）の範囲で入力してください'),
    body('startTime')
      .notEmpty()
      .withMessage('開始時間を入力してください')
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('開始時間は「HH:MM」形式で入力してください'),
    body('endTime')
      .notEmpty()
      .withMessage('終了時間を入力してください')
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('終了時間は「HH:MM」形式で入力してください'),
    body('capacity')
      .isInt({ min: 1 })
      .withMessage('定員は1以上の整数で入力してください'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('アクティブステータスは真偽値で指定してください')
  ],
  scheduleController.createSchedule as any
);

// スケジュールを更新（認証済み、編集者以上）
router.put(
  '/:id',
  authenticate,
  isEditor,
  [
    // バリデーションルール
    body('title')
      .optional()
      .trim(),
    body('description')
      .optional(),
    body('instructor')
      .optional()
      .trim(),
    body('studio')
      .optional()
      .trim(),
    body('level')
      .optional()
      .isIn(['beginner', 'intermediate', 'advanced', 'all'])
      .withMessage('レベルは「beginner」「intermediate」「advanced」「all」のいずれかを選択してください'),
    body('dayOfWeek')
      .optional()
      .isInt({ min: 0, max: 6 })
      .withMessage('曜日は0（日曜日）〜6（土曜日）の範囲で入力してください'),
    body('startTime')
      .optional()
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('開始時間は「HH:MM」形式で入力してください'),
    body('endTime')
      .optional()
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('終了時間は「HH:MM」形式で入力してください'),
    body('capacity')
      .optional()
      .isInt({ min: 1 })
      .withMessage('定員は1以上の整数で入力してください'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('アクティブステータスは真偽値で指定してください')
  ],
  scheduleController.updateSchedule as any
);

// スケジュールを削除（認証済み、編集者以上）
router.delete(
  '/:id',
  authenticate,
  isEditor,
  scheduleController.deleteSchedule as any
);

export default router; 