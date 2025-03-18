import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, ChevronRight } from 'lucide-react';

// ニュースデータ
const defaultNewsItems = [
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
  }
];

// ローカルストレージのキー
const NEWS_STORAGE_KEY = 'moriwaki_news_data';

const NewsPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [selectedNews, setSelectedNews] = useState<(typeof defaultNewsItems)[0] | null>(null);
  const [newsItems, setNewsItems] = useState<typeof defaultNewsItems>([]);
  
  // ニュースデータの取得
  useEffect(() => {
    const storedNews = localStorage.getItem(NEWS_STORAGE_KEY);
    if (storedNews) {
      const parsedNews = JSON.parse(storedNews);
      // 公開されている記事のみを表示
      const publishedNews = parsedNews.filter((news: any) => news.isPublished);
      setNewsItems(publishedNews);
    } else {
      setNewsItems(defaultNewsItems);
    }
  }, []);
  
  // 詳細表示用のニュース記事を探す
  useEffect(() => {
    if (id && newsItems.length > 0) {
      const newsId = parseInt(id, 10);
      const news = newsItems.find(item => item.id === newsId);
      if (news) {
        setSelectedNews(news);
      } else {
        // 存在しないIDの場合はニュース一覧にリダイレクト
        navigate('/news');
      }
    } else {
      setSelectedNews(null);
    }
  }, [id, navigate, newsItems]);

  // SEOのためにtitleとdescriptionを設定
  useEffect(() => {
    if (selectedNews) {
      document.title = `${selectedNews.title} | MORIWAKI BALLET STUDIO`;
      // メタディスクリプションの設定（実際のプロジェクトではHelmetsなどを使うべき）
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', selectedNews.content.substring(0, 160) + '...');
      }
    } else {
      document.title = 'ニュース・お知らせ | MORIWAKI BALLET STUDIO';
      // メタディスクリプションの設定（実際のプロジェクトではHelmetsなどを使うべき）
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 'MORIWAKI BALLET STUDIOからの最新ニュースやお知らせをご覧いただけます。レッスン情報、イベント情報、休講情報など重要なお知らせを掲載しています。');
      }
    }
  }, [selectedNews]);

  // ニュース詳細表示用のコンポーネント
  const NewsDetail = () => {
    if (!selectedNews) return null;
    
    return (
      <>
        {/* パンくずリスト */}
        <nav className="flex mb-8 text-sm text-gray-400">
          <Link to="/" className="flex items-center hover:text-[#C8A45D] transition-colors">
            <Home size={14} className="mr-1" />
            <span>ホーム</span>
          </Link>
          <ChevronRight size={14} className="mx-2" />
          <Link to="/news" className="hover:text-[#C8A45D] transition-colors">
            <span>ニュース</span>
          </Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-[#C8A45D]">{selectedNews.title}</span>
        </nav>
        
        <div className="bg-[#0A2744]/70 border border-[#C8A45D]/30 rounded-xl overflow-hidden mb-8">
          <div className="aspect-w-16 aspect-h-9 max-h-96">
            <img 
              src={selectedNews.image} 
              alt={selectedNews.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/600x400/0A2744/C8A45D?text=MORIWAKI+BALLET';
              }}
            />
          </div>
          <div className="p-8">
            <div className="flex items-center mb-4">
              <span className={`${selectedNews.typeClass} text-xs font-bold px-3 py-1 rounded-full text-white mr-3`}>
                {selectedNews.type}
              </span>
              <span className="text-gray-400 text-sm">{selectedNews.date}</span>
            </div>
            <h1 className="text-3xl font-bold text-[#C8A45D] mb-6">{selectedNews.title}</h1>
            <div className="text-gray-300 mb-8 leading-relaxed space-y-4">
              {selectedNews.content.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
            
            {/* 追加情報（ダミー） */}
            <div className="bg-[#0A2744] border border-[#C8A45D]/20 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-medium mb-4 text-[#C8A45D]">詳細情報</h3>
              <p className="text-gray-300 mb-4">
                このニュースに関する詳細情報やお申し込み方法などについては、各スタジオの受付にてお問い合わせください。
              </p>
              <p className="text-gray-300">
                お電話でのお問い合わせ: 03-1234-5678 (平日10:00〜18:00)
              </p>
            </div>
            
            <div className="flex justify-between items-center">
              <Link 
                to="/news" 
                className="inline-flex items-center bg-[#0A2744] border border-[#C8A45D]/30 text-[#C8A45D] px-4 py-2 rounded-md text-sm hover:bg-[#C8A45D]/10 transition-all duration-300"
              >
                <ArrowLeft size={14} className="mr-1" />
                ニュース一覧に戻る
              </Link>
              <div className="flex space-x-2">
                <button className="bg-[#0A2744] border border-[#C8A45D]/30 text-[#C8A45D] p-2 rounded-full hover:bg-[#C8A45D]/10 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
                <button className="bg-[#0A2744] border border-[#C8A45D]/30 text-[#C8A45D] p-2 rounded-full hover:bg-[#C8A45D]/10 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* 関連ニュース */}
        <div className="mt-12">
          <h2 className="text-2xl font-serif text-[#C8A45D] mb-6">関連ニュース</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsItems
              .filter(item => item.id !== selectedNews.id)
              .slice(0, 3)
              .map(news => (
                <div 
                  key={news.id} 
                  className="bg-[#0A2744]/70 border border-[#C8A45D]/30 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="h-48">
                    <img 
                      src={news.image} 
                      alt={news.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/600x400/0A2744/C8A45D?text=MORIWAKI+BALLET';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <span className={`${news.typeClass} text-xs font-bold px-2 py-0.5 rounded-full text-white mr-2`}>
                        {news.type}
                      </span>
                      <span className="text-gray-400 text-xs">{news.date}</span>
                    </div>
                    <h3 className="text-base font-medium text-[#C8A45D] mb-2 line-clamp-2">{news.title}</h3>
                    <Link 
                      to={`/news/${news.id}`} 
                      className="text-sm text-[#C8A45D] hover:underline flex items-center"
                    >
                      <span>詳細を見る</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </>
    );
  };

  // ニュース一覧表示用のコンポーネント
  const NewsList = () => (
    <>
      {/* パンくずリスト */}
      <nav className="flex mb-8 text-sm text-gray-400">
        <Link to="/" className="flex items-center hover:text-[#C8A45D] transition-colors">
          <Home size={14} className="mr-1" />
          <span>ホーム</span>
        </Link>
        <ChevronRight size={14} className="mx-2" />
        <span className="text-[#C8A45D]">ニュース</span>
      </nav>
      
      <h1 className="text-5xl font-serif text-[#C8A45D] mb-2 tracking-wider text-center">News</h1>
      <div className="w-24 h-1 bg-[#C8A45D] mx-auto mb-3"></div>
      <p className="text-sm text-center text-gray-300 font-light tracking-[0.3em] uppercase mb-12">お知らせ・最新情報</p>
      
      {/* ニュースの説明文を追加 */}
      <div className="bg-[#0A2744]/70 border border-[#C8A45D]/30 rounded-xl p-6 mb-12">
        <p className="text-gray-300 text-center leading-relaxed">
          MORIWAKI BALLET STUDIOからの最新情報をお届けします。<br />
          レッスン情報、イベント情報、休講情報など、重要なお知らせを随時更新していきます。<br />
          定期的にチェックして、最新情報をお見逃しなく。
        </p>
      </div>
      
      {/* ニュース一覧 */}
      <div className="grid grid-cols-1 gap-8">
        {newsItems.map((news) => (
          <div 
            key={news.id} 
            className="bg-[#0A2744]/70 border border-[#C8A45D]/30 rounded-xl overflow-hidden shadow-lg transform transition duration-500 hover:shadow-2xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="h-64 md:h-auto">
                <img 
                  src={news.image} 
                  alt={news.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/600x400/0A2744/C8A45D?text=MORIWAKI+BALLET';
                  }}
                />
              </div>
              <div className="p-6 md:col-span-2">
                <div className="flex items-center mb-4">
                  <span className={`${news.typeClass} text-xs font-bold px-3 py-1 rounded-full text-white mr-3`}>
                    {news.type}
                  </span>
                  <span className="text-gray-400 text-sm">{news.date}</span>
                </div>
                <h2 className="text-xl font-bold text-[#C8A45D] mb-4">{news.title}</h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {news.content}
                </p>
                <Link 
                  to={`/news/${news.id}`} 
                  className="inline-block bg-[#0A2744] border border-[#C8A45D]/30 text-[#C8A45D] px-4 py-2 rounded-md text-sm hover:bg-[#C8A45D]/10 transition-all duration-300 flex items-center"
                >
                  <span>詳細を見る</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* ページネーション（ダミー） */}
      <div className="flex justify-center mt-12">
        <div className="inline-flex items-center">
          <button className="bg-[#0A2744]/70 border border-[#C8A45D]/30 text-gray-300 px-4 py-2 rounded-l-md">
            前へ
          </button>
          <button className="bg-[#C8A45D] text-[#0A2744] px-4 py-2">
            1
          </button>
          <button className="bg-[#0A2744]/70 border border-[#C8A45D]/30 text-gray-300 px-4 py-2">
            2
          </button>
          <button className="bg-[#0A2744]/70 border border-[#C8A45D]/30 text-gray-300 px-4 py-2 rounded-r-md">
            次へ
          </button>
        </div>
      </div>
      
      {/* 関連ページリンク */}
      <div className="bg-[#0A2744]/70 border border-[#C8A45D]/30 rounded-xl p-6 mt-16 mb-8">
        <h3 className="text-center text-[#C8A45D] mb-4 font-medium">関連ページ</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/schedule" 
            className="bg-[#0A2744] border border-[#C8A45D]/30 text-[#C8A45D] px-4 py-2 rounded-md text-sm hover:bg-[#C8A45D]/10 transition-all duration-300"
          >
            レッスンスケジュール
          </Link>
          <a 
            href="/#contact" 
            className="bg-[#0A2744] border border-[#C8A45D]/30 text-[#C8A45D] px-4 py-2 rounded-md text-sm hover:bg-[#C8A45D]/10 transition-all duration-300"
          >
            お問い合わせ
          </a>
          <a 
            href="/#faq" 
            className="bg-[#0A2744] border border-[#C8A45D]/30 text-[#C8A45D] px-4 py-2 rounded-md text-sm hover:bg-[#C8A45D]/10 transition-all duration-300"
          >
            よくある質問
          </a>
        </div>
      </div>
    </>
  );

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
          {selectedNews ? <NewsDetail /> : <NewsList />}
          
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

export default NewsPage; 