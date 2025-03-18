import mongoose, { Document, Schema } from 'mongoose';

// スケジュールドキュメントのインターフェース
export interface ISchedule extends Document {
  title: string;
  description: string;
  instructor: string;
  studio: string;
  level: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  capacity: number;
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// スケジュールスキーマ
const ScheduleSchema = new Schema<ISchedule>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true
  },
  studio: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'all'],
    default: 'all'
  },
  dayOfWeek: {
    type: Number,
    required: true,
    min: 0,
    max: 6
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  isActive: {
    type: Boolean,
    default: true
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
export default mongoose.model<ISchedule>('Schedule', ScheduleSchema); 