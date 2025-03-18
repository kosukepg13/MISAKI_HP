"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEditor = exports.isAdmin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// JWTトークンを検証して認証するミドルウェア
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // ヘッダーからトークンを取得
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({ error: '認証が必要です' });
            return;
        }
        // トークンの検証
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        // デコードされたユーザーIDでユーザーを検索
        const user = yield User_1.default.findById(decoded.id);
        if (!user) {
            res.status(401).json({ error: 'ユーザーが見つかりません' });
            return;
        }
        // リクエストにユーザー情報を追加
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ error: '認証に失敗しました' });
        return;
    }
});
exports.authenticate = authenticate;
// 管理者権限を確認するミドルウェア
const isAdmin = (req, res, next) => {
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
exports.isAdmin = isAdmin;
// 編集者以上の権限を確認するミドルウェア
const isEditor = (req, res, next) => {
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
exports.isEditor = isEditor;
