"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
// 環境変数設定
dotenv_1.default.config();
// ルートのインポート
const auth_1 = __importDefault(require("../routes/auth"));
const news_1 = __importDefault(require("../routes/news"));
const schedule_1 = __importDefault(require("../routes/schedule"));
const media_1 = __importDefault(require("../routes/media"));
// Expressアプリケーション作成
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// ミドルウェア
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
}));
// 静的ファイル提供
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// APIルート
app.use('/api/auth', auth_1.default);
app.use('/api/news', news_1.default);
app.use('/api/schedule', schedule_1.default);
app.use('/api/media', media_1.default);
// フロントエンドのビルドファイル提供（本番環境用）
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(path_1.default.join(__dirname, '../../project/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, '../../project/dist/index.html'));
    });
}
// データベース接続
mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moriwaki_ballet')
    .then(() => {
    console.log('MongoDB connected successfully');
})
    .catch(err => {
    console.error('MongoDB connection error:', err);
});
// サーバー起動
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
