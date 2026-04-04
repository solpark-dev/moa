import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const fetchSession = useAuthStore((s) => s.fetchSession);

  useEffect(() => {
    const run = async () => {
      const status = params.get("status");
      const provider = params.get("provider");

      if (status === "LOGIN") {
        await fetchSession();
        navigate("/", { replace: true });
        return;
      }

      if (status === "CONNECT") {
        await fetchSession();
        navigate("/mypage", {
          replace: true,
          state: { oauthConnected: provider },
        });
        return;
      }

      if (status === "NEED_REGISTER") {
        navigate("/register/social", {
          replace: true,
          state: {
            provider: params.get("provider"),
            providerUserId: params.get("providerUserId"),
            email: params.get("email"),
          },
        });
        return;
      }

      if (status === "NEED_PHONE_CONNECT") {
        navigate("/oauth/phone-connect", {
          replace: true,
          state: {
            provider: params.get("provider"),
            providerUserId: params.get("providerUserId"),
            phone: params.get("phone"),
          },
        });
        return;
      }

      if (status === "NEED_TRANSFER") {
        navigate("/oauth/transfer", {
          replace: true,
          state: {
            provider: params.get("provider"),
            providerUserId: params.get("providerUserId"),
          },
        });
        return;
      }

      navigate("/", { replace: true });
    };

    run();
  }, [params, navigate, fetchSession]);

  return null;
}
