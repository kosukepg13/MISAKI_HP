# モリワキバレエ ウェブサイト

モリワキバレエのウェブサイト兼管理システムです。フロントエンドはReact+TypeScript、バックエンドはExpress+MongoDBで構築されています。

## 機能

- ニュース記事の管理
- レッスンスケジュールの管理
- メディア（画像・動画）の管理
- 管理者用ダッシュボード

## 技術スタック

### フロントエンド
- React
- TypeScript
- Vite
- CSS Modules

### バックエンド
- Node.js
- Express
- MongoDB
- TypeScript
- JWT認証

## 開発環境のセットアップ

### 前提条件
- Node.js 16.x以上
- npm 8.x以上
- MongoDB

### インストール

1. リポジトリをクローン
```
git clone https://github.com/あなたのユーザー名/moriwaki-ballet.git
cd moriwaki-ballet
```

2. 依存関係をインストール
```
npm run install:all
```

3. サーバー用の環境変数を設定
`server/.env`ファイルを作成し、以下の内容を設定します：
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/moriwaki_ballet
JWT_SECRET=あなたの秘密鍵
NODE_ENV=development
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
```

4. フロントエンド用の環境変数を設定
`project/.env`ファイルを作成し、以下の内容を設定します：
```
VITE_API_URL=http://localhost:5000/api
```

### 開発サーバーの起動

```
npm run dev
```

これでバックエンドサーバーとフロントエンド開発サーバーが同時に起動します。

- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:5000/api

### 本番ビルド

```
npm run build
```

## 初期管理者アカウントの作成

開発環境では、以下のエンドポイントを使用して初期管理者アカウントを作成できます：

```
POST http://localhost:5000/api/auth/init-admin
```

デフォルトの認証情報：
- ユーザー名: admin
- パスワード: admin

本番環境では、環境変数 `ADMIN_USERNAME` と `ADMIN_PASSWORD` が設定されていない場合、上記のデフォルト値が使用されます。

**注意**: 本番環境ではこの機能は無効になります。

## ライセンス

プライベート - 無断複製・転載を禁じます 