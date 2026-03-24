import { Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";

const LoadingFallback = () => (
  <div className="w-full flex items-center justify-center py-20">
    <span className="text-sm text-slate-500">Checking session...</span>
  </div>
);

export default function ProtectedRoute({ element }) {
  const { user, accessToken, loading, fetchSession } = useAuthStore();
  const hasRequestedSession = useRef(false);

  useEffect(() => {
    if (!accessToken) {
      // No token: ensure we are not stuck in a loading state and skip any API calls.
      if (loading) {
        useAuthStore.setState({ loading: false });
      }
      return;
    }

    if (!user && !hasRequestedSession.current) {
      hasRequestedSession.current = true;
      Promise.resolve(fetchSession())
        .catch(() => {
          // Swallow errors here; navigation logic below will redirect unauthenticated users.
        })
        .finally(() => {
          useAuthStore.setState({ loading: false });
        });
    }
  }, [accessToken, user, loading, fetchSession]);

  if (!accessToken) return <Navigate to="/login" replace />;

  if (loading || (!user && hasRequestedSession.current)) {
    return <LoadingFallback />;
  }

  if (!user) return <Navigate to="/login" replace />;

  return element;
}
