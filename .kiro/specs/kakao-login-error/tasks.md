# Implementation Plan

- [x] 1. 버그 조건 탐색 테스트 작성 (수정 전 실행)
  - **Property 1: Bug Condition** - 카카오 로그인 세션 수립 실패 / 소셜 회원가입 쿠키 미설정 / userId null 422
  - **CRITICAL**: 이 테스트는 수정 전 코드에서 반드시 FAIL해야 함 — 실패가 버그 존재를 증명
  - **DO NOT attempt to fix the test or the code when it fails**
  - **GOAL**: 버그가 실제로 존재함을 반례(counterexample)로 증명
  - **Scoped PBT Approach**: 결정론적 버그이므로 구체적인 실패 케이스로 범위를 좁혀 재현성 확보
  - 버그 A: `hasRehydrated = true` 상태에서 `fetchSession()` 호출 → 무시됨 확인 (design.md `isBugCondition_A` 참조)
  - 버그 B: `POST /api/signup/add` (소셜 분기) 응답 헤더에 `Set-Cookie` 없음 확인 (design.md `isBugCondition_B` 참조)
  - 버그 C: `userId = null`로 `POST /api/signup/add` 요청 → 422 반환 확인 (design.md `isBugCondition_C` 참조)
  - 수정 전 코드에서 테스트 실행
  - **EXPECTED OUTCOME**: 테스트 FAIL (버그 존재 증명)
  - 발견된 반례 문서화 (예: "fetchSession() 호출 후 user가 여전히 null", "응답에 Set-Cookie 헤더 없음", "422 Unprocessable Entity")
  - 테스트 작성, 실행, 실패 문서화 완료 시 태스크 완료 처리
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. 보존 속성 테스트 작성 (수정 전 실행)
  - **Property 2: Preservation** - 기존 일반 로그인/회원가입 및 정상 OAuth 흐름 동작 유지
  - **IMPORTANT**: 관찰 우선 방법론 적용 — 수정 전 코드에서 비버그 입력의 실제 동작을 먼저 관찰
  - 관찰 1: `force = false`(기본값)로 `fetchSession()` 호출 시 `isFetchingSession` 가드가 정상 동작함 확인
  - 관찰 2: 일반 회원가입(`POST /api/signup/add`, provider 없음) 시 이메일 인증 메일 발송 및 PENDING 상태 생성 확인
  - 관찰 3: 이메일 제공 카카오 계정 회원가입 시 `userId = email` 그대로 사용됨 확인
  - 관찰 4: 기존 카카오 로그인 백엔드 콜백에서 `Set-Cookie` 헤더 정상 설정 확인
  - 관찰 5: `status=CONNECT` / `status=NEED_TRANSFER` 흐름 변경 없음 확인
  - 속성 기반 테스트: 버그 조건 A/B/C에 해당하지 않는 임의 입력에 대해 원본 동작과 동일한 결과 반환 검증
  - 수정 전 코드에서 테스트 실행
  - **EXPECTED OUTCOME**: 테스트 PASS (보존해야 할 기준 동작 확인)
  - 테스트 작성, 실행, 통과 확인 완료 시 태스크 완료 처리
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 3. 카카오 로그인 버그 수정

  - [x] 3.1 [버그 A] authStore.js — fetchSession에 force 옵션 추가
    - `fetchSession` 함수 시그니처를 `async (force = false)`로 변경
    - `force = true`이면 `isFetchingSession = false`, `hasRehydrated = false` 리셋 후 실행
    - `force = false`이면 기존 `if (isFetchingSession) return` 가드 동작 유지
    - 파일: `4beans-moa-front/src/store/authStore.js`
    - _Bug_Condition: isBugCondition_A — status="LOGIN" AND (hasRehydrated=true OR isFetchingSession=true) AND cookieExists("ACCESS_TOKEN")_
    - _Expected_Behavior: fetchSession(true) 호출 시 플래그 우회 후 /api/users/me 호출, user 상태 및 _hydrated=true 수립_
    - _Preservation: force=false 기본 호출 시 기존 가드 동작 유지 (요건 3.3)_
    - _Requirements: 2.1, 3.3_

  - [x] 3.2 [버그 A] OAuthCallbackPage.jsx — fetchSession(true) 호출로 변경
    - `status === "LOGIN"` 분기에서 `fetchSession()` → `fetchSession(true)` 로 변경
    - 파일: `4beans-moa-front/src/pages/oauth/OAuthCallbackPage.jsx`
    - _Bug_Condition: OAuthCallbackPage가 status=LOGIN 수신 시 fetchSession() 두 번째 호출이 무시되는 상황_
    - _Expected_Behavior: fetchSession(true)로 강제 실행하여 세션 정상 수립_
    - _Requirements: 2.1_

  - [x] 3.3 [버그 B] SignupRestController.java — HttpServletResponse 추가 및 소셜 분기 쿠키 설정
    - `add()` 메서드에 `HttpServletRequest req`, `HttpServletResponse response` 파라미터 추가
    - 소셜 분기(`isSocial = true`)에서 `addUserAndLogin()` 반환 토큰을 HttpOnly 쿠키로 설정
    - `ACCESS_TOKEN`: httpOnly, secure(HTTPS 환경), sameSite, path="/", maxAge 설정
    - `REFRESH_TOKEN`: httpOnly, secure(HTTPS 환경), sameSite, path="/", maxAge=14일 설정
    - 응답 바디에서 토큰 값 제거 (보안), `signupType: "SOCIAL"` 및 user 정보만 반환
    - 파일: `4beans-moa-backend/src/main/java/com/moa/user/controller/SignupRestController.java`
    - _Bug_Condition: isBugCondition_B — provider/providerUserId 포함 소셜 회원가입 요청 시 Set-Cookie 헤더 없음_
    - _Expected_Behavior: 응답 헤더에 ACCESS_TOKEN, REFRESH_TOKEN HttpOnly 쿠키 설정_
    - _Preservation: 일반 회원가입 분기(isSocial=false) 동작 변경 없음 (요건 3.2)_
    - _Requirements: 2.2, 3.2_

  - [x] 3.4 [버그 B] useSignup.js — setTokens 제거 및 쿠키 기반 인증으로 전환
    - `signupType === "SOCIAL"` 분기에서 `setTokens()` 호출 제거 (쿠키로 인증하므로 불필요)
    - `fetchCurrentUser()` 직접 호출로 세션 수립 (쿠키가 자동으로 전송됨)
    - 파일: `4beans-moa-front/src/hooks/auth/useSignup.js`
    - _Expected_Behavior: 소셜 회원가입 후 쿠키 기반으로 /api/users/me 인증 성공_
    - _Requirements: 2.2_

  - [x] 3.5 [버그 C] useSignup.js — userId fallback 추가 (이메일 미제공 카카오 계정)
    - 소셜 분기 `userId` 결정 로직 수정: `socialInfo.email || \`${socialInfo.provider}_${socialInfo.providerUserId}\``
    - 이메일 없는 경우 `socialEmail` 검증으로 인한 alert 후 중단 로직 제거 또는 수정
    - 파일: `4beans-moa-front/src/hooks/auth/useSignup.js`
    - _Bug_Condition: isBugCondition_C — provider="kakao" AND email=null → userId=null → @NotBlank 422_
    - _Expected_Behavior: userId = "kakao_{providerUserId}" 형식으로 생성, 422 없이 회원가입 완료_
    - _Preservation: 이메일 제공 카카오 계정은 기존대로 email을 userId로 사용 (요건 3.5)_
    - _Requirements: 2.3, 3.5_

  - [x] 3.6 [버그 C] UserCreateRequest.java — userId 검증 로직 확인
    - `userId` 필드의 `@NotBlank` 검증이 `kakao_{providerUserId}` 형식 값에서 통과하는지 확인
    - 프론트엔드에서 항상 non-null userId를 전송하는 것으로 충분한지 검토
    - 서비스 레이어에서 추가 처리가 필요한 경우 보완
    - 파일: `4beans-moa-backend/src/main/java/com/moa/user/dto/request/UserCreateRequest.java`
    - _Requirements: 2.3_

  - [x] 3.7 버그 조건 탐색 테스트 통과 확인
    - **Property 1: Expected Behavior** - 카카오 로그인 세션 수립 / 소셜 회원가입 쿠키 설정 / userId fallback
    - **IMPORTANT**: 태스크 1에서 작성한 동일한 테스트를 재실행 — 새 테스트 작성 금지
    - 태스크 1의 테스트가 기대 동작을 인코딩하고 있으므로, 통과 시 버그 수정 확인
    - **EXPECTED OUTCOME**: 테스트 PASS (버그 수정 확인)
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.8 보존 속성 테스트 통과 확인
    - **Property 2: Preservation** - 기존 일반 로그인/회원가입 및 정상 OAuth 흐름 동작 유지
    - **IMPORTANT**: 태스크 2에서 작성한 동일한 테스트를 재실행 — 새 테스트 작성 금지
    - **EXPECTED OUTCOME**: 테스트 PASS (회귀 없음 확인)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 4. 체크포인트 — 전체 테스트 통과 확인
  - 모든 테스트(탐색 테스트, 보존 테스트) 통과 확인
  - 카카오 로그인 전체 흐름 수동 검증: 콜백 → 쿠키 설정 → fetchSession(true) → 홈 이동 후 로그인 상태 확인
  - 신규 카카오 회원가입 전체 흐름 수동 검증: 소셜 회원가입 → 쿠키 설정 → /api/users/me 인증 성공
  - 이메일 미제공 카카오 계정 회원가입 수동 검증: providerUserId 기반 userId 생성 → 422 없이 가입 완료
  - 의문 사항 발생 시 사용자에게 문의
