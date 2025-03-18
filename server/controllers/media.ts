import { Response } from 'express';
import { validationResult } from 'express-validator';
import Media, { IMedia } from '../models/Media';
import { AuthRequest } from '../middleware/auth';
import fs from 'fs';
import path from 'path';

// 全てのメディアを取得
export const getAllMedia = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 20, page = 1, type } = req.query;
    
    // フィルタオプションを構築
    const filter: Record<string, any> = {};
    
    // タイプフィルタ
    if (type) {
      filter.type = type;
    }
    
    // ページネーション設定
    const limitNum = Number(limit);
    const skip = (Number(page) - 1) * limitNum;
    
    // メディアを取得
    const media = await Media.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('uploadedBy', 'username name');
    
    // 全体のカウント
    const total = await Media.countDocuments(filter);
    
    res.json({
      media,
      pagination: {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get all media error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
};

// 特定のメディアを取得
export const getMediaById = async (req: AuthRequest, res: Response) => {
  try {
    const mediaId = req.params.id;
    
    // メディアを取得
    const media = await Media.findById(mediaId)
      .populate('uploadedBy', 'username name');
    
    if (!media) {
      res.status(404).json({ error: 'メディアが見つかりません' });
      return;
    }
    
    res.json(media);
  } catch (error) {
    console.error('Get media by id error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
};

// 新しいメディアをアップロード
export const uploadMedia = async (req: AuthRequest, res: Response) => {
  try {
    // ファイルが添付されているか確認
    if (!req.file) {
      res.status(400).json({ error: 'ファイルが添付されていません' });
      return;
    }
    
    const { description, type } = req.body;
    
    // ファイルの種類を判定
    let fileType = type || 'other';
    if (!type) {
      if (req.file.mimetype.startsWith('image/')) {
        fileType = 'image';
      } else if (req.file.mimetype === 'application/pdf') {
        fileType = 'document';
      } else if (req.file.mimetype.startsWith('video/')) {
        fileType = 'video';
      }
    }
    
    // 新しいメディアを作成
    const media = new Media({
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: `/uploads/${req.file.filename}`,
      mimetype: req.file.mimetype,
      size: req.file.size,
      type: fileType,
      description: description || '',
      uploadedBy: req.user._id
    });
    
    await media.save();
    
    res.status(201).json({
      message: 'メディアをアップロードしました',
      media
    });
  } catch (error) {
    console.error('Upload media error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
};

// メディア情報を更新
export const updateMedia = async (req: AuthRequest, res: Response) => {
  try {
    const mediaId = req.params.id;
    const { description, type } = req.body;
    
    // メディアを取得
    const media = await Media.findById(mediaId);
    
    if (!media) {
      res.status(404).json({ error: 'メディアが見つかりません' });
      return;
    }
    
    // 更新内容を設定
    if (description !== undefined) {
      media.description = description;
    }
    
    if (type && ['image', 'document', 'video', 'other'].includes(type)) {
      media.type = type;
    }
    
    await media.save();
    
    res.json({
      message: 'メディア情報を更新しました',
      media
    });
  } catch (error) {
    console.error('Update media error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
};

// メディアを削除
export const deleteMedia = async (req: AuthRequest, res: Response) => {
  try {
    const mediaId = req.params.id;
    
    // メディアを取得
    const media = await Media.findById(mediaId);
    
    if (!media) {
      return res.status(404).json({ error: 'メディアが見つかりません' });
    }
    
    // ファイルを削除
    const filePath = path.join(__dirname, '../../uploads', path.basename(media.path));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // データベースから削除
    await Media.deleteOne({ _id: mediaId });
    
    res.json({
      message: 'メディアを削除しました'
    });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
}; 