import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// APIのベースURL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// トークンの取得
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Axiosインスタンスの作成
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプタ
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプタ
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401エラー（認証失敗）の場合はトークンを削除
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // 必要に応じてログインページにリダイレクト
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

// API呼び出し関数
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(url, config);
  },
  
  post: <T = any>(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data, config);
  },
  
  put: <T = any>(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.put<T>(url, data, config);
  },
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(url, config);
  },
  
  // ファイルアップロード用
  upload: <T = any>(url: string, file: File, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // 追加データがある場合
    if (data) {
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
    }
    
    const uploadConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    };
    
    return apiClient.post<T>(url, formData, uploadConfig);
  }
};

export default api; 