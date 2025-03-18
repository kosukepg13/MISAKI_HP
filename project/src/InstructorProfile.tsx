import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Star, ArrowLeft, Instagram } from 'lucide-react';

// 講師プロフィールデータ
const instructorData = [
  {
    id: "misaki-moriwaki",
    name: "森脇みさき",
    role: "バレエ講師 ",
    image: "/images/classic-ballerina-dancing-blue_155003-1514.avif",
    instagram: "https://www.instagram.com/misaki_ballet_official/",
    bio: "10歳からバレエを始め、国内外のコンクールで数々の賞を受賞。東京バレエ団で10年間プリンシパルダンサーとして活躍後、教育者として後進の指導に力を注いでいます。繊細かつ大胆な表現力と、生徒一人ひとりの個性を引き出す指導に定評があります。",
    achievements: [
      "全日本バレエコンクール シニア部門 金賞",
      "モスクワ国際バレエコンクール ファイナリスト",
      "プリマバレリーナ賞 受賞",
      "文化庁芸術祭新人賞 受賞"
    ],
    education: [
      "国立バレエ学校 卒業",
      "ロシア国立バレエアカデミー 留学",
      "英国ロイヤルバレエスクール サマーコース修了"
    ],
    performances: [
      "「白鳥の湖」オデット/オディール役",
      "「ジゼル」タイトルロール",
      "「ドン・キホーテ」キトリ役",
      "「眠れる森の美女」オーロラ姫役"
    ]
  }
];

// 講師プロフィールページコンポーネント
const InstructorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [instructor, setInstructor] = useState<typeof instructorData[0] | null>(null);

  useEffect(() => {
    // 講師データから該当する講師を検索
    const foundInstructor = instructorData.find(inst => inst.id === id);
    setInstructor(foundInstructor || null);
  }, [id]);

  if (!instructor) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-600">講師情報が見つかりませんでした。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-pink-500 hover:text-pink-600 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>トップページに戻る</span>
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <div className="relative h-full">
                <img 
                  src={instructor.image} 
                  alt={instructor.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
            </div>
            <div className="md:w-2/3 p-8">
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-serif mb-2">{instructor.name}</h1>
                    <p className="text-pink-500">{instructor.role}</p>
                  </div>
                  {instructor.instagram && (
                    <a 
                      href={instructor.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-lg transition-transform duration-300 hover:scale-110"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-6 h-6" />
                    </a>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-medium mb-3 text-gray-800">プロフィール</h2>
                <p className="text-gray-600 leading-relaxed">{instructor.bio}</p>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-medium mb-3 text-gray-800">経歴・受賞歴</h2>
                <ul className="space-y-2">
                  {instructor.achievements.map((achievement: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <Star className="w-4 h-4 text-pink-400 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-medium mb-3 text-gray-800">学歴</h2>
                  <ul className="space-y-2">
                    {instructor.education.map((edu: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2 mr-2 flex-shrink-0"></div>
                        <span className="text-gray-600">{edu}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-xl font-medium mb-3 text-gray-800">主な出演作品</h2>
                  <ul className="space-y-2">
                    {instructor.performances.map((performance: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2 mr-2 flex-shrink-0"></div>
                        <span className="text-gray-600">{performance}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorProfile;
export { instructorData }; 