import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const LoadingFallback = () => {
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    // 10초 후에도 로딩 중이면 타임아웃 메시지 표시
    const timer = setTimeout(() => {
      setShowTimeout(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center py-20 gap-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700"></div>
      <span className="text-sm text-slate-500">Checking session...</span>
      {showTimeout && (
        <div className="text-xs text-amber-600 max-w-md text-center">
          세션 확인이 지연되고 있습니다. 네트워크 연결을 확인해주세요.
          <br />
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
          >
            새로고침
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * ProtectedRoute — 쿠키 기반 세션 복구를 지원하는 라우트 가드
 *
 * 흐름:
 * 1. 페이지 새로고침 → accessToken(메모리) 사라짐, _hydrated = false
 * 2. authStore의 onRehydrateStorage → fetchSession() 호출
 * 3. fetchSession이 /users/me 를 쿠키(ACCESS_TOKEN)로 호출
 * 4. 성공 시 user 설정 + _hydrated = true
 * 5. 실패 시 clearAuth + _hydrated = true
 * 6. ProtectedRoute는 _hydrated = true 이후에만 판단
 */
export default function ProtectedRoute({ element }) {
  const { user, _hydrated } = useAuthStore();

  // fetchSession 완료 전 (_hydrated = false) → 로딩 표시
  if (!_hydrated) {
    return <LoadingFallback />;
  }

  // fetchSession 완료 후 user가 없으면 → 로그인 페이지
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return element;
}
