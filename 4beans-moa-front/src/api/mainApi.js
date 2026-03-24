import httpClient from "@/api/httpClient";
import { useAuthStore } from "@/store/authStore";
import { extractMainPayload, normalizeList } from "@/utils/format";

const readCookie = (name) => {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
};

const buildAuthHeaders = () => {
  const tokenFromStore = useAuthStore.getState()?.accessToken;
  const tokenFromCookie = readCookie("ACCESS_TOKEN");
  const token = tokenFromStore || tokenFromCookie;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const safeGet = async (path, config = {}) => {
  try {
    const res = await httpClient.get(path, {
      ...config,
      headers: { ...(config.headers || {}), ...buildAuthHeaders() },
    });
    return extractMainPayload(res);
  } catch (err) {
    const status = err?.response?.status;
    const data = err?.response?.data;
    return { __error: true, status, data };
  }
};

// 상품 목록 조회 - /product 엔드포인트 사용 (permitAll)
export const fetchMainSubscriptionProducts = async () => {
  const payload = await safeGet("/product");
  if (payload?.__error) return payload;
  return normalizeList(payload);
};

// 파티 목록 조회 - /parties 엔드포인트 직접 사용 (permitAll)
// 모집중인 파티만 마감 임박순으로 가져옴
export const fetchMainTrendingParties = async () => {
  const payload = await safeGet("/parties", {
    params: { sort: "deadline", size: 12, partyStatus: "RECRUITING" },
  });
  if (payload?.__error) return payload;
  return normalizeList(payload);
};

export const loadMain = async () => {
  const [products, parties] = await Promise.all([
    fetchMainSubscriptionProducts(),
    fetchMainTrendingParties(),
  ]);

  return {
    products: Array.isArray(products) ? products : [],
    parties: Array.isArray(parties) ? parties : [],
    productsError: products?.__error ? products : null,
    partiesError: parties?.__error ? parties : null,
  };
};
