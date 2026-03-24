import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, UserX } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { withdrawUser } from "@/api/userApi";

// 테마별 스타일
const dialogThemeStyles = {
  pop: {
    content: "bg-white border border-gray-200",
    title: "text-black",
    description: "text-gray-600",
    label: "text-black",
    radioBox: "border-gray-200 bg-white",
    radioBoxSelected: "border-pink-500 bg-pink-50",
    radioAccent: "accent-pink-500",
    textarea: "bg-white border-gray-200 text-black",
    warningBg: "bg-amber-50 border-amber-200",
    warningText: "text-amber-800",
    primaryBtn: "bg-pink-500 hover:bg-pink-600 text-white",
    secondaryBtn: "bg-white border-gray-200 text-black hover:bg-slate-50",
  },
  classic: {
    content: "bg-white border border-gray-200",
    title: "text-black",
    description: "text-gray-600",
    label: "text-black",
    radioBox: "border-gray-200 bg-white",
    radioBoxSelected: "border-[#635bff] bg-[#635bff]/5",
    radioAccent: "accent-[#635bff]",
    textarea: "bg-white border-gray-200 text-black",
    warningBg: "bg-amber-50 border-amber-200",
    warningText: "text-amber-800",
    primaryBtn: "bg-[#635bff] hover:bg-[#5851e8] text-white",
    secondaryBtn: "bg-white border-gray-200 text-black hover:bg-slate-50",
  },
  dark: {
    content: "bg-[#1E293B] border border-gray-700",
    title: "text-gray-100",
    description: "text-gray-400",
    label: "text-gray-200",
    radioBox: "border-gray-700 bg-[#0F172A]",
    radioBoxSelected: "border-[#635bff] bg-[#635bff]/10",
    radioAccent: "accent-[#635bff]",
    textarea: "bg-[#0F172A] border-gray-700 text-gray-100",
    warningBg: "bg-amber-900/30 border-amber-700",
    warningText: "text-amber-300",
    primaryBtn: "bg-red-600 hover:bg-red-700 text-white",
    secondaryBtn: "bg-[#0F172A] border-gray-700 text-gray-200 hover:bg-gray-800",
  },
  christmas: {
    content: "bg-white border border-gray-200",
    title: "text-black",
    description: "text-gray-600",
    label: "text-black",
    radioBox: "border-gray-200 bg-white",
    radioBoxSelected: "border-[#c41e3a] bg-[#c41e3a]/5",
    radioAccent: "accent-[#c41e3a]",
    textarea: "bg-white border-gray-200 text-black",
    warningBg: "bg-amber-50 border-amber-200",
    warningText: "text-amber-800",
    primaryBtn: "bg-[#c41e3a] hover:bg-red-700 text-white",
    secondaryBtn: "bg-white border-gray-200 text-black hover:bg-red-50",
  },
};

const REASONS = [
  { value: "NOT_USED", title: "서비스를 더 이상 사용하지 않음" },
  { value: "PRICE", title: "가격이 부담됨" },
  { value: "FUNCTION", title: "원하는 기능이 부족함" },
  { value: "OTHER", title: "기타 (상세내용 입력)" },
];

export function DeleteUserDialog({ open, onOpenChange }) {
  const { theme } = useThemeStore();
  const themeStyle = dialogThemeStyles[theme] || dialogThemeStyles.pop;

  const [deleteReason, setDeleteReason] = useState("");
  const [deleteDetail, setDeleteDetail] = useState("");
  const [loading, setLoading] = useState(false);

  const showDetail = deleteReason === "OTHER";

  const onSubmitDelete = async () => {
    if (!deleteReason) {
      alert("탈퇴 사유를 선택해 주세요.");
      return;
    }

    const ok = window.confirm("정말 탈퇴할까요? 탈퇴 후에는 복구할 수 없습니다.");
    if (!ok) return;

    setLoading(true);
    try {
      const res = await withdrawUser({ deleteReason, deleteDetail });
      if (res?.success) {
        alert("탈퇴가 완료되었습니다.");
        window.location.href = "/";
      } else {
        // 다른 형식으로 재시도
        const res2 = await withdrawUser({ reason: deleteReason, detail: deleteDetail });
        if (res2?.success) {
          alert("탈퇴가 완료되었습니다.");
          window.location.href = "/";
        } else {
          alert(res2?.error?.message || "탈퇴 처리에 실패했습니다.");
        }
      }
    } catch (err) {
      alert(err?.response?.data?.error?.message || "탈퇴 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      setDeleteReason("");
      setDeleteDetail("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={`max-w-md ${themeStyle.content}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${themeStyle.title}`}>
            <UserX className="w-5 h-5 text-red-500" />
            회원 탈퇴
          </DialogTitle>
          <DialogDescription className={themeStyle.description}>
            탈퇴 전 아래 내용을 확인해 주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* 경고 메시지 */}
          <div className={`${themeStyle.warningBg} border rounded-xl p-3`}>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className={`text-xs ${themeStyle.warningText} leading-relaxed`}>
                <p>탈퇴 시 계정 정보 및 서비스 이용 이력은 관련 법령에 따라 일정 기간 보관 후 안전하게 파기됩니다.</p>
                <p className="mt-1">탈퇴 후에는 동일 이메일로 재가입이 제한될 수 있습니다.</p>
              </div>
            </div>
          </div>

          <Separator className={theme === "dark" ? "bg-gray-700" : "bg-gray-200"} />

          {/* 탈퇴 사유 선택 */}
          <div className="space-y-2">
            <p className={`text-sm font-bold ${themeStyle.label}`}>탈퇴 사유</p>
            <div className="space-y-2">
              {REASONS.map((reason) => (
                <label
                  key={reason.value}
                  className={`
                    flex items-center gap-3 cursor-pointer
                    border rounded-xl px-4 py-3 transition-colors
                    ${deleteReason === reason.value ? themeStyle.radioBoxSelected : themeStyle.radioBox}
                  `}
                >
                  <input
                    type="radio"
                    name="deleteReason"
                    value={reason.value}
                    checked={deleteReason === reason.value}
                    onChange={() => {
                      setDeleteReason(reason.value);
                      if (reason.value !== "OTHER") setDeleteDetail("");
                    }}
                    className={`h-4 w-4 ${themeStyle.radioAccent} cursor-pointer`}
                  />
                  <span className={`text-sm font-medium ${themeStyle.label}`}>{reason.title}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 상세 사유 입력 */}
          {showDetail && (
            <div className="space-y-2">
              <p className={`text-sm font-bold ${themeStyle.label}`}>상세 사유 (선택)</p>
              <textarea
                value={deleteDetail}
                onChange={(e) => setDeleteDetail(e.target.value)}
                className={`
                  w-full border rounded-xl p-3 text-sm h-24 resize-none
                  focus:outline-none focus:ring-2 focus:ring-offset-0
                  ${themeStyle.textarea}
                `}
                placeholder="기타 사유 또는 추가 의견이 있다면 입력해 주세요."
              />
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className={`flex-1 ${themeStyle.secondaryBtn} rounded-xl`}
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={onSubmitDelete}
              disabled={loading || !deleteReason}
              className={`flex-1 ${themeStyle.primaryBtn} rounded-xl`}
            >
              {loading ? "처리 중..." : "탈퇴하기"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
