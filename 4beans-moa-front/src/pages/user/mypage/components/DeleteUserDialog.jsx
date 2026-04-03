import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, UserX } from "lucide-react";
import { toast } from "@/utils/toast";
import { withdrawUser } from "@/api/userApi";
import { useAuthStore } from "@/store/authStore";

const REASONS = [
  { value: "NOT_USED", title: "서비스를 더 이상 사용하지 않음" },
  { value: "PRICE", title: "가격이 부담됨" },
  { value: "FUNCTION", title: "원하는 기능이 부족함" },
  { value: "OTHER", title: "기타 (상세내용 입력)" },
];

export function DeleteUserDialog({ open, onOpenChange }) {
  const { logout } = useAuthStore();
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteDetail, setDeleteDetail] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      setDeleteReason("");
      setDeleteDetail("");
      setConfirmed(false);
    }
    onOpenChange(isOpen);
  };

  const onSubmitDelete = async () => {
    if (!deleteReason) {
      toast.warning("탈퇴 사유를 선택해 주세요.");
      return;
    }
    if (!confirmed) {
      setConfirmed(true);
      return;
    }

    setLoading(true);
    try {
      const res = await withdrawUser({ deleteReason, deleteDetail });
      const success = res?.success || (await withdrawUser({ reason: deleteReason, detail: deleteDetail }))?.success;
      if (success) {
        toast.success("탈퇴가 완료되었습니다.");
        logout?.();
        window.location.href = "/";
      } else {
        toast.error(res?.error?.message || "탈퇴 처리에 실패했습니다.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.error?.message || "탈퇴 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const outlineBtnStyle = {
    background: "var(--glass-bg-overlay)",
    border: "1px solid var(--glass-border)",
    color: "var(--theme-text)",
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-md rounded-2xl"
        style={{
          background: "var(--glass-bg-card)",
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--shadow-glass)",
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" style={{ color: "var(--theme-text)" }}>
            <UserX className="w-5 h-5 text-red-500" />
            회원 탈퇴
          </DialogTitle>
          <DialogDescription style={{ color: "var(--theme-text-muted)" }}>
            탈퇴 전 아래 내용을 확인해 주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* 경고 메시지 */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-800 leading-relaxed">
                <p>탈퇴 시 계정 정보 및 서비스 이용 이력은 관련 법령에 따라 일정 기간 보관 후 안전하게 파기됩니다.</p>
                <p className="mt-1">탈퇴 후에는 동일 이메일로 재가입이 제한될 수 있습니다.</p>
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--glass-border)" }} />

          {/* 탈퇴 사유 선택 */}
          <div className="space-y-2">
            <p className="text-sm font-bold" style={{ color: "var(--theme-text)" }}>탈퇴 사유</p>
            <div className="space-y-2">
              {REASONS.map((reason) => (
                <label
                  key={reason.value}
                  className="flex items-center gap-3 cursor-pointer border rounded-xl px-4 py-3 transition-colors"
                  style={
                    deleteReason === reason.value
                      ? { borderColor: "var(--theme-primary)", background: "var(--glass-bg-overlay)" }
                      : { borderColor: "var(--glass-border)", background: "var(--glass-bg-overlay)" }
                  }
                >
                  <input
                    type="radio"
                    name="deleteReason"
                    value={reason.value}
                    checked={deleteReason === reason.value}
                    onChange={() => {
                      setDeleteReason(reason.value);
                      if (reason.value !== "OTHER") setDeleteDetail("");
                      setConfirmed(false);
                    }}
                    className="h-4 w-4 cursor-pointer"
                    style={{ accentColor: "var(--theme-primary)" }}
                  />
                  <span className="text-sm font-medium" style={{ color: "var(--theme-text)" }}>
                    {reason.title}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 상세 사유 입력 */}
          {deleteReason === "OTHER" && (
            <div className="space-y-2">
              <p className="text-sm font-bold" style={{ color: "var(--theme-text)" }}>상세 사유 (선택)</p>
              <textarea
                value={deleteDetail}
                onChange={(e) => setDeleteDetail(e.target.value)}
                className="w-full rounded-xl p-3 text-sm h-24 resize-none focus:outline-none"
                style={{
                  background: "var(--glass-bg-overlay)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--theme-text)",
                }}
                placeholder="기타 사유 또는 추가 의견이 있다면 입력해 주세요."
              />
            </div>
          )}

          {/* 최종 확인 안내 */}
          {confirmed && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-xs text-red-700 font-medium">한 번 더 버튼을 누르면 즉시 탈퇴 처리됩니다.</p>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="flex-1 rounded-xl"
              style={outlineBtnStyle}
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={onSubmitDelete}
              disabled={loading || !deleteReason}
              className="flex-1 rounded-xl text-white"
              style={{ background: confirmed ? "#ef4444" : "var(--theme-primary)" }}
            >
              {loading ? "처리 중..." : confirmed ? "탈퇴 확인" : "탈퇴하기"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
