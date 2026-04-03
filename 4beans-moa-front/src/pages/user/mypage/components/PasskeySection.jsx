import { useEffect, useState } from "react";
import { KeyRound, Plus, Trash2 } from "lucide-react";
import { toast } from "@/utils/toast";
import { usePasskey } from "@/hooks/auth/usePasskey";

export function PasskeySection() {
  const { loading, error, credentials, register, loadCredentials, deleteCredential } =
    usePasskey();

  const [registerError, setRegisterError] = useState(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

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
    if (pendingDeleteId !== id) {
      setPendingDeleteId(id);
      toast.warning("한 번 더 누르면 패스키가 삭제됩니다.");
      return;
    }
    setPendingDeleteId(null);
    await deleteCredential(id);
  };

  const boxStyle = {
    border: "1px solid var(--glass-border)",
    background: "var(--glass-bg-overlay)",
    borderRadius: "1rem",
    padding: "1rem",
  };

  const btnStyle = {
    padding: "6px 12px",
    borderRadius: "0.75rem",
    border: "1px solid var(--glass-border)",
    background: "var(--glass-bg-overlay)",
    color: "var(--theme-text)",
    fontWeight: 900,
    fontSize: "0.75rem",
    cursor: "pointer",
  };

  const btnDangerStyle = { ...btnStyle, color: "#ef4444" };

  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString("ko-KR", { year: "numeric", month: "short", day: "numeric" }) : "-";

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4" style={{ color: "var(--theme-text-muted)" }} />
          <p className="text-sm font-bold" style={{ color: "var(--theme-text)" }}>
            패스키 (Passkey)
          </p>
        </div>
        <button
          type="button"
          onClick={handleRegister}
          disabled={loading}
          style={{ ...btnStyle, display: "flex", alignItems: "center", gap: "4px" }}
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
        <div className="text-center" style={boxStyle}>
          <p className="text-xs" style={{ color: "var(--theme-text-muted)" }}>등록된 패스키가 없습니다.</p>
          <p className="text-xs mt-1" style={{ color: "var(--theme-text-muted)" }}>
            패스키를 등록하면 비밀번호 없이 지문·얼굴 인식으로 로그인할 수 있습니다.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {credentials.map((cred) => (
            <div key={cred.id} className="flex items-center justify-between" style={boxStyle}>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-black" style={{ color: "var(--theme-text)" }}>{cred.label || "패스키"}</span>
                <span className="text-xs" style={{ color: "var(--theme-text-muted)" }}>
                  등록일: {formatDate(cred.createdAt)}
                  {cred.lastUsedAt && ` · 최근 사용: ${formatDate(cred.lastUsedAt)}`}
                </span>
              </div>
              <button
                type="button"
                style={pendingDeleteId === cred.id ? { ...btnDangerStyle, border: "1px solid #ef4444" } : btnDangerStyle}
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
