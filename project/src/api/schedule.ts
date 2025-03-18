import api from './client';

// スケジュールに関する型定義
export interface Schedule {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  studio: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  capacity: number;
  isActive: boolean;
  createdBy: {
    _id: string;
    username: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleInput {
  title: string;
  description: string;
  instructor: string;
  studio: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'all';
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  capacity: number;
  isActive?: boolean;
}

export interface ScheduleUpdateInput {
  title?: string;
  description?: string;
  instructor?: string;
  studio?: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'all';
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  capacity?: number;
  isActive?: boolean;
}

export interface ScheduleFilters {
  dayOfWeek?: number;
  studio?: string;
  level?: string;
  instructor?: string;
  isActive?: boolean;
}

// スケジュール関連のAPI
export const scheduleApi = {
  // 全てのスケジュールを取得
  getAllSchedules: async (filters: ScheduleFilters = {}): Promise<Schedule[]> => {
    try {
      const { dayOfWeek, studio, level, instructor, isActive } = filters;
      const queryParams = new URLSearchParams();
      
      if (dayOfWeek !== undefined) {
        queryParams.append('dayOfWeek', dayOfWeek.toString());
      }
      
      if (studio) {
        queryParams.append('studio', studio);
      }
      
      if (level) {
        queryParams.append('level', level);
      }
      
      if (instructor) {
        queryParams.append('instructor', instructor);
      }
      
      if (isActive !== undefined) {
        queryParams.append('isActive', isActive.toString());
      }
      
      const query = queryParams.toString();
      const response = await api.get<Schedule[]>(`/schedule${query ? `?${query}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('Get all schedules error:', error);
      throw error;
    }
  },
  
  // 特定のスケジュールを取得
  getScheduleById: async (id: string): Promise<Schedule> => {
    try {
      const response = await api.get<Schedule>(`/schedule/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get schedule by id error:', error);
      throw error;
    }
  },
  
  // 新しいスケジュールを作成
  createSchedule: async (scheduleData: ScheduleInput): Promise<Schedule> => {
    try {
      const response = await api.post<{ message: string; schedule: Schedule }>('/schedule', scheduleData);
      return response.data.schedule;
    } catch (error) {
      console.error('Create schedule error:', error);
      throw error;
    }
  },
  
  // スケジュールを更新
  updateSchedule: async (id: string, scheduleData: ScheduleUpdateInput): Promise<Schedule> => {
    try {
      const response = await api.put<{ message: string; schedule: Schedule }>(`/schedule/${id}`, scheduleData);
      return response.data.schedule;
    } catch (error) {
      console.error('Update schedule error:', error);
      throw error;
    }
  },
  
  // スケジュールを削除
  deleteSchedule: async (id: string): Promise<void> => {
    try {
      await api.delete(`/schedule/${id}`);
    } catch (error) {
      console.error('Delete schedule error:', error);
      throw error;
    }
  }
};

export default scheduleApi; 