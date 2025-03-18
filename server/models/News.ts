import mongoose, { Document, Schema } from 'mongoose';

// ニュースドキュメントのインターフェース
export interface INews extends Document {
  title: string;
  content: string;
  summary: string;
  image: string;
  publishDate: Date;
  isPublished: boolean;
  category: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ニューススキーマ
const NewsSchema = new Schema<INews>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true,
    maxlength: 500
  },
  image: {
    type: String,
    default: ''
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['announcement', 'event', 'performance', 'other'],
    default: 'announcement'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// モデル作成とエクスポート
export default mongoose.model<INews>('News', NewsSchema); 