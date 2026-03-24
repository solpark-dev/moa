import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { NeoCard } from "@/components/common/neo";
import { useThemeStore } from "@/store/themeStore";

// 테마별 Search 섹션 스타일
const searchThemeStyles = {
  pop: {
    linkText: "text-pink-500",
    tagHover: "hover:bg-pink-100 hover:border-pink-500",
  },
  christmas: {
    linkText: "text-[#c41e3a]",
    tagHover: "hover:bg-red-50 hover:border-[#c41e3a]",
  },
};

// 한글-영어 매핑 (대소문자 구분 없이 검색)
const koreanToEnglish = {
  "넷플릭스": ["netflix", "넷플"],
  "넷플": ["netflix", "넷플릭스"],
  "디즈니": ["disney", "디즈니플러스", "디즈니+"],
  "디즈니플러스": ["disney", "디즈니", "디즈니+"],
  "유튜브": ["youtube", "유튭", "유튜브프리미엄"],
  "유튭": ["youtube", "유튜브"],
  "스포티파이": ["spotify", "스포티"],
  "스포티": ["spotify", "스포티파이"],
  "웨이브": ["wavve"],
  "왓챠": ["watcha"],
  "티빙": ["tving"],
  "쿠팡플레이": ["coupang", "쿠팡"],
  "쿠팡": ["coupang", "쿠팡플레이"],
  "애플뮤직": ["apple", "애플", "applemusic"],
  "애플티비": ["apple", "애플", "appletv"],
  "애플": ["apple", "애플뮤직", "애플티비"],
  "아마존": ["amazon", "프라임"],
  "프라임비디오": ["amazon", "prime", "아마존"],
  "멜론": ["melon"],
  "지니뮤직": ["genie", "지니"],
  "벅스": ["bugs"],
  "플로": ["flo"],
  "밀리의서재": ["millie", "밀리"],
  "리디북스": ["ridi", "리디"],
  "윌라": ["welaaa"],
  "네이버": ["naver", "네이버플러스"],
  "카카오": ["kakao"],
};

// 서비스별 색상 매핑
const serviceColors = {
  "넷플릭스": "bg-red-500",
  "netflix": "bg-red-500",
  "디즈니": "bg-blue-500",
  "disney": "bg-blue-500",
  "유튜브": "bg-red-600",
  "youtube": "bg-red-600",
  "스포티파이": "bg-lime-400",
  "spotify": "bg-lime-400",
  "웨이브": "bg-cyan-400",
  "wavve": "bg-cyan-400",
  "왓챠": "bg-yellow-400",
  "watcha": "bg-yellow-400",
  "티빙": "bg-pink-500",
  "tving": "bg-pink-500",
  "쿠팡": "bg-rose-500",
  "coupang": "bg-rose-500",
  "애플": "bg-gray-800",
  "apple": "bg-gray-800",
  "아마존": "bg-orange-500",
  "amazon": "bg-orange-500",
  "멜론": "bg-green-500",
  "melon": "bg-green-500",
  "지니": "bg-blue-400",
  "genie": "bg-blue-400",
  "벅스": "bg-orange-400",
  "bugs": "bg-orange-400",
  "플로": "bg-purple-500",
  "flo": "bg-purple-500",
  "밀리": "bg-yellow-500",
  "millie": "bg-yellow-500",
  "리디": "bg-blue-600",
  "ridi": "bg-blue-600",
  "네이버": "bg-green-600",
  "naver": "bg-green-600",
  "카카오": "bg-yellow-400",
  "kakao": "bg-yellow-400",
};

const getServiceColor = (name) => {
  const lowerName = (name || "").toLowerCase();
  for (const [key, color] of Object.entries(serviceColors)) {
    if (lowerName.includes(key.toLowerCase())) {
      return color;
    }
  }
  return "bg-gray-400";
};

export default function MainSearchSection({ products = [] }) {
  const { theme } = useThemeStore();
  const themeStyle = searchThemeStyles[theme] || searchThemeStyles.pop;
  const isDark = theme === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // 검색어에 대한 관련 키워드 생성 (한글-영어 치환)
  const getSearchKeywords = (query) => {
    const lowerQuery = query.toLowerCase();
    const keywords = [lowerQuery];

    // 한글-영어 매핑에서 관련 키워드 추가
    for (const [korean, alternatives] of Object.entries(koreanToEnglish)) {
      if (lowerQuery.includes(korean.toLowerCase())) {
        keywords.push(...alternatives.map(alt => alt.toLowerCase()));
      }
      // 영어로 검색했을 때 한글도 매칭
      for (const alt of alternatives) {
        if (lowerQuery.includes(alt.toLowerCase())) {
          keywords.push(korean.toLowerCase());
          keywords.push(...alternatives.map(a => a.toLowerCase()));
        }
      }
    }

    return [...new Set(keywords)]; // 중복 제거
  };

  // 검색 결과 필터링
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const keywords = getSearchKeywords(searchQuery.trim());

    return products.filter((product) => {
      const name = (product?.productName || product?.name || "").toLowerCase();
      const category = (product?.categoryName || product?.category || "").toLowerCase();

      // 키워드 중 하나라도 매칭되면 true
      return keywords.some(keyword =>
        name.includes(keyword) || category.includes(keyword)
      );
    }).slice(0, 6); // 최대 6개만 표시
  }, [searchQuery, products]);

  const showResults = isFocused && searchQuery.trim().length > 0;

  return (
    <section className={`py-12 px-6 border-b ${isDark ? 'bg-[#0B1120] border-gray-600' : 'bg-transparent border-gray-200'}`}>
      <div className="max-w-2xl mx-auto">
        {/* 검색 타이틀 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className={`text-2xl md:text-3xl font-black mb-2 ${isDark ? 'text-white' : ''}`}>
            🔍 어떤 구독 서비스를 찾으세요?
          </h2>
          <p className={`font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>원하는 OTT를 검색해보세요</p>
        </motion.div>

        {/* 검색 입력창 */}
        <div className="relative">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="넷플릭스, 디즈니+, 유튜브..."
              className={`w-full px-6 py-4 pl-14 text-lg font-bold border rounded-2xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] focus:shadow-[6px_6px_16px_rgba(0,0,0,0.12)] transition-all outline-none ${isDark ? 'bg-[#1E293B] border-gray-600 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 placeholder:text-gray-400'}`}
            />
            <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={`absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-black'}`}
              >
                <X />
              </button>
            )}
          </div>

          {/* 검색 결과 드롭다운 */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`absolute top-full left-0 right-0 mt-2 border rounded-2xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] overflow-hidden z-50 ${isDark ? 'bg-[#1E293B] border-gray-600' : 'bg-white border-gray-200'}`}
              >
                {filteredProducts.length > 0 ? (
                  <div className="p-2">
                    {filteredProducts.map((product, index) => {
                      const productName = product?.productName || product?.name || "서비스";
                      const productId = product?.productId || product?.id;
                      const color = getServiceColor(productName);

                      return (
                        <Link
                          key={productId || index}
                          to={`/party?productId=${productId}`}
                          className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
                        >
                          <div className={`w-10 h-10 ${color} rounded-xl border ${isDark ? 'border-gray-600' : 'border-gray-200'} flex items-center justify-center`}>
                            <span className="text-white font-black text-sm">
                              {productName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className={`font-black ${isDark ? 'text-white' : 'text-black'}`}>{productName}</p>
                            <p className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {product?.category || "구독 서비스"}
                            </p>
                          </div>
                          <span className={`${themeStyle.linkText} font-black text-sm`}>
                            파티 찾기 →
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className={`font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      "{searchQuery}" 검색 결과가 없어요 😢
                    </p>
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      다른 서비스명으로 검색해보세요
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 인기 검색어 태그 */}
        <div className="flex flex-wrap gap-2 justify-center mt-6">
          {["넷플릭스", "디즈니+", "유튜브", "스포티파이", "웨이브"].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className={`px-4 py-2 border rounded-full font-bold text-sm transition-all ${isDark ? 'bg-[#1E293B] border-gray-600 text-white hover:bg-[#2D3B4F] hover:border-[#635bff]' : `bg-slate-100 border-gray-200 ${themeStyle.tagHover}`}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
