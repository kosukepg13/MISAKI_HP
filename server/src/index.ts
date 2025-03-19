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

// 環境変数のログ出力（デバッグ用）
console.log('環境変数:', {
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI ? '[設定済み]' : '[未設定]',
  PORT: process.env.PORT || 5000,
  __dirname: __dirname
});

// APIルート
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/media', mediaRoutes);

// ヘルスチェックエンドポイント
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// フロントエンドのビルドファイル提供（本番環境用）
if (process.env.NODE_ENV === 'production') {
  // 絶対パスで正確なディレクトリを指定
  const frontendPath = process.env.FRONTEND_PATH || path.join(__dirname, '../../../project/dist');
  console.log('フロントエンドパス:', frontendPath);
  
  app.use(express.static(frontendPath));
  
  app.get('*', function(req, res) {
    try {
      const indexPath = path.join(frontendPath, 'index.html');
      console.log('インデックスパス:', indexPath);
      if (!require('fs').existsSync(indexPath)) {
        return res.status(404).send('Frontend build not found. Please check path: ' + indexPath);
      }
      res.sendFile(indexPath);
    } catch (error) {
      console.error('フロントエンド提供エラー:', error);
      res.status(500).send('Internal server error');
    }
  });
}

// データベース接続
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/moriwaki_ballet';
console.log('MongoDB接続を試行:', mongoUri.includes('mongodb+srv') ? 'MongoDB Atlas' : 'ローカルDB');

mongoose.connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('詳細エラー情報:', JSON.stringify(err, null, 2));
    
    // もしAtlasの場合、0.0.0.0/0をホワイトリストに追加するか、
    // MONGODB_URIに正しい接続文字列があるか確認してください
    if (mongoUri.includes('mongodb+srv')) {
      console.log('MongoDB Atlasの場合、「ネットワークアクセス」でIPアドレス0.0.0.0/0を追加してみてください');
    }
  });

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 