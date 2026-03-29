import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useMainStore } from "@/store/main/mainStore";
import {
  getProductId,
  getProductName,
  getProductStatus,
  getProductIconUrl as getProductImagePath,
} from "@/utils/format";
import { getProductIconUrl } from "@/utils/imageUtils";

const SERVICE_COLORS = {
  netflix:    "#e50914", 넷플릭스:   "#e50914",
  youtube:    "#ff0000", 유튜브:     "#ff0000",
  spotify:    "#1db954", 스포티파이:  "#1db954",
  disney:     "#0063e5", 디즈니:     "#0063e5",
  wavve:      "#0abde3", 웨이브:     "#0abde3",
  watcha:     "#f6ac3f", 왓챠:      "#f6ac3f",
  apple:      "#555555", 애플:      "#555555",
};

function getServiceColor(name = "") {
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(SERVICE_COLORS)) {
    if (lower.includes(key)) return val;
  }
  return "#2563EB";
}

function ProductIcon({ product, index }) {
  const navigate  = useNavigate();
  const id        = getProductId(product);
  const name      = getProductName(product);
  const status    = getProductStatus(product);
  const imgPath   = getProductImagePath(product);
  const iconUrl   = getProductIconUrl(imgPath);
  const color     = getServiceColor(name);
  const available = status === "ACTIVE";

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.3, ease: "easeOut" }}
      whileTap={{ scale: 0.94 }}
      onClick={() => id && navigate(`/product/${id}`)}
      className="flex flex-col items-center gap-2"
      style={{ opacity: available ? 1 : 0.45 }}
    >
      {/* Icon circle */}
      <div
        className="w-[60px] h-[60px] rounded-2xl flex items-center justify-center overflow-hidden"
        style={{
          background: "var(--glass-bg-card)",
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--shadow-glass)",
        }}
      >
        {iconUrl ? (
          <img src={iconUrl} alt={name} className="w-9 h-9 object-contain" />
        ) : (
          <span className="font-black text-lg" style={{ color }}>
            {name?.charAt(0) || "?"}
          </span>
        )}
      </div>

      {/* Label */}
      <p
        className="text-[11px] font-medium text-center w-full truncate px-1"
        style={{ color: "var(--theme-text)" }}
      >
        {name}
      </p>
    </motion.button>
  );
}

function SkeletonIcon() {
  return (
    <div className="flex flex-col items-center gap-2 animate-pulse">
      <div
        className="w-[60px] h-[60px] rounded-2xl"
        style={{ background: "var(--glass-bg-overlay)" }}
      />
      <div className="h-2.5 rounded-md w-10" style={{ background: "var(--glass-bg-overlay)" }} />
    </div>
  );
}

export default function MainProductsSection() {
  const navigate        = useNavigate();
  const products        = useMainStore((s) => s.products);
  const productsLoading = useMainStore((s) => s.productsLoading);

  const list = Array.isArray(products) ? products.slice(0, 8) : [];

  return (
    <section className="px-5 pb-8">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-[16px] font-bold" style={{ color: "var(--theme-text)" }}>
          구독 서비스
        </p>
        <button
          onClick={() => navigate("/product")}
          className="text-[13px] font-semibold"
          style={{ color: "var(--theme-primary)" }}
        >
          전체보기
        </button>
      </div>

      {/* Icon grid — 4 columns */}
      <div className="grid grid-cols-4 gap-y-5 gap-x-3">
        {productsLoading
          ? Array.from({ length: 8 }, (_, i) => <SkeletonIcon key={i} />)
          : list.map((p, i) => (
              <ProductIcon key={getProductId(p) ?? i} product={p} index={i} />
            ))
        }
      </div>
    </section>
  );
}
