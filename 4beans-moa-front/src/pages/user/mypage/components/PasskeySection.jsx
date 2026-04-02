import { useEffect, useState } from "react";
import { KeyRound, Plus, Trash2 } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { usePasskey } from "@/hooks/auth/usePasskey";

/**
 * PasskeySection – 마이페이지 보안 설정 내 패스키 관리 컴포넌트.
 *
 * - 등록된 패스키 목록 표시
 * - 새 패스키 등록
 * - 패스키 삭제
 */
export function PasskeySection() {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  const { loading, error, credentials, register, loadCredentials, deleteCredential } =
    usePasskey();

  const [registerError, setRegisterError] = useState(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  useEffect(() => {
    loadCredentials();
  }, [loadCredentials]);

  const handleRegister = async () => {
    setRegisterError(null);
    setRegisterSuccess(false);
    const result = await register();
    if (result.success) {
      setRegisterSuccess(true);
      loadCredentials();
      setTimeout(() => setRegisterSuccess(false), 3000);
    } else if (!result.cancelled) {
      setRegisterError(result.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("이 패스키를 삭제하시겠습니까?")) return;
    await deleteCredential(id);
  };

  // ── 테마 스타일 ──────────────────────────────────────────────
  const box    = isDark
    ? "border border-gray-700 bg-[#0F172A] rounded-2xl p-4"
    : "border border-gray-200 bg-white rounded-2xl p-4";
  const label  = isDark ? "text-sm text-gray-400 font-bold" : "text-sm text-slate-600 font-bold";
  const value  = isDark ? "text-sm font-black text-gray-200" : "text-sm font-black text-black";
  const muted  = isDark ? "text-xs text-gray-500" : "text-xs text-gray-400";
  const btn    = isDark
    ? "px-3 py-1.5 rounded-xl border border-gray-700 bg-[#0F172A] text-gray-200 font-black text-xs active:translate-y-[1px]"
    : "px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-black font-black text-xs active:translate-y-[1px]";
  const btnDanger = isDark
    ? "px-3 py-1.5 rounded-xl border border-gray-700 bg-[#0F172A] text-red-400 font-black text-xs active:translate-y-[1px]"
    : "px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-red-600 font-black text-xs active:translate-y-[1px]";

  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString("ko-KR", { year: "numeric", month: "short", day: "numeric" }) : "-";

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4" style={{ color: "var(--theme-text-muted)" }} />
          <p className={isDark ? "text-sm font-bold text-gray-200" : "text-sm font-bold text-black"}>
            패스키 (Passkey)
          </p>
        </div>
        <button
          type="button"
          onClick={handleRegister}
          disabled={loading}
          className={`${btn} flex items-center gap-1`}
        >
          <Plus className="w-3 h-3" />
          {loading ? "등록 중..." : "패스키 추가"}
        </button>
      </div>

      {registerSuccess && (
        <p className="text-xs text-green-500 mb-2">패스키가 등록되었습니다.</p>
      )}
      {(registerError || error) && (
        <p className="text-xs text-red-500 mb-2">{registerError || error}</p>
      )}

      {credentials.length === 0 ? (
        <div className={`${box} text-center`}>
          <p className={muted}>등록된 패스키가 없습니다.</p>
          <p className={`${muted} mt-1`}>
            패스키를 등록하면 비밀번호 없이 지문·얼굴 인식으로 로그인할 수 있습니다.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {credentials.map((cred) => (
            <div key={cred.id} className={`${box} flex items-center justify-between`}>
              <div className="flex flex-col gap-0.5">
                <span className={value}>{cred.label || "패스키"}</span>
                <span className={muted}>
                  등록일: {formatDate(cred.createdAt)}
                  {cred.lastUsedAt && ` · 최근 사용: ${formatDate(cred.lastUsedAt)}`}
                </span>
              </div>
              <button
                type="button"
                className={btnDanger}
                onClick={() => handleDelete(cred.id)}
                disabled={loading}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
