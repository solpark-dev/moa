import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateUserStore } from "@/store/user/updateUserStore";
import { useAuthStore } from "@/store/authStore";
import { checkCommon, startPassAuth, verifyPassAuth } from "@/api/authApi";
import { getUser, updateUser, uploadProfileImage } from "@/api/userApi";

const BAD_WORDS = [
  "fuck",
  "shit",
  "bitch",
  "개새",
  "씨발",
  "병신",
  "지랄",
  "좆",
  "썅",
];

export default function useUpdateUser() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const blobUrlRef = useRef(null);

  const [initialNickname, setInitialNickname] = useState("");
  const [nickMsg, setNickMsg] = useState({ text: "", isError: false });

  const {
    email,
    nickname,
    phone,
    previewImage,
    agreeMarketing,
    profileImage,
    setField,
    setUserData,
  } = useUpdateUserStore();

  const displayImage = useMemo(() => {
    if (previewImage) {
      if (previewImage.startsWith("blob:") || previewImage.startsWith("http"))
        return previewImage;
      return `${window.location.origin}${previewImage}`;
    }
    return "https://static.thenounproject.com/png/363633-200.png";
  }, [previewImage]);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await getUser();
        if (res?.success && res?.data) {
          setUserData(res.data);
          setInitialNickname(res.data.nickname || "");
          return;
        }
        alert("로그인이 필요합니다.");
        navigate("/login", { replace: true });
      } catch {
        alert("로그인이 필요합니다.");
        navigate("/login", { replace: true });
      }
    };
    run();
  }, [navigate, setUserData]);

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);

  const goMypage = () => {
    navigate("/mypage");
  };

  const openFilePicker = () => {
    fileRef.current?.click();
  };

  const onImageSelect = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }

    const url = URL.createObjectURL(file);
    blobUrlRef.current = url;
    setField("previewImage", url);
  };

  const onNicknameChange = (value) => {
    setField("nickname", value);
    setNickMsg({ text: "", isError: false });
  };

  const onAgreeMarketingChange = (checked) => {
    setField("agreeMarketing", checked);
  };

  const validateNickname = async (currentNickname) => {
    const v = (currentNickname ?? "").trim();

    if (!v) {
      setNickMsg({ text: "닉네임을 입력해주세요.", isError: true });
      return false;
    }

    const reg = /^[A-Za-z0-9가-힣]{2,10}$/;
    if (!reg.test(v)) {
      setNickMsg({
        text: "닉네임은 2~10자, 한글/영문/숫자만 가능합니다.",
        isError: true,
      });
      return false;
    }

    const lower = v.toLowerCase();
    for (const bad of BAD_WORDS) {
      if (lower.includes(bad)) {
        setNickMsg({
          text: "부적절한 단어가 포함되어 있습니다.",
          isError: true,
        });
        return false;
      }
    }

    if (v !== initialNickname) {
      try {
        const res = await checkCommon({ type: "nickname", value: v });
        const available = !!res?.data?.available;
        if (!available) {
          setNickMsg({ text: "이미 사용 중인 닉네임입니다.", isError: true });
          return false;
        }
      } catch {
        setNickMsg({ text: "이미 사용 중인 닉네임입니다.", isError: true });
        return false;
      }
    }

    setNickMsg({ text: "사용 가능한 닉네임입니다.", isError: false });
    return true;
  };

  const onNicknameBlur = async () => {
    await validateNickname(nickname);
  };

  const onPassVerify = async () => {
    try {
      const start = await startPassAuth();
      const { impCode, merchantUid } = start?.data || {};

      if (!window.IMP) throw new Error("본인인증 모듈이 로드되지 않았습니다.");

      const verified = await new Promise((resolve, reject) => {
        window.IMP.init(impCode);
        window.IMP.certification(
          { merchant_uid: merchantUid, popup: true, pg: "inicis_unified" },
          async function (rsp) {
            if (!rsp?.success) {
              reject(new Error("본인인증 실패"));
              return;
            }
            try {
              const verify = await verifyPassAuth({ imp_uid: rsp.imp_uid });
              resolve(verify.data);
            } catch (err) {
              reject(err);
            }
          }
        );
      });

      setField("phone", verified.phone);
      alert("본인인증 성공. 휴대폰 번호 변경됨.");
    } catch (err) {
      alert(err?.message || "본인인증 실패");
    }
  };

  const onSave = async () => {
    try {
      const ok = await validateNickname(nickname);
      if (!ok) return;

      const file = fileRef.current?.files?.[0] || null;

      let nextProfileUrl = profileImage || null;

      if (file) {
        const form = new FormData();
        form.append("file", file);

        const up = await uploadProfileImage(form);
        if (!up?.success)
          throw new Error(up?.error?.message || "프로필 업로드 실패");
        nextProfileUrl = up.data;
      }

      const res = await updateUser({
        nickname,
        phone,
        agreeMarketing,
        profileImage: nextProfileUrl,
      });

      if (!res?.success)
        throw new Error(res?.error?.message || "회원정보 수정 실패");

      const updatedUser = res.data;

      useAuthStore.getState().setUser(updatedUser);
      setUserData(updatedUser);

      alert("회원정보가 수정되었습니다.");
      navigate("/mypage", { replace: true });
    } catch (err) {
      alert(err?.message || "회원정보 수정 실패");
    }
  };

  return {
    fileRef,
    email,
    nickname,
    phone,
    agreeMarketing,
    displayImage,
    nickMsg,
    openFilePicker,
    onImageSelect,
    onNicknameChange,
    onNicknameBlur,
    onAgreeMarketingChange,
    onPassVerify,
    onSave,
    goMypage,
  };
}
