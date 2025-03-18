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
exports.deleteMedia = exports.updateMedia = exports.uploadMedia = exports.getMediaById = exports.getAllMedia = void 0;
const Media_1 = __importDefault(require("../models/Media"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// 全てのメディアを取得
const getAllMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit = 20, page = 1, type } = req.query;
        // フィルタオプションを構築
        const filter = {};
        // タイプフィルタ
        if (type) {
            filter.type = type;
        }
        // ページネーション設定
        const limitNum = Number(limit);
        const skip = (Number(page) - 1) * limitNum;
        // メディアを取得
        const media = yield Media_1.default.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .populate('uploadedBy', 'username name');
        // 全体のカウント
        const total = yield Media_1.default.countDocuments(filter);
        res.json({
            media,
            pagination: {
                total,
                page: Number(page),
                totalPages: Math.ceil(total / limitNum)
            }
        });
    }
    catch (error) {
        console.error('Get all media error:', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});
exports.getAllMedia = getAllMedia;
// 特定のメディアを取得
const getMediaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mediaId = req.params.id;
        // メディアを取得
        const media = yield Media_1.default.findById(mediaId)
            .populate('uploadedBy', 'username name');
        if (!media) {
            res.status(404).json({ error: 'メディアが見つかりません' });
            return;
        }
        res.json(media);
    }
    catch (error) {
        console.error('Get media by id error:', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});
exports.getMediaById = getMediaById;
// 新しいメディアをアップロード
const uploadMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            }
            else if (req.file.mimetype === 'application/pdf') {
                fileType = 'document';
            }
            else if (req.file.mimetype.startsWith('video/')) {
                fileType = 'video';
            }
        }
        // 新しいメディアを作成
        const media = new Media_1.default({
            filename: req.file.filename,
            originalname: req.file.originalname,
            path: `/uploads/${req.file.filename}`,
            mimetype: req.file.mimetype,
            size: req.file.size,
            type: fileType,
            description: description || '',
            uploadedBy: req.user._id
        });
        yield media.save();
        res.status(201).json({
            message: 'メディアをアップロードしました',
            media
        });
    }
    catch (error) {
        console.error('Upload media error:', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});
exports.uploadMedia = uploadMedia;
// メディア情報を更新
const updateMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mediaId = req.params.id;
        const { description, type } = req.body;
        // メディアを取得
        const media = yield Media_1.default.findById(mediaId);
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
        yield media.save();
        res.json({
            message: 'メディア情報を更新しました',
            media
        });
    }
    catch (error) {
        console.error('Update media error:', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});
exports.updateMedia = updateMedia;
// メディアを削除
const deleteMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mediaId = req.params.id;
        // メディアを取得
        const media = yield Media_1.default.findById(mediaId);
        if (!media) {
            return res.status(404).json({ error: 'メディアが見つかりません' });
        }
        // ファイルを削除
        const filePath = path_1.default.join(__dirname, '../../uploads', path_1.default.basename(media.path));
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
        // データベースから削除
        yield Media_1.default.deleteOne({ _id: mediaId });
        res.json({
            message: 'メディアを削除しました'
        });
    }
    catch (error) {
        console.error('Delete media error:', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});
exports.deleteMedia = deleteMedia;
