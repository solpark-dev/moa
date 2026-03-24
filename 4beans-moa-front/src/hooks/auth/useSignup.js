import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "@/api/httpClient";
import { useSignupStore } from "@/store/user/addUserStore";
import { uploadProfileImage } from "@/api/userApi";

import {
  signup,
  checkCommon,
  checkPhone,
  fetchCurrentUser,
} from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";

const BAD_WORDS = ["fuck", "shit", "bitch", "asshole", "ssibal", "jiral"];

const REGEX = {
  EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  NICKNAME: /^[A-Za-z0-9\uAC00-\uD7A3]{2,10}$/,
  PASSWORD:
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,20}$/,
};

export const useSignup = ({ mode = "normal", socialInfo } = {}) => {
  const navigate = useNavigate();
  const { form, errors, setField, setErrorMessage, reset } = useSignupStore();
  const isSocial = mode === "social";
  const { setTokens, setUser, clearAuth } = useAuthStore();
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

  const handlePassAuth = async () => {
    try {
      const startUrl = "/signup/pass/start";
      const verifyUrl = "/signup/pass/verify";

      const start = await httpClient.get(startUrl, { skipAuth: true });

      if (!start?.success) {
        throw new Error(
          start?.error?.message || "본인인증 시작에 실패했습니다."
        );
      }

      const { impCode, merchantUid } = start.data;

      if (!window.IMP) {
        alert("본인인증 모듈 로드에 실패했습니다.");
        return;
      }

      window.IMP.init(impCode);

      window.IMP.certification({ merchant_uid: merchantUid }, async (rsp) => {
        if (!rsp.success) return;

        try {
          const verify = await httpClient.post(
            verifyUrl,
            { imp_uid: rsp.imp_uid },
            { skipAuth: true }
          );

          if (!verify?.success) {
            throw new Error(
              verify?.error?.message || "본인인증에 실패했습니다."
            );
          }

          const { phone, ci } = verify.data;
          const phoneCheck = await checkPhone(phone);
          const available =
            phoneCheck?.data?.available ?? phoneCheck?.data?.data?.available;
          if (!phoneCheck?.success || available === false) {
            if (
              isSocial &&
              socialInfo?.provider &&
              socialInfo?.providerUserId
            ) {
              const ok = window.confirm(
                "이미 가입된 휴대폰 번호입니다.\n해당 계정에 소셜 로그인을 연동하시겠습니까?"
              );

              if (ok) {
                navigate("/oauth/phone-connect", {
                  replace: true,
                  state: {
                    provider: socialInfo.provider,
                    providerUserId: socialInfo.providerUserId,
                    phone,
                    ci,
                  },
                });
              }

              return;
            }

            throw new Error("이미 가입된 휴대폰 번호입니다.");
          }

          setField("phone", phone);
          sessionStorage.setItem("PASS_CI", ci);
          setErrorMessage("phone", "본인인증 성공!", false);
        } catch (err) {
          sessionStorage.removeItem("PASS_CI");
          setField("phone", "");

          const message =
            err?.message ||
            err?.response?.data?.error?.message ||
            err?.response?.data?.message ||
            "본인인증에 실패했습니다.";

          setErrorMessage("phone", message, true);
          alert(message);
        }
      });
    } catch (err) {
      alert(err?.message || "본인인증 처리 중 오류가 발생했습니다.");
    }
  };

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

    if (
      isSocial &&
      errors.nickname.isError &&
      errors.phone.isError &&
      socialInfo?.provider &&
      socialInfo?.providerUserId
    ) {
      const ok = window.confirm(
        "이미 가입된 계정이 존재합니다.\n해당 계정과 소셜 로그인을 연동하시겠습니까?"
      );

      if (ok) {
        navigate("/oauth/phone-connect", {
          replace: true,
          state: {
            provider: socialInfo.provider,
            providerUserId: socialInfo.providerUserId,
          },
        });
      }

      return;
    }
    if (!form.nickname || errors.nickname.isError)
      return alert("닉네임을 확인해주세요.");

    if (!form.phone) return alert("본인인증을 진행해주세요.");
    if (errors.phone.isError)
      return alert(errors.phone.message || "휴대폰 번호를 확인해주세요.");

    const ci = sessionStorage.getItem("PASS_CI");
    if (!ci) return alert("본인인증 정보를 찾을 수 없습니다.");

    const socialEmail = socialInfo?.email || form.email;
    if (isSocial && !socialEmail) {
      return alert("소셜 이메일 정보를 확인할 수 없습니다.");
    }

    const payload = isSocial
      ? {
          provider: socialInfo.provider,
          providerUserId: socialInfo.providerUserId,
          userId: socialInfo.email,
          nickname: form.nickname,
          phone: form.phone,
          agreeMarketing: form.agreeMarketing,
          ci,
        }
      : {
          userId: form.email,
          password: form.password,
          passwordConfirm: form.passwordCheck,
          nickname: form.nickname,
          phone: form.phone,
          agreeMarketing: form.agreeMarketing,
          ci,
        };

    try {
      const res = await signup(payload);
      if (!res?.success) {
        throw new Error(res?.error?.message || "회원가입 실패");
      }

      const { signupType } = res.data || {};
      if (signupType === "SOCIAL") {
        const { accessToken, refreshToken, accessTokenExpiresIn, expiresIn } =
          res.data;

        setTokens({
          accessToken,
          refreshToken,
          accessTokenExpiresIn: accessTokenExpiresIn ?? expiresIn,
        });

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
        alert("인증 메일이 발송되었습니다. 이메일을 확인해주세요.");
        navigate("/", { replace: true });
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
    handlePassAuth,
    handleSubmit,
  };
};
