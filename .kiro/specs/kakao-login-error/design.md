# 카카오 로그인 버그 수정 설계 문서

## Overview

카카오 소셜 로그인 흐름에서 세션이 정상 수립되지 않는 3가지 버그를 수정합니다.

- **버그 A**: 기존 카카오 계정 로그인 시 `authStore`의 `hasRehydrated` / `isFetchingSession` 플래그가 `OAuthCallbackPage`의 `fetchSession()` 재호출을 차단하여 세션 수립 실패
- **버그 B**: 신규 카카오 회원가입 시 `addUserAndLogin()`이 토큰을 JSON 바디로만 반환하고 HttpOnly 쿠키를 설정하지 않아 이후 `/api/users/me` 인증 실패
- **버그 C**: 카카오가 이메일을 제공하지 않는 계정의 경우 `userId = null`로 전송되어 `@NotBlank` 검증 실패로 422 에러

수정 전략은 각 버그의 근본 원인을 최소 범위로 수정하고, 기존 일반 로그인/회원가입 흐름에 영향을 주지 않는 것을 원칙으로 합니다.

## Glossary

- **Bug_Condition (C)**: 버그를 유발하는 입력 조건
- **Property (P)**: 버그 조건이 충족될 때 기대되는 올바른 동작
- **Preservation**: 버그 수정 후에도 변경되지 않아야 하는 기존 동작
- **fetchSession**: `authStore.js`의 `/api/users/me`를 호출하여 세션을 복구하는 함수
- **hasRehydrated**: 페이지 로드당 `onRehydrateStorage` 콜백이 한 번만 실행되도록 막는 모듈 레벨 플래그
- **isFetchingSession**: `fetchSession` 동시 중복 호출을 막는 모듈 레벨 플래그
- **addUserAndLogin**: `UserServiceImpl.java`에서 소셜 회원가입 후 JWT 토큰을 생성하여 반환하는 메서드
- **OAuthCallbackPage**: 카카오/구글 OAuth 콜백 URL(`/oauth/callback`)을 처리하는 React 페이지 컴포넌트
- **HttpOnly 쿠키**: XSS 공격으로부터 토큰을 보호하기 위해 JavaScript에서 접근 불가한 쿠키

## Bug Details

### 버그 A — fetchSession 차단

`OAuthCallbackPage`가 `status=LOGIN`을 수신하면 `fetchSession()`을 호출합니다.
그러나 페이지 로드 시 `onRehydrateStorage`가 이미 `fetchSession()`을 한 번 실행했기 때문에,
`isFetchingSession = true` 상태이거나 `hasRehydrated = true`로 설정된 상태입니다.
`fetchSession()` 내부의 `if (isFetchingSession) return` 가드가 두 번째 호출을 무시합니다.

**Formal Specification:**
```
FUNCTION isBugCondition_A(context)
  INPUT: context = { status: string, hasRehydrated: boolean, isFetchingSession: boolean }
  OUTPUT: boolean

  RETURN context.status = "LOGIN"
         AND (context.hasRehydrated = true OR context.isFetchingSession = true)
         AND cookieExists("ACCESS_TOKEN")
END FUNCTION
```

**예시:**
- 카카오 로그인 → 백엔드가 쿠키 설정 후 `/oauth/callback?status=LOGIN`으로 리다이렉트
  → `onRehydrateStorage`가 `fetchSession()` 실행 (isFetchingSession=true 또는 완료 후 hasRehydrated=true)
  → `OAuthCallbackPage`의 `fetchSession()` 호출이 무시됨
  → `/api/users/me` 미호출 → `user = null`, `_hydrated = false` 상태 지속
  → 홈으로 리다이렉트되지만 로그인 상태 아님

### 버그 B — HttpOnly 쿠키 미설정

`SignupRestController.add()`의 소셜 분기에서 `userService.addUserAndLogin(request)`를 호출합니다.
`addUserAndLogin()`은 `Map<String, Object>`로 토큰을 JSON 바디에 담아 반환하고,
`Set-Cookie` 헤더를 설정하지 않습니다.
프론트엔드 `useSignup`은 응답에서 `accessToken`을 꺼내 `setTokens()`로 메모리에 저장한 뒤
`fetchCurrentUser()`(`/api/users/me`)를 호출하지만, 이 요청에는 쿠키가 없습니다.

**Formal Specification:**
```
FUNCTION isBugCondition_B(request)
  INPUT: request = { provider: string, providerUserId: string, userId: string }
  OUTPUT: boolean

  RETURN request.provider IS NOT NULL
         AND request.providerUserId IS NOT NULL
         AND responseHasCookie("ACCESS_TOKEN") = false
         AND responseHasCookie("REFRESH_TOKEN") = false
END FUNCTION
```

**예시:**
- 신규 카카오 계정 회원가입 → `POST /api/signup/add` 호출
  → 응답 바디: `{ signupType: "SOCIAL", accessToken: "...", ... }`
  → 응답 헤더: `Set-Cookie` 없음
  → `fetchCurrentUser()` 호출 시 쿠키 없이 요청 → 401 반환

### 버그 C — userId=null 422 에러

카카오가 이메일을 제공하지 않는 계정의 경우, 백엔드 콜백에서 `email = null`로 처리되어
`/oauth/callback?status=NEED_REGISTER` 리다이렉트 시 `email` 파라미터가 포함되지 않습니다.
프론트엔드 `useSignup`의 소셜 분기에서 `payload.userId = socialInfo.email`이 `null`이 되어
`@NotBlank` 검증 실패로 422가 반환됩니다.

**Formal Specification:**
```
FUNCTION isBugCondition_C(socialInfo)
  INPUT: socialInfo = { provider: string, providerUserId: string, email: string | null }
  OUTPUT: boolean

  RETURN socialInfo.provider = "kakao"
         AND (socialInfo.email IS NULL OR socialInfo.email IS BLANK)
         AND payload.userId IS NULL
END FUNCTION
```

**예시:**
- 이메일 미동의 카카오 계정 → `email = null`로 콜백 리다이렉트
  → `useSignup` payload: `{ userId: null, provider: "kakao", ... }`
  → `POST /api/signup/add` → 422 Unprocessable Entity (`@NotBlank` 위반)

## Expected Behavior

### Preservation Requirements

**변경되지 않아야 하는 동작:**
- 일반(이메일/비밀번호) 로그인 후 페이지 새로고침 시 `onRehydrateStorage`가 `fetchSession()`을 호출하여 세션을 복구하는 동작 (요건 3.3)
- 일반 회원가입 시 이메일 인증 메일 발송 및 PENDING 상태 계정 생성 동작 (요건 3.2)
- 기존 카카오 계정 로그인 시 백엔드가 HttpOnly 쿠키를 설정하고 `?status=LOGIN`으로 리다이렉트하는 동작 (요건 3.1)
- 카카오 계정 연동(`status=CONNECT`) 및 계정 이전(`status=NEED_TRANSFER`) 흐름 (요건 3.4)
- 카카오가 이메일을 제공하는 경우 해당 이메일이 `userId`로 사용되는 동작 (요건 3.5)

**범위:**
버그 조건에 해당하지 않는 모든 입력(일반 로그인, 일반 회원가입, 구글 OAuth, 이메일 제공 카카오 계정)은
이번 수정에 의해 영향을 받지 않아야 합니다.

## Hypothesized Root Cause

### 버그 A — 모듈 레벨 플래그의 생명주기 문제

`hasRehydrated`와 `isFetchingSession`은 `authStore.js` 모듈 레벨에 선언된 변수입니다.
OAuth 콜백 페이지는 백엔드 리다이렉트로 도달하는 새 페이지 로드이므로,
`onRehydrateStorage`가 먼저 실행되어 `hasRehydrated = true`로 설정됩니다.
이후 `OAuthCallbackPage`의 `useEffect`에서 `fetchSession()`을 호출하면
`isFetchingSession` 가드 또는 완료 후 상태에 의해 두 번째 호출이 무시됩니다.

**근본 원인**: `fetchSession()`에 "강제 실행" 옵션이 없어 OAuth 콜백 시나리오를 처리할 수 없음

### 버그 B — addUserAndLogin의 응답 방식 불일치

`addUserAndLogin()`은 일반 로그인(`AuthServiceImpl.login()`)과 달리 `HttpServletResponse`를 주입받지 않아
`Set-Cookie` 헤더를 설정할 수 없습니다. 토큰을 JSON 바디로만 반환하는 구현이 쿠키 기반 인증 아키텍처와 불일치합니다.

**근본 원인**: `SignupRestController.add()`가 `HttpServletResponse`를 파라미터로 받지 않아 쿠키 설정 불가

### 버그 C — 소셜 회원가입 시 이메일 없는 경우 처리 누락

`useSignup`의 소셜 분기에서 `userId: socialInfo.email`로 설정하는데,
카카오가 이메일을 제공하지 않으면 `socialInfo.email`이 `undefined` 또는 `null`이 됩니다.
프론트엔드에서 `socialEmail` 검증 로직이 있으나 (`if (isSocial && !socialEmail) return alert(...)`)
이 검증이 실제로 동작하는지 확인이 필요하며, 백엔드에서도 이메일 없는 소셜 계정에 대한 대안 처리가 없습니다.

**근본 원인**: 이메일 미제공 카카오 계정에 대한 `userId` 생성 전략 부재 (프론트/백엔드 모두)

## Correctness Properties

Property 1: Bug Condition A — OAuth 콜백 fetchSession 강제 실행

_For any_ 입력에서 `status=LOGIN`으로 `OAuthCallbackPage`에 도달하고 `ACCESS_TOKEN` 쿠키가 존재할 때,
수정된 `fetchSession()` 또는 `OAuthCallbackPage`는 `hasRehydrated` / `isFetchingSession` 플래그를
우회하거나 리셋하여 `/api/users/me`를 반드시 호출하고, `user` 상태와 `_hydrated = true`를 정상 수립해야 한다.

**Validates: Requirements 2.1**

Property 2: Bug Condition B — 소셜 회원가입 시 HttpOnly 쿠키 설정

_For any_ 소셜 회원가입 요청(`provider`, `providerUserId` 포함)에서,
수정된 `addUserAndLogin()` 또는 `SignupRestController.add()`는 `ACCESS_TOKEN`과 `REFRESH_TOKEN`을
HttpOnly 쿠키로 응답 헤더에 설정해야 하며, 이후 `/api/users/me` 호출이 쿠키 기반으로 인증되어야 한다.

**Validates: Requirements 2.2**

Property 3: Bug Condition C — 이메일 미제공 카카오 계정 회원가입 처리

_For any_ 카카오 소셜 회원가입 요청에서 `email`이 `null` 또는 빈 값인 경우,
수정된 시스템은 `providerUserId`를 기반으로 고유한 `userId`를 생성하거나 사용자에게 이메일 입력을 요구하여
422 에러 없이 회원가입을 완료해야 한다.

**Validates: Requirements 2.3**

Property 4: Preservation — 기존 동작 유지

_For any_ 입력에서 버그 조건 A, B, C에 해당하지 않는 경우(일반 로그인, 일반 회원가입, 이메일 제공 카카오 계정,
구글 OAuth, 페이지 새로고침 세션 복구),
수정된 코드는 원본 코드와 동일한 동작을 유지해야 한다.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

## Fix Implementation

### 버그 A 수정

**파일**: `4beans-moa-front/src/store/authStore.js`

**변경 내용**:
1. `fetchSession()`에 `force` 옵션 파라미터 추가
   - `force = true`이면 `isFetchingSession` 가드를 우회하고 `hasRehydrated`를 리셋
   - 기존 `onRehydrateStorage` 호출은 `force = false`(기본값)로 동작 유지

```
// 변경 전
fetchSession: async () => {
  if (isFetchingSession) return;
  ...
}

// 변경 후
fetchSession: async (force = false) => {
  if (!force && isFetchingSession) return;
  if (force) {
    isFetchingSession = false;
    hasRehydrated = false;
  }
  ...
}
```

**파일**: `4beans-moa-front/src/pages/oauth/OAuthCallbackPage.jsx`

**변경 내용**:
2. `status === "LOGIN"` 분기에서 `fetchSession(true)` 호출 (강제 실행)

```
// 변경 전
if (status === "LOGIN") {
  await fetchSession();
  ...
}

// 변경 후
if (status === "LOGIN") {
  await fetchSession(true);
  ...
}
```

### 버그 B 수정

**파일**: `4beans-moa-backend/src/main/java/com/moa/user/controller/SignupRestController.java`

**변경 내용**:
1. `add()` 메서드에 `HttpServletRequest request`, `HttpServletResponse response` 파라미터 추가
2. 소셜 분기에서 `addUserAndLogin()` 반환값의 토큰을 HttpOnly 쿠키로 설정
3. 응답 바디에서 토큰 정보 제거 (보안)

```
// 변경 후 (소셜 분기)
@PostMapping("/add")
public ApiResponse<?> add(@RequestBody @Valid UserCreateRequest request,
                          HttpServletRequest req, HttpServletResponse response) {
  boolean isSocial = ...;
  if (isSocial) {
    Map<String, Object> result = userService.addUserAndLogin(request);
    // 쿠키 설정
    boolean isHttps = req.isSecure() || "https".equalsIgnoreCase(req.getHeader("X-Forwarded-Proto"));
    ResponseCookie accessCookie = ResponseCookie.from("ACCESS_TOKEN", (String) result.get("accessToken"))
        .httpOnly(true).secure(isHttps).sameSite(isHttps ? "None" : "Lax").path("/")
        .maxAge(...).build();
    ResponseCookie refreshCookie = ResponseCookie.from("REFRESH_TOKEN", (String) result.get("refreshToken"))
        .httpOnly(true).secure(isHttps).sameSite(isHttps ? "None" : "Lax").path("/")
        .maxAge(60 * 60 * 24 * 14).build();
    response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
    response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
    // 토큰 제외하고 반환
    return ApiResponse.success(Map.of("signupType", "SOCIAL", "user", result.get("user")));
  }
  ...
}
```

**파일**: `4beans-moa-front/src/hooks/auth/useSignup.js`

**변경 내용**:
4. `signupType === "SOCIAL"` 분기에서 `setTokens()` 호출 제거 (쿠키로 인증하므로 불필요)
5. `fetchCurrentUser()` 직접 호출로 세션 수립

### 버그 C 수정

**방법**: `providerUserId` 기반 fallback userId 생성 (이메일 없는 경우)

**파일**: `4beans-moa-front/src/hooks/auth/useSignup.js`

**변경 내용**:
1. 소셜 분기에서 `userId` 결정 로직 수정
   - `socialInfo.email`이 있으면 그대로 사용
   - 없으면 `kakao_{providerUserId}` 형식으로 생성

```
// 변경 전
userId: socialInfo.email,

// 변경 후
userId: socialInfo.email || `${socialInfo.provider}_${socialInfo.providerUserId}`,
```

2. 이메일 없는 경우 `socialEmail` 검증 로직 제거 또는 수정 (alert 후 중단하지 않도록)

**파일**: `4beans-moa-backend/src/main/java/com/moa/user/dto/request/UserCreateRequest.java`

**변경 내용**:
3. `userId` 필드의 `@NotBlank` 검증이 소셜 회원가입 시에도 통과할 수 있도록
   `provider`가 있는 경우 `userId` 자동 생성 로직을 서비스 레이어에 추가하는 방안 검토
   (또는 프론트엔드에서 항상 non-null userId를 전송하는 것으로 충분)

## Testing Strategy

### Validation Approach

두 단계로 검증합니다.
1. 수정 전 코드에서 버그를 재현하는 탐색 테스트 실행 → 실패 확인
2. 수정 후 코드에서 Fix Checking + Preservation Checking 실행 → 통과 확인

### Exploratory Bug Condition Checking

**목표**: 수정 전 코드에서 버그를 재현하여 근본 원인 분석을 검증합니다.

**테스트 케이스**:
1. **버그 A 탐색**: `hasRehydrated = true` 상태에서 `fetchSession()` 호출 → 무시됨 확인 (수정 전 실패)
2. **버그 B 탐색**: `POST /api/signup/add` (소셜) 응답 헤더에 `Set-Cookie` 없음 확인 (수정 전 실패)
3. **버그 C 탐색**: `userId = null`로 `POST /api/signup/add` 요청 → 422 반환 확인 (수정 전 실패)

**예상 반례**:
- 버그 A: `fetchSession()` 호출 후 `user`가 여전히 `null`
- 버그 B: 응답에 `Set-Cookie` 헤더 없음, 이후 `/api/users/me` 401
- 버그 C: 422 Unprocessable Entity, `@NotBlank` 위반 메시지

### Fix Checking

**목표**: 버그 조건이 충족되는 모든 입력에서 수정된 코드가 올바른 동작을 하는지 검증합니다.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition_A(input) DO
  result := fetchSession_fixed(true)
  ASSERT user IS NOT NULL AND _hydrated = true
END FOR

FOR ALL request WHERE isBugCondition_B(request) DO
  response := addUserAndLogin_fixed(request)
  ASSERT response.headers["Set-Cookie"] CONTAINS "ACCESS_TOKEN"
  ASSERT response.headers["Set-Cookie"] CONTAINS "REFRESH_TOKEN"
END FOR

FOR ALL socialInfo WHERE isBugCondition_C(socialInfo) DO
  result := signup_fixed(socialInfo)
  ASSERT result.status != 422
  ASSERT user IS CREATED
END FOR
```

### Preservation Checking

**목표**: 버그 조건에 해당하지 않는 입력에서 수정된 코드가 원본과 동일하게 동작하는지 검증합니다.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition_A(input) AND NOT isBugCondition_B(input) AND NOT isBugCondition_C(input) DO
  ASSERT original_behavior(input) = fixed_behavior(input)
END FOR
```

**테스트 케이스**:
1. **일반 로그인 새로고침 세션 복구**: `onRehydrateStorage` → `fetchSession()` 정상 실행 확인
2. **일반 회원가입**: `POST /api/signup/add` (일반) → 이메일 인증 메일 발송, PENDING 상태 확인
3. **이메일 제공 카카오 계정 회원가입**: `userId = email` 그대로 사용 확인
4. **카카오 기존 계정 로그인 쿠키**: 백엔드 콜백에서 `Set-Cookie` 헤더 정상 설정 확인
5. **CONNECT / NEED_TRANSFER 흐름**: 기존 동작 변경 없음 확인

### Unit Tests

- `fetchSession(force=true)` 호출 시 `hasRehydrated`, `isFetchingSession` 플래그 리셋 후 실행 확인
- `fetchSession(force=false)` 호출 시 기존 가드 동작 유지 확인
- `SignupRestController.add()` 소셜 분기에서 `Set-Cookie` 헤더 설정 확인
- `UserCreateRequest` 검증: `userId = null` 시 422, `userId = "kakao_12345"` 시 통과 확인

### Property-Based Tests

- 임의의 `providerUserId`에 대해 `kakao_{providerUserId}` 형식의 userId가 `@NotBlank`를 통과하는지 검증
- 임의의 소셜 회원가입 요청에 대해 응답에 항상 `ACCESS_TOKEN`, `REFRESH_TOKEN` 쿠키가 설정되는지 검증
- `force = true/false` 조합에서 `fetchSession` 실행 여부가 올바른지 검증

### Integration Tests

- 카카오 로그인 전체 흐름: 콜백 → 쿠키 설정 → `OAuthCallbackPage` → `fetchSession(true)` → 홈 이동 후 로그인 상태 확인
- 신규 카카오 회원가입 전체 흐름: 소셜 회원가입 → 쿠키 설정 → `/api/users/me` 인증 성공 → 홈 이동
- 이메일 미제공 카카오 계정 회원가입: `providerUserId` 기반 userId 생성 → 422 없이 가입 완료
