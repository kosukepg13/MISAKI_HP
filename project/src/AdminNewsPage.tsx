import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Save,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Calendar,
  Type,
  AlertCircle,
  XCircle
} from 'lucide-react';

// ニュースのタイプ一覧
const newsTypes = [
  { id: 'event', label: 'イベント', color: 'bg-blue-600' },
  { id: 'class', label: 'クラス', color: 'bg-pink-600' },
  { id: 'cancel', label: '休講', color: 'bg-amber-600' },
  { id: 'workshop', label: 'ワークショップ', color: 'bg-purple-600' },
  { id: 'info', label: 'お知らせ', color: 'bg-green-600' }
];

// デフォルトのニュースデータ（実際はサーバーから取得）
const initialNewsItems = [
  {
    id: 1,
    type: "イベント",
    typeId: "event",
    typeClass: "bg-blue-600",
    date: "2023/12/15",
    title: "年末発表会のお知らせ",
    content: "今年の発表会は12月23日（土）に市民ホールにて開催されます。チケットは11月1日より販売開始です。ご家族やお友達をお誘いの上、ぜひご参加ください。今年は特別ゲストとして元バレエ団プリンシパルの山田花子さんをお招きしています。",
    image: "/images/news1.jpg",
    isPublished: true
  },
  {
    id: 2,
    type: "クラス",
    typeId: "class",
    typeClass: "bg-pink-600",
    date: "2023/11/05",
    title: "新クラス開講のお知らせ",
    content: "11月より、新宿スタジオにて新たに「シニアのためのバレエクラス」を開講します。50歳以上の方を対象に、無理なく楽しくバレエの基礎を学べるクラスです。体験レッスンも実施していますので、お気軽にお問い合わせください。",
    image: "/images/news2.jpg",
    isPublished: true
  },
  {
    id: 3,
    type: "休講",
    typeId: "cancel",
    typeClass: "bg-amber-600",
    date: "2023/10/28",
    title: "祝日に伴う休講のお知らせ",
    content: "11月3日（金・文化の日）、11月23日（木・勤労感謝の日）は祝日のため全スタジオ休講となります。振替レッスンをご希望の方は、各スタジオの受付までお申し出ください。ご理解とご協力をお願いいたします。",
    image: "/images/news3.jpg",
    isPublished: true
  },
  {
    id: 4,
    type: "ワークショップ",
    typeId: "workshop",
    typeClass: "bg-purple-600",
    date: "2023/10/10",
    title: "冬季特別ワークショップ開催",
    content: "冬休み期間中の12月26日〜28日、キッズ・ジュニア向けの3日間集中ワークショップを開催します。バレエの基礎から応用まで、楽しく学べる内容となっています。参加費用は15,000円（3日間）、定員は各クラス15名です。お早めにお申し込みください。",
    image: "/images/news4.jpg",
    isPublished: true
  },
  {
    id: 5,
    type: "お知らせ",
    typeId: "info",
    typeClass: "bg-green-600",
    date: "2023/09/15",
    title: "スタジオ改装のお知らせ",
    content: "中央スタジオは10月15日〜20日まで改装工事のため休講となります。期間中のレッスンは他スタジオでの振替、または翌月への繰り越しが可能です。新しくなったスタジオにご期待ください。リニューアルオープンは10月21日を予定しています。",
    image: "/images/news5.jpg",
    isPublished: true
  },
  {
    id: 6,
    type: "お知らせ",
    typeId: "info",
    typeClass: "bg-green-600",
    date: "2023/11/20",
    title: "新規講師採用のお知らせ（下書き）",
    content: "12月より、当スタジオに新しい講師が加わります。プロフィールや担当クラスについては後日お知らせします。",
    image: "/images/placeholder.jpg",
    isPublished: false
  }
];

// ローカルストレージのキー
const NEWS_STORAGE_KEY = 'moriwaki_news_data';

const AdminNewsPage: React.FC = () => {
  const navigate = useNavigate();
  const [newsItems, setNewsItems] = useState<typeof initialNewsItems>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNews, setCurrentNews] = useState<(typeof initialNewsItems)[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showDrafts, setShowDrafts] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [successMessage, setSuccessMessage] = useState('');

  // ローカルストレージからニュースデータを取得
  useEffect(() => {
    // 管理者ログインの確認
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/admin');
      return;
    }
    
    // ニュースデータの取得
    const storedNews = localStorage.getItem(NEWS_STORAGE_KEY);
    if (storedNews) {
      setNewsItems(JSON.parse(storedNews));
    } else {
      setNewsItems(initialNewsItems);
      localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(initialNewsItems));
    }
  }, [navigate]);

  // ニュースデータの保存
  const saveNewsToStorage = (news: typeof initialNewsItems) => {
    localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(news));
    setNewsItems(news);
  };

  // 検索とフィルタ適用後のニュース記事
  const filteredNews = newsItems.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          news.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || news.typeId === filterType;
    const matchesDraftStatus = showDrafts ? true : news.isPublished;
    
    return matchesSearch && matchesType && matchesDraftStatus;
  });

  // 新規作成モードの開始
  const startCreating = () => {
    setValidationErrors({});
    setSuccessMessage('');
    setCurrentNews({
      id: Math.max(0, ...newsItems.map(n => n.id)) + 1,
      type: "お知らせ",
      typeId: "info",
      typeClass: "bg-green-600",
      date: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
      title: "",
      content: "",
      image: "/images/placeholder.jpg",
      isPublished: false
    });
    setIsEditing(true);
  };

  // 編集モードの開始
  const startEditing = (news: (typeof initialNewsItems)[0]) => {
    setValidationErrors({});
    setSuccessMessage('');
    setCurrentNews({...news});
    setIsEditing(true);
  };

  // フォーム送信時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 検証
    const errors: {[key: string]: string} = {};
    if (!currentNews?.title.trim()) {
      errors.title = 'タイトルを入力してください';
    }
    if (!currentNews?.content.trim()) {
      errors.content = 'コンテンツを入力してください';
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    // タイプ情報の更新
    const selectedType = newsTypes.find(type => type.id === currentNews?.typeId);
    if (currentNews && selectedType) {
      currentNews.type = selectedType.label;
      currentNews.typeClass = selectedType.color;
    }
    
    // 新規作成または更新
    if (currentNews) {
      const isNew = !newsItems.some(news => news.id === currentNews.id);
      let updatedNewsItems;
      
      if (isNew) {
        updatedNewsItems = [...newsItems, currentNews];
        setSuccessMessage('ニュース記事を新規作成しました');
      } else {
        updatedNewsItems = newsItems.map(news => 
          news.id === currentNews.id ? currentNews : news
        );
        setSuccessMessage('ニュース記事を更新しました');
      }
      
      saveNewsToStorage(updatedNewsItems);
      
      // 成功メッセージを表示して自動的に消す
      setTimeout(() => {
        setSuccessMessage('');
        setIsEditing(false);
      }, 3000);
    }
  };

  // キャンセル処理
  const handleCancel = () => {
    setValidationErrors({});
    setSuccessMessage('');
    setIsEditing(false);
    setCurrentNews(null);
  };

  // 削除処理
  const handleDelete = (id: number) => {
    if (window.confirm('このニュース記事を削除してもよろしいですか？')) {
      const updatedNews = newsItems.filter(news => news.id !== id);
      saveNewsToStorage(updatedNews);
      setSuccessMessage('ニュース記事を削除しました');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  // 公開ステータスの切り替え
  const togglePublishStatus = (id: number) => {
    const updatedNews = newsItems.map(news => {
      if (news.id === id) {
        return {...news, isPublished: !news.isPublished};
      }
      return news;
    });
    
    saveNewsToStorage(updatedNews);
    
    setSuccessMessage(
      updatedNews.find(n => n.id === id)?.isPublished 
        ? 'ニュース記事を公開しました' 
        : 'ニュース記事を非公開にしました'
    );
    
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // 入力フィールドの変更ハンドラ
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (currentNews) {
      setCurrentNews({
        ...currentNews,
        [name]: value
      });
    }
    
    // 検証エラーを消去
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  // 公開状態の変更ハンドラ
  const handlePublishChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentNews) {
      setCurrentNews({
        ...currentNews,
        isPublished: e.target.checked
      });
    }
  };

  return (
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
          <div>
            <Link 
              to="/admin" 
              className="text-white hover:text-[#C8A45D] transition-colors"
            >
              ダッシュボードに戻る
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {successMessage && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            {successMessage}
          </div>
        )}
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">ニュース管理</h1>
            <p className="text-gray-600">ニュース記事の追加・編集・削除を行えます</p>
          </div>
          {!isEditing && (
            <button
              onClick={startCreating}
              className="bg-[#0A2744] text-white px-4 py-2 rounded-md hover:bg-[#0A2744]/90 transition duration-300 flex items-center"
            >
              <Plus size={16} className="mr-1" />
              新規作成
            </button>
          )}
        </div>

        {isEditing ? (
          /* 編集フォーム */
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {currentNews?.id && newsItems.some(news => news.id === currentNews.id) 
                ? 'ニュース記事の編集' 
                : '新規ニュース記事の作成'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* 左側 - 基本情報 */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                      タイトル <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={currentNews?.title || ''}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${validationErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A45D]`}
                      placeholder="ニュースタイトルを入力"
                    />
                    {validationErrors.title && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="typeId" className="block text-gray-700 font-medium mb-2">
                        タイプ
                      </label>
                      <select
                        id="typeId"
                        name="typeId"
                        value={currentNews?.typeId || 'info'}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A45D]"
                      >
                        {newsTypes.map(type => (
                          <option key={type.id} value={type.id}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
                        日付
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={currentNews?.date?.replace(/\//g, '-') || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A45D]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
                      画像URL
                    </label>
                    <input
                      type="text"
                      id="image"
                      name="image"
                      value={currentNews?.image || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A45D]"
                      placeholder="/images/example.jpg"
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      画像管理画面でアップロードした画像のURLを入力してください
                    </p>
                  </div>
                  
                  <div>
                    <label className="relative inline-flex items-center cursor-pointer mt-4">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={currentNews?.isPublished || false}
                        onChange={handlePublishChange}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ms-3 text-sm font-medium text-gray-900">公開する</span>
                    </label>
                  </div>
                </div>
                
                {/* 右側 - コンテンツ情報 */}
                <div>
                  <div>
                    <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
                      内容 <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      value={currentNews?.content || ''}
                      onChange={handleInputChange}
                      rows={12}
                      className={`w-full px-3 py-2 border ${validationErrors.content ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A45D]`}
                      placeholder="ニュース内容を入力"
                    ></textarea>
                    {validationErrors.content && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.content}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* プレビュー */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">プレビュー</h3>
                <div className="bg-[#0A2744]/10 p-4 rounded-lg">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center mb-2">
                      {currentNews?.typeId && (
                        <span className={`${newsTypes.find(t => t.id === currentNews.typeId)?.color} text-xs font-bold px-3 py-1 rounded-full text-white mr-3`}>
                          {newsTypes.find(t => t.id === currentNews.typeId)?.label}
                        </span>
                      )}
                      <span className="text-gray-500">{currentNews?.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{currentNews?.title || '(タイトル未設定)'}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {currentNews?.content || '(内容未入力)'}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{currentNews?.isPublished ? '公開' : '下書き'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* ボタン */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0A2744] text-white rounded-md hover:bg-[#0A2744]/90 transition-colors flex items-center"
                >
                  <Save size={16} className="mr-1" />
                  保存する
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ニュース一覧 */
          <>
            {/* 検索とフィルタリング */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="relative w-full md:w-1/3">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="検索..."
                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A45D]"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex space-x-3">
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C8A45D]"
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                  >
                    <option value="all">すべてのタイプ</option>
                    {newsTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                  
                  <label className="inline-flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-[#0A2744]"
                      checked={showDrafts}
                      onChange={e => setShowDrafts(e.target.checked)}
                    />
                    <span className="text-gray-700">下書きを表示</span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* ニュース一覧テーブル */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              {filteredNews.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ステータス
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        タイトル
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        タイプ
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        日付
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        アクション
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredNews.map(news => (
                      <tr key={news.id} className={!news.isPublished ? 'bg-gray-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${news.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {news.isPublished ? '公開' : '下書き'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{news.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{news.content}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`${news.typeClass} text-xs font-bold px-2 py-1 rounded-full text-white`}>
                            {news.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {news.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => togglePublishStatus(news.id)}
                              className={`${news.isPublished ? 'text-amber-600 hover:text-amber-900' : 'text-green-600 hover:text-green-900'}`}
                              title={news.isPublished ? '非公開にする' : '公開する'}
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => startEditing(news)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="編集"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(news.id)}
                              className="text-red-600 hover:text-red-900"
                              title="削除"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  該当するニュース記事が見つかりません
                </div>
              )}
            </div>
            
            {/* ページネーション（ダミー） */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                全{newsItems.length}件中 {filteredNews.length}件表示
              </div>
              <div className="flex space-x-1">
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
                  <ChevronLeft size={16} />
                </button>
                <button className="px-3 py-1 border border-gray-300 bg-[#0A2744] text-white rounded-md">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </main>
      
      {/* フッター */}
      <footer className="bg-white border-t border-gray-200 mt-8 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          © 2023 MORIWAKI BALLET STUDIO 管理システム
        </div>
      </footer>
    </div>
  );
};

export default AdminNewsPage; 