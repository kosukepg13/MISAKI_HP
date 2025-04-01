import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import dotenv from 'dotenv';

// 環境変数設定
// .envファイルのパスを明示的に指定
dotenv.config({ path: path.resolve(__dirname, '../.env') });

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

// ✅ CORS設定
app.use(cors({
  origin: ['https://moriwaki-ballet-studio.netlify.app', 'http://localhost:5174'], // NetlifyのURLとローカル開発用URL
  credentials: true,
}));

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
// テスト用APIエンドポイント
app.get('/api', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is working!' });
});

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
  
  // 静的ファイルの提供
  app.use(express.static(frontendPath));
  
  // 全てのルートをindex.htmlにリダイレクト（SPA対応）
  app.use('*', (req, res) => {
    const indexPath = path.join(frontendPath, 'index.html');
    if (require('fs').existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send(`フロントエンドのビルドが見つかりません: ${indexPath}`);
    }
  });
}

// データベース接続
// 明示的にMongoDB Atlasの接続文字列を指定し、オプションを追加
const mongoUri = 'mongodb+srv://kosukepg13:moriwaki2023@cluster0.nq1oc.mongodb.net/moriwaki_ballet?retryWrites=true&w=majority';

// 環境変数のデバッグ出力を拡張
console.log('MongoDB接続情報:', {
  mongoUri: mongoUri.substring(0, 30) + '...',
  isDirect: true,
  isAtlas: mongoUri.includes('mongodb+srv')
});

// Mongooseオプションを追加
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

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