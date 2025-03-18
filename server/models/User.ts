import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// ユーザードキュメントのインターフェース
export interface IUser extends Document {
  username: string;
  password: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  lastLogin: Date;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
  generateToken(): string;
}

// ユーザースキーマ
const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  role: {
    type: String,
    enum: ['admin', 'editor'],
    default: 'editor'
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// パスワードをハッシュ化してから保存
UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// パスワード検証メソッド
UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// JWTトークン生成メソッド
UserSchema.methods.generateToken = function(): string {
  return jwt.sign(
    { id: this._id, username: this.username, role: this.role },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '1d' }
  );
};

// モデル作成とエクスポート
export default mongoose.model<IUser>('User', UserSchema); 