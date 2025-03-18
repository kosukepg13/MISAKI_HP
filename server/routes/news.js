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
const newsController = __importStar(require("../controllers/news"));
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
// 全てのニュース記事を取得（公開されているもののみ、認証不要）
router.get('/', newsController.getAllNews);
// 特定のニュース記事を取得（公開されているもののみ、認証不要）
router.get('/:id', newsController.getNewsById);
// 新しいニュース記事を作成（認証済み、編集者以上）
router.post('/', auth_1.authenticate, auth_1.isEditor, upload_1.upload.single('image'), // 画像アップロード
[
    // バリデーションルール
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('タイトルを入力してください')
        .isLength({ max: 200 })
        .withMessage('タイトルは200文字以内で入力してください')
        .trim(),
    (0, express_validator_1.body)('content')
        .notEmpty()
        .withMessage('内容を入力してください'),
    (0, express_validator_1.body)('summary')
        .notEmpty()
        .withMessage('要約を入力してください')
        .isLength({ max: 500 })
        .withMessage('要約は500文字以内で入力してください')
        .trim(),
    (0, express_validator_1.body)('publishDate')
        .optional()
        .isISO8601()
        .withMessage('有効な日付を入力してください'),
    (0, express_validator_1.body)('isPublished')
        .optional()
        .isBoolean()
        .withMessage('公開ステータスは真偽値で指定してください'),
    (0, express_validator_1.body)('category')
        .optional()
        .isIn(['announcement', 'event', 'performance', 'other'])
        .withMessage('カテゴリーは「announcement」「event」「performance」「other」のいずれかを選択してください')
], newsController.createNews);
// ニュース記事を更新（認証済み、編集者以上）
router.put('/:id', auth_1.authenticate, auth_1.isEditor, upload_1.upload.single('image'), // 画像アップロード
[
    // バリデーションルール
    (0, express_validator_1.body)('title')
        .optional()
        .isLength({ max: 200 })
        .withMessage('タイトルは200文字以内で入力してください')
        .trim(),
    (0, express_validator_1.body)('content')
        .optional(),
    (0, express_validator_1.body)('summary')
        .optional()
        .isLength({ max: 500 })
        .withMessage('要約は500文字以内で入力してください')
        .trim(),
    (0, express_validator_1.body)('publishDate')
        .optional()
        .isISO8601()
        .withMessage('有効な日付を入力してください'),
    (0, express_validator_1.body)('isPublished')
        .optional()
        .isBoolean()
        .withMessage('公開ステータスは真偽値で指定してください'),
    (0, express_validator_1.body)('category')
        .optional()
        .isIn(['announcement', 'event', 'performance', 'other'])
        .withMessage('カテゴリーは「announcement」「event」「performance」「other」のいずれかを選択してください')
], newsController.updateNews);
// ニュース記事を削除（認証済み、編集者以上）
router.delete('/:id', auth_1.authenticate, auth_1.isEditor, newsController.deleteNews);
exports.default = router;
