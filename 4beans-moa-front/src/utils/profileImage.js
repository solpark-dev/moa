export const resolveProfileImageUrl = (profileImage) => {
  if (!profileImage) return "";

  if (/^https?:\/\//i.test(profileImage)) {
    return profileImage;
  }

  const base = import.meta.env.VITE_IMAGE_BASE_URL;
  if (!base) return "";

  const path = profileImage.startsWith("/") ? profileImage : `/${profileImage}`;

  return `${base}${path}`;
};
