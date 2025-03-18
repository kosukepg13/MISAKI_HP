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
exports.deleteSchedule = exports.updateSchedule = exports.createSchedule = exports.getScheduleById = exports.getAllSchedules = void 0;
const express_validator_1 = require("express-validator");
const Schedule_1 = __importDefault(require("../models/Schedule"));
// 全てのスケジュールを取得
const getAllSchedules = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { dayOfWeek, studio, level, instructor, isActive } = req.query;
        // フィルタオプションを構築
        const filter = {};
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
        }
        else {
            filter.isActive = true;
        }
        // スケジュールを取得
        const schedules = yield Schedule_1.default.find(filter)
            .sort({ dayOfWeek: 1, startTime: 1 })
            .populate('createdBy', 'username name');
        res.json(schedules);
    }
    catch (error) {
        console.error('Get all schedules error:', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});
exports.getAllSchedules = getAllSchedules;
// 特定のスケジュールを取得
const getScheduleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const scheduleId = req.params.id;
        // スケジュールを取得
        const schedule = yield Schedule_1.default.findById(scheduleId)
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
    }
    catch (error) {
        console.error('Get schedule by id error:', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});
exports.getScheduleById = getScheduleById;
// 新しいスケジュールを作成
const createSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // バリデーションエラーチェック
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { title, description, instructor, studio, level, dayOfWeek, startTime, endTime, capacity, isActive } = req.body;
        // 新しいスケジュールを作成
        const schedule = new Schedule_1.default({
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
        yield schedule.save();
        res.status(201).json({
            message: 'スケジュールを作成しました',
            schedule
        });
    }
    catch (error) {
        console.error('Create schedule error:', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});
exports.createSchedule = createSchedule;
// スケジュールを更新
const updateSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // バリデーションエラーチェック
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const scheduleId = req.params.id;
        const { title, description, instructor, studio, level, dayOfWeek, startTime, endTime, capacity, isActive } = req.body;
        // スケジュールを取得
        const schedule = yield Schedule_1.default.findById(scheduleId);
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
        yield schedule.save();
        res.json({
            message: 'スケジュールを更新しました',
            schedule
        });
    }
    catch (error) {
        console.error('Update schedule error:', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});
exports.updateSchedule = updateSchedule;
// スケジュールを削除
const deleteSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const scheduleId = req.params.id;
        // スケジュールを取得
        const schedule = yield Schedule_1.default.findById(scheduleId);
        if (!schedule) {
            return res.status(404).json({ error: 'スケジュールが見つかりません' });
        }
        // スケジュールを削除
        yield Schedule_1.default.deleteOne({ _id: scheduleId });
        res.json({
            message: 'スケジュールを削除しました'
        });
    }
    catch (error) {
        console.error('Delete schedule error:', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});
exports.deleteSchedule = deleteSchedule;
