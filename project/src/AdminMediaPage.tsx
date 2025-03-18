import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Upload, 
  Trash2, 
  Copy, 
  ImageIcon, 
  FileIcon, 
  FolderIcon, 
  AlertCircle 
} from 'lucide-react';

// メディアストレージキー
const MEDIA_STORAGE_KEY = 'moriwaki_media_data';

// デフォルトのメディアアイテム
const defaultMediaItems = [
  {
    id: "img1",
    filename: "ballet-class.jpg",
    type: "image",
    contentType: "image/jpeg",
    uploadDate: "2023-06-10",
    size: "1.2MB",
    url: "/images/news1.jpg",
    thumbnail: "/images/news1.jpg",
    inUse: true
  },
  {
    id: "img2",
    filename: "studio-opening.jpg",
    type: "image",
    contentType: "image/jpeg",
    uploadDate: "2023-07-15",
    size: "0.8MB",
    url: "/images/news2.jpg",
    thumbnail: "/images/news2.jpg",
    inUse: true
  },
  {
    id: "img3",
    filename: "workshop-event.jpg",
    type: "image",
    contentType: "image/jpeg",
    uploadDate: "2023-08-20",
    size: "1.5MB",
    url: "/images/news3.jpg",
    thumbnail: "/images/news3.jpg",
    inUse: true
  },
  {
    id: "img4",
    filename: "renovation.jpg",
    type: "image",
    contentType: "image/jpeg",
    uploadDate: "2023-09-05",
    size: "1.1MB",
    url: "/images/news4.jpg",
    thumbnail: "/images/news4.jpg",
    inUse: true
  },
  {
    id: "img5",
    filename: "lesson-cancel.jpg",
    type: "image",
    contentType: "image/jpeg",
    uploadDate: "2023-10-12",
    size: "0.9MB",
    url: "/images/news5.jpg",
    thumbnail: "/images/news5.jpg",
    inUse: true
  }
];

// メディアタイプの定義
const mediaTypes = {
  image: {
    icon: <ImageIcon size={18} />,
    label: "画像"
  },
  document: {
    icon: <FileIcon size={18} />,
    label: "文書"
  },
  folder: {
    icon: <FolderIcon size={18} />,
    label: "フォルダ"
  }
};

// コピー成功メッセージを表示する関数
const showCopySuccessMessage = (message: string) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.className = 'copy-success-message';
  messageElement.style.position = 'fixed';
  messageElement.style.bottom = '20px';
  messageElement.style.right = '20px';
  messageElement.style.backgroundColor = '#4CAF50';
  messageElement.style.color = 'white';
  messageElement.style.padding = '10px';
  messageElement.style.borderRadius = '5px';
  messageElement.style.zIndex = '1000';
  
  document.body.appendChild(messageElement);
  
  setTimeout(() => {
    messageElement.style.opacity = '0';
    messageElement.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
      document.body.removeChild(messageElement);
    }, 500);
  }, 2000);
};

const AdminMediaPage: React.FC = () => {
  // 状態の定義
  const [mediaItems, setMediaItems] = useState<typeof defaultMediaItems>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showOnlyUsed, setShowOnlyUsed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 管理者ログイン確認
  useEffect(() => {
    const isAdmin = localStorage.getItem('moriwaki_admin_logged_in');
    if (!isAdmin) {
      window.location.href = '/admin';
    }
    
    // メディアデータの取得
    const storedMedia = localStorage.getItem(MEDIA_STORAGE_KEY);
    if (storedMedia) {
      setMediaItems(JSON.parse(storedMedia));
    } else {
      setMediaItems(defaultMediaItems);
      localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(defaultMediaItems));
    }
  }, []);

  // メディアデータの保存
  const saveMediaData = (data: typeof defaultMediaItems) => {
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(data));
    setMediaItems(data);
  };
  
  // フィルタリングされたメディアアイテムの取得
  const filteredMediaItems = mediaItems.filter(item => {
    const matchesSearch = item.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUsage = showOnlyUsed ? item.inUse : true;
    return matchesSearch && matchesUsage;
  });
  
  // ソートされたメディアアイテムの取得
  const sortedMediaItems = [...filteredMediaItems].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc' 
        ? new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
        : new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
    } else if (sortBy === 'name') {
      return sortOrder === 'asc'
        ? a.filename.localeCompare(b.filename)
        : b.filename.localeCompare(a.filename);
    } else { // size
      const aSize = parseFloat(a.size.replace('MB', ''));
      const bSize = parseFloat(b.size.replace('MB', ''));
      return sortOrder === 'asc' ? aSize - bSize : bSize - aSize;
    }
  });

  // メディアの削除
  const handleDelete = (id: string) => {
    if (window.confirm('このメディアを削除してもよろしいですか？使用中のメディアは削除できません。')) {
      const mediaItem = mediaItems.find(item => item.id === id);
      
      if (mediaItem && mediaItem.inUse) {
        setErrorMessage('使用中のメディアは削除できません。');
        setTimeout(() => setErrorMessage(''), 3000);
        return;
      }
      
      const updatedItems = mediaItems.filter(item => item.id !== id);
      saveMediaData(updatedItems);
      
      if (selectedMedia === id) {
        setSelectedMedia(null);
      }
      
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    }
  };
  
  // 複数のメディアの削除
  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    
    if (window.confirm(`選択した${selectedItems.length}個のメディアを削除してもよろしいですか？使用中のメディアは削除されません。`)) {
      const usedItems = mediaItems.filter(item => item.inUse && selectedItems.includes(item.id));
      
      if (usedItems.length > 0) {
        setErrorMessage(`${usedItems.length}個のメディアは使用中のため削除できません。`);
        setTimeout(() => setErrorMessage(''), 3000);
      }
      
      const updatedItems = mediaItems.filter(item => !selectedItems.includes(item.id) || item.inUse);
      saveMediaData(updatedItems);
      setSelectedItems([]);
      setSelectedMedia(null);
    }
  };
  
  // URLのコピー
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      showCopySuccessMessage('URLをクリップボードにコピーしました');
    });
  };
  
  // アップロードのシミュレーション
  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // 新しいメディアアイテムの追加
          const newId = `img${mediaItems.length + 1}`;
          const newItem = {
            id: newId,
            filename: `uploaded-image-${newId}.jpg`,
            type: "image",
            contentType: "image/jpeg",
            uploadDate: new Date().toISOString().slice(0, 10),
            size: `${(Math.random() * 2 + 0.5).toFixed(1)}MB`,
            url: "/images/placeholder.jpg",
            thumbnail: "/images/placeholder.jpg",
            inUse: false
          };
          
          const updatedItems = [...mediaItems, newItem];
          saveMediaData(updatedItems);
          
          return 0;
        }
        return prev + 10;
      });
    }, 300);
  };
  
  // メディア選択の切り替え
  const toggleSelect = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };
  
  // すべてのメディアの選択
  const toggleSelectAll = () => {
    if (selectedItems.length === filteredMediaItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredMediaItems.map(item => item.id));
    }
  };
  
  // ソート順の切り替え
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  // 表示モードの切り替え
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/admin" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-semibold">メディア管理</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleViewMode}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded"
          >
            {viewMode === 'grid' ? 'リスト表示' : 'グリッド表示'}
          </button>
          <button
            onClick={() => simulateUpload()}
            disabled={isUploading}
            className={`px-4 py-2 flex items-center text-white rounded ${
              isUploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Upload size={16} className="mr-2" />
            {isUploading ? 'アップロード中...' : 'アップロード'}
          </button>
        </div>
      </header>

      {/* アップロードプログレスバー */}
      {isUploading && (
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">アップロード中: {uploadProgress}%</p>
        </div>
      )}

      {/* エラーメッセージ */}
      {errorMessage && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 flex items-center">
          <AlertCircle size={20} className="mr-2" />
          {errorMessage}
        </div>
      )}

      {/* 検索・フィルターバー */}
      <div className="bg-white p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
            placeholder="ファイル名で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showUsed"
              checked={showOnlyUsed}
              onChange={() => setShowOnlyUsed(!showOnlyUsed)}
              className="mr-2"
            />
            <label htmlFor="showUsed" className="text-sm text-gray-600">使用中のみ表示</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">並び替え:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'size')}
              className="border border-gray-300 rounded p-1 text-sm"
            >
              <option value="date">日付</option>
              <option value="name">名前</option>
              <option value="size">サイズ</option>
            </select>
            <button 
              onClick={toggleSortOrder}
              className="text-gray-600 hover:text-gray-900"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* 選択アイテムアクション */}
      {selectedItems.length > 0 && (
        <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {selectedItems.length}個のアイテムを選択中
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleDeleteSelected}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
            >
              <Trash2 size={16} className="mr-1" />
              削除
            </button>
          </div>
        </div>
      )}

      {/* メディアコンテンツ */}
      <main className="p-6">
        {sortedMediaItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            表示するメディアがありません
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {sortedMediaItems.map((item) => (
              <div
                key={item.id}
                className={`relative border rounded-md overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow ${
                  selectedItems.includes(item.id) ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="w-4 h-4"
                  />
                </div>
                
                {item.inUse && (
                  <div className="absolute top-2 right-2 z-10 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    使用中
                  </div>
                )}
                
                <div 
                  className="aspect-w-1 aspect-h-1 bg-gray-100 cursor-pointer"
                  onClick={() => setSelectedMedia(item.id)}
                >
                  {item.type === 'image' ? (
                    <img
                      src={item.thumbnail}
                      alt={item.filename}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/images/placeholder.jpg';
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      {mediaTypes[item.type as keyof typeof mediaTypes]?.icon || <FileIcon size={32} />}
                    </div>
                  )}
                </div>
                
                <div className="p-3">
                  <div className="text-sm font-medium truncate" title={item.filename}>
                    {item.filename}
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>{item.size}</span>
                    <span>{item.uploadDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-md shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-10 py-3 pl-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredMediaItems.length && filteredMediaItems.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ファイル名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    タイプ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    サイズ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アップロード日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状態
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedMediaItems.map((item) => (
                  <tr 
                    key={item.id}
                    className={selectedItems.includes(item.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}
                  >
                    <td className="py-4 pl-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 mr-3 bg-gray-100 rounded overflow-hidden">
                          {item.type === 'image' ? (
                            <img
                              src={item.thumbnail}
                              alt={item.filename}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = '/images/placeholder.jpg';
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              {mediaTypes[item.type as keyof typeof mediaTypes]?.icon || <FileIcon size={24} />}
                            </div>
                          )}
                        </div>
                        <div className="text-sm font-medium text-gray-900">{item.filename}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {mediaTypes[item.type as keyof typeof mediaTypes]?.label || item.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.uploadDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.inUse ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          使用中
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          未使用
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleCopyUrl(item.url)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className={`text-red-600 hover:text-red-900 ${item.inUse ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={item.inUse}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* メディアプレビューモーダル */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">メディアプレビュー</h2>
              <button 
                onClick={() => setSelectedMedia(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {(() => {
              const media = mediaItems.find(item => item.id === selectedMedia);
              if (!media) return null;
              
              return (
                <>
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-1/2 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        {media.type === 'image' ? (
                          <img
                            src={media.url}
                            alt={media.filename}
                            className="max-w-full max-h-[400px] object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = '/images/placeholder.jpg';
                            }}
                          />
                        ) : (
                          <div className="p-12">
                            {mediaTypes[media.type as keyof typeof mediaTypes]?.icon || <FileIcon size={64} />}
                          </div>
                        )}
                      </div>
                      
                      <div className="w-full md:w-1/2">
                        <h3 className="text-xl font-medium mb-4">{media.filename}</h3>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-500">タイプ:</span>
                            <span>{mediaTypes[media.type as keyof typeof mediaTypes]?.label || media.type}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-500">MIME タイプ:</span>
                            <span>{media.contentType}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-500">サイズ:</span>
                            <span>{media.size}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-500">アップロード日:</span>
                            <span>{media.uploadDate}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-500">使用状態:</span>
                            <span>{media.inUse ? '使用中' : '未使用'}</span>
                          </div>
                          
                          <div className="pt-3">
                            <div className="text-gray-500 mb-1">URL:</div>
                            <div className="flex">
                              <input
                                type="text"
                                value={media.url}
                                readOnly
                                className="flex-grow border rounded-l-md px-3 py-2 bg-gray-50"
                              />
                              <button
                                onClick={() => handleCopyUrl(media.url)}
                                className="bg-gray-100 hover:bg-gray-200 border border-l-0 rounded-r-md px-3 py-2"
                              >
                                <Copy size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
                    <button
                      onClick={() => setSelectedMedia(null)}
                      className="px-4 py-2 border rounded-md"
                    >
                      閉じる
                    </button>
                    <button
                      onClick={() => handleDelete(media.id)}
                      className={`px-4 py-2 flex items-center text-white rounded-md ${
                        media.inUse 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                      disabled={media.inUse}
                    >
                      <Trash2 size={16} className="mr-2" />
                      削除
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMediaPage; 