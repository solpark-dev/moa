import { setupOtp, verifyOtp, disableOtpVerify, fetchCurrentUser } from "@/api/authApi";
import { useOtpStore } from "@/store/user/otpStore";
import { useMyPageStore } from "@/store/user/myPageStore";
import { useAuthStore } from "@/store/authStore";

export function otpHandlers() {
  const openSetup = async () => {
    const authStore = useAuthStore.getState();

    if (!authStore.accessToken) {
      await authStore.fetchSession();
    }

    if (!useAuthStore.getState().accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const store = useOtpStore.getState();
      store.setField("loading", true);
      store.setField("mode", "enable");

      const res = await setupOtp();
      if (!res?.success) {
        alert(res?.error?.message || "OTP 설정 정보를 가져오지 못했습니다.");
        return;
      }

      const { otpAuthUrl, secret, enabled } = res.data;

      store.setField("qrUrl", otpAuthUrl);
      store.setField("secret", secret);
      store.setEnabled(!!enabled);
      store.setField("modalOpen", true);
    } catch (e) {
      console.log(e);
      alert("OTP 설정 중 오류가 발생했습니다.");
    } finally {
      useOtpStore.getState().setField("loading", false);
    }
  };

  const changeCode = (value) => {
    const onlyNumber = value.replace(/\D/g, "").slice(0, 6);
    useOtpStore.getState().setField("code", onlyNumber);
  };

  const confirmOtp = async () => {
    const state = useOtpStore.getState();
    const mode = state.mode;

    if (!state.code || state.code.length !== 6) {
      alert("6자리 코드를 입력해주세요.");
      return;
    }

    try {
      state.setField("loading", true);

      if (mode === "enable") {
        const res = await verifyOtp(state.code);
        if (!res.success) {
          alert(res.error?.message || "OTP 인증 실패");
          return;
        }
      }

      if (mode === "disable") {
        const res = await disableOtpVerify(state.code);
        if (!res.success) {
          alert(res.error?.message || "OTP 해제 인증 실패");
          return;
        }
      }

      const sessionRes = await fetchCurrentUser();
      if (sessionRes?.success && sessionRes?.data) {
        useAuthStore.getState().setUser(sessionRes.data);
        useOtpStore.getState().setEnabled(!!sessionRes.data.otpEnabled);
        useMyPageStore.getState().setUser(sessionRes.data);
      } else {
        await useAuthStore.getState().fetchSession();
        const authedUser = useAuthStore.getState().user;
        if (authedUser) {
          useOtpStore.getState().setEnabled(!!authedUser.otpEnabled);
          useMyPageStore.getState().setUser(authedUser);
        }
      }

      alert(mode === "enable" ? "OTP 활성화 완료" : "OTP 해제 완료");

      state.reset();
      state.setEnabled(mode === "enable");
      return { success: true, mode };
    } catch (e) {
      console.log(e);
      alert("OTP 처리 중 오류 발생");
      return { success: false, mode };
    } finally {
      state.setField("loading", false);
    }
  };

  const prepareDisable = () => {
    const store = useOtpStore.getState();
    store.setField("mode", "disable");
    store.setField("qrUrl", null);
    store.setField("secret", null);
    store.setField("modalOpen", true);
  };

  const closeModal = () => {
    useOtpStore.getState().reset();
  };

  return {
    openSetup,
    changeCode,
    confirmOtp,
    prepareDisable,
    closeModal,
  };
}
