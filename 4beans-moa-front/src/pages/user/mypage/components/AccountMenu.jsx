import React from "react";
import { KeyRound, Clock, CreditCard, Users, Wallet, UserMinus, UserPen } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

const WRAP = "p-6";

// 테마별 스타일
const accountMenuThemeStyles = {
  pop: {
    item: "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-gray-200 bg-white text-black font-black text-sm active:translate-y-[1px]",
    active: "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-gray-200 bg-slate-100 text-black font-black text-sm",
    itemHover: "hover:bg-slate-50",
  },
  christmas: {
    item: "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-gray-200 bg-white text-black font-black text-sm active:translate-y-[1px]",
    active: "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-gray-200 bg-slate-100 text-black font-black text-sm",
    itemHover: "hover:bg-red-50",
  },
  dark: {
    item: "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-gray-700 bg-[#0F172A] text-gray-200 font-black text-sm active:translate-y-[1px]",
    active: "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-[#635bff] bg-[#635bff]/20 text-gray-200 font-black text-sm",
    itemHover: "hover:bg-[#635bff]/10",
  },
  classic: {
    item: "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-gray-200 bg-white text-black font-black text-sm active:translate-y-[1px]",
    active: "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-gray-200 bg-slate-100 text-black font-black text-sm",
    itemHover: "hover:bg-slate-50",
  },
};

export function AccountMenu({
  actions,
  activeView,
  onShowMain,
  onShowLoginHistory,
  onOpenUpdateUser,
  onOpenDeleteUser,
}) {
  const { theme } = useThemeStore();
  const themeStyle = accountMenuThemeStyles[theme] || accountMenuThemeStyles.pop;
  const ITEM = themeStyle.item;
  const ACTIVE = themeStyle.active;
  
  const goPassword = () => {
    if (typeof actions?.goChangePwd === "function") return actions.goChangePwd();
    if (typeof actions?.goUpdatePassword === "function")
      return actions.goUpdatePassword();
    if (typeof actions?.navigateUpdatePassword === "function")
      return actions.navigateUpdatePassword();
    if (typeof actions?.navigate === "function")
      return actions.navigate("/mypage/password");
  };

  const goSubscription = () => {
    if (typeof actions?.goSubscription === "function")
      return actions.goSubscription();
    if (typeof actions?.navigate === "function")
      return actions.navigate("/subscription");
  };

  const goMyParties = () => {
    if (typeof actions?.goMyParties === "function")
      return actions.goMyParties();
    if (typeof actions?.navigate === "function")
      return actions.navigate("/my-parties");
  };

  const goWallet = () => {
    if (typeof actions?.goWallet === "function") return actions.goWallet();
    if (typeof actions?.navigate === "function")
      return actions.navigate("/mypage/wallet");
  };

  // 모달로 변경
  const goUpdate = () => {
    if (typeof onOpenUpdateUser === "function") {
      onOpenUpdateUser();
    }
  };

  // 모달로 변경
  const goDelete = () => {
    if (typeof onOpenDeleteUser === "function") {
      onOpenDeleteUser();
    }
  };

  return (
    <div className={WRAP}>
      <div className="space-y-3">
        <button type="button" className={`${ITEM} ${themeStyle.itemHover}`} onClick={goUpdate}>
          <span className="inline-flex items-center gap-2">
            <UserPen className="w-4 h-4" />
            회원정보 수정
          </span>
        </button>

        <button type="button" className={`${ITEM} ${themeStyle.itemHover}`} onClick={goPassword}>
          <span className="inline-flex items-center gap-2">
            <KeyRound className="w-4 h-4" />
            비밀번호 변경
          </span>
        </button>

        <button type="button" className={`${ITEM} ${themeStyle.itemHover}`} onClick={goSubscription}>
          <span className="inline-flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            구독·결제 관리
          </span>
        </button>

        <button type="button" className={`${ITEM} ${themeStyle.itemHover}`} onClick={goMyParties}>
          <span className="inline-flex items-center gap-2">
            <Users className="w-4 h-4" />내 파티 목록
          </span>
        </button>

        <button type="button" className={`${ITEM} ${themeStyle.itemHover}`} onClick={goWallet}>
          <span className="inline-flex items-center gap-2">
            <Wallet className="w-4 h-4" />내 지갑
          </span>
        </button>

        <button
          type="button"
          className={activeView === "history" ? ACTIVE : `${ITEM} ${themeStyle.itemHover}`}
          onClick={onShowLoginHistory}
        >
          <span className="inline-flex items-center gap-2">
            <Clock className="w-4 h-4" />
            로그인 기록
          </span>
        </button>

        <button type="button" className={`${ITEM} ${themeStyle.itemHover}`} onClick={goDelete}>
          <span className="inline-flex items-center gap-2">
            <UserMinus className="w-4 h-4" />
            회원 탈퇴
          </span>
        </button>
      </div>
    </div>
  );
}
