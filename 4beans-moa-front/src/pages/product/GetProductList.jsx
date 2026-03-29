import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, CalendarPlus, Calendar, Sparkles } from "lucide-react";
import httpClient from "../../api/httpClient";
import { useAuthStore } from "../../store/authStore";
import AddSubscriptionModal from "../../components/subscription/AddSubscriptionModal";
import AddProductModal from "../../components/product/AddProductModal";
import UpdateProductModal from "../../components/product/UpdateProductModal";
import { getProductIconUrl } from "@/utils/imageUtils";

// Product detail bottom sheet
function ProductDetailSheet({ product, onClose, user, navigate, onSubscribe, onEdit }) {
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");

  if (!product) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] flex items-end justify-center bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[390px] rounded-t-3xl pb-10 max-h-[90vh] overflow-y-auto"
        style={{
          background: "var(--glass-bg-card)",
          backdropFilter: "blur(var(--glass-blur))",
          WebkitBackdropFilter: "blur(var(--glass-blur))",
          border: "1px solid var(--glass-border)",
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: "var(--glass-border)" }} />
        </div>

        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full"
          style={{ background: "var(--glass-bg-overlay)" }}>
          <X className="w-4 h-4" style={{ color: "var(--theme-text-muted)" }} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0"
            style={{ background: "var(--glass-bg-overlay)" }}>
            {product.image ? (
              <img src={getProductIconUrl(product.image)} alt={product.productName}
                className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[18px] font-bold truncate" style={{ color: "var(--theme-text)" }}>
              {product.productName}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              {product.categoryName && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "var(--glass-bg-overlay)", color: "var(--theme-primary)" }}>
                  {product.categoryName}
                </span>
              )}
              <span className="text-[16px] font-black" style={{ color: "var(--theme-primary)" }}>
                ₩{product.price?.toLocaleString()}
                <span className="text-[11px] font-normal ml-0.5" style={{ color: "var(--theme-text-muted)" }}>/월</span>
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 space-y-4">
          {product.description && (
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--theme-text-muted)" }}>
              {product.description}
            </p>
          )}

          {/* Benefits */}
          <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--glass-bg-overlay)" }}>
            <p className="text-[12px] font-semibold flex items-center gap-1.5"
              style={{ color: "var(--theme-primary)" }}>
              <Sparkles className="w-3.5 h-3.5" />
              MOA 구독 관리 혜택
            </p>
            {["모든 구독을 한눈에 정리", "결제일 자동 알림으로 불필요한 지출 방지", "파티 공유로 최대 75% 절약"].map((t) => (
              <p key={t} className="text-[12px]" style={{ color: "var(--theme-text-muted)" }}>
                • {t}
              </p>
            ))}
          </div>

          {/* Date pickers (non-admin) */}
          {user?.role !== "ADMIN" && (
            <div className="space-y-3">
              {[
                { label: "구독 시작일", value: startDate, onChange: setStartDate, min: "" },
                { label: "구독 종료일 (선택)", value: endDate, onChange: setEndDate, min: startDate },
              ].map(({ label, value, onChange, min }) => (
                <div key={label}>
                  <label className="block text-[12px] font-semibold mb-1.5"
                    style={{ color: "var(--theme-text-muted)" }}>{label}</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: "var(--theme-primary)" }} />
                    <input
                      type="date"
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      min={min || undefined}
                      className="w-full h-10 pl-9 pr-3 rounded-xl text-[13px] outline-none"
                      style={{
                        background: "var(--glass-bg-overlay)",
                        border: "1px solid var(--glass-border)",
                        color: "var(--theme-text)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            {user?.role === "ADMIN" ? (
              <>
                <button onClick={() => { onClose(); onEdit(product); }}
                  className="flex-1 py-3 rounded-xl text-[13px] font-bold"
                  style={{ background: "var(--glass-bg-overlay)", color: "var(--theme-primary)" }}>
                  수정하기
                </button>
                <button onClick={() => { onClose(); navigate(`/product/${product.productId}/delete`); }}
                  className="flex-1 py-3 rounded-xl text-[13px] font-bold"
                  style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
                  삭제하기
                </button>
              </>
            ) : (
              <>
                <button onClick={onClose}
                  className="flex-1 py-3 rounded-xl text-[13px] font-semibold"
                  style={{ background: "var(--glass-bg-overlay)", color: "var(--theme-text-muted)" }}>
                  취소
                </button>
                <button
                  onClick={() => { onClose(); onSubscribe({ productId: product.productId, startDate, endDate }); }}
                  className="flex-[2] py-3 rounded-xl text-[13px] font-bold text-white flex items-center justify-center gap-2"
                  style={{ background: "var(--theme-primary)" }}
                >
                  <CalendarPlus className="w-4 h-4" />
                  구독 일정에 등록
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const GetProductList = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [allProducts,      setAllProducts]      = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories,       setCategories]       = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [searchKeyword,    setSearchKeyword]    = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [viewingProduct,   setViewingProduct]   = useState(null);
  const [subscribingData,  setSubscribingData]  = useState(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct,   setEditingProduct]   = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productRes, categoryRes] = await Promise.all([
        httpClient.get("/product"),
        httpClient.get("/product/categorie"),
      ]);
      if (productRes.success) setAllProducts(productRes.data || []);
      if (categoryRes.success) setCategories(categoryRes.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    let result = allProducts;
    if (selectedCategory !== "전체") result = result.filter((p) => p.categoryName === selectedCategory);
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      result = result.filter((p) => p.productName?.toLowerCase().includes(kw));
    }
    setFilteredProducts(result);
  }, [searchKeyword, selectedCategory, allProducts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ borderColor: "var(--glass-border)", borderTopColor: "var(--theme-primary)" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-4" style={{ background: "var(--theme-bg)" }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-bold" style={{ color: "var(--theme-text)" }}>구독 서비스</h2>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--theme-text-muted)" }}>
            {filteredProducts.length}개의 서비스
          </p>
        </div>
        {user?.role === "ADMIN" && (
          <button
            onClick={() => setIsAddProductModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold text-white"
            style={{ background: "var(--theme-primary)" }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            상품 등록
          </button>
        )}
      </div>

      {/* Search */}
      <div className="px-4 mb-3">
        <div className="relative">
          <input
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="서비스명 검색..."
            className="w-full h-10 pl-9 pr-9 rounded-xl text-[14px] outline-none"
            style={{
              background: "var(--glass-bg-card)",
              border: "1px solid var(--glass-border)",
              color: "var(--theme-text)",
            }}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: "var(--theme-text-muted)" }} />
          {searchKeyword && (
            <button onClick={() => setSearchKeyword("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4" style={{ color: "var(--theme-text-muted)" }} />
            </button>
          )}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 px-4 overflow-x-auto scrollbar-hide pb-2 mb-3">
        {["전체", ...categories.map((c) => c.categoryName)].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all"
            style={{
              background: selectedCategory === cat ? "var(--theme-primary)" : "var(--glass-bg-card)",
              border: "1px solid var(--glass-border)",
              color: selectedCategory === cat ? "#fff" : "var(--theme-text-muted)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product list */}
      <div className="px-4 space-y-3">
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center py-16 gap-3"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--glass-bg-overlay)" }}>
              <Search className="w-6 h-6" style={{ color: "var(--theme-primary)" }} />
            </div>
            <p className="text-[14px] font-semibold" style={{ color: "var(--theme-text)" }}>
              {searchKeyword ? `'${searchKeyword}' 검색 결과 없음` : "등록된 구독 상품이 없어요"}
            </p>
          </motion.div>
        ) : (
          filteredProducts.map((product, i) => (
            <motion.div
              key={product.productId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.3), duration: 0.35 }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "var(--glass-bg-card)",
                backdropFilter: "blur(var(--glass-blur))",
                WebkitBackdropFilter: "blur(var(--glass-blur))",
                border: "1px solid var(--glass-border)",
                boxShadow: "var(--shadow-glass)",
              }}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden relative"
                  style={{ background: "var(--glass-bg-overlay)" }}>
                  {product.image ? (
                    <img src={getProductIconUrl(product.image)} alt={product.productName}
                      className="w-10 h-10 object-contain" />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                  {product.productStatus === "INACTIVE" && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                      <span className="text-white text-[10px] font-bold">중지</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-[15px] font-bold truncate" style={{ color: "var(--theme-text)" }}>
                      {product.productName}
                    </p>
                    {product.categoryName && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: "var(--glass-bg-overlay)", color: "var(--theme-text-muted)" }}>
                        {product.categoryName}
                      </span>
                    )}
                  </div>
                  <p className="text-[16px] font-black" style={{ color: "var(--theme-primary)" }}>
                    ₩{product.price?.toLocaleString()}
                    <span className="text-[10px] font-normal ml-0.5" style={{ color: "var(--theme-text-muted)" }}>/월</span>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      if (!user) { navigate("/login"); return; }
                      setViewingProduct(product);
                    }}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold"
                    style={{ background: "var(--glass-bg-overlay)", color: "var(--theme-primary)", border: "1px solid var(--glass-border)" }}
                  >
                    상세보기
                  </button>
                  {user?.role === "ADMIN" ? (
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-white"
                      style={{ background: "var(--theme-primary)" }}
                    >
                      관리
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (!user) { navigate("/login"); return; }
                        const today = new Date().toISOString().split("T")[0];
                        setSubscribingData({ productId: product.productId, startDate: today, endDate: "" });
                      }}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-white"
                      style={{ background: "var(--theme-primary)" }}
                    >
                      구독신청
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {viewingProduct && (
          <ProductDetailSheet
            product={viewingProduct}
            onClose={() => setViewingProduct(null)}
            user={user}
            navigate={navigate}
            onSubscribe={(data) => setSubscribingData(data)}
            onEdit={(p) => setEditingProduct(p)}
          />
        )}
      </AnimatePresence>

      {subscribingData && (
        <AddSubscriptionModal
          productId={subscribingData.productId}
          startDate={subscribingData.startDate}
          endDate={subscribingData.endDate}
          onClose={() => setSubscribingData(null)}
          user={user}
          onSuccess={() => {}}
        />
      )}

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onSuccess={fetchData}
      />

      <UpdateProductModal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        productId={editingProduct?.productId}
        initialData={editingProduct}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default GetProductList;
