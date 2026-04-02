# MOA 인증 시스템 리팩토링 기록

> **작업 기간**: 2026-03
> **브랜치**: main
> **목적**: 부트캠프 팀 프로젝트의 인증 레이어를 포트폴리오 수준으로 고도화

---

## 개요

기존 이메일+비밀번호 단일 인증에서 다계층 인증 시스템으로 확장.
총 4개 Phase로 진행하였으며, 불필요한 기능 제거부터 패스키(WebAuthn) 도입까지 다룬다.

### 진행 상황

| Phase | 내용 | 상태 |
|-------|------|------|
| Phase 1 | 아이디 찾기 제거 | ✅ 완료 |
| Phase 2 | 비밀번호 재설정 (Email OTP) | ✅ 완료 |
| Phase 3 | Magic Link 로그인 | ✅ 완료 |
| Phase 4 | Passkey (WebAuthn) 로그인 | ✅ 완료 |

### 변경 범위 요약

| 구분 | 추가 | 수정 | 삭제 |
|------|------|------|------|
| Backend (Java) | 8개 파일 | 10개 파일 | - |
| Frontend (JSX/JS) | 9개 파일 | 8개 파일 | 8개 파일 |
| DB Migration | 1개 파일 | - | - |
| 의존성 | 2개 | - | - |

---

## Phase 1 — 아이디 찾기 제거

> **이유**: 이메일 기반 서비스에서 "아이디 찾기" 기능은 불필요. 코드 복잡도만 증가.

### 삭제된 파일

| 경로 | 설명 |
|------|------|
| `src/hooks/auth/useFindId.js` | 아이디 찾기 훅 |
| `src/store/user/findIdStore.js` | Zustand 상태 스토어 |
| `src/pages/user/findId/FindIdPage.jsx` | 아이디 찾기 페이지 |
| `src/pages/user/findId/components/FindIdForm.jsx` | 폼 컴포넌트 |
| `src/pages/user/findId/components/FindIdResult.jsx` | 결과 컴포넌트 |

### 수정된 파일

- **`App.jsx`**: `/find-id` 라우트 제거
- **`SignupRestController.java`**: 아이디 찾기 관련 엔드포인트 제거
- **`UserDao.java`** / **`UserService.java`** / **`UserServiceImpl.java`**: 관련 메서드 제거
- **`UserMapper.xml`**: 아이디 찾기 쿼리 제거

---

## Phase 2 — 비밀번호 재설정 (Email OTP)

> **이전**: 보안 질문 + 전화번호 기반의 레거시 방식
> **이후**: 이메일 OTP 6자리 코드 → 토큰 검증 → 비밀번호 변경 3단계 플로우

### 아키텍처

```
[사용자]
  │ POST /api/auth/reset-password/send      ① 이메일 입력
  ▼
[ResetPasswordService]
  │ - Redis에 OTP 저장 (TTL 10분)
  │ - Resend API로 이메일 발송
  │
  │ POST /api/auth/reset-password/verify    ② OTP 검증
  ▼
  │ - OTP 일치 확인
  │ - Redis에 reset token 저장 (TTL 30분)
  │ - OTP 즉시 삭제
  │
  │ POST /api/auth/reset-password/confirm   ③ 비밀번호 변경
  ▼
  │ - reset token 검증
  │ - bcrypt로 새 비밀번호 해시 후 저장
  └─ token 삭제
```

### 새로 추가된 파일

**Backend**

| 파일 | 역할 |
|------|------|
| `ResetPasswordService.java` | 인터페이스 |
| `ResetPasswordServiceImpl.java` | OTP 생성·검증, 토큰 관리, 비밀번호 변경 |
| `ResetPasswordVerifyRequest.java` | OTP 검증 요청 DTO |
| `templates/email/reset-password-otp.html` | 이메일 HTML 템플릿 |

**Frontend**

| 파일 | 역할 |
|------|------|
| `ResetPwdPage.jsx` | 3단계 통합 UI (send → verify → confirm) |

### 삭제된 파일 (레거시)

| 파일 | 이유 |
|------|------|
| `useResetPassword.js` | 레거시 전화번호 기반 훅 |
| `ResetPwdForm.jsx` | 구 폼 컴포넌트 |
| `ResetPwdGuide.jsx` | 구 안내 컴포넌트 |

### Redis 키 구조

```
reset:otp:{email}    →  "123456"        TTL 10분
reset:token:{email}  →  "<uuid>"        TTL 30분
```

### 수정된 파일

- **`AuthRestController.java`**: 3개 엔드포인트 추가
  - `POST /api/auth/reset-password/send`
  - `POST /api/auth/reset-password/verify`
  - `POST /api/auth/reset-password/confirm`
- **`EmailService.java`** / **`EmailServiceImpl.java`**: `sendResetPasswordOtp()` 추가
- **`SecurityConfig.java`**: 3개 엔드포인트 `permitAll()` 추가
- **`ErrorCode.java`**: `OTP_EXPIRED`, `OTP_MISMATCH`, `RESET_TOKEN_EXPIRED` 추가

---

## Phase 3 — Magic Link 로그인

> **목적**: 비밀번호 없이 이메일 링크 클릭만으로 로그인. 분실/임시 접근 시나리오 대응.

### 아키텍처

```
[사용자]
  │ POST /api/auth/magic-link/send          ① 이메일 입력
  ▼
[MagicLinkService]
  │ - SecureRandom으로 token 생성
  │ - Redis에 저장 (key: magic:{token}, value: email, TTL 15분)
  │ - Resend API로 로그인 링크 이메일 발송
  │
  │ POST /api/auth/magic-link/verify        ② 링크 클릭 (token 전달)
  ▼
  │ - Redis에서 token → email 조회
  │ - token 즉시 삭제 (1회용)
  │ - UsernamePasswordAuthenticationToken 생성
  │ - JwtProvider.generateToken(auth, "magic-link")
  │ - ACCESS_TOKEN / REFRESH_TOKEN 쿠키 발급
  └─ JSON 응답에도 token 포함 (기존 auth 패턴 동일)
```

### 새로 추가된 파일

**Backend**

| 파일 | 역할 |
|------|------|
| `MagicLinkService.java` | 인터페이스 |
| `MagicLinkServiceImpl.java` | token 생성·검증, JWT 발급 |
| `templates/email/magic-link.html` | 로그인 링크 이메일 HTML 템플릿 |

**Frontend**

| 파일 | 역할 |
|------|------|
| `MagicLinkPage.jsx` | 이메일 입력 UI |
| `MagicLinkCallbackPage.jsx` | 링크 클릭 후 token 검증 및 리다이렉트 |

### Redis 키 구조

```
magic:{token}  →  "user@example.com"   TTL 15분 (1회용 사용 후 즉시 삭제)
```

### 수정된 파일

- **`AuthRestController.java`**: 2개 엔드포인트 추가
  - `POST /api/auth/magic-link/send`
  - `POST /api/auth/magic-link/verify`
- **`EmailService.java`** / **`EmailServiceImpl.java`**: `sendMagicLink()` 추가
- **`SecurityConfig.java`**: 2개 엔드포인트 `permitAll()` 추가
- **`LoginPage.jsx`**: "이메일 링크로 로그인" 버튼 추가
- **`App.jsx`**: `/login/magic`, `/login/magic/callback` 라우트 추가

---

## Phase 4 — Passkey (WebAuthn) 로그인

> **목적**: FIDO2/WebAuthn 표준 기반 패스워드리스 인증. 지문·안면인식 등 플랫폼 인증기 지원.

### 기술 스택

| 레이어 | 사용 기술 |
|--------|----------|
| Backend | Spring Security 6.5 WebAuthn API + webauthn4j-core |
| Frontend | `@simplewebauthn/browser` v13 |
| 챌린지 저장 | Redis (nonce 기반, TTL 5분) |
| 자격증명 저장 | MySQL `PASSKEY_CREDENTIALS` (JSON 직렬화) |

### 아키텍처

#### 등록 플로우

```
[사용자 — 마이페이지 보안 설정]
  │
  │ POST /api/passkey/register/options     ① 챌린지 요청 (JWT 인증 필요)
  ▼
[PasskeyController]
  │ - ImmutablePublicKeyCredentialCreationOptionsRequest(authentication)
  │ - webAuthnOps.createPublicKeyCredentialCreationOptions(request)
  │ - Redis 저장: passkey:reg:options:{userId}  TTL 5분
  │
  │ [브라우저 WebAuthn API] startRegistration()
  │   → 플랫폼 인증기 UI 표시 (지문/안면인식)
  │
  │ POST /api/passkey/register             ② credential 등록
  ▼
  │ - Redis에서 creationOptions 꺼냄 (getAndDelete)
  │ - ImmutableRelyingPartyRegistrationRequest(options, RelyingPartyPublicKey)
  │ - webAuthnOps.registerCredential(request)
  │   → PasskeyCredentialRepository.save() 호출
  │   → PASSKEY_CREDENTIALS 테이블에 저장
  └─ 성공 응답
```

#### 인증 플로우

```
[사용자 — 로그인 페이지]
  │
  │ POST /api/passkey/authenticate/options  ① 챌린지 요청 (공개 API)
  ▼
[PasskeyController]
  │ - AnonymousAuthenticationToken 전달 → passkey picker 표시
  │ - webAuthnOps.createCredentialRequestOptions(request)
  │ - Redis 저장: passkey:auth:options:{nonce}  TTL 5분
  │ - 응답: { options, nonce }
  │
  │ [브라우저 WebAuthn API] startAuthentication()
  │   → 플랫폼 패스키 선택 UI
  │
  │ POST /api/passkey/authenticate          ② assertion 검증 + JWT 발급
  │   Header: X-Passkey-Nonce: {nonce}
  ▼
  │ - Redis에서 requestOptions 꺼냄 (getAndDelete)
  │ - webAuthnOps.authenticate(RelyingPartyAuthenticationRequest)
  │   → PublicKeyCredentialUserEntity 반환 (getName() = userId)
  │ - User 조회 → UsernamePasswordAuthenticationToken 생성
  │ - JwtProvider.generateToken(auth, "passkey")
  │ - ACCESS_TOKEN / REFRESH_TOKEN 쿠키 발급
  └─ JSON 응답에도 token 포함
```

### DB 스키마 (V2__add_passkey_tables.sql)

```sql
CREATE TABLE PASSKEY_USER_ENTITIES (
    id           VARCHAR(512) NOT NULL PRIMARY KEY,  -- Base64URL(userEntity.id)
    user_id      VARCHAR(255) NOT NULL,              -- 이메일
    display_name VARCHAR(255),
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PASSKEY_CREDENTIALS (
    id                    VARCHAR(36)    NOT NULL PRIMARY KEY,
    user_id               VARCHAR(255)   NOT NULL,
    credential_id         VARCHAR(512)   NOT NULL UNIQUE,  -- Base64URL
    credential_json       MEDIUMTEXT     NOT NULL,          -- CredentialRecord JSON
    label                 VARCHAR(100),
    created_at            DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_used_at          DATETIME
);
```

### 새로 추가된 파일

**Backend**

| 파일 | 역할 |
|------|------|
| `passkey/config/PasskeyConfig.java` | `WebauthnJackson2Module` + `Webauthn4JRelyingPartyOperations` Bean |
| `passkey/controller/PasskeyController.java` | 6개 커스텀 엔드포인트 |
| `passkey/repository/PasskeyCredentialRepository.java` | `UserCredentialRepository` 구현, JSON 직렬화 |
| `passkey/repository/PasskeyUserEntityRepository.java` | `PublicKeyCredentialUserEntityRepository` 구현 |
| `db/migration/V2__add_passkey_tables.sql` | Flyway 마이그레이션 |

**Frontend**

| 파일 | 역할 |
|------|------|
| `hooks/auth/usePasskey.js` | 등록·인증·관리 훅 |
| `pages/user/mypage/components/PasskeySection.jsx` | 마이페이지 패스키 관리 UI |

### API 엔드포인트

| Method | 경로 | 인증 | 설명 |
|--------|------|------|------|
| POST | `/api/passkey/register/options` | JWT 필요 | 등록 챌린지 생성 |
| POST | `/api/passkey/register` | JWT 필요 | 자격증명 등록 |
| POST | `/api/passkey/authenticate/options` | 공개 | 인증 챌린지 생성 |
| POST | `/api/passkey/authenticate` | 공개 | assertion 검증 + JWT 발급 |
| GET | `/api/passkey/credentials` | JWT 필요 | 패스키 목록 |
| DELETE | `/api/passkey/credentials/{id}` | JWT 필요 | 패스키 삭제 |

### Spring Security 6.5 API 핵심 사항

> Spring Security 6.5의 WebAuthn API는 자동완성·문서에서 잘못 나오는 경우가 많아 실제 JAR를 직접 디컴파일하여 확인함.

| 잘못된 코드 | 실제 올바른 코드 |
|------------|----------------|
| `new PublicKeyCredentialCreationOptionsRequest(userId)` | `new ImmutablePublicKeyCredentialCreationOptionsRequest(authentication)` |
| `webAuthnOps.register(options, credential)` | `webAuthnOps.registerCredential(new ImmutableRelyingPartyRegistrationRequest(...))` |
| `webAuthnOps.createPublicKeyCredentialRequestOptions(req)` | `webAuthnOps.createCredentialRequestOptions(req)` |
| `SuccessfulAuthenticationData` (존재하지 않음) | `authenticate()` 반환값: `PublicKeyCredentialUserEntity` → `.getName()` |
| `WebAuthnJackson2Module` | `WebauthnJackson2Module` (소문자 n) |
| `management.CredentialRecord` | `api.CredentialRecord` |
| `management.ImmutableCredentialRecord` | `api.ImmutableCredentialRecord` |

### CredentialRecord 직렬화 방식

`ImmutableCredentialRecord`는 **private 생성자**로 Jackson 직접 역직렬화 불가.
`WebauthnJackson2Module`도 `CredentialRecord` 역직렬화를 제공하지 않음.
→ **커스텀 `toJson()`/`fromJson()` 구현**: `ImmutableCredentialRecord.builder()`로 필드별 재조립.

```java
// 직렬화: CredentialRecord → JSON
ObjectNode node = objectMapper.createObjectNode();
node.put("credentialId", r.getCredentialId().toBase64UrlString());
node.put("publicKey", Base64.getUrlEncoder().encodeToString(r.getPublicKey().getBytes()));
// ... 나머지 필드

// 역직렬화: JSON → ImmutableCredentialRecord
return ImmutableCredentialRecord.builder()
    .credentialId(Bytes.fromBase64(node.get("credentialId").asText()))
    .publicKey(ImmutablePublicKeyCose.fromBase64(node.get("publicKey").asText()))
    // ...
    .build();
```

### 추가된 의존성

**`pom.xml`**
```xml
<dependency>
    <groupId>com.webauthn4j</groupId>
    <artifactId>webauthn4j-core</artifactId>
    <!-- Spring Boot 3.5.x BOM 관리 -->
</dependency>
```

**`package.json`**
```json
"@simplewebauthn/browser": "^13.1.0"
```

---

## 공통 인프라 개선

Phase 전반에 걸쳐 함께 개선된 공통 인프라.

### httpClient.js 개선 (`src/api/httpClient.js`)

- Axios 인터셉터에 자동 토큰 갱신 (refresh token rotation) 로직 추가
- 401 응답 시 토큰 갱신 후 큐에 쌓인 요청 재처리
- 네트워크 에러 / 인증 에러 / 일반 에러 분기 처리
- `useToastStore`와 연동해 에러 메시지 자동 토스트 표시

### toastStore.js + ToastContainer.jsx

- 전역 토스트 알림 시스템 (success / error / warning / info)
- `httpClient.js` 에러 핸들러에서 자동 호출

### ErrorBoundary + ErrorFallback

- React Error Boundary 컴포넌트 추가 (`src/components/common/ErrorBoundary.jsx`)
- 렌더링 에러 발생 시 폴백 UI 표시

### WebhookNotificationService.java

- 서버 이벤트(결제 실패, 파티 이상 등)를 Discord/Slack 웹훅으로 전송하는 서비스 추가

### GlobalExceptionHandler 개선

- `@ExceptionHandler` 확장: `MethodArgumentNotValidException`, `ConstraintViolationException` 등 추가 처리
- 에러 응답 형식 통일 (`ApiError` / `ApiResponse` 구조 정비)

### 이메일 템플릿 (`src/main/resources/templates/email/`)

| 파일 | 사용처 |
|------|--------|
| `reset-password-otp.html` | 비밀번호 재설정 OTP 이메일 |
| `magic-link.html` | Magic Link 로그인 이메일 |

---

## Redis 키 전체 목록

| 키 패턴 | 용도 | TTL |
|---------|------|-----|
| `reset:otp:{email}` | 비밀번호 재설정 OTP | 10분 |
| `reset:token:{email}` | 비밀번호 재설정 검증 토큰 | 30분 |
| `magic:{token}` | Magic Link 로그인 토큰 | 15분 |
| `passkey:reg:options:{userId}` | WebAuthn 등록 챌린지 | 5분 |
| `passkey:auth:options:{nonce}` | WebAuthn 인증 챌린지 | 5분 |
| `refresh:{userId}` | JWT Refresh Token | 14일 |

---

## SecurityConfig 변경 내역

`permitAll()` 에 추가된 경로:

```java
"/api/auth/reset-password/send",
"/api/auth/reset-password/verify",
"/api/auth/reset-password/confirm",
"/api/auth/magic-link/send",
"/api/auth/magic-link/verify",
"/api/passkey/authenticate/options",
"/api/passkey/authenticate"
```

---

## 로그인 방식 비교

| 방식 | 구현 여부 | 특징 |
|------|----------|------|
| 이메일 + 비밀번호 | ✅ 기존 | 기본 인증 |
| OTP (TOTP) | ✅ 기존 | Google Authenticator 연동 |
| Google OAuth2 | ✅ 기존 | 소셜 로그인 |
| Kakao OAuth2 | ✅ 기존 | 소셜 로그인 |
| 비밀번호 재설정 | ✅ Phase 2 신규 | 이메일 OTP → 토큰 → 변경 |
| Magic Link | ✅ Phase 3 신규 | 1회용 이메일 링크 |
| Passkey (WebAuthn) | ✅ Phase 4 신규 | 지문·안면인식 |
