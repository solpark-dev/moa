import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { verifyMagicLink } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";

const STATE = { CONFIRM: "confirm", LOADING: "loading", SUCCESS: "success", ERROR: "error" };

export default function MagicLinkCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { setTokens } = useAuthStore();
  const [state, setState] = useState(token ? STATE.CONFIRM : STATE.ERROR);
  const [errorMsg, setErrorMsg] = useState("");

  // 프리페치 방지: 페이지 진입만으로 토큰을 소모하지 않음
  // 사용자가 직접 "로그인하기" 버튼을 눌러야 POST 검증 실행

  async function handleConfirm() {
    setState(STATE.LOADING);
    try {
      const res = await verifyMagicLink(token);
      const data = res.data?.data || res.data;
      await setTokens(
        data.accessToken,
        data.refreshToken,
        data.accessTokenExpiresIn
      );
      setState(STATE.SUCCESS);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      const msg = err?.response?.data?.message || "링크가 만료되었거나 유효하지 않습니다.";
      setErrorMsg(msg);
      setState(STATE.ERROR);
    }
  }

  const cardContent = {
    [STATE.CONFIRM]: {
      icon: "🔗",
      title: "로그인 확인",
      desc: "아래 버튼을 눌러 MOA에 로그인하세요.",
      action: (
        <Button onClick={handleConfirm}
          className="w-full h-11 text-[14px] font-bold rounded-xl text-white"
          style={{ background: "var(--theme-primary)" }}>
          로그인하기
        </Button>
      ),
    },
    [STATE.LOADING]: {
      icon: "⏳",
      title: "로그인 중...",
      desc: "잠시만 기다려주세요.",
      action: null,
    },
    [STATE.SUCCESS]: {
      icon: "✅",
      title: "로그인 성공",
      desc: "잠시 후 메인 페이지로 이동합니다.",
      action: null,
    },
    [STATE.ERROR]: {
      icon: "❌",
      title: "링크 오류",
      desc: errorMsg || "링크가 없거나 만료되었습니다.",
      action: (
        <Button onClick={() => navigate("/login/magic")}
          className="w-full h-11 text-[14px] font-bold rounded-xl text-white"
          style={{ background: "var(--theme-primary)" }}>
          새 링크 요청하기
        </Button>
      ),
    },
  };

  const content = cardContent[state];

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden"
         style={{ background: "var(--theme-bg)" }}>
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
           style={{ background: "var(--orb-1)", opacity: 0.22, filter: "blur(80px)" }} />
      <div className="absolute bottom-20 -right-16 w-64 h-64 rounded-full pointer-events-none"
           style={{ background: "var(--orb-2)", opacity: 0.18, filter: "blur(80px)" }} />

      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }} className="relative z-10 flex flex-col items-center pt-14 pb-8">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
             style={{ background: "var(--theme-primary)" }}>
          <span className="text-white text-2xl font-black">M</span>
        </div>
        <h1 className="text-[22px] font-bold" style={{ color: "var(--theme-primary)" }}>MOA</h1>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.45, ease: "easeOut" }}
        className="relative z-10 mx-5 rounded-3xl overflow-hidden"
        style={{ background: "var(--glass-bg-card)", backdropFilter: "blur(var(--glass-blur))",
          WebkitBackdropFilter: "blur(var(--glass-blur))", border: "1px solid var(--glass-border)",
          boxShadow: "var(--shadow-glass)" }}>

        <div className="px-6 py-10 text-center space-y-5">
          <div className="text-5xl">{content.icon}</div>
          <div>
            <h2 className="text-[20px] font-bold mb-2" style={{ color: "var(--theme-text)" }}>
              {content.title}
            </h2>
            <p className="text-[14px]" style={{ color: "var(--theme-text-muted)" }}>
              {content.desc}
            </p>
          </div>
          {content.action && <div className="pt-2">{content.action}</div>}
        </div>
      </motion.div>
    </div>
  );
}
