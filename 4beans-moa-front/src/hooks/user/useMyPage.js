import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "@/api/httpClient";
import { useAuthStore } from "@/store/authStore";
import { useOtpStore } from "@/store/user/otpStore";
import { otpHandlers } from "@/hooks/user/useOtp";

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toISOString().slice(0, 10);
}

export const useMyPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const { enabled, modalOpen, qrUrl, code, loading, setEnabled } =
    useOtpStore();

  const otpActionHandlers = otpHandlers();

  const getLoginProviderLabel = (user) => {
    if (!user) return "EMAIL";

    const raw =
      user.loginProvider ||
      user.provider ||
      user.lastLoginType ||
      (user.oauthConnections || []).find((c) => c.provider && !c.releaseDate)
        ?.provider;

    const p = (raw || "").toString().toLowerCase();

    if (p === "kakao") return "KAKAO";
    if (p === "google") return "GOOGLE";
    return "EMAIL";
  };

  /* ===============================
   * 사용자 정보 로딩
   * =============================== */
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await httpClient.get("/users/me");
        const { success, data } = res;

        if (!success || !data) {
          navigate("/login", { replace: true });
          return;
        }

        setUser(data);
        setEnabled(!!data.otpEnabled);
      } catch {
        navigate("/login", { replace: true });
      }
    };

    if (!user) fetchUserData();
  }, [user, setUser, setEnabled, navigate]);

  useEffect(() => {
    setEnabled(!!user?.otpEnabled);
  }, [user, setEnabled]);

  /* ===============================
   * 기본 파생 상태
   * =============================== */
  const marketingAgreed = user
    ? user.agreeMarketing ?? user.marketing ?? false
    : false;

  const shortId = user?.userId?.split("@")[0] || user?.userId || "";
  const isAdmin = user?.role === "ADMIN";

  /* ===============================
   * ✅ 실제 OAuth 연결 객체
   * =============================== */
  const googleOAuth = (user?.oauthConnections || []).find(
    (c) => c.provider?.toLowerCase() === "google" && !c.releaseDate
  );

  const kakaoOAuth = (user?.oauthConnections || []).find(
    (c) => c.provider?.toLowerCase() === "kakao" && !c.releaseDate
  );

  /* ===============================
   * 화면 표시용 boolean (기존 유지)
   * =============================== */
  const googleConn = Boolean(
    (user?.loginProvider || "").toLowerCase() === "google" || googleOAuth
  );

  const kakaoConn = Boolean(
    (user?.loginProvider || "").toLowerCase() === "kakao" || kakaoOAuth
  );

  const loginProviderLabel = getLoginProviderLabel(user);

  /* ===============================
   * 공통 핸들러
   * =============================== */
  const handlers = {
    oauthConnect: async (provider) => {
      const res = await httpClient.get(`/oauth/${provider}/auth`, {
        params: { mode: "connect" },
      });

      const body = res?.data;
      const url =
        typeof body === "string"
          ? body
          : body?.url || body?.data?.url || body?.redirectUrl;

      if (!url) {
        alert("연동을 시작할 수 없습니다.");
        return;
      }

      window.location.assign(url);
    },

    oauthRelease: async (oauthId) => {
      if (!oauthId) {
        alert("현재 로그인 계정은 해제할 수 없습니다.");
        return;
      }

      const res = await httpClient.post("/oauth/release", { oauthId });

      if (res.success) {
        await useAuthStore.getState().fetchSession();
      } else {
        alert("소셜 계정 연동 해제 실패");
      }
    },

    formatDate,
  };

  /* ===============================
   * ✅ 수정된 버튼 클릭 로직
   * =============================== */
  const handleGoogleClick = () => {
    if (googleOAuth) {
      return handlers.oauthRelease(googleOAuth.oauthId);
    }
    return handlers.oauthConnect("google");
  };

  const handleKakaoClick = () => {
    if ((user?.loginProvider || "").toLowerCase() === "kakao") {
      alert("카카오는 현재 로그인 계정이므로 해제할 수 없습니다.");
      return;
    }

    if (kakaoOAuth) {
      return handlers.oauthRelease(kakaoOAuth.oauthId);
    }

    return handlers.oauthConnect("kakao");
  };

  const handleOtpModalChange = (isOpen) => {
    if (!isOpen) otpActionHandlers.closeModal();
  };
  return {
    state: {
      user,
      isAdmin,
      shortId,
      marketingAgreed,
      googleConn,
      kakaoConn,
      loginProvider: loginProviderLabel,
      otp: {
        enabled: !!(user?.otpEnabled ?? enabled),
        modalOpen,
        qrUrl,
        code,
        loading,
      },
    },
    actions: {
      navigate,
      ...handlers,
      otp: otpActionHandlers,
      handleGoogleClick,
      handleKakaoClick,
      handleOtpModalChange,
    },
  };
};
