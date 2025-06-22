import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User, { IUser } from '../models/User';
import { AuthRequest } from '../middleware/auth';

// ユーザー登録
export const register = async (req: Request, res: Response) => {
  try {
    // バリデーションエラーチェック
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { username, password, name, email, role } = req.body;

    // ユーザー名とメールの重複チェック
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });

    if (existingUser) {
      res.status(400).json({ 
        error: 'ユーザー名またはメールアドレスが既に使用されています' 
      });
      return;
    }

    // 新しいユーザーを作成
    const user = new User({
      username,
      password,
      name,
      email,
      role: role || 'editor' // デフォルト役割は編集者
    });

    await user.save();

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
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
};

// ログイン
export const login = async (req: Request, res: Response) => {
  try {
    // バリデーションエラーチェック
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { username, password } = req.body;

    // ユーザーを検索
    const user = await User.findOne({ username });

    if (!user) {
      res.status(401).json({ error: 'ユーザー名またはパスワードが正しくありません' });
      return;
    }

    // パスワードを検証
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ error: 'ユーザー名またはパスワードが正しくありません' });
      return;
    }

    // 最終ログイン日時を更新
    user.lastLogin = new Date();
    await user.save();

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
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
};

// ユーザー情報取得
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user as IUser;
    
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
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
};

// 初期管理者アカウント作成 (開発用)
export const createInitialAdmin = async (req: Request, res: Response) => {
  try {
    // 既に管理者が存在するか確認
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      res.status(400).json({ error: '管理者アカウントが既に存在します' });
      return;
    }
    
    // 管理者アカウントを作成
    const admin = new User({
      username: 'admin',
      password: 'moriwaki2023',
      name: '管理者',
      email: 'admin@moriwakiballet.com',
      role: 'admin'
    });
    
    await admin.save();
    
    res.status(201).json({
      message: '初期管理者アカウントを作成しました',
      username: 'admin',
      password: 'moriwaki2023' // 本番環境では表示しない
    });
  } catch (error) {
    console.error('Create initial admin error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
};

// 管理者アカウントの資格情報をリセット (開発用)
export const resetAdminCredentials = async (req: Request, res: Response) => {
  try {
    const { username = 'admin', password = 'moriwaki2023' } = req.body || {};
    let adminUser = await User.findOne({ role: 'admin' });

    if (!adminUser) {
      adminUser = new User({
        username,
        password,
        name: '管理者',
        email: 'admin@moriwakiballet.com',
        role: 'admin'
      });
    } else {
      adminUser.username = username;
      adminUser.password = password;
    }

    await adminUser.save();

    res.json({
      message: '管理者アカウントをリセットしました',
      username,
      password
    });
  } catch (error) {
    console.error('Reset admin credentials error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
};
