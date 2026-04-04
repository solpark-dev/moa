import { useState, useCallback } from "react";
import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser";
import {
  getPasskeyRegistrationOptions,
  submitPasskeyRegistration,
  getPasskeyAuthOptions,
  submitPasskeyAuthentication,
  listPasskeyCredentials,
  deletePasskeyCredential,
} from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";

/**
 * usePasskey
 *
 * 패스키(WebAuthn) 등록·인증·관리 훅.
 * httpClient 인터셉터가 response.data를 자동 언래핑하므로
 * API 함수 반환값이 곧 서버 응답 JSON입니다.
 *
 * register()     – 현재 로그인 사용자의 패스키 등록
 * authenticate() – 패스키로 로그인 (JWT 발급)
 * loadCredentials() / deleteCredential() – 보안 설정 관리용
 */
export function usePasskey() {
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [credentials, setCredentials] = useState([]);

  const { setTokens } = useAuthStore();

  // ─────────────────────────────────────────────────────────────
  // 등록
  // ─────────────────────────────────────────────────────────────
  const register = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. 서버에서 챌린지(등록 옵션) 가져오기
      // httpClient 인터셉터가 response.data를 직접 반환하므로 바로 사용
      const options = await getPasskeyRegistrationOptions();

      // 2. 브라우저 WebAuthn API 호출 (platform authenticator 선택 UI 표시)
      const credential = await startRegistration({ optionsJSON: options });

      // 3. 서버에 자격증명 등록
      await submitPasskeyRegistration(JSON.stringify(credential));

      return { success: true };
    } catch (err) {
      if (err?.name === "NotAllowedError") {
        // 사용자가 취소
        return { success: false, cancelled: true };
      }
      const message =
        err?.response?.data?.message || err?.message || "패스키 등록에 실패했습니다.";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ─────────────────────────────────────────────────────────────
  // 인증 (로그인)
  // ─────────────────────────────────────────────────────────────
  const authenticate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. 서버에서 챌린지(인증 옵션) + nonce 가져오기
      // httpClient 인터셉터가 response.data를 직접 반환: { options, nonce }
      const { options, nonce } = await getPasskeyAuthOptions();

      // 2. 브라우저 패스키 선택 UI 표시
      const assertion = await startAuthentication({ optionsJSON: options });

      // 3. assertion + nonce를 서버에 전송 → JWT 쿠키 발급
      // 반환: { success, userId, accessToken, refreshToken, accessTokenExpiresIn }
      const result = await submitPasskeyAuthentication(
        nonce,
        JSON.stringify(assertion)
      );

      // accessToken만 메모리에 저장 — refreshToken은 HttpOnly 쿠키로 처리
      setTokens({
        accessToken: result.accessToken,
        accessTokenExpiresIn: result.accessTokenExpiresIn,
      });

      // 사용자 정보 로드
      const { default: httpClient } = await import("@/api/httpClient");
      const me = await httpClient.get("/users/me");
      if (me?.success && me.data) {
        useAuthStore.getState().setUser(me.data);
      }

      return { success: true };
    } catch (err) {
      if (err?.name === "NotAllowedError") {
        return { success: false, cancelled: true };
      }
      const message =
        err?.response?.data?.message || err?.message || "패스키 인증에 실패했습니다.";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [setTokens]);

  // ─────────────────────────────────────────────────────────────
  // 관리
  // ─────────────────────────────────────────────────────────────
  const loadCredentials = useCallback(async () => {
    try {
      const data = await listPasskeyCredentials();
      setCredentials(Array.isArray(data) ? data : []);
    } catch {
      setCredentials([]);
    }
  }, []);

  const deleteCredential = useCallback(async (id) => {
    setLoading(true);
    try {
      await deletePasskeyCredential(id);
      await loadCredentials();
      return { success: true };
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "삭제에 실패했습니다.";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [loadCredentials]);

  return {
    loading,
    error,
    credentials,
    register,
    authenticate,
    loadCredentials,
    deleteCredential,
  };
}
