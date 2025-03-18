import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import dotenv from 'dotenv';

// 環境変数設定
dotenv.config();

// ルートのインポート
import authRoutes from '../routes/auth';
import newsRoutes from '../routes/news';
import scheduleRoutes from '../routes/schedule';
import mediaRoutes from '../routes/media';

// Expressアプリケーション作成
const app = express();
const PORT = process.env.PORT || 5000;

// ミドルウェア
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
app.use(helmet({
  contentSecurityPolicy: false,
}));

// 静的ファイル提供
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// APIルート
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/media', mediaRoutes);

// フロントエンドのビルドファイル提供（本番環境用）
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../project/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../project/dist/index.html'));
  });
}

// データベース接続
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moriwaki_ballet')
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