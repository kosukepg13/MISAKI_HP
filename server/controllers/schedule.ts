import { Response } from 'express';
import { validationResult } from 'express-validator';
import Schedule, { ISchedule } from '../models/Schedule';
import { AuthRequest } from '../middleware/auth';

// 全てのスケジュールを取得
export const getAllSchedules = async (req: AuthRequest, res: Response) => {
  try {
    const { dayOfWeek, studio, level, instructor, isActive } = req.query;
    
    // フィルタオプションを構築
    const filter: Record<string, any> = {};
    
    // 曜日フィルタ
    if (dayOfWeek !== undefined) {
      filter.dayOfWeek = Number(dayOfWeek);
    }
    
    // スタジオフィルタ
    if (studio) {
      filter.studio = studio;
    }
    
    // レベルフィルタ
    if (level) {
      filter.level = level;
    }
    
    // 講師フィルタ
    if (instructor) {
      filter.instructor = instructor;
    }
    
    // アクティブステータスフィルタ (認証されていないユーザーはアクティブなスケジュールのみ)
    if (req.user) {
      if (isActive !== undefined) {
        filter.isActive = isActive === 'true';
      }
    } else {
      filter.isActive = true;
    }
    
    // スケジュールを取得
    const schedules = await Schedule.find(filter)
      .sort({ dayOfWeek: 1, startTime: 1 })
      .populate('createdBy', 'username name');
    
    res.json(schedules);
  } catch (error) {
    console.error('Get all schedules error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
};

// 特定のスケジュールを取得
export const getScheduleById = async (req: AuthRequest, res: Response) => {
  try {
    const scheduleId = req.params.id;
    
    // スケジュールを取得
    const schedule = await Schedule.findById(scheduleId)
      .populate('createdBy', 'username name');
    
    if (!schedule) {
      res.status(404).json({ error: 'スケジュールが見つかりません' });
      return;
    }
    
    // 非アクティブスケジュールは認証済みユーザーのみ閲覧可能
    if (!schedule.isActive && !req.user) {
      res.status(403).json({ error: 'このスケジュールを閲覧する権限がありません' });
      return;
    }
    
    res.json(schedule);
  } catch (error) {
    console.error('Get schedule by id error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
};

// 新しいスケジュールを作成
export const createSchedule = async (req: AuthRequest, res: Response) => {
  try {
    // バリデーションエラーチェック
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    
    const { 
      title, 
      description, 
      instructor, 
      studio, 
      level, 
      dayOfWeek, 
      startTime, 
      endTime, 
      capacity, 
      isActive 
    } = req.body;
    
    // 新しいスケジュールを作成
    const schedule = new Schedule({
      title,
      description,
      instructor,
      studio,
      level: level || 'all',
      dayOfWeek,
      startTime,
      endTime,
      capacity,
      isActive: isActive === undefined ? true : isActive,
      createdBy: req.user._id
    });
    
    await schedule.save();
    
    res.status(201).json({
      message: 'スケジュールを作成しました',
      schedule
    });
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
};

// スケジュールを更新
export const updateSchedule = async (req: AuthRequest, res: Response) => {
  try {
    // バリデーションエラーチェック
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    
    const scheduleId = req.params.id;
    const { 
      title, 
      description, 
      instructor, 
      studio, 
      level, 
      dayOfWeek, 
      startTime, 
      endTime, 
      capacity, 
      isActive 
    } = req.body;
    
    // スケジュールを取得
    const schedule = await Schedule.findById(scheduleId);
    
    if (!schedule) {
      res.status(404).json({ error: 'スケジュールが見つかりません' });
      return;
    }
    
    // 更新内容を設定
    schedule.title = title || schedule.title;
    schedule.description = description || schedule.description;
    schedule.instructor = instructor || schedule.instructor;
    schedule.studio = studio || schedule.studio;
    schedule.level = level || schedule.level;
    
    if (dayOfWeek !== undefined) {
      schedule.dayOfWeek = dayOfWeek;
    }
    
    schedule.startTime = startTime || schedule.startTime;
    schedule.endTime = endTime || schedule.endTime;
    
    if (capacity !== undefined) {
      schedule.capacity = capacity;
    }
    
    if (isActive !== undefined) {
      schedule.isActive = isActive;
    }
    
    await schedule.save();
    
    res.json({
      message: 'スケジュールを更新しました',
      schedule
    });
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
};

// スケジュールを削除
export const deleteSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const scheduleId = req.params.id;
    
    // スケジュールを取得
    const schedule = await Schedule.findById(scheduleId);
    
    if (!schedule) {
      return res.status(404).json({ error: 'スケジュールが見つかりません' });
    }
    
    // スケジュールを削除
    await Schedule.deleteOne({ _id: scheduleId });
    
    res.json({
      message: 'スケジュールを削除しました'
    });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
}; 