import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Save,
  Clock,
  Calendar,
  MapPin,
  Users,
  AlertCircle,
  Filter
} from 'lucide-react';

// スタジオデータ
const initialStudios = [
  { id: "central", name: "中央スタジオ", address: "東京都中央区銀座5-6-7" },
  { id: "shinjuku", name: "新宿スタジオ", address: "東京都新宿区西新宿1-2-3" },
  { id: "shibuya", name: "渋谷スタジオ", address: "東京都渋谷区渋谷2-3-4" },
  { id: "roppongi", name: "六本木スタジオ", address: "東京都港区六本木3-4-5" }
];

// クラスタイプデータ
const classTypes = [
  { id: "kids", name: "キッズ", age: "4〜6歳", color: "bg-pink-600" },
  { id: "junior", name: "ジュニア", age: "7〜12歳", color: "bg-purple-600" },
  { id: "teen", name: "ティーン", age: "13〜18歳", color: "bg-blue-600" },
  { id: "adult-beginner", name: "大人初心者", age: "19歳以上", color: "bg-green-600" },
  { id: "adult-intermediate", name: "大人中級", age: "経験者", color: "bg-yellow-600" }
];

// 曜日データ
const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const dayNames = {
  monday: "月曜日",
  tuesday: "火曜日",
  wednesday: "水曜日",
  thursday: "木曜日",
  friday: "金曜日",
  saturday: "土曜日",
  sunday: "日曜日"
};

// 講師データ
const instructors = [
  { id: "sato", name: "佐藤先生" },
  { id: "tanaka", name: "田中先生" },
  { id: "suzuki", name: "鈴木先生" },
  { id: "takahashi", name: "高橋先生" },
  { id: "yamamoto", name: "山本先生" }
];

// スケジュールデータ（初期データ）
const initialScheduleData = {
  central: {
    monday: [
      { id: 1, time: "15:00-16:00", type: "kids", studio: "Aスタジオ", instructor: "佐藤先生" },
      { id: 2, time: "16:15-17:15", type: "junior", studio: "Aスタジオ", instructor: "佐藤先生" },
      { id: 3, time: "17:30-19:00", type: "teen", studio: "Aスタジオ", instructor: "田中先生" },
      { id: 4, time: "19:15-20:15", type: "adult-beginner", studio: "Aスタジオ", instructor: "田中先生" }
    ],
    tuesday: [
      { id: 5, time: "10:00-11:00", type: "adult-beginner", studio: "Bスタジオ", instructor: "鈴木先生" },
      { id: 6, time: "11:15-12:15", type: "adult-intermediate", studio: "Bスタジオ", instructor: "鈴木先生" },
      { id: 7, time: "15:00-16:00", type: "kids", studio: "Aスタジオ", instructor: "佐藤先生" },
      { id: 8, time: "16:15-17:15", type: "junior", studio: "Aスタジオ", instructor: "佐藤先生" },
      { id: 9, time: "17:30-19:00", type: "teen", studio: "Aスタジオ", instructor: "田中先生" },
      { id: 10, time: "19:15-20:15", type: "adult-intermediate", studio: "Aスタジオ", instructor: "田中先生" }
    ],
    wednesday: [
      { id: 11, time: "15:00-16:00", type: "kids", studio: "Aスタジオ", instructor: "佐藤先生" },
      { id: 12, time: "16:15-17:15", type: "junior", studio: "Aスタジオ", instructor: "佐藤先生" },
      { id: 13, time: "17:30-19:00", type: "teen", studio: "Aスタジオ", instructor: "田中先生" },
      { id: 14, time: "19:15-20:15", type: "adult-beginner", studio: "Aスタジオ", instructor: "田中先生" }
    ],
    thursday: [
      { id: 15, time: "10:00-11:00", type: "adult-beginner", studio: "Bスタジオ", instructor: "鈴木先生" },
      { id: 16, time: "11:15-12:15", type: "adult-intermediate", studio: "Bスタジオ", instructor: "鈴木先生" },
      { id: 17, time: "15:00-16:00", type: "kids", studio: "Aスタジオ", instructor: "佐藤先生" },
      { id: 18, time: "16:15-17:15", type: "junior", studio: "Aスタジオ", instructor: "佐藤先生" },
      { id: 19, time: "17:30-19:00", type: "teen", studio: "Aスタジオ", instructor: "田中先生" },
      { id: 20, time: "19:15-20:15", type: "adult-intermediate", studio: "Aスタジオ", instructor: "田中先生" }
    ],
    friday: [
      { id: 21, time: "15:00-16:00", type: "kids", studio: "Aスタジオ", instructor: "佐藤先生" },
      { id: 22, time: "16:15-17:15", type: "junior", studio: "Aスタジオ", instructor: "佐藤先生" },
      { id: 23, time: "17:30-19:00", type: "teen", studio: "Aスタジオ", instructor: "田中先生" },
      { id: 24, time: "19:15-20:15", type: "adult-beginner", studio: "Aスタジオ", instructor: "田中先生" }
    ],
    saturday: [
      { id: 25, time: "10:00-11:00", type: "kids", studio: "Aスタジオ", instructor: "佐藤先生" },
      { id: 26, time: "11:15-12:15", type: "junior", studio: "Aスタジオ", instructor: "佐藤先生" },
      { id: 27, time: "13:00-14:00", type: "teen", studio: "Aスタジオ", instructor: "田中先生" },
      { id: 28, time: "14:15-15:15", type: "adult-beginner", studio: "Bスタジオ", instructor: "鈴木先生" },
      { id: 29, time: "15:30-16:30", type: "adult-intermediate", studio: "Bスタジオ", instructor: "鈴木先生" }
    ],
    sunday: []
  },
  shinjuku: {
    monday: [
      { id: 30, time: "15:00-16:00", type: "kids", studio: "スタジオA", instructor: "高橋先生" },
      { id: 31, time: "16:15-17:15", type: "junior", studio: "スタジオA", instructor: "高橋先生" },
      { id: 32, time: "17:30-19:00", type: "teen", studio: "スタジオA", instructor: "山本先生" },
      { id: 33, time: "19:15-20:15", type: "adult-beginner", studio: "スタジオA", instructor: "山本先生" }
    ],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  },
  shibuya: {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  },
  roppongi: {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  }
};

// ローカルストレージのキー
const SCHEDULE_STORAGE_KEY = 'moriwaki_schedule_data';
const STUDIOS_STORAGE_KEY = 'moriwaki_studios_data';

const AdminSchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const [studios, setStudios] = useState(initialStudios);
  const [scheduleData, setScheduleData] = useState(initialScheduleData);
  const [selectedStudio, setSelectedStudio] = useState("central");
  const [selectedDay, setSelectedDay] = useState("monday");
  const [isEditing, setIsEditing] = useState(false);
  const [currentClass, setCurrentClass] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [successMessage, setSuccessMessage] = useState('');
  
  // ローカルストレージからデータを取得
  useEffect(() => {
    // 管理者ログインの確認
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/admin');
      return;
    }
    
    // スタジオデータの取得
    const storedStudios = localStorage.getItem(STUDIOS_STORAGE_KEY);
    if (storedStudios) {
      setStudios(JSON.parse(storedStudios));
    } else {
      setStudios(initialStudios);
      localStorage.setItem(STUDIOS_STORAGE_KEY, JSON.stringify(initialStudios));
    }
    
    // スケジュールデータの取得
    const storedSchedule = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (storedSchedule) {
      setScheduleData(JSON.parse(storedSchedule));
    } else {
      setScheduleData(initialScheduleData);
      localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(initialScheduleData));
    }
  }, [navigate]);

  // データをローカルストレージに保存
  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // 新規クラス作成モードの開始
  const startCreating = () => {
    setValidationErrors({});
    setSuccessMessage('');
    
    // 新しいIDを生成（全スタジオ、全曜日の既存IDの最大値 + 1）
    let maxId = 0;
    Object.keys(scheduleData).forEach(studio => {
      Object.keys(scheduleData[studio as keyof typeof scheduleData]).forEach(day => {
        const classes = scheduleData[studio as keyof typeof scheduleData][day as keyof typeof scheduleData.central];
        classes.forEach(cls => {
          if (cls.id > maxId) maxId = cls.id;
        });
      });
    });
    
    setCurrentClass({
      id: maxId + 1,
      time: "",
      type: "kids",
      studio: "",
      instructor: ""
    });
    
    setIsEditing(true);
  };

  // 編集モードの開始
  const startEditing = (classItem: any) => {
    setValidationErrors({});
    setSuccessMessage('');
    setCurrentClass({...classItem});
    setIsEditing(true);
  };

  // フォーム送信時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 検証
    const errors: {[key: string]: string} = {};
    if (!currentClass?.time) {
      errors.time = '時間を入力してください';
    }
    if (!currentClass?.studio) {
      errors.studio = 'スタジオを入力してください';
    }
    if (!currentClass?.instructor) {
      errors.instructor = '講師を入力してください';
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    // スケジュールの更新
    const isNew = !scheduleData[selectedStudio as keyof typeof scheduleData][selectedDay as keyof typeof scheduleData.central]
      .some(c => c.id === currentClass.id);
    
    const updatedSchedule = {...scheduleData};
    const daySchedule = [...updatedSchedule[selectedStudio as keyof typeof updatedSchedule][selectedDay as keyof typeof updatedSchedule.central]];
    
    if (isNew) {
      daySchedule.push(currentClass);
      // 開始時間でソート
      daySchedule.sort((a, b) => {
        const timeA = a.time.split('-')[0];
        const timeB = b.time.split('-')[0];
        return timeA.localeCompare(timeB);
      });
      
      updatedSchedule[selectedStudio as keyof typeof updatedSchedule][selectedDay as keyof typeof updatedSchedule.central] = daySchedule;
      setSuccessMessage('新しいレッスンを追加しました');
    } else {
      const updatedDaySchedule = daySchedule.map(c => c.id === currentClass.id ? currentClass : c);
      // 開始時間でソート
      updatedDaySchedule.sort((a, b) => {
        const timeA = a.time.split('-')[0];
        const timeB = b.time.split('-')[0];
        return timeA.localeCompare(timeB);
      });
      
      updatedSchedule[selectedStudio as keyof typeof updatedSchedule][selectedDay as keyof typeof updatedSchedule.central] = updatedDaySchedule;
      setSuccessMessage('レッスンを更新しました');
    }
    
    setScheduleData(updatedSchedule);
    saveToStorage(SCHEDULE_STORAGE_KEY, updatedSchedule);
    
    // 成功メッセージを表示して自動的に消す
    setTimeout(() => {
      setSuccessMessage('');
      setIsEditing(false);
      setCurrentClass(null);
    }, 3000);
  };

  // キャンセル処理
  const handleCancel = () => {
    setValidationErrors({});
    setSuccessMessage('');
    setIsEditing(false);
    setCurrentClass(null);
  };

  // 削除処理
  const handleDelete = (id: number) => {
    if (window.confirm('このレッスンを削除してもよろしいですか？')) {
      const updatedSchedule = {...scheduleData};
      const daySchedule = updatedSchedule[selectedStudio as keyof typeof updatedSchedule][selectedDay as keyof typeof updatedSchedule.central];
      const filteredSchedule = daySchedule.filter(c => c.id !== id);
      
      updatedSchedule[selectedStudio as keyof typeof updatedSchedule][selectedDay as keyof typeof updatedSchedule.central] = filteredSchedule;
      
      setScheduleData(updatedSchedule);
      saveToStorage(SCHEDULE_STORAGE_KEY, updatedSchedule);
      
      setSuccessMessage('レッスンを削除しました');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  // 入力フィールドの変更ハンドラ
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (currentClass) {
      setCurrentClass({
        ...currentClass,
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

  // クラスタイプの色を取得する関数
  const getClassColor = (type: string) => {
    const classType = classTypes.find(ct => ct.id === type);
    return classType ? classType.color : "bg-gray-600";
  };

  // クラス名を取得する関数
  const getClassName = (type: string) => {
    const classType = classTypes.find(ct => ct.id === type);
    return classType ? classType.name : "不明";
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
            <h1 className="text-2xl font-bold text-gray-800">スケジュール管理</h1>
            <p className="text-gray-600">各スタジオのレッスンスケジュールを管理できます</p>
          </div>
        </div>

        {isEditing ? (
          /* 編集フォーム */
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {currentClass?.id && scheduleData[selectedStudio as keyof typeof scheduleData][selectedDay as keyof typeof scheduleData.central].some(c => c.id === currentClass.id)
                ? 'レッスンの編集' 
                : '新規レッスンの追加'}
            </h2>
            <p className="text-gray-600 mb-6">
              {selectedStudio && studios.find(s => s.id === selectedStudio)?.name} / {selectedDay && dayNames[selectedDay as keyof typeof dayNames]}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* 左側 - 基本情報 */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="time" className="block text-gray-700 font-medium mb-2">
                      時間 <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="time"
                      name="time"
                      value={currentClass?.time || ''}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${validationErrors.time ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A45D]`}
                      placeholder="例: 15:00-16:00"
                    />
                    {validationErrors.time && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.time}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                      「開始時間-終了時間」の形式で入力してください
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="type" className="block text-gray-700 font-medium mb-2">
                      クラスタイプ
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={currentClass?.type || 'kids'}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A45D]"
                    >
                      {classTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* 右側 - スタジオと講師情報 */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="studio" className="block text-gray-700 font-medium mb-2">
                      スタジオ名 <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="studio"
                      name="studio"
                      value={currentClass?.studio || ''}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${validationErrors.studio ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A45D]`}
                      placeholder="例: Aスタジオ"
                    />
                    {validationErrors.studio && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.studio}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="instructor" className="block text-gray-700 font-medium mb-2">
                      講師 <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="instructor"
                      name="instructor"
                      value={currentClass?.instructor || ''}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${validationErrors.instructor ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A45D]`}
                    >
                      <option value="">講師を選択</option>
                      {instructors.map(instructor => (
                        <option key={instructor.id} value={instructor.name}>{instructor.name}</option>
                      ))}
                    </select>
                    {validationErrors.instructor && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.instructor}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* プレビュー */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">プレビュー</h3>
                <div className="bg-[#0A2744]/10 p-4 rounded-lg">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start mb-3 md:mb-0">
                        <div className={`${getClassColor(currentClass?.type || 'kids')} w-2 h-full rounded-full mr-3`}></div>
                        <div>
                          <div className="text-gray-900 font-medium">{getClassName(currentClass?.type || 'kids')}</div>
                          <div className="text-gray-600 flex items-center mt-1">
                            <Clock size={14} className="mr-1" /> 
                            {currentClass?.time || '(時間未設定)'}
                          </div>
                          <div className="text-gray-600 flex items-center mt-1">
                            <Users size={14} className="mr-1" /> 
                            {currentClass?.instructor || '(講師未選択)'}
                          </div>
                          <div className="text-gray-500 text-sm mt-1">
                            {currentClass?.studio || '(スタジオ未設定)'}
                          </div>
                        </div>
                      </div>
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
          /* スケジュール一覧 */
          <>
            {/* スタジオと曜日選択 */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="w-full md:w-1/2">
                  <label htmlFor="studio-select" className="block text-sm font-medium text-gray-700 mb-1">
                    スタジオ
                  </label>
                  <select
                    id="studio-select"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A45D]"
                    value={selectedStudio}
                    onChange={(e) => setSelectedStudio(e.target.value)}
                  >
                    {studios.map(studio => (
                      <option key={studio.id} value={studio.id}>{studio.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="w-full md:w-1/2">
                  <label htmlFor="day-select" className="block text-sm font-medium text-gray-700 mb-1">
                    曜日
                  </label>
                  <select
                    id="day-select"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A45D]"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                  >
                    {days.map(day => (
                      <option key={day} value={day}>{dayNames[day as keyof typeof dayNames]}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* スケジュール表示 */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    {studios.find(studio => studio.id === selectedStudio)?.name} - {dayNames[selectedDay as keyof typeof dayNames]}
                  </h2>
                  <p className="text-sm text-gray-600">
                    登録レッスン数: {scheduleData[selectedStudio as keyof typeof scheduleData][selectedDay as keyof typeof scheduleData.central].length}
                  </p>
                </div>
                <button
                  onClick={startCreating}
                  className="bg-[#0A2744] text-white px-3 py-1 rounded-md hover:bg-[#0A2744]/90 transition duration-300 flex items-center text-sm"
                >
                  <Plus size={14} className="mr-1" />
                  新規レッスン追加
                </button>
              </div>
              
              {scheduleData[selectedStudio as keyof typeof scheduleData][selectedDay as keyof typeof scheduleData.central].length > 0 ? (
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {scheduleData[selectedStudio as keyof typeof scheduleData][selectedDay as keyof typeof scheduleData.central].map((classItem: any) => (
                      <div 
                        key={classItem.id} 
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start mb-3">
                          <div className={`${getClassColor(classItem.type)} w-2 h-full rounded-full mr-3`}></div>
                          <div className="flex-1">
                            <div className="text-gray-900 font-medium">{getClassName(classItem.type)}</div>
                            <div className="text-gray-600 flex items-center mt-1">
                              <Clock size={14} className="mr-1" /> 
                              {classItem.time}
                            </div>
                            <div className="text-gray-600 flex items-center mt-1">
                              <Users size={14} className="mr-1" /> 
                              {classItem.instructor}
                            </div>
                            <div className="text-gray-500 text-sm mt-1">
                              {classItem.studio}
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2 ml-2">
                            <button
                              onClick={() => startEditing(classItem)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="編集"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(classItem.id)}
                              className="text-red-600 hover:text-red-900"
                              title="削除"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  この日のレッスンはありません。「新規レッスン追加」ボタンからレッスンを登録してください。
                </div>
              )}
            </div>
            
            {/* スタジオ情報 */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">スタジオ情報</h3>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex items-center">
                  <MapPin size={18} className="text-gray-500 mr-2" />
                  <span className="text-gray-700">
                    {studios.find(studio => studio.id === selectedStudio)?.address}
                  </span>
                </div>
              </div>
            </div>
            
            {/* クラスタイプ凡例 */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-3">クラスタイプ</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {classTypes.map((type) => (
                  <div key={type.id} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${type.color} mr-2`}></div>
                    <div>
                      <div className="text-sm font-medium text-gray-700">{type.name}</div>
                      <div className="text-xs text-gray-500">{type.age}</div>
                    </div>
                  </div>
                ))}
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

export default AdminSchedulePage; 