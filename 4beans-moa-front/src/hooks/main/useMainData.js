import { getMainBanner, getMainPopularParties } from "../../api/mainApi";

const extractPayload = (response) => {
  if (!response) return null;
  if (response.data !== undefined) return response.data;
  if (response.result !== undefined) return response.result;
  if (response.banner !== undefined) return response.banner;
  return response;
};

export const loadMainPageData = async () => {
  const [bannerRes, popularRes] = await Promise.all([
    getMainBanner(),
    getMainPopularParties(),
  ]);

  return {
    banner: extractPayload(bannerRes),
    popular: extractPayload(popularRes) || [],
  };
};
