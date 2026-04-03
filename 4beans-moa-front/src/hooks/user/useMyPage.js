import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "@/api/httpClient";
import { useAuthStore } from "@/store/authStore";
import { useOtpStore } from "@/store/user/otpStore";
import { otpHandlers } from "@/hooks/user/useOtp";
import { toast } from "@/utils/toast";

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
   * 사용자 정보 동기화
   * authStore가 자동으로 세션을 복구하므로
   * 여기서는 OTP 설정만 동기화
   * =============================== */
  useEffect(() => {
    if (user) {
      setEnabled(!!user.otpEnabled);
    }
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
      try {
        const res = await httpClient.get(`/oauth/${provider}/auth`, {
          params: { mode: "connect" },
        });

        const body = res?.data;
        const url =
          typeof body === "string"
            ? body
            : body?.url || body?.data?.url || body?.redirectUrl;

        if (!url) {
          toast.error("연동을 시작할 수 없습니다.");
          return;
        }

        window.location.assign(url);
      } catch (err) {
        toast.error(err?.response?.data?.error?.message || "소셜 연동 중 오류가 발생했습니다.");
      }
    },

    oauthRelease: async (oauthId) => {
      if (!oauthId) {
        toast.warning("현재 로그인 계정은 해제할 수 없습니다.");
        return;
      }

      // Optimistic Update
      const originalUser = useAuthStore.getState().user;
      const updatedConnections = originalUser.oauthConnections?.filter(c => c.oauthId !== oauthId);
      setUser({ ...originalUser, oauthConnections: updatedConnections });

      let aborted = false;

      toast.success("소셜 계정 연동이 해제되었습니다.", {
        duration: 5000,
        action: {
          label: "실행 취소",
          onClick: () => {
            aborted = true;
            setUser(originalUser); // Revert
            toast.info("연동 해제가 취소되었습니다.");
          }
        }
      });

      // Execute API call after 5 seconds if not aborted
      setTimeout(async () => {
        if (aborted) return;
        try {
          const res = await httpClient.post("/oauth/release", { oauthId });
          if (res.success) {
            await useAuthStore.getState().fetchSession();
          } else {
            setUser(originalUser); // Revert on failure
            toast.error(res?.error?.message || "소셜 계정 연동 해제에 실패했습니다.");
          }
        } catch (err) {
          setUser(originalUser);
          toast.error(err?.response?.data?.error?.message || "연동 해제 중 오류가 발생했습니다.");
        }
      }, 5000);
    },

    handleMarketingToggle: async (currentValue) => {
      const newValue = !currentValue;
      
      // Optimistic update
      setUser({ ...user, agreeMarketing: newValue });
      
      try {
        // send JSON patch
        await httpClient.patch("/users/me", { agreeMarketing: newValue });
        
        toast.success(
          `마케팅 정보 수신 동의가 ${newValue ? "설정" : "해제"}되었습니다.`,
          {
            duration: 4000,
            action: {
              label: "실행 취소",
              onClick: async () => {
                // Revert
                setUser({ ...user, agreeMarketing: currentValue });
                await httpClient.patch("/users/me", { agreeMarketing: currentValue });
                toast.info("원래 설정으로 복구되었습니다.");
              }
            }
          }
        );
      } catch (err) {
        setUser({ ...user, agreeMarketing: currentValue });
        toast.error("변경에 실패했습니다.");
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
      toast.warning("카카오는 현재 로그인 계정이므로 해제할 수 없습니다.");
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
      goChangePwd:    () => navigate("/mypage/password"),
      goSubscription: () => navigate("/subscription"),
      goMyParties:    () => navigate("/my-parties"),
      goWallet:       () => navigate("/user/wallet"),
    },
  };
};
