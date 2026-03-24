import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import {
  fetchCurrentUser,
  oauthConnectByPhone,
  startPassAuth,
  verifyPassAuth,
} from "@/api/authApi";

export default function PhoneConnectPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setTokens, setUser, clearAuth } = useAuthStore();
  const runningRef = useRef(false);
  const provider = location.state?.provider;
  const providerUserId = location.state?.providerUserId;

  useEffect(() => {
    if (!provider || !providerUserId) {
      navigate("/login", { replace: true });
    }
  }, [provider, providerUserId, navigate]);

  const handlePassAuth = async () => {
    if (!provider || !providerUserId) {
      navigate("/login", { replace: true });
      return;
    }

    if (runningRef.current) return;
    runningRef.current = true;

    try {
      const start = await startPassAuth();
      if (!start?.success) {
        throw new Error(start?.error?.message || "본인 인증 시작에 실패했습니다.");
      }

      const { impCode, merchantUid } = start.data || {};
      if (!window.IMP) {
        throw new Error("인증 모듈 로드 실패");
      }

      window.IMP.init(impCode);
      window.IMP.certification({ merchant_uid: merchantUid }, async (rsp) => {
        if (!rsp.success) {
          runningRef.current = false;
          return;
        }

        try {
          const verify = await verifyPassAuth({ imp_uid: rsp.imp_uid });
          if (!verify?.success) {
            throw new Error(verify?.error?.message || "본인 인증에 실패했습니다.");
          }

          const { phone, ci } = verify.data || {};
          if (!phone || !ci) {
            throw new Error("본인 인증 정보가 올바르지 않습니다.");
          }

          const ok = window.confirm(
            "기존 계정과 소셜 계정을 연동하고 로그인하시겠습니까?"
          );
          if (!ok) {
            runningRef.current = false;
            return;
          }

          const connectRes = await oauthConnectByPhone({
            provider,
            providerUserId,
            phone,
            ci,
          });

          if (!connectRes?.success) {
            throw new Error(
              connectRes?.error?.message || "계정 연동에 실패했습니다."
            );
          }

          const {
            accessToken,
            refreshToken,
            accessTokenExpiresIn,
            expiresIn,
          } = connectRes.data || {};

          if (accessToken && refreshToken) {
            setTokens({
              accessToken,
              refreshToken,
              accessTokenExpiresIn: accessTokenExpiresIn ?? expiresIn,
            });
            try {
              const meRes = await fetchCurrentUser();
              if (meRes?.success && meRes.data) {
                setUser(meRes.data);
              }
            } catch {
              clearAuth();
            }
          }

          navigate("/", { replace: true });
        } catch (err) {
          alert(err?.message || "계정 연동에 실패했습니다.");
          navigate("/login", { replace: true });
        } finally {
          runningRef.current = false;
        }
      });
    } catch (err) {
      alert(err?.message || "본인 인증 처리 중 오류가 발생했습니다.");
      navigate("/login", { replace: true });
      runningRef.current = false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="rounded-2xl bg-slate-900/80 border border-slate-700 px-8 py-10 text-center space-y-4 shadow-xl">
        <div className="text-lg font-semibold text-slate-50">
          이미 가입된 휴대폰 번호가 존재합니다.
        </div>
        <div className="text-sm text-slate-400">
          본인 인증 후 해당 계정과 소셜 계정을 연동합니다.
        </div>
        <button
          type="button"
          onClick={handlePassAuth}
          className="mt-4 inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          PASS 본인인증
        </button>
      </div>
    </div>
  );
}
