/**
 * Helpers for formatting values shown on the main page.
 * Keep UI-level formatting out of components to simplify reuse and testing.
 */

export const extractMainPayload = (response) => {
  if (!response) return null;
  if (response.data !== undefined) return response.data;
  if (response.result !== undefined) return response.result;
  if (response.banner !== undefined) return response.banner;
  return response;
};

export const pickFirstDefined = (...values) => {
  for (const v of values) {
    if (v !== undefined && v !== null) return v;
  }
  return undefined;
};

export const formatCurrency = (
  value,
  { suffix = "원", fallback = "-", withSpace = false } = {}
) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return fallback;
  return withSpace
    ? `${amount.toLocaleString()} ${suffix}`.trim()
    : `${amount.toLocaleString()}${suffix}`.trim();
};

export const formatDateText = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

export const formatPhoneNumber = (value, fallback = "-") => {
  if (!value) return fallback;

  const digits = String(value).replace(/\D/g, "");

  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }

  if (digits.length === 10) {
    return digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }

  return value;
};

export const normalizeList = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.content)) return payload.content;
  if (Array.isArray(payload.list)) return payload.list;
  return [];
};

export const getPartyId = (party) => party?.partyId ?? party?.id ?? null;

export const getPartyPrice = (party) => {
  const priceKeys = [
    "price",
    "pricePerMonth",
    "monthlyFee",
    "monthlyPrice",
    "subscriptionFee",
  ];
  for (const key of priceKeys) {
    const candidate = party?.[key];
    if (candidate === 0 || candidate) {
      const numeric = Number(candidate);
      if (!Number.isNaN(numeric)) return numeric;
    }
  }
  return null;
};

export const getPartyTitle = (party) => party?.title ?? party?.partyTitle ?? "";

export const getPartyDescription = (party) =>
  party?.description ?? party?.summary ?? "";

export const getPartyServiceName = (party) =>
  party?.serviceName ?? party?.platform ?? party?.productName ?? "";

export const getPartyHostName = (party) =>
  party?.hostName ?? party?.leaderName ?? party?.ownerName ?? "";

export const getPartyStatus = (party) =>
  party?.status ?? party?.partyStatus ?? party?.recruitStatus ?? "";

export const getPartyMembers = (party) => {
  const v = pickFirstDefined(
    party?.members,
    party?.memberCount,
    party?.currentMembers,
    party?.joinedCount
  );
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export const getPartyMaxMembers = (party) => {
  const v = pickFirstDefined(
    party?.maxMembers,
    party?.maxSlots,
    party?.totalSlots,
    party?.capacity,
    party?.product?.maxProfiles
  );
  const n = Number(v);
  return Number.isFinite(n) ? n : 4; // 기본값 4
};

export const getProductId = (p) => p?.productId ?? p?.id ?? null;
export const getProductName = (p) => p?.productName ?? p?.name ?? "";
export const getProductCategory = (p) =>
  p?.category ?? p?.type ?? p?.group ?? "";
export const getProductTier = (p) => p?.tier ?? p?.planName ?? p?.plan ?? "";
export const getProductPrice = (p) =>
  pickFirstDefined(p?.price, p?.monthlyPrice, p?.amount, null);
export const getProductMaxProfiles = (p) =>
  pickFirstDefined(p?.maxProfiles, p?.maxUsers, p?.maxSlots, null);
export const getProductDescription = (p) => p?.description ?? p?.summary ?? "";
export const getProductStatus = (p) => p?.status ?? p?.state ?? "";
export const getProductIconUrl = (p) =>
  p?.iconUrl ?? p?.image ?? p?.imageUrl ?? p?.thumbnailUrl ?? "";
