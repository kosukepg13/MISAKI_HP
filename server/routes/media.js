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
const mediaController = __importStar(require("../controllers/media"));
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
// 全てのメディアを取得（認証済み、編集者以上）
router.get('/', auth_1.authenticate, auth_1.isEditor, mediaController.getAllMedia);
// 特定のメディアを取得（認証済み、編集者以上）
router.get('/:id', auth_1.authenticate, auth_1.isEditor, mediaController.getMediaById);
// 新しいメディアをアップロード（認証済み、編集者以上）
router.post('/', auth_1.authenticate, auth_1.isEditor, upload_1.upload.single('file'), // ファイルアップロード
[
    // バリデーションルール
    (0, express_validator_1.body)('description')
        .optional()
        .trim(),
    (0, express_validator_1.body)('type')
        .optional()
        .isIn(['image', 'document', 'video', 'other'])
        .withMessage('タイプは「image」「document」「video」「other」のいずれかを選択してください')
], mediaController.uploadMedia);
// メディア情報を更新（認証済み、編集者以上）
router.put('/:id', auth_1.authenticate, auth_1.isEditor, [
    // バリデーションルール
    (0, express_validator_1.body)('description')
        .optional()
        .trim(),
    (0, express_validator_1.body)('type')
        .optional()
        .isIn(['image', 'document', 'video', 'other'])
        .withMessage('タイプは「image」「document」「video」「other」のいずれかを選択してください')
], mediaController.updateMedia);
// メディアを削除（認証済み、編集者以上）
router.delete('/:id', auth_1.authenticate, auth_1.isEditor, mediaController.deleteMedia);
exports.default = router;
