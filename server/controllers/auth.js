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
exports.createInitialAdmin = exports.getProfile = exports.login = exports.register = void 0;
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
// ユーザー登録
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // バリデーションエラーチェック
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { username, password, name, email, role } = req.body;
        // ユーザー名とメールの重複チェック
        const existingUser = yield User_1.default.findOne({
            $or: [{ username }, { email }]
        });
        if (existingUser) {
            res.status(400).json({
                error: 'ユーザー名またはメールアドレスが既に使用されています'
            });
            return;
        }
        // 新しいユーザーを作成
        const user = new User_1.default({
            username,
            password,
            name,
            email,
            role: role || 'editor' // デフォルト役割は編集者
        });
        yield user.save();
        // パスワードを除いたユーザー情報を返す
        const userResponse = {
            _id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role
        };
        res.status(201).json({
            message: 'ユーザー登録が完了しました',
            user: userResponse,
            token: user.generateToken()
        });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});
exports.register = register;
// ログイン
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // バリデーションエラーチェック
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { username, password } = req.body;
        // ユーザーを検索
        const user = yield User_1.default.findOne({ username });
        if (!user) {
            res.status(401).json({ error: 'ユーザー名またはパスワードが正しくありません' });
            return;
        }
        // パスワードを検証
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ error: 'ユーザー名またはパスワードが正しくありません' });
            return;
        }
        // 最終ログイン日時を更新
        user.lastLogin = new Date();
        yield user.save();
        // パスワードを除いたユーザー情報を返す
        const userResponse = {
            _id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role,
            lastLogin: user.lastLogin
        };
        res.json({
            message: 'ログインに成功しました',
            user: userResponse,
            token: user.generateToken()
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});
exports.login = login;
// ユーザー情報取得
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        // パスワードを除いたユーザー情報を返す
        const userResponse = {
            _id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role,
            lastLogin: user.lastLogin
        };
        res.json({
            user: userResponse
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});
exports.getProfile = getProfile;
// 初期管理者アカウント作成 (開発用)
const createInitialAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 既に管理者が存在するか確認
        const adminExists = yield User_1.default.findOne({ role: 'admin' });
        if (adminExists) {
            res.status(400).json({ error: '管理者アカウントが既に存在します' });
            return;
        }
        // 管理者アカウントを作成
        const admin = new User_1.default({
            username: 'admin',
            password: 'moriwaki2023',
            name: '管理者',
            email: 'admin@moriwakiballet.com',
            role: 'admin'
        });
        yield admin.save();
        res.status(201).json({
            message: '初期管理者アカウントを作成しました',
            username: 'admin',
            password: 'moriwaki2023' // 本番環境では表示しない
        });
    }
    catch (error) {
        console.error('Create initial admin error:', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});
exports.createInitialAdmin = createInitialAdmin;
