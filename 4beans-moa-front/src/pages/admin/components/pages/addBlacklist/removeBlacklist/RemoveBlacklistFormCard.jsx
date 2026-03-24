import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";

/**
 * 블랙리스트 해제 폼 카드
 * CSS 변수 기반 테마 적용
 */
export default function RemoveBlacklistFormCard({
  userId,
  reason,
  submitting,
  error,
  onChangeReason,
  onSubmit,
  onCancel,
}) {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 -mt-10">
      <div className="mt-10 flex justify-center">
        <Card className="w-full max-w-3xl shadow-[var(--theme-shadow)] border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] rounded-2xl">
          <CardHeader className="border-b border-[var(--theme-border-light)] bg-[var(--theme-primary-light)] rounded-t-2xl">
            <CardTitle className="text-lg font-semibold text-[var(--theme-text)]">
              블랙리스트 해제 정보 확인
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 md:p-8 space-y-6">
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
                <AlertTriangle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--theme-text)]">
                회원 아이디(이메일)
              </label>
              <Input
                value={userId}
                readOnly
                className="h-10 bg-[var(--theme-primary-light)] border border-[var(--theme-border-light)] text-[var(--theme-text-muted)]"
              />
              <p className="text-[11px] text-[var(--theme-text-muted)]">
                회원 상세에서 이동한 계정만 해제할 수 있습니다.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--theme-text)]">
                해제 사유
                <span className="ml-1 text-xs text-[var(--theme-text-muted)]">
                  (필수, 내부 참고용)
                </span>
              </label>
              <Textarea
                value={reason}
                onChange={(e) => onChangeReason(e.target.value)}
                rows={4}
                className="resize-none bg-[var(--theme-bg-card)] border border-[var(--theme-border-light)] text-[var(--theme-text)] focus-visible:ring-[var(--theme-primary)] focus-visible:border-[var(--theme-primary)]"
                placeholder="해제 사유를 입력하세요. (예: 오인 신고, 본인 확인 완료 등)"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-4 border-t border-[var(--theme-border-light)]">
              <Button
                type="button"
                variant="outline"
                className="px-4 h-10 rounded-lg border-[var(--theme-border-light)] text-[var(--theme-text)] bg-[var(--theme-bg-card)]"
                onClick={onCancel}
                disabled={submitting}
              >
                취소
              </Button>
              <Button
                type="button"
                className="px-5 h-10 rounded-lg bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white font-semibold"
                onClick={onSubmit}
                disabled={submitting}
              >
                {submitting ? "해제 처리 중..." : "블랙리스트 해제"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
