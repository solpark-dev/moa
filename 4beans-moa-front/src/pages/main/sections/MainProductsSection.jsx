import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import { useMainStore } from "@/store/main/mainStore";
import { useThemeStore } from "@/store/themeStore";
import {
  formatCurrency,
  getProductId,
  getProductName,
  getProductTier,
  getProductPrice,
  getProductMaxProfiles,
  getProductDescription,
  getProductStatus,
  getProductIconUrl as getProductImagePath,
} from "@/utils/format";
import { getProductIconUrl, getProductLogoUrl } from "@/utils/imageUtils";

// 테마별 Products 섹션 스타일
const productsThemeStyles = {
  light: {
    stickerBg: "bg-cyan-400",
    priceColor: "text-pink-500",
    emoji: "🎬",
  },
};

function Sticker({ children, color = "bg-white", rotate = 0, className = "", isDark = false }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`
        ${color}
        ${isDark ? 'border-gray-600' : 'border border-gray-200'}
        shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
        hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)]
        transition-all duration-200
        ${className}
      `}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </motion.div>
  );
}

function BouncyCard({ children, className = "", delay = 0, onClick, isDark = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: -1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay, type: "spring", stiffness: 220, damping: 16 }}
      whileHover={{ y: -8, rotate: 1 }}
      onClick={onClick}
      className={`
        ${isDark ? 'bg-[#1E293B]' : 'bg-white'}
        ${isDark ? 'border-gray-600' : 'border-gray-200'}
        shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
        rounded-3xl
        overflow-hidden
        cursor-pointer
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

export default function MainProductsSection() {
  const navigate = useNavigate();
  const products = useMainStore((s) => s.products);
  const productsLoading = useMainStore((s) => s.productsLoading);
  const productsError = useMainStore((s) => s.productsError);
  const { theme } = useThemeStore();
  const themeStyle = productsThemeStyles[theme] || productsThemeStyles.light;
  const isDark = theme === "dark";

  // 랜덤 3개 상품 선택
  const randomProducts = useMemo(() => {
    const list = Array.isArray(products) ? [...products] : [];
    if (list.length <= 3) return list;

    // Fisher-Yates 셔플 알고리즘으로 랜덤 선택
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list.slice(0, 3);
  }, [products]);

  const goDetail = (p) => {
    const id = getProductId(p);
    if (!id) return;
    navigate(`/product/${id}`);
  };

  return (
    <section className={`relative px-6 md:px-12 py-20 ${isDark ? 'bg-[#0F172A] border-gray-700' : 'bg-transparent border-gray-200'} border-b`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10"
        >
          <div>
            <Sticker
              color={themeStyle.stickerBg}
              rotate={-1}
              className="inline-block px-4 py-2 rounded-xl mb-4"
              isDark={isDark}
            >
              <span className="font-black">
                {`구독 상품 ${themeStyle.emoji}`}
              </span>
            </Sticker>
            <h2 className={`text-4xl md:text-5xl font-black ${isDark ? 'text-white' : 'text-black'}`}>
              원하는 서비스를 골라요
            </h2>
            <p className={`font-medium mt-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              다양한 구독 서비스를 확인하고 파티에 참여하세요.
            </p>
          </div>

          <Link to="/product">
            <Sticker color="bg-black" rotate={2} className="px-5 py-3 rounded-xl cursor-pointer" isDark={isDark}>
              <span className="flex items-center gap-2 text-white font-black">
                전체 보기 <ArrowUpRight className="w-5 h-5" />
              </span>
            </Sticker>
          </Link>
        </motion.div>

        {productsError?.status === 401 && (
          <div className="mb-10">
            <div className={`${isDark ? 'bg-[#1E293B] border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-800'} rounded-3xl p-6 font-bold shadow-[4px_4px_12px_rgba(0,0,0,0.08)]`}>
              구독 상품은 로그인 후 확인할 수 있어요.
            </div>
          </div>
        )}

        {productsLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`h-72 ${isDark ? 'bg-[#1E293B] border-gray-600' : 'bg-white border-gray-200'} rounded-3xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] animate-pulse`}
              />
            ))}
          </div>
        )}

        {!productsLoading && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {randomProducts.map((p, i) => {
                const name = getProductName(p);
                const status = getProductStatus(p);
                const tier = getProductTier(p);
                const price = getProductPrice(p);
                const maxProfiles = getProductMaxProfiles(p);
                const desc = getProductDescription(p);
                const imagePath = getProductImagePath(p);
                const logoUrl = getProductLogoUrl(imagePath);  // 상단 로고 이미지
                const iconUrl = getProductIconUrl(imagePath);  // 작은 아이콘 이미지

                const badge =
                  status === "ACTIVE"
                    ? { label: "이용 가능", cls: "bg-lime-400" }
                    : status
                      ? { label: String(status), cls: "bg-slate-200" }
                      : { label: "준비중", cls: "bg-slate-200" };

                return (
                  <BouncyCard
                    key={`${getProductId(p) ?? i}`}
                    delay={i * 0.08}
                    onClick={() => goDetail(p)}
                    isDark={isDark}
                  >
                    {/* 상단 로고 이미지 영역 */}
                    <div className={`h-28 ${isDark ? 'bg-[#2D3B4F]' : 'bg-slate-100'} flex items-center justify-center`}>
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt={name || "logo"}
                          className="max-w-[60%] max-h-[60%] object-contain"
                        />
                      ) : (
                        <span className={`text-4xl`}>📦</span>
                      )}
                    </div>

                    <div className={`p-6 ${isDark ? 'border-gray-600' : 'border-gray-200'} border-t`}>
                      {/* 아이콘 + 서비스명 */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-[#1E293B] border-gray-600' : 'bg-white border-gray-200'} border overflow-hidden flex items-center justify-center flex-shrink-0`}>
                          {iconUrl ? (
                            <img
                              src={iconUrl}
                              alt={name || "icon"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-lg">📦</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={`font-black text-lg truncate ${isDark ? 'text-white' : 'text-black'}`}>
                            {name || "-"}
                          </div>
                          <span
                            className={`${badge.cls} ${isDark ? 'border-gray-600' : 'border-gray-200'} px-2 py-0.5 rounded-full font-bold text-xs`}
                          >
                            {badge.label}
                          </span>
                        </div>
                      </div>

                      {/* 요금제 */}
                      <div className={`flex justify-between items-center py-3 ${isDark ? 'border-gray-600' : 'border-gray-100'} border-t`}>
                        <span className={`font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>요금제</span>
                        <span className={`${themeStyle.priceColor} font-black text-lg`}>
                          {formatCurrency(price, { fallback: "-" })}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goDetail(p);
                        }}
                        className={`w-full mt-3 ${isDark ? 'bg-[#1E293B] border-gray-600 hover:bg-[#2D3B4F]' : 'bg-white border-gray-200 hover:bg-slate-100'} border rounded-2xl py-3 font-black transition flex items-center justify-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}
                      >
                        자세히 보기 <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </BouncyCard>
                );
              })}
            </div>

            {randomProducts.length === 0 && (
              <div className="py-16 text-center">
                <div className={`inline-block ${isDark ? 'bg-[#1E293B] border-gray-600 text-white' : 'bg-white border-gray-200 text-black'} rounded-3xl px-8 py-6 font-black shadow-[4px_4px_12px_rgba(0,0,0,0.08)]`}>
                  등록된 상품이 없습니다.
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
