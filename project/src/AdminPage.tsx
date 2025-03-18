import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { 
  LockIcon, 
  User, 
  LogOut, 
  Edit, 
  Calendar, 
  BarChart, 
  FileText, 
  Image,
  Settings,
  FileEdit
} from 'lucide-react';
import { authApi } from './api/auth';

// LoginForm コンポーネントをPortalとして実装
const LoginFormPortal: React.FC<{
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error: string;
  isLocked: boolean;
}> = ({ onSubmit, error, isLocked }) => {
  // ポータル要素への参照
  const portalRef = useRef<HTMLDivElement | null>(null);
  
  // コンポーネントマウント時にポータル要素を作成
  useEffect(() => {
    // すでに存在する場合は作成しない
    if (document.getElementById('login-portal-root')) return;
    
    // ポータル用のDIV要素を作成
    const portalRoot = document.createElement('div');
    portalRoot.id = 'login-portal-root';
    document.body.appendChild(portalRoot);
    portalRef.current = portalRoot;
    
    // クリーンアップ関数
    return () => {
      if (portalRoot && document.body.contains(portalRoot)) {
        document.body.removeChild(portalRoot);
      }
    };
  }, []);
  
  // ポータルのマークアップ
  const portalContent = (
    <div className="min-h-screen flex items-center justify-center bg-[#0A2744]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-2xl font-bold text-[#0A2744] mb-1" style={{ fontFamily: 'serif' }}>
            MORIWAKI BALLET STUDIO
          </div>
          <h2 className="text-xl font-bold text-gray-800">管理者ログイン</h2>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">ユーザー名</label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <User size={18} />
              </div>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A45D]"
                placeholder="ユーザー名を入力"
                autoFocus
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">パスワード</label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <LockIcon size={18} />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A45D]"
                placeholder="パスワードを入力"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#0A2744] text-white py-2 px-4 rounded-md hover:bg-[#0A2744]/90 focus:outline-none focus:ring-2 focus:ring-[#C8A45D] transition duration-300"
            disabled={isLocked}
          >
            ログイン
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <Link to="/" className="text-[#0A2744] hover:underline">
            サイトに戻る
          </Link>
        </div>
      </div>
    </div>
  );
  
  // ポータルがなければ何も表示しない
  if (!portalRef.current) return null;
  
  // ポータルにレンダリング
  return createPortal(portalContent, portalRef.current);
};

const AdminPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  // ローカルストレージからログイン状態を取得
  useEffect(() => {
    const checkAuth = async () => {
      if (authApi.isAuthenticated()) {
        const userData = authApi.getCurrentUser();
        setUser(userData);
        setIsLoggedIn(true);
      }
    };
    
    checkAuth();
  }, []);

  // ログイン処理
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isLocked) {
      setError('アカウントがロックされています。しばらく経ってから再試行してください。');
      return;
    }
    
    // フォームデータから直接値を取得
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    
    try {
      setIsLoading(true);
      const userData = await authApi.login({ username, password });
      setUser(userData);
      setIsLoggedIn(true);
      setLoginAttempts(0);
      setError('');
    } catch (error: any) {
      const attempts = loginAttempts + 1;
      setLoginAttempts(attempts);
      
      if (attempts >= 5) {
        setIsLocked(true);
        setError('ログイン試行回数が上限を超えました。アカウントが一時的にロックされました。');
        
        // 5分後にロックを解除
        setTimeout(() => {
          setIsLocked(false);
          setLoginAttempts(0);
        }, 5 * 60 * 1000);
      } else {
        setError('ユーザー名またはパスワードが正しくありません。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ログアウト処理
  const handleLogout = () => {
    authApi.logout();
    setIsLoggedIn(false);
    setUser(null);
    navigate('/admin');
  };

  // 最終ログイン日時
  const lastLogin = user?.lastLogin ? new Date(user.lastLogin).toLocaleString('ja-JP') : new Date().toLocaleString('ja-JP');

  // ダッシュボード画面
  const Dashboard = () => (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-[#0A2744] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-xl font-bold text-[#C8A45D]" style={{ fontFamily: 'serif' }}>
              MORIWAKI BALLET STUDIO
            </div>
            <span className="ml-4 text-sm bg-[#C8A45D] text-[#0A2744] px-2 py-1 rounded font-medium">
              管理画面
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-200">
              最終ログイン: {lastLogin}
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
            >
              <LogOut size={16} className="mr-1" />
              ログアウト
            </button>
          </div>
        </div>
      </header>
      
      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">管理ダッシュボード</h1>
        
        {/* クイックステータス */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">公開中のニュース</h3>
            <div className="flex items-end">
              <span className="text-3xl font-bold text-gray-800">5</span>
              <span className="text-sm text-green-600 ml-2">公開中</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">登録中のレッスン</h3>
            <div className="flex items-end">
              <span className="text-3xl font-bold text-gray-800">24</span>
              <span className="text-sm text-gray-600 ml-2">クラス</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">最終更新日</h3>
            <div className="flex items-end">
              <span className="text-lg font-bold text-gray-800">{new Date().toLocaleDateString('ja-JP')}</span>
            </div>
          </div>
        </div>
        
        {/* 管理メニュー */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">コンテンツ管理</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admin/news" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center text-blue-600 mb-2">
              <FileEdit size={20} className="mr-2" />
              <h3 className="font-medium">ニュース管理</h3>
            </div>
            <p className="text-gray-600 text-sm">ニュース記事の追加、編集、削除を行います。</p>
          </Link>
          
          <Link to="/admin/schedule" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center text-green-600 mb-2">
              <Calendar size={20} className="mr-2" />
              <h3 className="font-medium">スケジュール管理</h3>
            </div>
            <p className="text-gray-600 text-sm">レッスンスケジュールの追加、編集、削除を行います。</p>
          </Link>
          
          <Link to="/admin/media" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center text-purple-600 mb-2">
              <Image size={20} className="mr-2" />
              <h3 className="font-medium">メディア管理</h3>
            </div>
            <p className="text-gray-600 text-sm">画像などのメディアファイルのアップロードと管理を行います。</p>
          </Link>
        </div>
        
        {/* システム管理 */}
        <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">システム管理</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admin/settings" className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 flex flex-col items-center">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Settings size={24} className="text-gray-600" />
            </div>
            <h3 className="text-gray-800 font-medium text-lg mb-2">設定</h3>
            <p className="text-gray-500 text-sm text-center">
              システム設定の管理
            </p>
          </Link>
        </div>
      </main>
      
      {/* フッター */}
      <footer className="bg-white border-t border-gray-200 mt-8 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          © 2023 MORIWAKI BALLET STUDIO 管理システム
        </div>
      </footer>
    </div>
  );

  return isLoggedIn ? <Dashboard /> : <LoginFormPortal onSubmit={handleLogin} error={error} isLocked={isLocked} />;
};

export default AdminPage; 