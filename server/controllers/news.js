"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNews = exports.updateNews = exports.createNews = exports.getNewsById = exports.getAllNews = void 0;
const express_validator_1 = require("express-validator");
const News_1 = __importDefault(require("../models/News"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// 全てのニュース記事を取得
const getAllNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit = 10, page = 1, category, isPublished } = req.query;
        // フィルタオプションを構築
        const filter = {};
        // カテゴリーフィルタ
        if (category) {
            filter.category = category;
        }
        // 公開ステータスフィルタ (認証されていないユーザーは公開記事のみ)
        if (req.user) {
            if (isPublished !== undefined) {
                filter.isPublished = isPublished === 'true';
            }
        }
        else {
            filter.isPublished = true;
        }
        // ページネーション設定
        const limitNum = Number(limit);
        const skip = (Number(page) - 1) * limitNum;
        // ニュース記事を取得
        const news = yield News_1.default.find(filter)
            .sort({ publishDate: -1 })
            .skip(skip)
            .limit(limitNum)
            .populate('createdBy', 'username name');
        // 全体のカウント
        const total = yield News_1.default.countDocuments(filter);
        res.json({
            news,
            pagination: {
                total,
                page: Number(page),
                totalPages: Math.ceil(total / limitNum)
            }
        });
    }
    catch (error) {
        console.error('Get all news error:', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});
exports.getAllNews = getAllNews;
// 特定のニュース記事を取得
const getNewsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newsId = req.params.id;
        // ニュース記事を取得
        const news = yield News_1.default.findById(newsId)
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
    }
    catch (error) {
        console.error('Get news by id error:', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});
exports.getNewsById = getNewsById;
// 新しいニュース記事を作成
const createNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // バリデーションエラーチェック
        const errors = (0, express_validator_1.validationResult)(req);
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
        const news = new News_1.default({
            title,
            content,
            summary,
            image,
            publishDate: publishDate || new Date(),
            isPublished: isPublished === undefined ? false : isPublished,
            category: category || 'announcement',
            createdBy: req.user._id
        });
        yield news.save();
        res.status(201).json({
            message: 'ニュース記事を作成しました',
            news
        });
    }
    catch (error) {
        console.error('Create news error:', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});
exports.createNews = createNews;
// ニュース記事を更新
const updateNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // バリデーションエラーチェック
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const newsId = req.params.id;
        const { title, content, summary, publishDate, isPublished, category } = req.body;
        // ニュース記事を取得
        const news = yield News_1.default.findById(newsId);
        if (!news) {
            res.status(404).json({ error: 'ニュース記事が見つかりません' });
            return;
        }
        // 画像ファイルの有無を確認
        let image = news.image;
        if (req.file) {
            // 古い画像ファイルを削除
            if (news.image) {
                const oldImagePath = path_1.default.join(__dirname, '../../uploads', path_1.default.basename(news.image));
                if (fs_1.default.existsSync(oldImagePath)) {
                    fs_1.default.unlinkSync(oldImagePath);
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
        yield news.save();
        res.json({
            message: 'ニュース記事を更新しました',
            news
        });
    }
    catch (error) {
        console.error('Update news error:', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});
exports.updateNews = updateNews;
// ニュース記事を削除
const deleteNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newsId = req.params.id;
        // ニュース記事を取得
        const news = yield News_1.default.findById(newsId);
        if (!news) {
            res.status(404).json({ error: 'ニュース記事が見つかりません' });
            return;
        }
        // 画像ファイルがある場合は削除
        if (news.image) {
            const imagePath = path_1.default.join(__dirname, '../../uploads', path_1.default.basename(news.image));
            if (fs_1.default.existsSync(imagePath)) {
                fs_1.default.unlinkSync(imagePath);
            }
        }
        // ニュース記事を削除
        yield News_1.default.deleteOne({ _id: newsId });
        res.json({
            message: 'ニュース記事を削除しました'
        });
    }
    catch (error) {
        console.error('Delete news error:', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});
exports.deleteNews = deleteNews;
