import { useNavigate, useLocation } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import { getAdminUserDetail } from "@/api/adminUserApi";

export const useAdminUserDetailLogic = (userId) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!userId) {
        throw new Error("회원 ID가 없습니다.");
      }

      const res = await getAdminUserDetail(userId);

      if (!res.success) {
        throw new Error(
          res.error?.message || "회원 정보를 불러오지 못했습니다."
        );
      }

      setUser(res.data);
    } catch (e) {
      setError(e.message || "회원 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const goBackList = () => {
    const from = location.state?.from;
    navigate(from || "/admin/users");
  };

  const goLoginHistory = () => {
    navigate(`/admin/users/${encodeURIComponent(userId)}/login-history`, {
      state: { from: location.state?.from || "/admin/users" },
    });
  };

  const goBlacklistAdd = () => {
    if (!user) return;

    const from = location.state?.from || "/admin/users";

    if (user.blacklisted) {
      navigate(
        `/admin/blacklist/delete?user=${encodeURIComponent(user.userId)}`,
        { state: { from } }
      );
    } else {
      navigate(`/admin/blacklist/add?user=${encodeURIComponent(user.userId)}`, {
        state: { from },
      });
    }
  };

  const formatDate = (date) =>
    date ? new Date(date).toISOString().slice(0, 10) : "-";

  return {
    user,
    loading,
    error,
    formatDate,
    goBackList,
    goBlacklistAdd,
    goLoginHistory,
  };
};
