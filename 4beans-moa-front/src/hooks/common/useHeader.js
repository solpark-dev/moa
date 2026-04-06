import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { resolveProfileImageUrl } from "@/utils/profileImage";

export function useHeaderLogic() {
  const {
    user,
    logout: storeLogout,
  } = useAuthStore();
  const navigate = useNavigate();

  const logout = async () => {
    await storeLogout();
    alert("로그아웃 되었습니다.");
    navigate("/");
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
    profileImageUrl,
    userInitial,
    displayNickname,
    displayEmail,
    logout,
  };
}
