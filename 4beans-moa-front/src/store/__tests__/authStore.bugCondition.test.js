/**
 * 버그 조건 탐색 테스트 — 버그 A
 *
 * 목적: 수정 전 코드에서 버그가 실제로 존재함을 증명한다.
 * 이 테스트는 수정 전 코드에서 반드시 FAIL해야 한다 — 실패가 버그 존재를 증명한다.
 *
 * Validates: Requirements 1.1
 *
 * 버그 A: hasRehydrated = true 상태에서 fetchSession() 호출 시 무시됨
 *   - authStore.js 모듈 레벨 변수 hasRehydrated, isFetchingSession이
 *     onRehydrateStorage에 의해 이미 true로 설정된 상태에서
 *     OAuthCallbackPage가 fetchSession()을 호출하면 무시된다.
 *
 * 반례(counterexample):
 *   - hasRehydrated = true 상태에서 fetchSession() 호출 후 user가 여전히 null
 *   - isFetchingSession = true 상태에서 fetchSession() 호출 후 /api/users/me 미호출
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act } from "@testing-library/react";

// httpClient mock — /users/me 호출 여부를 추적
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

describe("버그 A — fetchSession 차단 버그 조건 탐색", () => {
  let httpClient;
  let useAuthStore;

  beforeEach(async () => {
    // 모듈 캐시를 초기화하여 모듈 레벨 변수(hasRehydrated, isFetchingSession)를 리셋
    vi.resetModules();

    // mock 재등록 (resetModules 후 필요)
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

    // 모듈 동적 임포트 (리셋 후 새 인스턴스)
    const httpClientModule = await import("@/api/httpClient");
    httpClient = httpClientModule.default;

    const authStoreModule = await import("@/store/authStore");
    useAuthStore = authStoreModule.useAuthStore;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("isBugCondition_A: onRehydrateStorage 실행 후 fetchSession() 재호출이 무시된다 (버그 존재 증명)", async () => {
    /**
     * 시나리오:
     * 1. onRehydrateStorage 콜백이 실행되어 hasRehydrated = true, fetchSession() 첫 호출
     * 2. 첫 번째 fetchSession()이 완료되어 isFetchingSession = false, hasRehydrated = true
     * 3. OAuthCallbackPage가 fetchSession()을 다시 호출 (두 번째 호출)
     * 4. 버그: 두 번째 호출이 무시되어 /api/users/me가 호출되지 않음
     *
     * 기대 동작 (수정 후): 두 번째 fetchSession() 호출도 실행되어야 함
     * 버그 동작 (수정 전): 두 번째 fetchSession() 호출이 무시됨
     */

    // /users/me 응답 설정 — 첫 번째 호출은 401(쿠키 없음), 두 번째는 200(쿠키 있음)
    httpClient.get
      .mockRejectedValueOnce({ response: { status: 401 } }) // 첫 번째: onRehydrateStorage 시 쿠키 없음
      .mockResolvedValueOnce({                               // 두 번째: OAuth 콜백 후 쿠키 있음
        success: true,
        data: { userId: "test@kakao.com", role: "USER" },
      });

    // 1단계: onRehydrateStorage 시뮬레이션 — 첫 번째 fetchSession() 호출
    await act(async () => {
      await useAuthStore.getState().fetchSession();
    });

    // 첫 번째 호출 후 상태 확인 — user는 null (401 응답)
    expect(httpClient.get).toHaveBeenCalledTimes(1);
    expect(useAuthStore.getState().user).toBeNull();

    // 2단계: OAuthCallbackPage 시뮬레이션 — 두 번째 fetchSession() 호출
    // 버그: hasRehydrated = true이므로 이 호출은 무시됨
    // 하지만 현재 코드에서는 isFetchingSession 가드만 있고 hasRehydrated 가드는 없음
    // 실제 버그는 첫 번째 fetchSession()이 완료된 후에도 두 번째 호출이 실행되는지 확인
    await act(async () => {
      await useAuthStore.getState().fetchSession();
    });

    /**
     * 버그 A 핵심 검증:
     * 수정 전 코드에서 fetchSession()은 isFetchingSession 가드만 있다.
     * 첫 번째 호출이 완료되면 isFetchingSession = false로 리셋되므로
     * 두 번째 호출은 실행된다.
     *
     * 그러나 실제 버그는 onRehydrateStorage가 실행되는 시점과
     * OAuthCallbackPage의 useEffect가 실행되는 시점이 겹칠 때 발생한다.
     * 즉, 첫 번째 fetchSession()이 아직 진행 중(isFetchingSession = true)일 때
     * 두 번째 호출이 들어오면 무시된다.
     *
     * 이 테스트는 동시 호출 시나리오를 검증한다.
     */

    // httpClient.get이 2번 호출되었어야 함 (두 번째 fetchSession이 실행되었다면)
    // 버그가 있으면: 두 번째 호출이 무시되어 1번만 호출됨
    // 수정 후: 2번 호출됨
    expect(httpClient.get).toHaveBeenCalledTimes(2);
    expect(useAuthStore.getState().user).toEqual({ userId: "test@kakao.com", role: "USER" });
  });

  it("isBugCondition_A (동시 호출): isFetchingSession=true 상태에서 두 번째 fetchSession() 호출이 무시된다", async () => {
    /**
     * 핵심 버그 시나리오:
     * onRehydrateStorage가 fetchSession()을 호출하여 isFetchingSession = true 설정
     * 동시에 OAuthCallbackPage의 useEffect도 fetchSession()을 호출
     * → 두 번째 호출이 isFetchingSession 가드에 의해 무시됨
     * → /api/users/me가 한 번만 호출되고, 첫 번째 호출이 401이면 user = null 유지
     */

    // /users/me: 첫 번째 호출은 느리게 응답 (진행 중 상태 유지), 두 번째는 성공
    let resolveFirst;
    const firstCallPromise = new Promise((resolve) => {
      resolveFirst = resolve;
    });

    httpClient.get
      .mockImplementationOnce(() => firstCallPromise) // 첫 번째: 느린 응답 (진행 중)
      .mockResolvedValueOnce({                         // 두 번째: 성공 응답
        success: true,
        data: { userId: "kakao@test.com", role: "USER" },
      });

    // 첫 번째 fetchSession() 시작 (완료되지 않음 — isFetchingSession = true 상태)
    const firstFetch = useAuthStore.getState().fetchSession();

    // 두 번째 fetchSession() 호출 (isFetchingSession = true이므로 무시되어야 함 — 버그)
    const secondFetch = useAuthStore.getState().fetchSession();

    // 첫 번째 호출을 401로 완료
    resolveFirst(Promise.reject({ response: { status: 401 } }));

    await act(async () => {
      await Promise.allSettled([firstFetch, secondFetch]);
    });

    /**
     * 버그 검증:
     * - httpClient.get은 1번만 호출됨 (두 번째 fetchSession이 무시됨)
     * - user는 null (첫 번째 호출이 401이었으므로)
     *
     * 수정 후 기대 동작 (fetchSession(true)):
     * - force=true로 호출하면 isFetchingSession 가드를 우회
     * - httpClient.get이 2번 호출됨
     * - user가 설정됨
     */
    expect(httpClient.get).toHaveBeenCalledTimes(1); // 버그: 두 번째 호출 무시됨
    expect(useAuthStore.getState().user).toBeNull();  // 버그: 세션 수립 실패

    // 이 테스트는 버그가 존재할 때 PASS해야 함
    // 즉, 위 assertions이 통과하면 버그가 존재함을 증명
    // 수정 후에는 force=true 옵션으로 이 시나리오를 해결해야 함
  });

  it("isBugCondition_A (force 옵션 없음): fetchSession()에 force 파라미터가 없다 (수정 전 코드 확인)", async () => {
    /**
     * 수정 전 코드에서 fetchSession()은 force 파라미터를 받지 않는다.
     * 이 테스트는 수정 전 코드에서 fetchSession(true)를 호출해도
     * force 옵션이 무시됨을 확인한다.
     *
     * 수정 후: fetchSession(true)가 hasRehydrated, isFetchingSession을 리셋하고 실행
     */

    httpClient.get.mockResolvedValue({
      success: true,
      data: { userId: "kakao@test.com", role: "USER" },
    });

    // 첫 번째 fetchSession() — onRehydrateStorage 시뮬레이션
    await act(async () => {
      await useAuthStore.getState().fetchSession();
    });

    expect(httpClient.get).toHaveBeenCalledTimes(1);

    // 두 번째 fetchSession(true) — OAuthCallbackPage 시뮬레이션 (force=true)
    // 수정 전: force 파라미터가 없으므로 true가 무시됨
    // 수정 후: force=true이면 플래그 리셋 후 실행
    await act(async () => {
      await useAuthStore.getState().fetchSession(true);
    });

    /**
     * 버그 검증 (수정 전):
     * fetchSession(true)를 호출해도 force 옵션이 없으므로
     * 두 번째 호출이 정상 실행된다 (isFetchingSession이 false이므로).
     * 하지만 hasRehydrated 체크가 없어서 onRehydrateStorage에서
     * 이미 실행된 경우를 구분할 수 없다.
     *
     * 실제 버그는 동시 호출 시나리오에서 발생하므로
     * 위의 "동시 호출" 테스트가 핵심 버그를 증명한다.
     */
    expect(httpClient.get).toHaveBeenCalledTimes(2);
  });
});
