import { Link2, Shield, Smartphone } from "lucide-react";
import { formatPhoneNumber } from "@/utils/format";
import { PasskeySection } from "./PasskeySection";

const ROW = "flex items-center justify-between py-3";

const divider = { borderTop: "1px solid var(--glass-border)" };

export function ConnectionStatusCard({ user, loginProvider, googleConn, kakaoConn, otp, actions }) {
  const phone = user?.phone || "-";

  const toggleGoogle = () => actions?.handleGoogleClick?.();
  const toggleKakao  = () => actions?.handleKakaoClick?.();

  const openOtp = () => {
    if (!otp?.enabled) actions?.otp?.openSetup?.();
    else actions?.otp?.prepareDisable?.();
    actions?.handleOtpModalChange?.(true);
  };

  const btnBase = {
    padding: "6px 16px",
    borderRadius: "1rem",
    border: "1px solid var(--glass-border)",
    background: "var(--glass-bg-overlay)",
    color: "var(--theme-text)",
    fontWeight: 700,
    fontSize: "0.875rem",
    cursor: "pointer",
  };

  const btnDanger = { ...btnBase, color: "#ef4444" };

  return (
    <div className="px-5 pb-5">
      {/* 로그인 정보 */}
      <div className="flex items-center gap-2 mb-3">
        <Smartphone className="w-4 h-4" style={{ color: "var(--theme-primary)" }} />
        <p className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--theme-text-muted)" }}>
          로그인 정보
        </p>
      </div>

      <div style={divider}>
        <div className={ROW}>
          <p className="text-[13px] font-medium" style={{ color: "var(--theme-text-muted)" }}>전화번호</p>
          <p className="text-[13px] font-bold" style={{ color: "var(--theme-text)" }}>{formatPhoneNumber(phone)}</p>
        </div>
        <div style={divider} />
        <div className={ROW}>
          <p className="text-[13px] font-medium" style={{ color: "var(--theme-text-muted)" }}>로그인 방식</p>
          <span
            className="px-3 py-1 rounded-full text-[11px] font-bold"
            style={{
              background: "var(--glass-bg-overlay)",
              border: "1px solid var(--glass-border)",
              color: "var(--theme-text)",
            }}
          >
            {loginProvider || "LOCAL"}
          </span>
        </div>
      </div>

      {/* 소셜 연결 */}
      <div className="mt-5 pt-4" style={divider}>
        <div className="flex items-center gap-2 mb-3">
          <Link2 className="w-4 h-4" style={{ color: "var(--theme-primary)" }} />
          <p className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--theme-text-muted)" }}>
            소셜 연결
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" style={googleConn ? btnDanger : btnBase} onClick={toggleGoogle}>
            {googleConn ? "GOOGLE 해제" : "GOOGLE 연동"}
          </button>
          <button type="button" style={kakaoConn ? btnDanger : btnBase} onClick={toggleKakao}>
            {kakaoConn ? "KAKAO 해제" : "KAKAO 연동"}
          </button>
        </div>
      </div>

      {/* 보안 설정 */}
      <div className="mt-5 pt-4" style={divider}>
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4" style={{ color: "var(--theme-primary)" }} />
          <p className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--theme-text-muted)" }}>
            보안 설정
          </p>
        </div>

        <div
          className="flex items-center justify-between gap-3 rounded-2xl p-4 mb-3"
          style={{
            background: "var(--glass-bg-overlay)",
            border: "1px solid var(--glass-border)",
          }}
        >
          <span className="text-[13px] font-bold" style={{ color: "var(--theme-text)" }}>
            {otp?.enabled ? "OTP 사용중" : "OTP 미사용"}
          </span>
          <button type="button" style={btnBase} onClick={openOtp}>
            {otp?.enabled ? "OTP 해제" : "OTP 설정"}
          </button>
        </div>

        <PasskeySection />
      </div>
    </div>
  );
}
