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
const authController = __importStar(require("../controllers/auth"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// ユーザー登録
router.post('/register', [
    // バリデーションルール
    (0, express_validator_1.body)('username')
        .isLength({ min: 3, max: 20 })
        .withMessage('ユーザー名は3〜20文字で入力してください')
        .trim(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('パスワードは6文字以上で入力してください'),
    (0, express_validator_1.body)('name')
        .notEmpty()
        .withMessage('名前を入力してください')
        .trim(),
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('有効なメールアドレスを入力してください')
        .normalizeEmail(),
    (0, express_validator_1.body)('role')
        .optional()
        .isIn(['admin', 'editor'])
        .withMessage('ロールは「admin」または「editor」のいずれかを選択してください')
], auth_1.authenticate, // 認証済みユーザーのみ新規ユーザー登録可能
auth_1.isAdmin, // 管理者権限を持つユーザーのみ
authController.register);
// ログイン
router.post('/login', [
    // バリデーションルール
    (0, express_validator_1.body)('username')
        .notEmpty()
        .withMessage('ユーザー名を入力してください')
        .trim(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('パスワードを入力してください')
], authController.login);
// プロフィール取得 (認証済みユーザーのみ)
router.get('/profile', auth_1.authenticate, authController.getProfile);
// 初期管理者アカウント作成 (開発環境のみ)
if (process.env.NODE_ENV !== 'production') {
    router.post('/init-admin', authController.createInitialAdmin);
}
exports.default = router;
