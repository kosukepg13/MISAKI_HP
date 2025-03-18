import api from './client';

// ユーザー認証に関する型定義
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  lastLogin: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

// 認証関連のAPI
export const authApi = {
  // ログイン
  login: async (credentials: LoginCredentials): Promise<User> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      const { user, token } = response.data;
      
      // ローカルストレージに認証情報を保存
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // ログアウト
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // 現在のユーザー情報を取得
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  },
  
  // トークンのチェック
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
  
  // プロフィール情報の取得
  getProfile: async (): Promise<User> => {
    try {
      const response = await api.get<{ user: User }>('/auth/profile');
      return response.data.user;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },
  
  // 管理者アカウント初期化（開発専用）
  initAdmin: async (): Promise<any> => {
    try {
      const response = await api.post('/auth/init-admin', {});
      return response.data;
    } catch (error) {
      console.error('Init admin error:', error);
      throw error;
    }
  }
};

export default authApi; 