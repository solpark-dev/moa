import React from "react";
import { Link2, Shield, Smartphone } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { formatPhoneNumber } from "@/utils/format";

const ROW = "flex items-center justify-between py-3";

// 테마별 스타일
const connectionThemeStyles = {
  pop: {
    sectionTitle: "text-sm font-bold text-black",
    sectionBorder: "border-t-2 border-black",
    dividerBorder: "border-t border-black/20",
    labelText: "text-sm text-slate-600 font-bold",
    valueText: "text-sm font-black text-black",
    badgeBg: "border border-gray-200 bg-white text-black",
    btn: "px-4 py-2 rounded-2xl border border-gray-200 bg-white text-black font-black text-sm active:translate-y-[1px]",
    btnDanger: "px-4 py-2 rounded-2xl border border-gray-200 bg-white text-red-600 font-black text-sm active:translate-y-[1px]",
    buttonHover: "hover:bg-slate-50",
    otpBox: "border border-gray-200 bg-white",
  },
  christmas: {
    sectionTitle: "text-sm font-bold text-black",
    sectionBorder: "border-t border-gray-200",
    dividerBorder: "border-t border-gray-200",
    labelText: "text-sm text-slate-600 font-bold",
    valueText: "text-sm font-black text-black",
    badgeBg: "border border-gray-200 bg-white text-black",
    btn: "px-4 py-2 rounded-2xl border border-gray-200 bg-white text-black font-black text-sm active:translate-y-[1px]",
    btnDanger: "px-4 py-2 rounded-2xl border border-gray-200 bg-white text-red-600 font-black text-sm active:translate-y-[1px]",
    buttonHover: "hover:bg-red-50",
    otpBox: "border border-gray-200 bg-white",
  },
  dark: {
    sectionTitle: "text-sm font-bold text-gray-200",
    sectionBorder: "border-t border-gray-700",
    dividerBorder: "border-t border-gray-700",
    labelText: "text-sm text-gray-400 font-bold",
    valueText: "text-sm font-black text-gray-200",
    badgeBg: "border border-gray-700 bg-[#0F172A] text-gray-200",
    btn: "px-4 py-2 rounded-2xl border border-gray-700 bg-[#0F172A] text-gray-200 font-black text-sm active:translate-y-[1px]",
    btnDanger: "px-4 py-2 rounded-2xl border border-gray-700 bg-[#0F172A] text-red-400 font-black text-sm active:translate-y-[1px]",
    buttonHover: "hover:bg-[#635bff]/10",
    otpBox: "border border-gray-700 bg-[#0F172A]",
  },
  classic: {
    sectionTitle: "text-sm font-bold text-black",
    sectionBorder: "border-t border-gray-200",
    dividerBorder: "border-t border-gray-200",
    labelText: "text-sm text-slate-600 font-bold",
    valueText: "text-sm font-black text-black",
    badgeBg: "border border-gray-200 bg-white text-black",
    btn: "px-4 py-2 rounded-2xl border border-gray-200 bg-white text-black font-black text-sm active:translate-y-[1px]",
    btnDanger: "px-4 py-2 rounded-2xl border border-gray-200 bg-white text-red-600 font-black text-sm active:translate-y-[1px]",
    buttonHover: "hover:bg-slate-50",
    otpBox: "border border-gray-200 bg-white",
  },
};

export function ConnectionStatusCard({
  user,
  loginProvider,
  googleConn,
  kakaoConn,
  otp,
  actions,
}) {
  const { theme } = useThemeStore();
  const themeStyle = connectionThemeStyles[theme] || connectionThemeStyles.pop;
  const phone = user?.phone || "-";

  const toggleGoogle = () => {
    if (typeof actions?.handleGoogleClick === "function") {
      return actions.handleGoogleClick();
    }
  };

  const toggleKakao = () => {
    if (typeof actions?.handleKakaoClick === "function") {
      return actions.handleKakaoClick();
    }
  };

  const openOtp = () => {
    if (!otp?.enabled) actions?.otp?.openSetup?.();
    else actions?.otp?.prepareDisable?.();

    actions?.handleOtpModalChange?.(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Smartphone className="w-4 h-4" />
        <p className={themeStyle.sectionTitle}>로그인 정보</p>
      </div>

      <div className={themeStyle.sectionBorder}>
        <div className={ROW}>
          <p className={themeStyle.labelText}>전화번호</p>
          <p className={themeStyle.valueText}>{formatPhoneNumber(phone)}</p>
        </div>

        <div className={themeStyle.dividerBorder} />

        <div className={ROW}>
          <p className={themeStyle.labelText}>로그인 방식</p>
          <span className={`px-3 py-1 rounded-full text-xs font-black ${themeStyle.badgeBg}`}>
            {loginProvider || "LOCAL"}
          </span>
        </div>
      </div>

      <div className={`mt-6 ${themeStyle.sectionBorder} pt-5`}>
        <div className="flex items-center gap-2 mb-3">
          <Link2 className="w-4 h-4" />
          <p className={themeStyle.sectionTitle}>소셜 연결</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className={`${googleConn ? themeStyle.btnDanger : themeStyle.btn} ${
              themeStyle.buttonHover
            }`}
            onClick={toggleGoogle}
          >
            {googleConn ? "GOOGLE 해제" : "GOOGLE 연동"}
          </button>

          <button
            type="button"
            className={`${kakaoConn ? themeStyle.btnDanger : themeStyle.btn} ${
              themeStyle.buttonHover
            }`}
            onClick={toggleKakao}
          >
            {kakaoConn ? "KAKAO 해제" : "KAKAO 연동"}
          </button>
        </div>
      </div>

      <div className={`mt-6 ${themeStyle.sectionBorder} pt-5`}>
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4" />
          <p className={themeStyle.sectionTitle}>보안 설정</p>
        </div>

        <div className={`flex items-center justify-between gap-3 rounded-2xl p-4 ${themeStyle.otpBox}`}>
          <span className={themeStyle.valueText}>
            {otp?.enabled ? "OTP 사용중" : "OTP 미사용"}
          </span>

          <button
            type="button"
            className={`${themeStyle.btn} ${themeStyle.buttonHover}`}
            onClick={openOtp}
          >
            {otp?.enabled ? "OTP 해제" : "OTP 설정"}
          </button>
        </div>
      </div>
    </div>
  );
}
