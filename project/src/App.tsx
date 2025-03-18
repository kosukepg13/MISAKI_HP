import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Star, MapPin, Phone, CircleDot, Instagram } from 'lucide-react';
import InstructorProfile, { instructorData } from './InstructorProfile';
import NewsPage from './NewsPage';
import SchedulePage from './SchedulePage';
import AdminPage from './AdminPage';
import AdminNewsPage from './AdminNewsPage';
import AdminSchedulePage from './AdminSchedulePage';
import AdminMediaPage from './AdminMediaPage';

function App() {
  const features = [
    {
      number: 1,
      title: "子供のバレエレッスンを初めて検討した方",
      description: "経験豊富なインストラクターが丁寧に指導いたします。",
      image: "https://images.unsplash.com/photo-1554377740-cb9c91bfd08c?q=80&w=400&h=300&fit=crop"
    },
    {
      number: 2,
      title: "お好きなレッスンが何度でも受けられる年間制クラス",
      description: "柔軟なスケジュールで、お子様のペースに合わせて学べます。",
      image: "https://images.unsplash.com/photo-1563322867-8e4bd1d64303?q=80&w=400&h=300&fit=crop"
    },
    {
      number: 3,
      title: "スタジオの充実したレッスン",
      description: "最新設備を備えた広々としたスタジオで快適なレッスンを。",
      image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=400&h=300&fit=crop"
    }
  ];

  const studios = [
    { name: "中央スタジオ", phone: "03-3775-2021", address: "東京都中央区", image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=600&fit=crop" },
    { name: "新宿スタジオ", phone: "03-5191-7252", address: "東京都新宿区", image: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=800&h=600&fit=crop" },
    { name: "渋谷スタジオ", phone: "03-5726-3568", address: "東京都渋谷区", image: "https://images.unsplash.com/photo-1516801172338-d8b9d5c7c848?w=800&h=600&fit=crop" },
    { name: "六本木スタジオ", phone: "03-6294-8686", address: "東京都港区", image: "https://images.unsplash.com/photo-1575408264798-b50b252663e6?w=800&h=600&fit=crop" },
  ];

  const benefits = [
    {
      title: "子供のうちからバレエを始めるメリット",
      points: [
        "柔軟性と体幹を育てる",
        "リズム感と音楽性を養う",
        "礼儀作法と集中力を身につける"
      ]
    },
    {
      title: "みんなと踊ろう！",
      points: [
        "友達と一緒に楽しく学ぶ",
        "発表会で成長を実感",
        "コミュニケーション力の向上"
      ]
    },
    {
      title: "バレエの技術",
      points: [
        "基本姿勢とポジション",
        "リズム感と音楽性",
        "柔軟性と筋力のバランス"
      ]
    }
  ];

  const MainPage = () => (
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
            <div className="flex items-center">
              <div className="text-2xl font-bold text-[#C8A45D] tracking-wider" style={{ fontFamily: 'serif' }}>
                MORIWAKI BALLET STUDIO
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-8">
            <div className="hidden md:flex space-x-10">
              <a href="#features" className="text-center group relative">
                <div className="text-sm font-medium text-white group-hover:text-[#C8A45D] transition-colors duration-300 uppercase tracking-wider">Feature</div>
                <div className="text-xs text-gray-300 group-hover:text-[#C8A45D] transition-colors duration-300">特徴</div>
                <div className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#C8A45D] group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
              </a>
              <div className="text-center group relative">
                <a href="#classes" className="block">
                  <div className="text-sm font-medium text-white group-hover:text-[#C8A45D] transition-colors duration-300 uppercase tracking-wider">Class</div>
                  <div className="text-xs text-gray-300 group-hover:text-[#C8A45D] transition-colors duration-300">クラス</div>
                  <div className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#C8A45D] group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
                </a>
                <div className="absolute hidden group-hover:block bg-[#0A2744]/90 backdrop-blur-sm shadow-md rounded-md mt-2 py-2 w-48 z-50">
                  <a href="#prices" className="block px-4 py-2 text-white hover:bg-[#C8A45D]/10 hover:text-[#C8A45D] transition-all duration-300">
                    料金案内
                  </a>
                  <Link to="/schedule" className="block px-4 py-2 text-white hover:bg-[#C8A45D]/10 hover:text-[#C8A45D] transition-all duration-300 flex items-center">
                    <span>レッスンスケジュール</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
              <a href="#instructors" className="text-center group relative">
                <div className="text-sm font-medium text-white group-hover:text-[#C8A45D] transition-colors duration-300 uppercase tracking-wider">Instructors</div>
                <div className="text-xs text-gray-300 group-hover:text-[#C8A45D] transition-colors duration-300">講師</div>
                <div className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#C8A45D] group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
              </a>
              <a href="#studios" className="text-center group relative">
                <div className="text-sm font-medium text-white group-hover:text-[#C8A45D] transition-colors duration-300 uppercase tracking-wider">Studio</div>
                <div className="text-xs text-gray-300 group-hover:text-[#C8A45D] transition-colors duration-300">スタジオ</div>
                <div className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#C8A45D] group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
              </a>
              <Link to="/news" className="text-center group relative">
                <div className="text-sm font-medium text-white group-hover:text-[#C8A45D] transition-colors duration-300 uppercase tracking-wider">News</div>
                <div className="text-xs text-gray-300 group-hover:text-[#C8A45D] transition-colors duration-300">ニュース</div>
                <div className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#C8A45D] group-hover:w-full group-hover:left-0 transition-all duration-300 flex items-center">
                </div>
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-1">
                  <div className="flex items-center justify-center w-4 h-4 bg-[#C8A45D] text-[#0A2744] text-[8px] font-bold rounded-full">
                    新
                  </div>
                </div>
              </Link>
              <a href="#faq" className="text-center group relative">
                <div className="text-sm font-medium text-white group-hover:text-[#C8A45D] transition-colors duration-300 uppercase tracking-wider">FAQ</div>
                <div className="text-xs text-gray-300 group-hover:text-[#C8A45D] transition-colors duration-300">よくある質問</div>
                <div className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#C8A45D] group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
              </a>
            </div>
            <div className="bg-[#C8A45D] hover:bg-[#d9b978] text-[#0A2744] rounded-full px-4 py-2 shadow-md group">
              <a href="#contact" className="text-sm font-medium transition-colors duration-300">お問い合わせ</a>
            </div>
          </div>
        </nav>
      </header>

      {/* コンテンツ部分 - すべてz-10とrelativeを追加 */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="relative pt-20">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
            <div className="text-center flex flex-col items-center space-y-8">
              <h1 className="text-2xl md:text-3xl lg:text-5xl font-serif font-light tracking-tight text-[#C8A45D] max-w-30xl overflow-visible">
                We are proud of you and we'll be with you every step of the way.
              </h1>
              
              <p className="text-lg text-gray-300 max-w-2xl">
                私たちは誇るべきあなたの、あらゆる歩みと共にいます。
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                <a 
                  href="#classes" 
                  className="bg-[#C8A45D] hover:bg-[#d9b978] text-[#0A2744] px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 shadow-md"
                >
                  クラスを見る
                </a>
                <a 
                  href="#contact" 
                  className="border border-[#C8A45D] text-[#C8A45D] hover:bg-[#C8A45D]/10 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300"
                >
                  無料体験レッスン
                </a>
            </div>
          </div>
        </div>
      </div>

        {/* Features - 背景を半透明に */}
        <section id="features" className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
              <h2 className="text-5xl font-serif text-[#C8A45D] mb-2 tracking-wider uppercase">Features</h2>
              <div className="w-24 h-1 bg-[#C8A45D] mx-auto mb-3"></div>
              <p className="text-sm text-gray-300 font-light tracking-[0.3em] uppercase">特徴</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
                <div key={feature.number} className="bg-[#0A2744] border border-[#C8A45D]/30 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                  />
                    <div className="absolute top-3 left-3 bg-[#C8A45D] text-[#0A2744] w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  {feature.number}
                  </div>
                </div>
                <div className="p-6">
                    <h3 className="text-lg font-medium mb-2 text-[#C8A45D]">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

        {/* Let's Ballet - 背景を半透明に */}
        <section id="classes" className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
              <h2 className="text-5xl font-serif text-[#C8A45D] mb-2 tracking-wider uppercase">Classes</h2>
              <div className="w-24 h-1 bg-[#C8A45D] mx-auto mb-3"></div>
              <p className="text-sm text-gray-300 font-light tracking-[0.3em] uppercase">クラス案内</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
                <div key={index} className="bg-[#0f3a5e] border border-[#C8A45D]/30 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                  <h3 className="text-xl font-medium mb-4 text-[#C8A45D]">{benefit.title}</h3>
                <ul className="space-y-3">
                  {benefit.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start">
                        <Star className="w-5 h-5 text-[#C8A45D] mr-2 flex-shrink-0" />
                        <span className="text-gray-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
            
            {/* 料金案内 */}
            <div id="prices" className="mt-24">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-serif text-[#C8A45D] mb-2">料金案内</h3>
                <div className="w-16 h-0.5 bg-[#C8A45D] mx-auto mb-6"></div>
              </div>
              
              <div className="bg-[#0A2744] border border-[#C8A45D]/30 rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#0f3a5e]">
                        <th className="px-6 py-4 text-left text-[#C8A45D]">クラス</th>
                        <th className="px-6 py-4 text-left text-[#C8A45D]">対象年齢</th>
                        <th className="px-6 py-4 text-left text-[#C8A45D]">月謝</th>
                        <th className="px-6 py-4 text-left text-[#C8A45D]">入会金</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#C8A45D]/20">
                      <tr className="hover:bg-[#0f3a5e]/50 transition-colors">
                        <td className="px-6 py-4 text-gray-300">キッズクラス</td>
                        <td className="px-6 py-4 text-gray-300">4〜6歳</td>
                        <td className="px-6 py-4 text-gray-300">8,000円</td>
                        <td className="px-6 py-4 text-gray-300">10,000円</td>
                      </tr>
                      <tr className="hover:bg-[#0f3a5e]/50 transition-colors">
                        <td className="px-6 py-4 text-gray-300">ジュニアクラス</td>
                        <td className="px-6 py-4 text-gray-300">7〜12歳</td>
                        <td className="px-6 py-4 text-gray-300">10,000円</td>
                        <td className="px-6 py-4 text-gray-300">10,000円</td>
                      </tr>
                      <tr className="hover:bg-[#0f3a5e]/50 transition-colors">
                        <td className="px-6 py-4 text-gray-300">ティーンクラス</td>
                        <td className="px-6 py-4 text-gray-300">13〜18歳</td>
                        <td className="px-6 py-4 text-gray-300">12,000円</td>
                        <td className="px-6 py-4 text-gray-300">15,000円</td>
                      </tr>
                      <tr className="hover:bg-[#0f3a5e]/50 transition-colors">
                        <td className="px-6 py-4 text-gray-300">大人初心者クラス</td>
                        <td className="px-6 py-4 text-gray-300">19歳以上</td>
                        <td className="px-6 py-4 text-gray-300">12,000円</td>
                        <td className="px-6 py-4 text-gray-300">15,000円</td>
                      </tr>
                      <tr className="hover:bg-[#0f3a5e]/50 transition-colors">
                        <td className="px-6 py-4 text-gray-300">大人中級クラス</td>
                        <td className="px-6 py-4 text-gray-300">経験者</td>
                        <td className="px-6 py-4 text-gray-300">15,000円</td>
                        <td className="px-6 py-4 text-gray-300">15,000円</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="p-6 bg-[#0f3a5e]/30">
                  <p className="text-sm text-gray-300">※ 上記料金は税込みです</p>
                  <p className="text-sm text-gray-300">※ 兄弟姉妹割引あり（2人目以降は月謝10%オフ）</p>
                  <p className="text-sm text-gray-300">※ 体験レッスンは無料です</p>
                </div>
              </div>
            </div>
            
            {/* レッスンスケジュール */}
            <div id="schedule" className="mt-24">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-serif text-[#C8A45D] mb-2">レッスンスケジュール</h3>
                <div className="w-16 h-0.5 bg-[#C8A45D] mx-auto mb-6"></div>
              </div>
              
              <div className="bg-[#0A2744] border border-[#C8A45D]/30 rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#0f3a5e]">
                        <th className="px-4 py-3 text-left text-[#C8A45D]">時間帯</th>
                        <th className="px-4 py-3 text-left text-[#C8A45D]">月曜日</th>
                        <th className="px-4 py-3 text-left text-[#C8A45D]">火曜日</th>
                        <th className="px-4 py-3 text-left text-[#C8A45D]">水曜日</th>
                        <th className="px-4 py-3 text-left text-[#C8A45D]">木曜日</th>
                        <th className="px-4 py-3 text-left text-[#C8A45D]">金曜日</th>
                        <th className="px-4 py-3 text-left text-[#C8A45D]">土曜日</th>
                        <th className="px-4 py-3 text-left text-[#C8A45D]">日曜日</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#C8A45D]/20">
                      <tr className="hover:bg-[#0f3a5e]/50 transition-colors">
                        <td className="px-4 py-3 text-gray-300">10:00-11:00</td>
                        <td className="px-4 py-3 text-gray-300">-</td>
                        <td className="px-4 py-3 text-gray-300">大人初心者</td>
                        <td className="px-4 py-3 text-gray-300">-</td>
                        <td className="px-4 py-3 text-gray-300">大人初心者</td>
                        <td className="px-4 py-3 text-gray-300">-</td>
                        <td className="px-4 py-3 text-gray-300">キッズ</td>
                        <td className="px-4 py-3 text-gray-300">-</td>
                      </tr>
                      <tr className="hover:bg-[#0f3a5e]/50 transition-colors">
                        <td className="px-4 py-3 text-gray-300">11:15-12:15</td>
                        <td className="px-4 py-3 text-gray-300">-</td>
                        <td className="px-4 py-3 text-gray-300">大人中級</td>
                        <td className="px-4 py-3 text-gray-300">-</td>
                        <td className="px-4 py-3 text-gray-300">大人中級</td>
                        <td className="px-4 py-3 text-gray-300">-</td>
                        <td className="px-4 py-3 text-gray-300">ジュニア</td>
                        <td className="px-4 py-3 text-gray-300">-</td>
                      </tr>
                      <tr className="hover:bg-[#0f3a5e]/50 transition-colors">
                        <td className="px-4 py-3 text-gray-300">15:00-16:00</td>
                        <td className="px-4 py-3 text-gray-300">キッズ</td>
                        <td className="px-4 py-3 text-gray-300">キッズ</td>
                        <td className="px-4 py-3 text-gray-300">キッズ</td>
                        <td className="px-4 py-3 text-gray-300">キッズ</td>
                        <td className="px-4 py-3 text-gray-300">キッズ</td>
                        <td className="px-4 py-3 text-gray-300">ティーン</td>
                        <td className="px-4 py-3 text-gray-300">-</td>
                      </tr>
                      <tr className="hover:bg-[#0f3a5e]/50 transition-colors">
                        <td className="px-4 py-3 text-gray-300">16:15-17:15</td>
                        <td className="px-4 py-3 text-gray-300">ジュニア</td>
                        <td className="px-4 py-3 text-gray-300">ジュニア</td>
                        <td className="px-4 py-3 text-gray-300">ジュニア</td>
                        <td className="px-4 py-3 text-gray-300">ジュニア</td>
                        <td className="px-4 py-3 text-gray-300">ジュニア</td>
                        <td className="px-4 py-3 text-gray-300">大人中級</td>
                        <td className="px-4 py-3 text-gray-300">-</td>
                      </tr>
                      <tr className="hover:bg-[#0f3a5e]/50 transition-colors">
                        <td className="px-4 py-3 text-gray-300">17:30-19:00</td>
                        <td className="px-4 py-3 text-gray-300">ティーン</td>
                        <td className="px-4 py-3 text-gray-300">ティーン</td>
                        <td className="px-4 py-3 text-gray-300">ティーン</td>
                        <td className="px-4 py-3 text-gray-300">ティーン</td>
                        <td className="px-4 py-3 text-gray-300">ティーン</td>
                        <td className="px-4 py-3 text-gray-300">-</td>
                        <td className="px-4 py-3 text-gray-300">-</td>
                      </tr>
                      <tr className="hover:bg-[#0f3a5e]/50 transition-colors">
                        <td className="px-4 py-3 text-gray-300">19:15-20:15</td>
                        <td className="px-4 py-3 text-gray-300">大人初心者</td>
                        <td className="px-4 py-3 text-gray-300">大人中級</td>
                        <td className="px-4 py-3 text-gray-300">大人初心者</td>
                        <td className="px-4 py-3 text-gray-300">大人中級</td>
                        <td className="px-4 py-3 text-gray-300">大人初心者</td>
                        <td className="px-4 py-3 text-gray-300">-</td>
                        <td className="px-4 py-3 text-gray-300">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="p-6 bg-[#0f3a5e]/30">
                  <p className="text-sm text-gray-300">※ スケジュールは変更される場合があります</p>
                  <p className="text-sm text-gray-300">※ 祝日はお休みとなります</p>
                  <p className="text-sm text-gray-300">※ レッスンは予約制です</p>
                </div>
              </div>
          </div>
        </div>
      </section>

        {/* News Section - お知らせ・最新情報 */}
        <section id="news" className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
              <h2 className="text-5xl font-serif text-[#C8A45D] mb-2 tracking-wider uppercase">News</h2>
              <div className="w-24 h-1 bg-[#C8A45D] mx-auto mb-3"></div>
              <p className="text-sm text-gray-300 font-light tracking-[0.3em] uppercase">お知らせ・最新情報</p>
            </div>
            
            <div className="space-y-8">
              <div className="bg-[#0A2744] border border-[#C8A45D]/30 rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-[#C8A45D] text-[#0A2744] px-3 py-1 rounded text-sm font-bold">
                      新着
                    </div>
                    <div className="ml-4 text-gray-300">2023.12.15</div>
                  </div>
                  <h3 className="text-xl font-medium mb-3 text-[#C8A45D]">冬の発表会のお知らせ</h3>
                  <p className="text-gray-300 mb-4">
                    12月23日（土）に冬の発表会を開催します。会場は中央スタジオです。チケットは各スタジオで販売中です。
                  </p>
                  <a href="#" className="text-[#C8A45D] hover:underline inline-flex items-center">
                    詳細を見る
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
              
              <div className="bg-[#0A2744] border border-[#C8A45D]/30 rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-[#0f3a5e] text-[#C8A45D] px-3 py-1 rounded text-sm font-bold">
                      重要
                    </div>
                    <div className="ml-4 text-gray-300">2023.11.20</div>
                  </div>
                  <h3 className="text-xl font-medium mb-3 text-[#C8A45D]">年末年始のスケジュールについて</h3>
                  <p className="text-gray-300 mb-4">
                    2023年12月28日から2024年1月5日まで年末年始休業とさせていただきます。通常レッスンは1月6日（土）から再開します。
                  </p>
                  <a href="#" className="text-[#C8A45D] hover:underline inline-flex items-center">
                    詳細を見る
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
              
              <div className="bg-[#0A2744] border border-[#C8A45D]/30 rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-[#0f3a5e] text-[#C8A45D] px-3 py-1 rounded text-sm font-bold">
                      イベント
                    </div>
                    <div className="ml-4 text-gray-300">2023.10.05</div>
                  </div>
                  <h3 className="text-xl font-medium mb-3 text-[#C8A45D]">特別ワークショップのお知らせ</h3>
                  <p className="text-gray-300 mb-4">
                    11月12日（日）に元ロイヤルバレエ団のダンサーによる特別ワークショップを開催します。参加希望の方は各スタジオで申し込みを受け付けています。
                  </p>
                  <a href="#" className="text-[#C8A45D] hover:underline inline-flex items-center">
                    詳細を見る
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-10">
              <a href="#" className="inline-block bg-[#0A2744] border border-[#C8A45D]/30 text-[#C8A45D] px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:bg-[#C8A45D]/10">
                過去のお知らせを見る
              </a>
            </div>
          </div>
        </section>

        {/* Instructors Section - 背景を半透明に */}
        <section id="instructors" className="py-20 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-serif text-[#C8A45D] mb-2 tracking-wider uppercase">Instructor</h2>
              <div className="w-24 h-1 bg-[#C8A45D] mx-auto mb-3"></div>
              <p className="text-sm text-gray-300 font-light tracking-[0.3em] uppercase">講師紹介</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {instructorData.map((instructor) => (
              <Link 
                to={`/instructor/${instructor.id}`} 
                key={instructor.id} 
                className="block group"
              >
                  <div className="bg-[#0A2744] border border-[#C8A45D]/30 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <div className="relative h-full">
                  <img 
                    src={instructor.image} 
                    alt={instructor.name}
                          className="w-full h-64 md:h-full object-cover transition-all duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      </div>
                    </div>
                    <div className="md:w-2/3 p-6 flex flex-col justify-center">
                      <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-serif mb-2 text-[#C8A45D] group-hover:text-[#d9b978] transition-colors duration-300">{instructor.name}</h3>
                            <p className="text-[#C8A45D] mb-4">{instructor.role}</p>
                        </div>
                        {instructor.instagram && (
                          <a 
                            href={instructor.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                              className="bg-[#C8A45D] text-[#0A2744] p-2 rounded-lg transition-transform duration-300 hover:scale-110 flex-shrink-0"
                            aria-label="Instagram"
                          >
                            <Instagram className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                        <p className="text-gray-300 line-clamp-3">{instructor.bio}</p>
                        <div className="mt-4 text-[#C8A45D] font-medium group-hover:underline">プロフィールを見る</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

        {/* Studios - 背景を半透明に */}
        <section id="studios" className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
              <h2 className="text-5xl font-serif text-[#C8A45D] mb-2 tracking-wider uppercase">Studios</h2>
              <div className="w-24 h-1 bg-[#C8A45D] mx-auto mb-3"></div>
              <p className="text-sm text-gray-300 font-light tracking-[0.3em] uppercase">スタジオ案内</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studios.map((studio, index) => (
                <div key={index} className="bg-[#0f3a5e] border border-[#C8A45D]/30 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                <img 
                  src={studio.image}
                  alt={studio.name}
                    className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-medium">{studio.name}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start mb-2">
                      <MapPin className="w-5 h-5 text-[#C8A45D] mr-2 flex-shrink-0" />
                      <span className="text-gray-300">{studio.address}</span>
                  </div>
                  <div className="flex items-start">
                      <Phone className="w-5 h-5 text-[#C8A45D] mr-2 flex-shrink-0" />
                      <span className="text-gray-300">{studio.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

        {/* Contact - 背景を半透明に */}
        <section id="contact" className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
              <h2 className="text-5xl font-serif text-[#C8A45D] mb-2 tracking-wider uppercase">Contact</h2>
              <div className="w-24 h-1 bg-[#C8A45D] mx-auto mb-3"></div>
              <p className="text-sm text-gray-300 font-light tracking-[0.3em] uppercase">お問い合わせ</p>
          </div>
          
            <div className="max-w-3xl mx-auto bg-[#0A2744] border border-[#C8A45D]/30 rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
                <div className="md:w-1/2 bg-[#C8A45D] p-8 text-[#0A2744]">
                <h3 className="text-2xl font-medium mb-4">無料体験レッスンのお申し込み</h3>
                <p className="mb-6">お気軽にお問い合わせください。専門スタッフがご案内いたします。</p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">お電話</p>
                      <p>03-1234-5678</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CircleDot className="w-5 h-5 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">営業時間</p>
                      <p>平日 10:00〜20:00<br />土日 10:00〜18:00</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = {
                      name: (document.getElementById('name') as HTMLInputElement).value,
                      email: (document.getElementById('email') as HTMLInputElement).value,
                      date: (document.getElementById('lesson-date') as HTMLInputElement).value,
                      time: (document.getElementById('lesson-time') as HTMLSelectElement).value,
                      message: (document.getElementById('message') as HTMLTextAreaElement).value
                    };
                    
                    // Google Apps Scriptのウェブアプリのデプロイ後のURLを設定してください
                    const scriptURL = 'ここにデプロイ後のURLを貼り付けてください';
                    
                    // データを送信
                    fetch(scriptURL, {
                      method: 'POST',
                      mode: 'no-cors',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(formData)
                    })
                    .then(() => {
                      alert('お問い合わせを送信しました。確認次第ご連絡いたします。');
                      (e.target as HTMLFormElement).reset();
                    })
                    .catch(error => {
                      console.error('送信エラー:', error);
                      alert('送信に失敗しました。後ほど再度お試しください。');
                    });
                  }}>
                  <div className="mb-4">
                      <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="name">
                      お名前
                    </label>
                    <input 
                        className="w-full px-3 py-2 bg-[#0f3a5e] border border-[#C8A45D]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A45D] text-white"
                      id="name" 
                      type="text" 
                      placeholder="山田 花子"
                        required
                    />
                  </div>
                  <div className="mb-4">
                      <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="email">
                      メールアドレス
                    </label>
                    <input 
                        className="w-full px-3 py-2 bg-[#0f3a5e] border border-[#C8A45D]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A45D] text-white"
                      id="email" 
                      type="email" 
                      placeholder="example@email.com"
                        required
                    />
                  </div>
                  <div className="mb-4">
                      <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="lesson-date">
                      体験希望日
                    </label>
                    <input 
                        className="w-full px-3 py-2 bg-[#0f3a5e] border border-[#C8A45D]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A45D] text-white"
                      id="lesson-date" 
                      type="date" 
                      min={new Date().toISOString().split('T')[0]}
                        required
                    />
                  </div>
                  <div className="mb-4">
                      <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="lesson-time">
                      体験希望時間
                    </label>
                    <select 
                        className="w-full px-3 py-2 bg-[#0f3a5e] border border-[#C8A45D]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A45D] text-white"
                      id="lesson-time" 
                        required
                    >
                      <option value="">時間帯を選択してください</option>
                      <option value="10:00">10:00〜11:00</option>
                      <option value="11:00">11:00〜12:00</option>
                      <option value="13:00">13:00〜14:00</option>
                      <option value="14:00">14:00〜15:00</option>
                      <option value="15:00">15:00〜16:00</option>
                      <option value="16:00">16:00〜17:00</option>
                      <option value="17:00">17:00〜18:00</option>
                    </select>
                  </div>
                  <div className="mb-4">
                      <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="message">
                      お問い合わせ内容
                    </label>
                    <textarea 
                        className="w-full px-3 py-2 bg-[#0f3a5e] border border-[#C8A45D]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A45D] text-white"
                      id="message" 
                      rows={4}
                      placeholder="ご質問やご要望をお書きください"
                        required
                    ></textarea>
                  </div>
                  <button 
                      className="w-full bg-[#C8A45D] hover:bg-[#d9b978] text-[#0A2744] py-2 px-4 rounded-md transition-all duration-300 shadow-md font-medium"
                    type="submit"
                  >
                    送信する
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* FAQ - よくある質問 */}
        <section id="faq" className="py-20 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-serif text-[#C8A45D] mb-2 tracking-wider uppercase">FAQ</h2>
              <div className="w-24 h-1 bg-[#C8A45D] mx-auto mb-3"></div>
              <p className="text-sm text-gray-300 font-light tracking-[0.3em] uppercase">よくある質問</p>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-[#0A2744] border border-[#C8A45D]/30 rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-medium mb-3 text-[#C8A45D]">初心者でも大丈夫ですか？</h3>
                  <p className="text-gray-300">
                    はい、もちろんです。当スタジオでは、バレエ未経験の方のためのクラスもご用意しています。基礎から丁寧に指導しますので、安心してご参加ください。
                  </p>
                </div>
              </div>
              
              <div className="bg-[#0A2744] border border-[#C8A45D]/30 rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-medium mb-3 text-[#C8A45D]">何を持っていけばいいですか？</h3>
                  <p className="text-gray-300">
                    初回は動きやすい服装（Tシャツとレギンスなど）と靴下をお持ちください。継続される場合は、レオタード、タイツ、バレエシューズをご用意いただくことをおすすめします。詳しくはスタッフにお尋ねください。
                  </p>
                </div>
              </div>
              
              <div className="bg-[#0A2744] border border-[#C8A45D]/30 rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-medium mb-3 text-[#C8A45D]">何歳から始められますか？</h3>
                  <p className="text-gray-300">
                    当スタジオでは4歳からのキッズクラスをご用意しています。また、大人の方も初心者から経験者まで幅広く受け入れております。年齢に関係なく、バレエを楽しむことができます。
                  </p>
                </div>
              </div>
              
              <div className="bg-[#0A2744] border border-[#C8A45D]/30 rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-medium mb-3 text-[#C8A45D]">発表会はありますか？</h3>
                  <p className="text-gray-300">
                    はい、年に2回（夏と冬）発表会を開催しています。参加は任意ですが、目標を持って練習する良い機会となりますので、ぜひご参加ください。
                  </p>
                </div>
              </div>
              
              <div className="bg-[#0A2744] border border-[#C8A45D]/30 rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-medium mb-3 text-[#C8A45D]">レッスンの振替はできますか？</h3>
                  <p className="text-gray-300">
                    やむを得ない事情でレッスンをお休みされる場合、月内であれば同じレベルのクラスへの振替が可能です。振替を希望される場合は、事前にご連絡ください。
                  </p>
                </div>
              </div>
              
              <div className="bg-[#0A2744] border border-[#C8A45D]/30 rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-medium mb-3 text-[#C8A45D]">見学はできますか？</h3>
                  <p className="text-gray-300">
                    はい、レッスンの見学も可能です。事前にご予約いただければ、実際のレッスンの様子をご覧いただけます。お気軽にお問い合わせください。
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <p className="text-gray-300 mb-6">その他のご質問があれば、お気軽にお問い合わせください</p>
              <a 
                href="#contact" 
                className="inline-block bg-[#C8A45D] hover:bg-[#d9b978] text-[#0A2744] px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 shadow-md"
              >
                お問い合わせはこちら
              </a>
            </div>
          </div>
        </section>

        {/* Footer - 背景を半透明に */}
        <footer className="bg-transparent text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
                <div className="mb-4">
                  <div className="text-2xl font-bold text-[#C8A45D] tracking-wider" style={{ fontFamily: 'serif' }}>
                    MORIWAKI BALLET STUDIO
                  </div>
              </div>
              <p className="text-gray-400 max-w-md">
                子供から大人まで、一人ひとりの可能性を広げるバレエスクール。
                初心者からプロを目指す方まで、丁寧に指導いたします。
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
                  <h3 className="text-lg font-medium mb-4 text-[#C8A45D]">メニュー</h3>
                <ul className="space-y-2">
                    <li><a href="#features" className="text-gray-400 hover:text-[#C8A45D] transition-colors duration-300">特徴</a></li>
                    <li><a href="#classes" className="text-gray-400 hover:text-[#C8A45D] transition-colors duration-300">クラス</a></li>
                    <li><a href="#instructors" className="text-gray-400 hover:text-[#C8A45D] transition-colors duration-300">講師</a></li>
                    <li><a href="#studios" className="text-gray-400 hover:text-[#C8A45D] transition-colors duration-300">スタジオ</a></li>
                    <li><Link to="/news" className="text-gray-400 hover:text-[#C8A45D] transition-colors duration-300">お知らせ</Link></li>
                    <li><a href="#faq" className="text-gray-400 hover:text-[#C8A45D] transition-colors duration-300">よくある質問</a></li>
                    <li><a href="#contact" className="text-gray-400 hover:text-[#C8A45D] transition-colors duration-300">お問い合わせ</a></li>
                </ul>
            </div>
            <div>
                  <h3 className="text-lg font-medium mb-4 text-[#C8A45D]">お問い合わせ</h3>
                <ul className="space-y-2">
                  <li className="text-gray-400">03-1234-5678</li>
                    <li className="text-gray-400">info@moriwakiballet.jp</li>
                  <li className="text-gray-400">東京都中央区</li>
                </ul>
              </div>
              <div className="col-span-2 md:col-span-1">
                  <h3 className="text-lg font-medium mb-4 text-[#C8A45D]">営業時間</h3>
                <ul className="space-y-2">
                  <li className="text-gray-400">平日: 10:00〜20:00</li>
                  <li className="text-gray-400">土日: 10:00〜18:00</li>
                  <li className="text-gray-400">祝日: 休校</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
              <p>© 2023 MORIWAKI BALLET STUDIO. All rights reserved.</p>
            </div>
          </div>
        </footer>
        </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/instructor/:id" element={<InstructorProfile />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/news" element={<AdminNewsPage />} />
        <Route path="/admin/schedule" element={<AdminSchedulePage />} />
        <Route path="/admin/media" element={<AdminMediaPage />} />
        <Route path="/" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default App;