# Security Hardening

AWS 배포 준비 과정에서 수행한 보안 강화 작업 기록입니다.

---

## 배경

Docker/AWS 배포 가능 여부를 검토하던 중 보안 감사를 실시했습니다.
Critical 3건, High 4건, Medium 7건의 이슈를 발견하고 코드로 수정 가능한 10개 항목을 수정했습니다.

---

## 수정 완료 항목

### CRIT-2: Flyway `clean` 명령 비활성화

**파일:** `4beans-moa-backend/src/main/resources/application.properties`

`spring.flyway.clean-disabled=false` 상태에서는 Flyway의 `clean` 명령이 활성화되어 있어 DB 전체 테이블이 삭제될 수 있습니다.

```properties
# 변경 전
spring.flyway.clean-disabled=false

# 변경 후
spring.flyway.clean-disabled=true
```

---

### CRIT-3: JWT 토큰 localStorage 저장 제거

**파일:** `4beans-moa-front/src/store/authStore.js`

`accessToken`, `refreshToken`이 Zustand `persist`를 통해 `localStorage`에 저장되고 있었습니다.
XSS 공격 발생 시 14일짜리 refreshToken까지 탈취 가능한 구조였습니다.

```js
// 변경 전 — partialize에 토큰 포함
partialize: (state) => ({
  user: state.user,
  accessToken: state.accessToken,     // localStorage 저장
  refreshToken: state.refreshToken,   // localStorage 저장
  accessTokenExpiresIn: state.accessTokenExpiresIn,
})

// 변경 후 — user 정보만 persist
partialize: (state) => ({
  user: state.user,  // 토큰은 메모리에만 유지, 쿠키가 실제 인증 수단
})
```

- `accessToken`: Zustand 메모리에만 유지 (페이지 새로고침 시 `ACCESS_TOKEN` HttpOnly 쿠키로 fallback)
- `refreshToken`: 스토어에서 완전 제거, `REFRESH_TOKEN` HttpOnly 쿠키로만 처리
- 연동 파일: `useLogin.js`, `usePasskey.js`, `useSignup.js`의 `setTokens` 호출에서 `refreshToken` 제거

---

### HIGH-1: X-Forwarded-For 헤더 IP 스푸핑 방지

**파일:**
- `4beans-moa-backend/src/main/java/com/moa/global/common/filter/RateLimitFilter.java`
- `4beans-moa-backend/src/main/java/com/moa/user/controller/AuthRestController.java`

기존에는 `X-Forwarded-For` 헤더를 조건 없이 신뢰했습니다.
공격자가 헤더에 임의의 IP를 삽입하면 Rate Limit을 완전히 우회할 수 있었습니다.

```java
// 변경 후 — 신뢰된 프록시에서 온 경우에만 XFF 허용
private String getClientIp(HttpServletRequest request) {
    String remoteAddr = request.getRemoteAddr();
    if (isTrustedProxy(remoteAddr)) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isEmpty()) return xff.split(",")[0].trim();
    }
    return "0:0:0:0:0:0:0:1".equals(remoteAddr) ? "127.0.0.1" : remoteAddr;
}

// 신뢰 대역: localhost, Docker(172.16-31.x), AWS VPC(10.x, 192.168.x)
private boolean isTrustedProxy(String ip) {
    return ip.equals("127.0.0.1")
        || ip.equals("0:0:0:0:0:0:0:1")
        || ip.startsWith("10.")
        || ip.startsWith("192.168.")
        || (ip.startsWith("172.") && isDockerRange(ip));
}
```

---

### HIGH-2: Refresh Token 쿠키 기반 전환

**파일:**
- `4beans-moa-backend/src/main/java/com/moa/user/controller/AuthRestController.java`
- `4beans-moa-front/src/api/httpClient.js`

기존에는 `Refresh-Token` 커스텀 헤더로 refreshToken을 전송했습니다.
localStorage에 저장된 토큰을 XSS 스크립트가 헤더에 실어 새 accessToken을 발급받을 수 있었습니다.

```java
// 변경 전
@PostMapping("/refresh")
public ApiResponse<TokenResponse> refresh(@RequestHeader("Refresh-Token") String refreshToken) { ... }

// 변경 후 — REFRESH_TOKEN HttpOnly 쿠키에서 직접 읽음
@PostMapping("/refresh")
public ApiResponse<TokenResponse> refresh(HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
    String refreshToken = null;
    if (httpRequest.getCookies() != null) {
        for (var cookie : httpRequest.getCookies()) {
            if ("REFRESH_TOKEN".equals(cookie.getName())) {
                refreshToken = cookie.getValue();
                break;
            }
        }
    }
    // ...새 쿠키 발급 후 응답
}
```

```js
// 변경 전 — localStorage 토큰을 헤더로 전송
const refreshRes = await axios.post("/api/auth/refresh", null, {
  headers: { "Refresh-Token": refreshToken }
});

// 변경 후 — withCredentials로 쿠키 자동 전송
const refreshRes = await axios.post("/api/auth/refresh", null, {
  withCredentials: true
});
```

---

### HIGH-3: existsByEmail 엔드포인트 sentinel 제거

**파일:** `4beans-moa-backend/src/main/java/com/moa/user/controller/AuthRestController.java`

`__CHECK_ONLY__`라는 sentinel 값을 이용해 `unlockByCertification` 비즈니스 메서드를 계정 존재 확인에 우회 사용하고 있었습니다.

```java
// 변경 전 — 업무 메서드에 매직 sentinel 삽입
userService.unlockByCertification(email, "__CHECK_ONLY__", null);

// 변경 후 — DAO 직접 호출
if (userDao.existsByUserId(email.toLowerCase()) == 0) {
    throw new BusinessException(ErrorCode.USER_NOT_FOUND, "등록된 계정이 없습니다.");
}
```

---

### HIGH-4: restore 응답에서 raw 토큰 제거

**파일:** `4beans-moa-backend/src/main/java/com/moa/user/controller/AuthRestController.java`

`/api/auth/restore`가 HttpOnly 쿠키를 설정하면서 동시에 응답 body에도 `accessToken`, `refreshToken`을 평문으로 포함하고 있었습니다.

```java
// 변경 전
return ApiResponse.success(Map.of(
    "restored", true,
    "userId", userId,
    "accessToken", token.getAccessToken(),     // 불필요한 노출
    "refreshToken", token.getRefreshToken()    // 불필요한 노출
));

// 변경 후 — 쿠키가 이미 토큰을 전달하므로 body에서 제거
return ApiResponse.success(Map.of("restored", true, "userId", userId));
```

---

### HIGH-5: CORS 와일드카드 제거

**파일:** `4beans-moa-backend/src/main/resources/application-local.properties`

`app.cors.allowed-origins=*`와 `allowCredentials(true)`의 조합은 `setAllowedOriginPatterns` 사용 시 모든 출처에서 쿠키를 포함한 크로스 오리진 요청을 허용합니다.

```properties
# 변경 전
app.cors.allowed-origins=*

# 변경 후
app.cors.allowed-origins=https://localhost:5173,https://localhost:3000
```

---

### MED-1: XssFilter JSON body 필터링 추가

**파일:** `4beans-moa-backend/src/main/java/com/moa/global/common/filter/XssRequestWrapper.java`

기존 XSS 필터는 `getParameter()`, `getHeader()`만 처리하고 `getInputStream()` / `getReader()`는 처리하지 않았습니다.
`@RequestBody`로 받는 모든 JSON POST 요청이 XSS 필터를 우회하고 있었습니다.

```java
// 추가된 오버라이드
@Override
public ServletInputStream getInputStream() throws IOException {
    if (cachedBody != null) {
        ByteArrayInputStream bais = new ByteArrayInputStream(cachedBody);
        return new ServletInputStream() { /* ... */ };
    }
    return super.getInputStream();
}

@Override
public BufferedReader getReader() throws IOException {
    if (cachedBody != null) {
        return new BufferedReader(new InputStreamReader(
            new ByteArrayInputStream(cachedBody), StandardCharsets.UTF_8));
    }
    return super.getReader();
}
```

생성자에서 `application/json` 요청의 body를 읽어 sanitize 후 캐시합니다.

---

### MED-3: resend SDK 프론트 의존성 제거

**파일:** `4beans-moa-front/package.json`

서버 전용 이메일 SDK인 `resend`가 프론트엔드 `dependencies`에 포함되어 있었습니다.
번들에 포함될 경우 Resend API 키가 브라우저에 노출될 수 있었습니다.

```json
// 제거
"resend": "^6.5.2"
```

---

### MED-5: Swagger UI 프로덕션 비활성화

**파일:** `4beans-moa-backend/src/main/resources/application-prod.properties`

```properties
# 추가
springdoc.api-docs.enabled=false
springdoc.swagger-ui.enabled=false
```

---

### MED-7: exists-by-phone 응답에서 userId 제거

**파일:** `4beans-moa-backend/src/main/java/com/moa/user/controller/SignupRestController.java`

미인증 GET 요청으로 전화번호 → 이메일(userId) 매핑을 열거할 수 있었습니다.

```java
// 변경 전
return ApiResponse.success(Map.of("exists", true, "userId", user.getUserId()));

// 변경 후 — userId 제거
return ApiResponse.success(Map.of("exists", true));
```

---

## 별도 조치 필요 항목 (코드 외)

### CRIT-1: 커밋된 API 키/시크릿 로테이션

다음 키들이 `application-secret.properties` 및 `.env`에 평문으로 존재하며 git 히스토리에 남아 있습니다.

| 키 | 위험 |
|----|------|
| OpenAI API Key | 무단 과금 |
| PortOne imp-key/secret | 결제 도용 |
| Resend API Key | 스팸 메일 발송 |
| Kakao/Google OAuth Secret | 계정 탈취 |
| JWT Secret | 토큰 위조 |
| DB Password | DB 직접 접근 |

```bash
# 1. 모든 키 즉시 로테이션 (각 서비스 콘솔에서 재발급)

# 2. git 히스토리에서 파일 완전 제거
git filter-repo --path 4beans-moa-backend/src/main/resources/application-secret.properties --invert-paths
git filter-repo --path .env --invert-paths

# 3. 원격 저장소 force push
git push origin --force --all
```

### MED-4: Redis 인증 설정

```yaml
# docker-compose.prod.yml
redis:
  image: redis:7-alpine
  command: redis-server --requirepass ${REDIS_PASSWORD}
```

```properties
# .env에 추가
SPRING_DATA_REDIS_PASSWORD=your_redis_password
```

---

## AWS 배포 시 추가 체크리스트

- [ ] EC2 인스턴스에 `.env` 직접 생성 (`.env.example` 기반)
- [ ] `SPRING_DATASOURCE_URL` → RDS 엔드포인트로 변경
- [ ] `APP_SECURITY_AES_KEY` → 32바이트 랜덤 값으로 설정
- [ ] Redis `REDIS_PASSWORD` 설정
- [ ] `TOSS_CLIENT_KEY` 테스트 키 → 라이브 키 교체
- [ ] ALB 또는 호스트 nginx에서 HTTPS(443) → 내부 포트 프록시 설정
- [ ] 도메인 Kakao/Google OAuth redirect URI 등록 확인
