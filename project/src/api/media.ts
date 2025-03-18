import api from './client';

// メディアに関する型定義
export interface Media {
  _id: string;
  filename: string;
  originalname: string;
  path: string;
  mimetype: string;
  size: number;
  type: 'image' | 'document' | 'video' | 'other';
  description: string;
  uploadedBy: {
    _id: string;
    username: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MediaInput {
  description?: string;
  type?: 'image' | 'document' | 'video' | 'other';
}

export interface MediaFilters {
  page?: number;
  limit?: number;
  type?: string;
}

export interface MediaPagination {
  media: Media[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

// メディア関連のAPI
export const mediaApi = {
  // 全てのメディアを取得
  getAllMedia: async (filters: MediaFilters = {}): Promise<MediaPagination> => {
    try {
      const { page = 1, limit = 20, type } = filters;
      const queryParams = new URLSearchParams();
      
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());
      
      if (type) {
        queryParams.append('type', type);
      }
      
      const query = queryParams.toString();
      const response = await api.get<MediaPagination>(`/media?${query}`);
      return response.data;
    } catch (error) {
      console.error('Get all media error:', error);
      throw error;
    }
  },
  
  // 特定のメディアを取得
  getMediaById: async (id: string): Promise<Media> => {
    try {
      const response = await api.get<Media>(`/media/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get media by id error:', error);
      throw error;
    }
  },
  
  // 新しいメディアをアップロード
  uploadMedia: async (file: File, data: MediaInput = {}): Promise<Media> => {
    try {
      const response = await api.upload<{ message: string; media: Media }>('/media', file, data);
      return response.data.media;
    } catch (error) {
      console.error('Upload media error:', error);
      throw error;
    }
  },
  
  // メディア情報を更新
  updateMedia: async (id: string, data: MediaInput): Promise<Media> => {
    try {
      const response = await api.put<{ message: string; media: Media }>(`/media/${id}`, data);
      return response.data.media;
    } catch (error) {
      console.error('Update media error:', error);
      throw error;
    }
  },
  
  // メディアを削除
  deleteMedia: async (id: string): Promise<void> => {
    try {
      await api.delete(`/media/${id}`);
    } catch (error) {
      console.error('Delete media error:', error);
      throw error;
    }
  },
  
  // メディアのフルURLを取得する
  getMediaUrl: (path: string): string => {
    if (!path) return '';
    
    const baseUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '')
      : 'http://localhost:5000';
      
    return `${baseUrl}${path}`;
  }
};

export default mediaApi; 