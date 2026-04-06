import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { withdrawUser } from "@/api/userApi";

export default function useDeleteUser() {
  const navigate = useNavigate();

  const [deleteReason, setDeleteReason] = useState("");
  const [deleteDetail, setDeleteDetail] = useState("");

  const showDetail = useMemo(() => deleteReason === "OTHER", [deleteReason]);

  const goMypage = useCallback(() => {
    navigate("/mypage");
  }, [navigate]);

  const onSelectReason = useCallback((value) => {
    setDeleteReason(value);
    if (value !== "OTHER") {
      setDeleteDetail("");
    }
  }, []);

  const onChangeDetail = useCallback((value) => {
    setDeleteDetail(value);
  }, []);

  const onSubmitDelete = useCallback(async () => {
    if (!deleteReason) {
      alert("탈퇴 사유를 선택해 주세요.");
      return;
    }

    const ok = window.confirm("정말 탈퇴할까요? 탈퇴 후에는 복구할 수 없습니다.");
    if (!ok) return;

    const res = await withdrawUser({ deleteType: deleteReason, deleteDetail });
    if (!res?.success) {
      throw new Error(res?.error?.message || "탈퇴 처리에 실패했습니다.");
    }

    alert("탈퇴가 완료되었습니다.");
    window.location.href = "/";
  }, [deleteReason, deleteDetail]);

  return {
    deleteReason,
    deleteDetail,
    showDetail,
    goMypage,
    onSelectReason,
    onChangeDetail,
    onSubmitDelete,
  };
}
