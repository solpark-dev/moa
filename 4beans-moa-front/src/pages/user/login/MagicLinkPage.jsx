import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { sendMagicLink } from "@/api/authApi";

export default function MagicLinkPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return setError("이메일을 입력해주세요.");
    setLoading(true);
    setError("");
    try {
      await sendMagicLink(email.trim().toLowerCase());
      setSent(true);
    } catch {
      setError("전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden"
         style={{ background: "var(--theme-bg)" }}>
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
           style={{ background: "var(--orb-1)", opacity: 0.22, filter: "blur(80px)" }} />
      <div className="absolute bottom-20 -right-16 w-64 h-64 rounded-full pointer-events-none"
           style={{ background: "var(--orb-2)", opacity: 0.18, filter: "blur(80px)" }} />

      {/* Branding */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }} className="relative z-10 flex flex-col items-center pt-14 pb-8">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
             style={{ background: "var(--theme-primary)" }}>
          <span className="text-white text-2xl font-black">M</span>
        </div>
        <h1 className="text-[22px] font-bold" style={{ color: "var(--theme-primary)" }}>MOA</h1>
        <p className="text-[13px] mt-1" style={{ color: "var(--theme-text-muted)" }}>
          이메일 링크로 로그인
        </p>
      </motion.div>

      {/* Card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.45, ease: "easeOut" }}
        className="relative z-10 mx-5 rounded-3xl overflow-hidden"
        style={{ background: "var(--glass-bg-card)", backdropFilter: "blur(var(--glass-blur))",
          WebkitBackdropFilter: "blur(var(--glass-blur))", border: "1px solid var(--glass-border)",
          boxShadow: "var(--shadow-glass)" }}>

        <div className="px-6 pt-7 pb-8">
          {!sent ? (
            <>
              <h2 className="text-[20px] font-bold mb-1" style={{ color: "var(--theme-text)" }}>
                로그인 링크 받기
              </h2>
              <p className="text-[13px] mb-6" style={{ color: "var(--theme-text-muted)" }}>
                이메일로 일회용 로그인 링크를 보내드립니다.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-semibold" style={{ color: "var(--theme-text-muted)" }}>
                    이메일
                  </Label>
                  <Input type="email" placeholder="이메일 주소 입력" value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    className="h-11 rounded-xl text-[14px] border-0 focus-visible:ring-1"
                    style={{ background: "var(--glass-bg-overlay)", border: "1px solid var(--glass-border)",
                      color: "var(--theme-text)", "--tw-ring-color": "var(--theme-primary)" }} />
                </div>
                {error && <p className="text-[12px] text-red-500">{error}</p>}
                <Button type="submit" disabled={loading}
                  className="w-full h-11 text-[14px] font-bold rounded-xl text-white"
                  style={{ background: "var(--theme-primary)" }}>
                  {loading ? "전송 중..." : "링크 보내기"}
                </Button>
              </form>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl"
                   style={{ background: "color-mix(in srgb, var(--theme-primary) 15%, transparent)" }}>
                ✉️
              </div>
              <div>
                <p className="text-[16px] font-bold mb-1" style={{ color: "var(--theme-text)" }}>
                  이메일을 확인해주세요
                </p>
                <p className="text-[13px]" style={{ color: "var(--theme-text-muted)" }}>
                  <span className="font-semibold" style={{ color: "var(--theme-primary)" }}>{email}</span>으로<br />
                  로그인 링크를 보냈습니다.
                </p>
              </div>
              <p className="text-[12px]" style={{ color: "var(--theme-text-muted)" }}>
                링크는 15분간 유효하며 1회만 사용 가능합니다.
              </p>
              <button onClick={() => setSent(false)}
                className="text-[12px] font-medium" style={{ color: "var(--theme-primary)" }}>
                다른 이메일로 다시 보내기
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="relative z-10 flex items-center justify-center gap-1 mt-6 pb-10">
        <span className="text-[13px]" style={{ color: "var(--theme-text-muted)" }}>비밀번호로 로그인하시겠어요?</span>
        <button onClick={() => navigate("/login")}
          className="text-[13px] font-semibold" style={{ color: "var(--theme-primary)" }}>
          로그인
        </button>
      </motion.div>
    </div>
  );
}
