# Bugfix Requirements Document

## Introduction

카카오 소셜 로그인 후 세션이 정상적으로 수립되지 않는 버그입니다.
두 가지 경로에서 문제가 발생합니다.

**경로 A — 기존 카카오 계정으로 로그인 시:**
백엔드 OAuth 콜백(`/api/oauth/kakao/callback`)은 ACCESS_TOKEN / REFRESH_TOKEN을 HttpOnly 쿠키로 올바르게 설정하고 프론트엔드로 리다이렉트합니다.
그러나 `OAuthCallbackPage`가 `fetchSession()`을 호출하는 시점에 `authStore`의 `onRehydrateStorage`가 이미 `fetchSession()`을 한 번 실행한 상태이고,
`isFetchingSession` 플래그가 아직 해제되지 않았거나 `hasRehydrated` 플래그가 이미 `true`로 설정되어 있어 두 번째 `fetchSession()` 호출이 무시됩니다.
결과적으로 쿠키는 존재하지만 세션 복구가 완료되지 않아 `/api/users/me`가 401을 반환합니다.

**경로 B — 신규 카카오 계정으로 소셜 회원가입 시:**
백엔드 `addUserAndLogin()`은 토큰을 **응답 바디(JSON)**로만 반환하고 HttpOnly 쿠키를 설정하지 않습니다.
프론트엔드 `useSignup`은 응답에서 `accessToken`을 꺼내 메모리에 저장한 뒤 `/api/users/me`를 호출하지만,
이 요청에는 쿠키가 없고 `Authorization` 헤더만 있습니다.
또한 카카오가 이메일을 제공하지 않는 계정의 경우 `userId`가 `null`로 전송되어 `@NotBlank` 검증 실패로 422가 반환됩니다.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN 기존 카카오 계정으로 로그인하여 `status=LOGIN`으로 콜백 페이지에 도달했을 때 THEN `OAuthCallbackPage`의 `fetchSession()` 호출이 `hasRehydrated` 또는 `isFetchingSession` 플래그에 의해 무시되어 세션이 수립되지 않는다

1.2 WHEN 신규 카카오 계정으로 소셜 회원가입(`/api/signup/add`) 완료 후 THEN 백엔드가 토큰을 응답 바디로만 반환하고 HttpOnly 쿠키를 설정하지 않아, 이후 `/api/users/me` 호출 시 쿠키 기반 인증이 불가능하다

1.3 WHEN 카카오가 이메일을 제공하지 않는 계정으로 소셜 회원가입을 시도할 때 THEN `userId` 필드가 `null`로 전송되어 `@NotBlank` 검증 실패로 422 Unprocessable Entity가 반환된다

### Expected Behavior (Correct)

2.1 WHEN 기존 카카오 계정으로 로그인하여 `status=LOGIN`으로 콜백 페이지에 도달했을 때 THEN 시스템은 `hasRehydrated` / `isFetchingSession` 플래그를 우회하거나 리셋하여 `fetchSession()`이 반드시 실행되고 세션이 정상 수립되어야 한다 (SHALL)

2.2 WHEN 신규 카카오 계정으로 소셜 회원가입이 완료될 때 THEN 백엔드는 ACCESS_TOKEN과 REFRESH_TOKEN을 HttpOnly 쿠키로 설정하여 응답해야 하며, 이후 `/api/users/me` 호출이 쿠키 기반으로 인증되어야 한다 (SHALL)

2.3 WHEN 카카오가 이메일을 제공하지 않는 계정으로 소셜 회원가입을 시도할 때 THEN 시스템은 `providerUserId`를 기반으로 고유한 `userId`를 생성하거나, 사용자에게 이메일 입력을 요구하여 422 없이 회원가입을 완료해야 한다 (SHALL)

### Unchanged Behavior (Regression Prevention)

3.1 WHEN 이미 카카오 계정이 연동된 사용자가 로그인할 때 THEN 시스템은 기존과 동일하게 JWT 토큰을 쿠키로 발급하고 `/oauth/callback?status=LOGIN`으로 리다이렉트해야 한다 (SHALL CONTINUE TO)

3.2 WHEN 일반(이메일/비밀번호) 회원가입을 진행할 때 THEN 시스템은 기존과 동일하게 이메일 인증 메일을 발송하고 PENDING 상태로 계정을 생성해야 한다 (SHALL CONTINUE TO)

3.3 WHEN 일반 로그인 후 페이지를 새로고침할 때 THEN `authStore`의 `onRehydrateStorage`가 `fetchSession()`을 호출하여 세션을 복구하는 기존 동작이 유지되어야 한다 (SHALL CONTINUE TO)

3.4 WHEN 카카오 계정 연동(`status=CONNECT`) 또는 계정 이전(`status=NEED_TRANSFER`) 흐름을 진행할 때 THEN 기존 OAuth 연동/이전 로직이 변경 없이 동작해야 한다 (SHALL CONTINUE TO)

3.5 WHEN 소셜 회원가입 시 카카오가 이메일을 제공하는 경우 THEN 해당 이메일이 `userId`로 사용되는 기존 동작이 유지되어야 한다 (SHALL CONTINUE TO)
