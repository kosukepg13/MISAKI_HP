import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Users, MapPin, Info, Download, Home, ChevronRight } from 'lucide-react';

// スタジオデータ
const defaultStudios = [
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

// デフォルトのスケジュールデータ
const defaultScheduleData = {
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

const SchedulePage: React.FC = () => {
  const [selectedStudio, setSelectedStudio] = useState("central");
  const [studios, setStudios] = useState(defaultStudios);
  const [scheduleData, setScheduleData] = useState(defaultScheduleData);
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

  // スケジュールデータの取得
  useEffect(() => {
    // スタジオデータの取得
    const storedStudios = localStorage.getItem(STUDIOS_STORAGE_KEY);
    if (storedStudios) {
      setStudios(JSON.parse(storedStudios));
    }
    
    // スケジュールデータの取得
    const storedSchedule = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (storedSchedule) {
      setScheduleData(JSON.parse(storedSchedule));
    }
  }, []);

  // SEOのためにtitleとdescriptionを設定
  useEffect(() => {
    document.title = 'レッスンスケジュール | MORIWAKI BALLET STUDIO';
    // メタディスクリプションの設定（実際のプロジェクトではHelmetsなどを使うべき）
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'MORIWAKI BALLET STUDIOのレッスンスケジュールをご案内します。各スタジオのクラス、時間帯、講師情報などをご確認いただけます。');
    }
  }, []);

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
    <div className="min-h-screen font-sans text-white relative">
      {/* 固定背景 - サイト全体に表示 */}
      <div 
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: `url('/images/misaki_logo.jpeg')`,
          filter: 'brightness(0.7)',
          backgroundAttachment: 'fixed'
        }}
      ></div>
      
      {/* 背景オーバーレイ */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0A2744]/80 to-[#0A2744]/95 z-0"></div>

      {/* Header */}
      <header className="bg-[#0A2744]/80 backdrop-blur-sm shadow-md fixed w-full z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="text-2xl font-bold text-[#C8A45D] tracking-wider" style={{ fontFamily: 'serif' }}>
                MORIWAKI BALLET STUDIO
              </div>
            </Link>
          </div>
          <Link 
            to="/" 
            className="bg-[#C8A45D] hover:bg-[#d9b978] text-[#0A2744] px-4 py-2 rounded-full text-sm transition-all duration-300 shadow-md flex items-center font-medium"
          >
            <ArrowLeft size={14} className="mr-1" />
            ホームに戻る
          </Link>
        </nav>
      </header>

      {/* コンテンツ部分 */}
      <div className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* パンくずリスト */}
          <nav className="flex mb-8 text-sm text-gray-400">
            <Link to="/" className="flex items-center hover:text-[#C8A45D] transition-colors">
              <Home size={14} className="mr-1" />
              <span>ホーム</span>
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-[#C8A45D]">レッスンスケジュール</span>
          </nav>
          
          <h1 className="text-5xl font-serif text-[#C8A45D] mb-2 tracking-wider text-center">Schedule</h1>
          <div className="w-24 h-1 bg-[#C8A45D] mx-auto mb-3"></div>
          <p className="text-sm text-center text-gray-300 font-light tracking-[0.3em] uppercase mb-8">レッスンスケジュール</p>
          
          {/* スケジュールの説明文を追加 */}
          <div className="bg-[#0A2744]/70 border border-[#C8A45D]/30 rounded-xl p-6 mb-8">
            <p className="text-gray-300 text-center leading-relaxed">
              MORIWAKI BALLET STUDIOの各スタジオのレッスンスケジュールをご案内します。<br />
              クラス、時間帯、講師情報などをご確認いただけます。スタジオタブをクリックして切り替えてください。
            </p>
          </div>
          
          {/* スタジオ選択タブ */}
          <div className="flex flex-wrap justify-center mb-8">
            {studios.map((studio) => (
              <button
                key={studio.id}
                className={`px-6 py-3 m-1 rounded-full text-sm font-medium transition-all duration-300 
                  ${selectedStudio === studio.id 
                    ? 'bg-[#C8A45D] text-[#0A2744]' 
                    : 'bg-[#0A2744]/70 text-white hover:bg-[#C8A45D]/20 hover:text-[#C8A45D]'
                  }`}
                onClick={() => setSelectedStudio(studio.id)}
              >
                {studio.name}
              </button>
            ))}
          </div>
          
          {/* 凡例 */}
          <div className="bg-[#0A2744]/70 border border-[#C8A45D]/30 rounded-xl p-4 mb-8">
            <h3 className="text-[#C8A45D] mb-3 font-medium flex items-center">
              <Info size={16} className="mr-2" />
              クラス案内
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {classTypes.map((type) => (
                <div key={type.id} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${type.color} mr-2`}></div>
                  <div>
                    <div className="text-sm font-medium">{type.name}</div>
                    <div className="text-xs text-gray-400">{type.age}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* スタジオ情報 */}
          <div className="bg-[#0A2744]/70 border border-[#C8A45D]/30 rounded-xl p-4 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className="text-2xl text-[#C8A45D] mb-2 font-medium">
                  {studios.find(s => s.id === selectedStudio)?.name}
                </h2>
                <p className="text-gray-300 flex items-center">
                  <MapPin size={16} className="mr-2" />
                  {studios.find(s => s.id === selectedStudio)?.address}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <a 
                  href="#" 
                  className="inline-flex items-center bg-[#0A2744] border border-[#C8A45D]/30 text-[#C8A45D] px-4 py-2 rounded-md text-sm transition-all duration-300 hover:bg-[#C8A45D]/10"
                >
                  <Download size={16} className="mr-2" />
                  スケジュールPDFをダウンロード
                </a>
              </div>
            </div>
          </div>
          
          {/* スケジュール表 */}
          <div className="space-y-8">
            {days.map((day) => (
              <div key={day} className="bg-[#0A2744]/70 border border-[#C8A45D]/30 rounded-xl overflow-hidden">
                <div className="bg-[#0f3a5e] px-6 py-3 flex items-center">
                  <Calendar size={18} className="mr-2 text-[#C8A45D]" />
                  <h3 className="text-lg font-medium text-[#C8A45D]">{dayNames[day as keyof typeof dayNames]}</h3>
                </div>
                
                {scheduleData[selectedStudio as keyof typeof scheduleData][day as keyof typeof scheduleData.central].length > 0 ? (
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {scheduleData[selectedStudio as keyof typeof scheduleData][day as keyof typeof scheduleData.central].map((session, index) => (
                        <div 
                          key={index} 
                          className="bg-[#0A2744] border border-[#C8A45D]/20 rounded-lg p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                          <div className="flex items-start mb-3">
                            <div className={`${getClassColor(session.type)} w-2 h-full rounded-full mr-3`}></div>
                            <div>
                              <div className="text-[#C8A45D] font-medium">{getClassName(session.type)}</div>
                              <div className="text-gray-300 flex items-center mt-1">
                                <Clock size={14} className="mr-1" /> 
                                {session.time}
                              </div>
                              <div className="text-gray-300 flex items-center mt-1">
                                <Users size={14} className="mr-1" /> 
                                {session.instructor}
                              </div>
                              <div className="text-gray-400 text-sm mt-1">
                                {session.studio}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-400">
                    この日のレッスンはありません
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* 関連ページリンク */}
          <div className="bg-[#0A2744]/70 border border-[#C8A45D]/30 rounded-xl p-6 mt-16 mb-8">
            <h3 className="text-center text-[#C8A45D] mb-4 font-medium">関連ページ</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/news" 
                className="bg-[#0A2744] border border-[#C8A45D]/30 text-[#C8A45D] px-4 py-2 rounded-md text-sm hover:bg-[#C8A45D]/10 transition-all duration-300"
              >
                ニュース・お知らせ
              </Link>
              <a 
                href="/#prices" 
                className="bg-[#0A2744] border border-[#C8A45D]/30 text-[#C8A45D] px-4 py-2 rounded-md text-sm hover:bg-[#C8A45D]/10 transition-all duration-300"
              >
                料金案内
              </a>
              <a 
                href="/#contact" 
                className="bg-[#0A2744] border border-[#C8A45D]/30 text-[#C8A45D] px-4 py-2 rounded-md text-sm hover:bg-[#C8A45D]/10 transition-all duration-300"
              >
                お問い合わせ
              </a>
            </div>
          </div>
          
          {/* 注意事項 */}
          <div className="bg-[#0A2744]/70 border border-[#C8A45D]/30 rounded-xl p-6 mt-8">
            <h3 className="text-[#C8A45D] mb-3 font-medium">ご注意事項</h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• スケジュールは予告なく変更される場合があります。最新情報は各スタジオにお問い合わせください。</li>
              <li>• レッスンは予約制です。参加希望の方は事前にご予約をお願いします。</li>
              <li>• 祝日はお休みとなります。</li>
              <li>• 体験レッスンは各クラス1回無料でご参加いただけます。</li>
              <li>• お持ち物や服装については、各スタジオにてご確認ください。</li>
            </ul>
          </div>
          
          <div className="text-center mt-16">
            <Link to="/" className="inline-block bg-[#C8A45D] hover:bg-[#d9b978] text-[#0A2744] px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 shadow-md">
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0A2744]/80 backdrop-blur-sm text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-xl font-bold text-[#C8A45D] tracking-wider mb-4" style={{ fontFamily: 'serif' }}>
            MORIWAKI BALLET STUDIO
          </div>
          <p className="text-gray-400">© 2023 MORIWAKI BALLET STUDIO. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default SchedulePage; 