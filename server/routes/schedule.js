"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const scheduleController = __importStar(require("../controllers/schedule"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// 全てのスケジュールを取得（アクティブなもののみ、認証不要）
router.get('/', scheduleController.getAllSchedules);
// 特定のスケジュールを取得（アクティブなもののみ、認証不要）
router.get('/:id', scheduleController.getScheduleById);
// 新しいスケジュールを作成（認証済み、編集者以上）
router.post('/', auth_1.authenticate, auth_1.isEditor, [
    // バリデーションルール
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('タイトルを入力してください')
        .trim(),
    (0, express_validator_1.body)('description')
        .notEmpty()
        .withMessage('詳細説明を入力してください'),
    (0, express_validator_1.body)('instructor')
        .notEmpty()
        .withMessage('講師名を入力してください')
        .trim(),
    (0, express_validator_1.body)('studio')
        .notEmpty()
        .withMessage('スタジオ名を入力してください')
        .trim(),
    (0, express_validator_1.body)('level')
        .optional()
        .isIn(['beginner', 'intermediate', 'advanced', 'all'])
        .withMessage('レベルは「beginner」「intermediate」「advanced」「all」のいずれかを選択してください'),
    (0, express_validator_1.body)('dayOfWeek')
        .isInt({ min: 0, max: 6 })
        .withMessage('曜日は0（日曜日）〜6（土曜日）の範囲で入力してください'),
    (0, express_validator_1.body)('startTime')
        .notEmpty()
        .withMessage('開始時間を入力してください')
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('開始時間は「HH:MM」形式で入力してください'),
    (0, express_validator_1.body)('endTime')
        .notEmpty()
        .withMessage('終了時間を入力してください')
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('終了時間は「HH:MM」形式で入力してください'),
    (0, express_validator_1.body)('capacity')
        .isInt({ min: 1 })
        .withMessage('定員は1以上の整数で入力してください'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('アクティブステータスは真偽値で指定してください')
], scheduleController.createSchedule);
// スケジュールを更新（認証済み、編集者以上）
router.put('/:id', auth_1.authenticate, auth_1.isEditor, [
    // バリデーションルール
    (0, express_validator_1.body)('title')
        .optional()
        .trim(),
    (0, express_validator_1.body)('description')
        .optional(),
    (0, express_validator_1.body)('instructor')
        .optional()
        .trim(),
    (0, express_validator_1.body)('studio')
        .optional()
        .trim(),
    (0, express_validator_1.body)('level')
        .optional()
        .isIn(['beginner', 'intermediate', 'advanced', 'all'])
        .withMessage('レベルは「beginner」「intermediate」「advanced」「all」のいずれかを選択してください'),
    (0, express_validator_1.body)('dayOfWeek')
        .optional()
        .isInt({ min: 0, max: 6 })
        .withMessage('曜日は0（日曜日）〜6（土曜日）の範囲で入力してください'),
    (0, express_validator_1.body)('startTime')
        .optional()
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('開始時間は「HH:MM」形式で入力してください'),
    (0, express_validator_1.body)('endTime')
        .optional()
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('終了時間は「HH:MM」形式で入力してください'),
    (0, express_validator_1.body)('capacity')
        .optional()
        .isInt({ min: 1 })
        .withMessage('定員は1以上の整数で入力してください'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('アクティブステータスは真偽値で指定してください')
], scheduleController.updateSchedule);
// スケジュールを削除（認証済み、編集者以上）
router.delete('/:id', auth_1.authenticate, auth_1.isEditor, scheduleController.deleteSchedule);
exports.default = router;
