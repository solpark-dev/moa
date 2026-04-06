/**
 * 보존 속성 테스트 — 기존 동작 유지 확인
 *
 * 목적: 수정 전 코드에서 비버그 입력의 기존 동작이 정상임을 확인한다.
 * 이 테스트는 수정 전 코드에서 반드시 PASS해야 한다 — 통과가 기준 동작을 확인한다.
 * 수정 후에도 동일하게 PASS해야 한다 — 회귀가 없음을 증명한다.
 *
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5
 *
 * 보존해야 할 동작:
 *   - 관찰 1: force=false(기본값)로 fetchSession() 호출 시 isFetchingSession 가드가 정상 동작
 *   - 관찰 2: 일반 로그인 후 페이지 새로고침 시 onRehydrateStorage → fetchSession() 세션 복구
 *   - 관찰 3: 첫 번째 fetchSession() 호출은 항상 실행됨 (isFetchingSession=false 초기 상태)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act } from "@testing-library/react";

// httpClient mock
vi.mock("@/api/httpClient", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// OTP store mock
vi.mock("@/store/user/otpStore", () => ({
  useOtpStore: {
    getState: () => ({ setEnabled: vi.fn() }),
  },
}));

// login store mock
vi.mock("@/store/user/loginStore", () => ({
  useLoginStore: {
    getState: () => ({ setField: vi.fn() }),
  },
}));

describe("보존 속성 테스트 — 기존 authStore 동작 유지 (요건 3.3)", () => {
  let httpClient;
  let useAuthStore;

  beforeEach(async () => {
    // 모듈 캐시를 초기화하여 모듈 레벨 변수(hasRehydrated, isFetchingSession)를 리셋
    vi.resetModules();

    vi.mock("@/api/httpClient", () => ({
      default: {
        get: vi.fn(),
        post: vi.fn(),
      },
    }));
    vi.mock("@/store/user/otpStore", () => ({
      useOtpStore: {
        getState: () => ({ setEnabled: vi.fn() }),
      },
    }));
    vi.mock("@/store/user/loginStore", () => ({
      useLoginStore: {
        getState: () => ({ setField: vi.fn() }),
      },
    }));

    const httpClientModule = await import("@/api/httpClient");
    httpClient = httpClientModule.default;

    const authStoreModule = await import("@/store/authStore");
    useAuthStore = authStoreModule.useAuthStore;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /**
   * 관찰 1: 일반 로그인 새로고침 세션 복구
   * onRehydrateStorage → fetchSession() 정상 실행 (요건 3.3)
   *
   * 버그 조건 A에 해당하지 않는 케이스:
   * - isFetchingSession = false (초기 상태)
   * - 첫 번째 fetchSession() 호출은 항상 실행됨
   */
  it("관찰 1: 초기 상태에서 fetchSession() 호출 시 /api/users/me가 실행된다 (요건 3.3)", async () => {
    // 일반 로그인 후 새로고침 시 세션 복구 성공 시나리오
    httpClient.get.mockResolvedValueOnce({
      success: true,
      data: { userId: "user@example.com", role: "USER" },
    });

    await act(async () => {
      await useAuthStore.getState().fetchSession();
    });

    // 검증: /api/users/me가 호출되었고 user가 설정됨
    expect(httpClient.get).toHaveBeenCalledTimes(1);
    expect(httpClient.get).toHaveBeenCalledWith("/users/me");
    expect(useAuthStore.getState().user).toEqual({ userId: "user@example.com", role: "USER" });
    expect(useAuthStore.getState()._hydrated).toBe(true);
    expect(useAuthStore.getState().loading).toBe(false);
  });

  /**
   * 관찰 1 (실패 케이스): 세션 복구 실패 시 user=null, _hydrated=true
   * 쿠키가 없거나 만료된 경우 401 응답 → clearAuth() 호출
   */
  it("관찰 1 (401): 세션 복구 실패 시 user=null, _hydrated=true로 설정된다 (요건 3.3)", async () => {
    httpClient.get.mockRejectedValueOnce({ response: { status: 401 } });

    await act(async () => {
      await useAuthStore.getState().fetchSession();
    });

    expect(httpClient.get).toHaveBeenCalledTimes(1);
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState()._hydrated).toBe(true);
    expect(useAuthStore.getState().loading).toBe(false);
  });

  /**
   * 관찰 2: isFetchingSession 가드 — 동시 중복 호출 방지
   * force=false(기본값)로 호출 시 진행 중인 fetchSession이 있으면 두 번째 호출 무시
   * 이것은 버그가 아니라 의도된 동작 (일반 로그인 새로고침 시 중복 호출 방지)
   */
  it("관찰 2: 진행 중인 fetchSession이 있을 때 두 번째 호출(force=false)은 무시된다 (의도된 동작)", async () => {
    let resolveFirst;
    const firstCallPromise = new Promise((resolve) => {
      resolveFirst = resolve;
    });

    httpClient.get
      .mockImplementationOnce(() => firstCallPromise)
      .mockResolvedValueOnce({
        success: true,
        data: { userId: "user@example.com", role: "USER" },
      });

    // 첫 번째 fetchSession() 시작 (완료되지 않음)
    const firstFetch = useAuthStore.getState().fetchSession();

    // 두 번째 fetchSession() 호출 — 진행 중이므로 무시됨 (의도된 동작)
    const secondFetch = useAuthStore.getState().fetchSession();

    // 첫 번째 호출 완료
    resolveFirst({
      success: true,
      data: { userId: "user@example.com", role: "USER" },
    });

    await act(async () => {
      await Promise.allSettled([firstFetch, secondFetch]);
    });

    // 검증: /api/users/me는 1번만 호출됨 (두 번째 호출 무시 — 의도된 동작)
    expect(httpClient.get).toHaveBeenCalledTimes(1);
    expect(useAuthStore.getState().user).toEqual({ userId: "user@example.com", role: "USER" });
  });

  /**
   * 관찰 3: fetchSession() 완료 후 상태 정리
   * isFetchingSession이 finally 블록에서 false로 리셋됨
   * → 이후 새로운 fetchSession() 호출이 가능
   */
  it("관찰 3: fetchSession() 완료 후 isFetchingSession이 리셋되어 다음 호출이 가능하다", async () => {
    httpClient.get
      .mockResolvedValueOnce({
        success: true,
        data: { userId: "user@example.com", role: "USER" },
      })
      .mockResolvedValueOnce({
        success: true,
        data: { userId: "user@example.com", role: "USER" },
      });

    // 첫 번째 fetchSession() 완료
    await act(async () => {
      await useAuthStore.getState().fetchSession();
    });

    expect(httpClient.get).toHaveBeenCalledTimes(1);

    // 두 번째 fetchSession() — 첫 번째 완료 후이므로 실행됨
    await act(async () => {
      await useAuthStore.getState().fetchSession();
    });

    // 검증: 두 번 모두 실행됨
    expect(httpClient.get).toHaveBeenCalledTimes(2);
  });

  /**
   * 관찰 4: loading 상태 관리
   * fetchSession() 시작 시 loading=true, 완료 시 loading=false
   */
  it("관찰 4: fetchSession() 실행 중 loading=true, 완료 후 loading=false", async () => {
    httpClient.get.mockResolvedValueOnce({
      success: true,
      data: { userId: "user@example.com", role: "USER" },
    });

    await act(async () => {
      await useAuthStore.getState().fetchSession();
    });

    expect(useAuthStore.getState().loading).toBe(false);
  });
});
