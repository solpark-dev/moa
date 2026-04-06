import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSignupStore } from "@/store/user/addUserStore";
import { uploadProfileImage } from "@/api/userApi";

import {
  signup,
  checkCommon,
  fetchCurrentUser,
} from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";

const BAD_WORDS = ["fuck", "shit", "bitch", "asshole", "ssibal", "jiral"];

const REGEX = {
  EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  NICKNAME: /^[A-Za-z0-9\uAC00-\uD7A3]{2,10}$/,
  PHONE: /^010\d{8}$/,
  PASSWORD:
    /^(?=.*[A-Za-z])(?:(?=.*\d)|(?=.*[^A-Za-z0-9])).{8,20}$/,
};

export const useSignup = ({ mode = "normal", socialInfo } = {}) => {
  const navigate = useNavigate();
  const { form, errors, setField, setErrorMessage, reset } = useSignupStore();
  const isSocial = mode === "social";
  const { setUser } = useAuthStore();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordCheckRef = useRef(null);
  const nicknameRef = useRef(null);
  const phoneRef = useRef(null);

  useEffect(() => {
    return () => {
      if (form.previewUrl) URL.revokeObjectURL(form.previewUrl);
      reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setField(name, type === "checkbox" ? checked : value);
  };

  const handleBlur = () => {};

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setField("profileImage", file);
      setField("previewUrl", url);
    }
  };

  useEffect(() => {
    if (isSocial) return;

    const checkEmail = async () => {
      if (!form.email) return setErrorMessage("email", "", false);

      if (!REGEX.EMAIL.test(form.email)) {
        return setErrorMessage(
          "email",
          "이메일 형식이 올바르지 않습니다.",
          true
        );
      }

      setErrorMessage("email", "확인 중..", false);

      try {
        const res = await checkCommon({ type: "email", value: form.email });
        const available = res.data?.available ?? res.data?.data?.available;
        setErrorMessage(
          "email",
          available ? "사용 가능한 이메일입니다." : "이미 사용 중입니다.",
          !available
        );
      } catch {
        setErrorMessage("email", "중복 확인 실패 (서버 오류)", false);
      }
    };

    const t = setTimeout(checkEmail, 400);
    return () => clearTimeout(t);
  }, [form.email]);

  useEffect(() => {
    if (isSocial) return;

    if (!form.password) return setErrorMessage("password", "", false);

    if (!REGEX.PASSWORD.test(form.password)) {
      setErrorMessage(
        "password",
        "영문+숫자+특수문자 포함 8~20자로 입력해주세요.",
        true
      );
    } else {
      setErrorMessage("password", "사용 가능한 비밀번호입니다.", false);
    }
  }, [form.password]);

  useEffect(() => {
    if (isSocial) return;

    if (!form.passwordCheck) return setErrorMessage("passwordCheck", "", false);

    if (form.password !== form.passwordCheck) {
      setErrorMessage("passwordCheck", "비밀번호가 일치하지 않습니다.", true);
    } else {
      setErrorMessage("passwordCheck", "비밀번호가 일치합니다.", false);
    }
  }, [form.passwordCheck, form.password]);

  useEffect(() => {
    const checkNickname = async () => {
      if (!form.nickname) return setErrorMessage("nickname", "", false);

      if (!REGEX.NICKNAME.test(form.nickname)) {
        return setErrorMessage(
          "nickname",
          "닉네임은 2~10자의 한글/영문/숫자만 가능합니다.",
          true
        );
      }

      if (BAD_WORDS.some((bad) => form.nickname.toLowerCase().includes(bad))) {
        return setErrorMessage(
          "nickname",
          "부적절한 단어가 포함되어 있습니다.",
          true
        );
      }

      setErrorMessage("nickname", "확인 중..", false);

      try {
        const res = await checkCommon({
          type: "nickname",
          value: form.nickname,
        });
        const available = res.data?.available ?? res.data?.data?.available;
        setErrorMessage(
          "nickname",
          available ? "사용 가능한 닉네임입니다." : "이미 사용 중입니다.",
          !available
        );
      } catch {
        setErrorMessage("nickname", "중복 확인 실패 (서버 오류)", false);
      }
    };

    const t = setTimeout(checkNickname, 400);
    return () => clearTimeout(t);
  }, [form.nickname]);

  useEffect(() => {
    if (!form.phone) return setErrorMessage("phone", "", false);

    const digits = form.phone.replace(/-/g, "");
    if (!REGEX.PHONE.test(digits)) {
      setErrorMessage("phone", "올바른 휴대폰 번호 형식이 아닙니다.", true);
    } else {
      setErrorMessage("phone", "", false);
    }
  }, [form.phone]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSocial) {
      if (!form.email || errors.email.isError)
        return alert("이메일을 확인해주세요.");

      if (!form.password || errors.password.isError)
        return alert("비밀번호를 확인해주세요.");

      if (!form.passwordCheck || errors.passwordCheck.isError)
        return alert("비밀번호 일치를 확인해주세요.");
    }

    if (!form.nickname || errors.nickname.isError)
      return alert("닉네임을 확인해주세요.");

    if (form.phone && errors.phone.isError)
      return alert(errors.phone.message || "휴대폰 번호를 확인해주세요.");

    const payload = isSocial
      ? {
          provider: socialInfo.provider,
          providerUserId: socialInfo.providerUserId,
          email: socialInfo.email || form.email || null,
          nickname: form.nickname,
          phone: form.phone || undefined,
          agreeMarketing: form.agreeMarketing,
        }
      : {
          userId: form.email,
          password: form.password,
          passwordConfirm: form.passwordCheck,
          nickname: form.nickname,
          phone: form.phone || undefined,
          agreeMarketing: form.agreeMarketing,
        };

    try {
      const res = await signup(payload);
      if (!res?.success) {
        throw new Error(res?.error?.message || "회원가입 실패");
      }

      const { signupType } = res.data || {};
      if (signupType === "SOCIAL") {
        if (form.profileImage) {
          const formData = new FormData();
          formData.append("file", form.profileImage);

          try {
            await uploadProfileImage(formData);
          } catch {
            alert(
              "프로필 이미지는 나중에 마이페이지에서 다시 변경할 수 있습니다."
            );
          }
        }

        const meRes = await fetchCurrentUser();
        if (meRes?.success && meRes.data) {
          const user = meRes.data;

          if (user.profileImage) {
            user.profileImage = `${user.profileImage}?v=${Date.now()}`;
          }

          setUser(user);
        }

        navigate("/", { replace: true });
        return;
      }

      if (signupType === "NORMAL") {
        alert(
          "인증 메일이 발송되었습니다.\n이메일을 확인하여 인증을 완료해 주세요."
        );
        navigate("/email-verified?pending=true", { replace: true });
        return;
      }

      throw new Error("알 수 없는 회원가입 타입입니다.");
    } catch (err) {
      alert(err?.message || err?.response?.data?.message || "회원가입 실패");
    }
  };

  return {
    form,
    errors,
    refs: {
      emailRef,
      passwordRef,
      passwordCheckRef,
      nicknameRef,
      phoneRef,
    },
    handleChange,
    handleBlur,
    handleImageChange,
    handleSubmit,
  };
};
