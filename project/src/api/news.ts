import api from './client';

// ニュースに関する型定義
export interface News {
  _id: string;
  title: string;
  content: string;
  summary: string;
  image: string;
  publishDate: string;
  isPublished: boolean;
  category: 'announcement' | 'event' | 'performance' | 'other';
  createdBy: {
    _id: string;
    username: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NewsInput {
  title: string;
  content: string;
  summary: string;
  publishDate?: string;
  isPublished?: boolean;
  category?: 'announcement' | 'event' | 'performance' | 'other';
}

export interface NewsUpdateInput {
  title?: string;
  content?: string;
  summary?: string;
  publishDate?: string;
  isPublished?: boolean;
  category?: 'announcement' | 'event' | 'performance' | 'other';
}

export interface NewsFilters {
  page?: number;
  limit?: number;
  category?: string;
  isPublished?: boolean;
}

export interface NewsPagination {
  news: News[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

// ニュース関連のAPI
export const newsApi = {
  // 全てのニュース記事を取得
  getAllNews: async (filters: NewsFilters = {}): Promise<NewsPagination> => {
    try {
      const { page = 1, limit = 10, category, isPublished } = filters;
      const queryParams = new URLSearchParams();
      
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());
      
      if (category) {
        queryParams.append('category', category);
      }
      
      if (isPublished !== undefined) {
        queryParams.append('isPublished', isPublished.toString());
      }
      
      const query = queryParams.toString();
      const response = await api.get<NewsPagination>(`/news?${query}`);
      return response.data;
    } catch (error) {
      console.error('Get all news error:', error);
      throw error;
    }
  },
  
  // 特定のニュース記事を取得
  getNewsById: async (id: string): Promise<News> => {
    try {
      const response = await api.get<News>(`/news/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get news by id error:', error);
      throw error;
    }
  },
  
  // 新しいニュース記事を作成
  createNews: async (newsData: NewsInput, imageFile?: File): Promise<News> => {
    try {
      if (imageFile) {
        // 画像がある場合
        const response = await api.upload<{ message: string; news: News }>('/news', imageFile, newsData);
        return response.data.news;
      } else {
        // 画像がない場合
        const response = await api.post<{ message: string; news: News }>('/news', newsData);
        return response.data.news;
      }
    } catch (error) {
      console.error('Create news error:', error);
      throw error;
    }
  },
  
  // ニュース記事を更新
  updateNews: async (id: string, newsData: NewsUpdateInput, imageFile?: File): Promise<News> => {
    try {
      if (imageFile) {
        // 画像がある場合
        const response = await api.upload<{ message: string; news: News }>(`/news/${id}`, imageFile, newsData, {
          method: 'PUT',
        });
        return response.data.news;
      } else {
        // 画像がない場合
        const response = await api.put<{ message: string; news: News }>(`/news/${id}`, newsData);
        return response.data.news;
      }
    } catch (error) {
      console.error('Update news error:', error);
      throw error;
    }
  },
  
  // ニュース記事を削除
  deleteNews: async (id: string): Promise<void> => {
    try {
      await api.delete(`/news/${id}`);
    } catch (error) {
      console.error('Delete news error:', error);
      throw error;
    }
  }
};

export default newsApi; 