import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "@/api/httpClient";
import { useLoginStore } from "@/store/user/loginStore";
import { useAuthStore } from "@/store/authStore";
import {
  login as apiLogin,
  startPassAuth,
  unlockAccount,
  restoreAccount,
} from "@/api/authApi";
import { purgeLoginPasswords } from "@/store/authStore";

const loadIamport = () =>
  new Promise((resolve, reject) => {
    if (window.IMP) {
      resolve(window.IMP);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/v1/iamport.js";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.IMP);
    script.onerror = reject;
    document.body.appendChild(script);
  });

export const PASSWORD_STORAGE_KEYS = [
  "login-password",
  "password",
  "pwd",
  "user-password",
  "pwd-remember",
];

export const purgeLoginPasswordKeys = (primaryStorage, secondaryStorage) => {
  const storages = [primaryStorage, secondaryStorage].filter(Boolean);
  storages.forEach((storage) => {
    PASSWORD_STORAGE_KEYS.forEach((key) => {
      try {
        storage.removeItem(key);
      } catch {}
    });
  });
};

export const applyRememberEmail = (storage, email, remember) => {
  try {
    if (remember) {
      storage.setItem("login-email", email);
    } else {
      storage.removeItem("login-email");
    }
  } catch (e) {
    console.warn("Failed to save login email", e);
  }
};

export const useLoginPageLogic = () => {
  const navigate = useNavigate();
  const {
    email,
    password,
    remember,
    otpRequired,
    otpModalOpen,
    otpCode,
    otpToken,
    setField,
    resetOtp,
  } = useLoginStore();
  const { setTokens } = useAuthStore();

  const [otpMode, setOtpMode] = useState("otp");
  const [loginLoading, setLoginLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    otp: "",
  });

  const runPassCertification = useCallback(async () => {
    const IMP = await loadIamport();
    if (!IMP) {
      alert("본인인증 모듈 로드에 실패했습니다.");
      return null;
    }

    const startRes = await startPassAuth();
    if (!startRes?.success) {
      alert(startRes?.error?.message || "본인인증 시작에 실패했습니다.");
      return null;
    }

    const { impCode, merchantUid } = startRes.data;
    IMP.init(impCode);

    const impUid = await new Promise((resolve) => {
      IMP.certification({ merchant_uid: merchantUid }, (rsp) => {
        if (!rsp?.success) {
          resolve(null);
          return;
        }
        resolve(rsp.imp_uid || null);
      });
    });

    return impUid;
  }, []);

  const handleUnlockByCertification = useCallback(async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setErrors((prev) => ({
        ...prev,
        email: "이메일을 입력해주세요",
      }));
      return;
    }
    try {
      await httpClient.post("/auth/exists-by-email", {
        email: trimmedEmail,
      });
    } catch (e) {
      alert("존재하는 계정이 아닙니다.");
      return;
    }

    try {
      const impUid = await runPassCertification();
      if (!impUid) {
        alert("본인인증이 취소되었습니다.");
        return;
      }

      const res = await unlockAccount({ userId: trimmedEmail, impUid });

      if (!res?.success) {
        alert(res?.error?.message || "본인인증 확인에 실패했습니다.");
        return;
      }

      alert("본인인증 완료. 계정 잠금이 해제되었습니다.");
    } catch (e) {
      console.error(e);
      alert("본인인증 처리 중 오류가 발생했습니다.");
    }
  }, [email, runPassCertification]);

  const handleRestoreByCertification = useCallback(
    async (userId) => {
      const trimmedEmail = (userId || "").trim();
      if (!trimmedEmail) return;

      try {
        const impUid = await runPassCertification();
        if (!impUid) {
          alert("본인인증이 취소되었습니다.");
          return;
        }

        const res = await restoreAccount({ userId: trimmedEmail, impUid });

        if (!res?.success) {
          alert(res?.error?.message || "계정 복구에 실패했습니다.");
          return;
        }

        const data = res.data || {};
        if (data.accessToken && data.refreshToken) {
          setTokens({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            accessTokenExpiresIn: data.accessTokenExpiresIn,
          });
        }

        const me = await httpClient.get("/users/me");
        if (me?.success) {
          useAuthStore.getState().setUser(me.data);
        }

        alert("계정 복구가 완료되었습니다.");
        navigate("/", { replace: true });
      } catch (e) {
        console.error(e);
        alert("계정 복구 처리 중 오류가 발생했습니다.");
      }
    },
    [runPassCertification, setTokens, navigate]
  );

  const handleEmailLogin = useCallback(async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const nextErrors = { email: "", password: "", otp: "" };

    if (!trimmedEmail) nextErrors.email = "이메일을 입력해주세요";
    if (!trimmedPassword) nextErrors.password = "비밀번호를 확인해주세요.";

    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) return;
    if (loginLoading) return;

    try {
      setLoginLoading(true);
      const response = await apiLogin({
        userId: trimmedEmail,
        password: trimmedPassword,
      });

      if (!response.success) {
        const code = response.error?.code;
        const message = response.error?.message || "";

        if (code === "ACCOUNT_WITHDRAW" || message.includes("탈퇴한 계정")) {
          const ok = window.confirm(
            "탈퇴한 계정입니다.\n다시 복구하시겠습니까?"
          );
          if (ok) {
            await handleRestoreByCertification(trimmedEmail);
          }
          return;
        }

        if (
          code === "N401" ||
          code === "AUTH_FAILED" ||
          message.includes("Invalid email or password")
        ) {
          alert("이메일 또는 비밀번호가 일치하지 않습니다.");
        } else {
          alert(message || "로그인에 실패했습니다.");
        }
        return;
      }

      const data = response.data;

      if (data.otpRequired) {
        setField("otpRequired", true);
        setField("otpModalOpen", true);
        setField("otpToken", data.otpToken);
        setField("otpUserId", trimmedEmail);
        setField("otpCode", "");
        setOtpMode("otp");
        return;
      }

      const { accessToken, refreshToken, accessTokenExpiresIn } = data;
      setTokens({ accessToken, refreshToken, accessTokenExpiresIn });

      const me = await httpClient.get("/users/me");
      if (me?.success) {
        useAuthStore.getState().setUser(me.data);
      }

      applyRememberEmail(localStorage, trimmedEmail, remember);
      purgeLoginPasswordKeys(localStorage, sessionStorage);
      setField("password", "");
      resetOtp();
      localStorage.setItem("remember", remember ? "true" : "false");

      navigate("/", { replace: true });
    } catch (error) {
      const apiError = error?.response?.data?.error;
      const code = apiError?.code;
      const message = apiError?.message || "Login processing error.";

      if (code === "ACCOUNT_WITHDRAW" || message.includes("탈퇴한 계정")) {
        const ok = window.confirm("탈퇴한 계정입니다.\n다시 복구하시겠습니까?");
        if (ok) {
          await handleRestoreByCertification(email.trim());
        }
        return;
      }

      if (code === "E403" && message.includes("계정 잠금")) {
        const start = window.confirm(
          "로그인 실패가 5회 누적되어 계정이 잠겼습니다.\n본인 인증을 진행하시겠습니까?"
        );
        if (start) {
          await handleUnlockByCertification();
        }
        return;
      }

      alert(code ? `[${code}] ${message}` : "로그인 중 오류가 발생했습니다.");
    } finally {
      setLoginLoading(false);
    }
  }, [
    email,
    password,
    remember,
    loginLoading,
    navigate,
    setField,
    setTokens,
    resetOtp,
    handleUnlockByCertification,
    handleRestoreByCertification,
  ]);

  const handleOtpConfirm = useCallback(async () => {
    if (otpLoading) return;

    if (otpMode === "otp" && (!otpCode || otpCode.length !== 6)) {
      setErrors((prev) => ({
        ...prev,
        otp: "6자리 OTP 코드를 입력해주세요.",
      }));
      return;
    }

    try {
      setOtpLoading(true);

      const url =
        otpMode === "otp"
          ? "/auth/login/otp-verify"
          : "/auth/login/backup-verify";

      const res = await httpClient.post(url, {
        code: otpCode,
        otpToken,
        userId: email.trim(),
      });

      if (!res.success) {
        alert(res.error?.message || "OTP verification failed.");
        return;
      }

      const { accessToken, refreshToken, accessTokenExpiresIn } = res.data;
      setTokens({ accessToken, refreshToken, accessTokenExpiresIn });

      const me = await httpClient.get("/users/me");
      if (me?.success) {
        useAuthStore.getState().setUser(me.data);
      }

      resetOtp();
      navigate("/", { replace: true });
    } catch (e) {
      console.error(e);
      alert("OTP 처리 중 오류가 발생했습니다.");
    } finally {
      setOtpLoading(false);
    }
  }, [
    otpCode,
    otpToken,
    otpMode,
    otpLoading,
    email,
    resetOtp,
    setTokens,
    navigate,
  ]);

  useEffect(() => {
    setField("password", "");
    setField("otpCode", "");
    resetOtp();
    setErrors({ email: "", password: "", otp: "" });
    purgeLoginPasswords();

    const savedRemember = localStorage.getItem("remember") === "true";
    const savedEmail = localStorage.getItem("login-email");

    if (savedRemember && savedEmail) {
      setField("email", savedEmail);
      setField("remember", true);
    } else {
      setField("email", "");
      setField("remember", false);
    }

    purgeLoginPasswordKeys(localStorage, sessionStorage);
  }, [setField, resetOtp]);

  return {
    email,
    password,
    remember,
    otpRequired,
    otpModalOpen,
    otpCode,
    otpMode,
    loginLoading,
    otpLoading,
    errors,

    setField,

    handleEmailLogin,
    handleOtpConfirm,
    handleUnlockByCertification,

    handleEmailChange: (value) => {
      setErrors((prev) => ({ ...prev, email: "" }));
      setField("email", value);
    },

    handlePasswordChange: (value) => {
      setErrors((prev) => ({ ...prev, password: "" }));
      setField("password", value);
    },

    handleKakaoLogin: async () => {
      try {
        const res = await httpClient.get("/oauth/kakao/auth", {
          params: { mode: "login" },
        });

        if (!res?.success) {
          alert(res?.error?.message || "Kakao login failed.");
          return;
        }

        const kakaoUrl = res.data.url;
        window.location.href = kakaoUrl;
      } catch (e) {
        console.error(e);
        alert("Failed to start Kakao login.");
      }
    },

    handleGoogleLogin: async () => {
      try {
        const res = await httpClient.get("/oauth/google/auth", {
          params: { mode: "login" },
        });

        if (!res?.success) {
          alert(res?.error?.message || "Google login failed.");
          return;
        }

        window.location.href = res.data.url;
      } catch (e) {
        console.error(e);
        alert("Failed to start Google login.");
      }
    },

    handleOtpChange: (value) => {
      setErrors((prev) => ({ ...prev, otp: "" }));
      if (otpMode === "otp") {
        setField("otpCode", value.replace(/\D/g, "").slice(0, 6));
      } else {
        setField("otpCode", value.trim().toUpperCase());
      }
    },

    closeOtpModal: () => {
      resetOtp();
      setErrors((prev) => ({ ...prev, otp: "" }));
    },

    switchToOtpMode: () => {
      setField("otpCode", "");
      setErrors((prev) => ({ ...prev, otp: "" }));
    },

    switchToBackupMode: () => {
      setField("otpCode", "");
      setErrors((prev) => ({ ...prev, otp: "" }));
    },
  };
};
