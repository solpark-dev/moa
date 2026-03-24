import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { resolveProfileImageUrl } from "@/utils/profileImage";

export function useHeaderLogic() {
  const {
    user,
    fetchSession,
    logout: storeLogout,
    accessToken,
    setUser,
  } = useAuthStore();
  const navigate = useNavigate();
  const [isAdminMode, setIsAdminMode] = useState(true);

  useEffect(() => {
    if (accessToken && !user) {
      fetchSession();
    }
  }, [accessToken, user, fetchSession]);

  const logout = async () => {
    await storeLogout();
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  const handleAdminSwitch = () => {
    setIsAdminMode((prev) => {
      const next = !prev;

      if (next) {
        setUser({
          ...user,
          email: "admin@admin.com",
          nickname: "슈퍼관리자",
          role: "ADMIN",
        });
      } else {
        setUser({
          ...user,
          email: "admin@moa.com",
          nickname: "MoA관리자",
          role: "ADMIN",
        });
      }

      return next;
    });
  };

  const isAdmin = user?.role === "ADMIN";

  const profileImageUrl = resolveProfileImageUrl(user?.profileImage);

  const userInitial = user?.nickname
    ? user.nickname.substring(0, 1).toUpperCase()
    : "U";
  const displayNickname = user?.nickname || "사용자";
  const displayEmail = user?.email || "";

  return {
    user,
    isAdmin,
    isAdminMode,
    profileImageUrl,
    userInitial,
    displayNickname,
    displayEmail,
    logout,
    handleAdminSwitch,
  };
}
