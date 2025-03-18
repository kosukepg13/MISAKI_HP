import mongoose, { Document, Schema } from 'mongoose';

// メディアドキュメントのインターフェース
export interface IMedia extends Document {
  filename: string;
  originalname: string;
  path: string;
  mimetype: string;
  size: number;
  type: string;
  description: string;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// メディアスキーマ
const MediaSchema = new Schema<IMedia>({
  filename: {
    type: String,
    required: true
  },
  originalname: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['image', 'document', 'video', 'other'],
    default: 'image'
  },
  description: {
    type: String,
    default: ''
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// モデル作成とエクスポート
export default mongoose.model<IMedia>('Media', MediaSchema); 