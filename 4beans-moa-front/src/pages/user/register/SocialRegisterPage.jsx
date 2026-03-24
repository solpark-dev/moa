import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import AddUserPage from "./AddUserPage";

export default function SocialRegisterPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const provider = location.state?.provider || params.get("provider");
  const providerUserId =
    location.state?.providerUserId || params.get("providerUserId");
  const email = location.state?.email || params.get("email");

  useEffect(() => {
    if (!provider || !providerUserId) {
      navigate("/login", { replace: true });
    }
  }, [provider, providerUserId, navigate]);

  if (!provider || !providerUserId) {
    return null;
  }

  return <AddUserPage socialInfo={{ provider, providerUserId, email }} />;
}
