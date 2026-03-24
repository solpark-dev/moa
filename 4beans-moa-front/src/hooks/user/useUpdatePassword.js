import { useCallback, useState } from "react";
import httpClient from "@/api/httpClient";
import { useUpdatePwdStore } from "@/store/user/updatePwdStore";
import { checkCurrentPassword } from "@/api/authApi";

const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,20}$/;

export const useUpdatePwdLogic = () => {
  const {
    currentPassword,
    newPassword,
    newPasswordConfirm,
    stepVerified,
    setField,
    setError,
    setModal,
    setVerified,
    resetAll,
    clearErrors,
  } = useUpdatePwdStore();

  const [loading, setLoading] = useState(false);

  const handleChange = useCallback(
    (key, value) => {
      setField(key, value);

      if (key === "currentPassword") {
        setError("current", "");
        return;
      }

      if (key === "newPassword") {
        const nextPassword = value;
        if (nextPassword && !PASSWORD_RULE.test(nextPassword)) {
          setError(
            "rule",
            "영문, 숫자, 특수문자를 포함한 8~20자를 입력해주세요."
          );
        } else {
          setError("rule", "");
        }

        if (newPasswordConfirm && nextPassword !== newPasswordConfirm) {
          setError("confirm", "비밀번호가 서로 일치하지 않습니다.");
        } else {
          setError("confirm", "");
        }
        return;
      }

      if (key === "newPasswordConfirm") {
        const nextConfirm = value;
        if (newPassword && nextConfirm && newPassword !== nextConfirm) {
          setError("confirm", "비밀번호가 서로 일치하지 않습니다.");
        } else {
          setError("confirm", "");
        }
      }
    },
    [newPassword, newPasswordConfirm, setError, setField]
  );

  const validateCurrent = useCallback(() => {
    if (!currentPassword?.trim()) {
      setError("current", "현재 비밀번호를 입력해주세요.");
      return false;
    }
    setError("current", "");
    return true;
  }, [currentPassword, setError]);

  const validateNew = useCallback(() => {
    let valid = true;

    if (!newPassword?.trim()) {
      setError("rule", "새 비밀번호를 입력해주세요.");
      valid = false;
    } else if (!PASSWORD_RULE.test(newPassword)) {
      setError("rule", "영문, 숫자, 특수문자를 포함한 8~20자를 입력해주세요.");
      valid = false;
    } else {
      setError("rule", "");
    }

    if (!newPasswordConfirm?.trim()) {
      setError("confirm", "새 비밀번호를 다시 입력해주세요.");
      valid = false;
    } else if (newPassword !== newPasswordConfirm) {
      setError("confirm", "비밀번호가 서로 일치하지 않습니다.");
      valid = false;
    } else {
      setError("confirm", "");
    }

    return valid;
  }, [newPassword, newPasswordConfirm, setError]);

  const verify = useCallback(async () => {
    clearErrors();

    if (!validateCurrent()) return false;

    try {
      setLoading(true);

      await checkCurrentPassword(currentPassword);

      setVerified(true);
      setModal(false);
      return true;
    } catch (err) {
      const message =
        err?.response?.data?.error?.message ||
        "현재 비밀번호가 일치하지 않습니다.";

      setError("current", message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [
    clearErrors,
    currentPassword,
    setError,
    setModal,
    setVerified,
    validateCurrent,
  ]);

  const update = useCallback(async () => {
    clearErrors();

    if (!stepVerified) {
      const ok = await verify();
      if (!ok) {
        setModal(true);
        return false;
      }
    }

    const validCurrent = validateCurrent();
    const validNew = validateNew();
    if (!validCurrent || !validNew) return false;

    try {
      setLoading(true);
      const res = await httpClient.post("/users/updatePwd", {
        currentPassword,
        newPassword,
        newPasswordConfirm,
      });

      if (!res?.success) {
        const message = res?.error?.message || "비밀번호 변경에 실패했습니다.";
        setError("current", message);
        alert(message);
        return false;
      }

      alert("비밀번호가 변경되었습니다.");
      resetAll();
      window.history.back();
      return true;
    } catch (err) {
      console.error(err);
      const message =
        err?.response?.data?.error?.message ||
        "비밀번호 변경 처리 중 오류가 발생했습니다.";
      setError("current", message);
      alert(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [
    clearErrors,
    currentPassword,
    newPassword,
    newPasswordConfirm,
    resetAll,
    setError,
    setModal,
    stepVerified,
    validateCurrent,
    validateNew,
    verify,
  ]);

  return {
    loading,
    verify,
    update,
    handleChange,
    setField,
  };
};
