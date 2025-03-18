import { Response } from 'express';
import { validationResult } from 'express-validator';
import News, { INews } from '../models/News';
import { AuthRequest } from '../middleware/auth';
import fs from 'fs';
import path from 'path';

// 全てのニュース記事を取得
export const getAllNews = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 10, page = 1, category, isPublished } = req.query;
    
    // フィルタオプションを構築
    const filter: Record<string, any> = {};
    
    // カテゴリーフィルタ
    if (category) {
      filter.category = category;
    }
    
    // 公開ステータスフィルタ (認証されていないユーザーは公開記事のみ)
    if (req.user) {
      if (isPublished !== undefined) {
        filter.isPublished = isPublished === 'true';
      }
    } else {
      filter.isPublished = true;
    }
    
    // ページネーション設定
    const limitNum = Number(limit);
    const skip = (Number(page) - 1) * limitNum;
    
    // ニュース記事を取得
    const news = await News.find(filter)
      .sort({ publishDate: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('createdBy', 'username name');
    
    // 全体のカウント
    const total = await News.countDocuments(filter);
    
    res.json({
      news,
      pagination: {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get all news error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
};

// 特定のニュース記事を取得
export const getNewsById = async (req: AuthRequest, res: Response) => {
  try {
    const newsId = req.params.id;
    
    // ニュース記事を取得
    const news = await News.findById(newsId)
      .populate('createdBy', 'username name');
    
    if (!news) {
      res.status(404).json({ error: 'ニュース記事が見つかりません' });
      return;
    }
    
    // 非公開記事は認証済みユーザーのみ閲覧可能
    if (!news.isPublished && !req.user) {
      res.status(403).json({ error: 'このニュース記事を閲覧する権限がありません' });
      return;
    }
    
    res.json(news);
  } catch (error) {
    console.error('Get news by id error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
};

// 新しいニュース記事を作成
export const createNews = async (req: AuthRequest, res: Response) => {
  try {
    // バリデーションエラーチェック
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    
    const { title, content, summary, publishDate, isPublished, category } = req.body;
    
    // 画像ファイルの有無を確認
    let image = '';
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }
    
    // 新しいニュース記事を作成
    const news = new News({
      title,
      content,
      summary,
      image,
      publishDate: publishDate || new Date(),
      isPublished: isPublished === undefined ? false : isPublished,
      category: category || 'announcement',
      createdBy: req.user._id
    });
    
    await news.save();
    
    res.status(201).json({
      message: 'ニュース記事を作成しました',
      news
    });
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
};

// ニュース記事を更新
export const updateNews = async (req: AuthRequest, res: Response) => {
  try {
    // バリデーションエラーチェック
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    
    const newsId = req.params.id;
    const { title, content, summary, publishDate, isPublished, category } = req.body;
    
    // ニュース記事を取得
    const news = await News.findById(newsId);
    
    if (!news) {
      res.status(404).json({ error: 'ニュース記事が見つかりません' });
      return;
    }
    
    // 画像ファイルの有無を確認
    let image = news.image;
    if (req.file) {
      // 古い画像ファイルを削除
      if (news.image) {
        const oldImagePath = path.join(__dirname, '../../uploads', path.basename(news.image));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      // 新しい画像パスを設定
      image = `/uploads/${req.file.filename}`;
    }
    
    // 更新内容を設定
    news.title = title || news.title;
    news.content = content || news.content;
    news.summary = summary || news.summary;
    news.image = image;
    news.publishDate = publishDate ? new Date(publishDate) : news.publishDate;
    news.isPublished = isPublished === undefined ? news.isPublished : isPublished;
    news.category = category || news.category;
    
    await news.save();
    
    res.json({
      message: 'ニュース記事を更新しました',
      news
    });
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
};

// ニュース記事を削除
export const deleteNews = async (req: AuthRequest, res: Response) => {
  try {
    const newsId = req.params.id;
    
    // ニュース記事を取得
    const news = await News.findById(newsId);
    
    if (!news) {
      res.status(404).json({ error: 'ニュース記事が見つかりません' });
      return;
    }
    
    // 画像ファイルがある場合は削除
    if (news.image) {
      const imagePath = path.join(__dirname, '../../uploads', path.basename(news.image));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // ニュース記事を削除
    await News.deleteOne({ _id: newsId });
    
    res.json({
      message: 'ニュース記事を削除しました'
    });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
}; 