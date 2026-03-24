import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addUserBlacklist } from "@/api/adminUserApi";
import { useAddBlacklistStore } from "@/store/admin/addBlacklistStore";

export const useAddBlacklistLogic = () => {
  const navigate = useNavigate();

  const {
    userId,
    reasonType,
    reasonDetail,
    submitting,
    error,
    setUserId,
    setReasonType,
    setReasonDetail,
    setSubmitting,
    setError,
    reset,
  } = useAddBlacklistStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const user = params.get("user");
    if (user) {
      setUserId(user);
    }
  }, [setUserId]);

  const handleChangeUserId = (value) => {
    setUserId(value);
  };

  const handleChangeReasonType = (value) => {
    setReasonType(value);
  };

  const handleChangeReasonDetail = (value) => {
    setReasonDetail(value);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    if (!userId) {
      alert("회원 아이디를 입력해주세요.");
      return;
    }
    if (!reasonType) {
      alert("사유 구분을 선택해주세요.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const body = await addUserBlacklist({
        userId,
        reasonType,
        reasonDetail,
      });

      if (!body.success) {
        throw new Error(body.error?.message || "블랙리스트 등록에 실패했습니다.");
      }

      alert("블랙리스트에 등록되었습니다.");
      navigate(`/admin/users/${encodeURIComponent(userId)}`);
      reset();
    } catch (e) {
      setError(e.message);
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    navigate(-1);
  };

  return {
    userId,
    reasonType,
    reasonDetail,
    submitting,
    error,
    handleChangeUserId,
    handleChangeReasonType,
    handleChangeReasonDetail,
    handleSubmit,
    handleCancel,
  };
};
