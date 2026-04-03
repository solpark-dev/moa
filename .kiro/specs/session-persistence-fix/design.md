# Design Document: Session Persistence Fix

## Overview

This design addresses the session persistence issue where users are logged out when refreshing the mypage. The root cause is that the frontend's session recovery mechanism (`fetchSession`) is not properly handling the HttpOnly cookie-based authentication flow. The backend sets an `ACCESS_TOKEN` cookie, but the frontend's `httpClient` and `authStore` are not correctly utilizing it during page refresh.

The solution involves:
1. Ensuring the `httpClient` properly sends cookies with requests
2. Fixing the `authStore` session recovery logic to handle cookie-based authentication
3. Improving error handling and loading states during session recovery
4. Preventing redundant session recovery calls

## Architecture

### Current Flow (Broken)
```
Page Refresh
  → authStore rehydrates from localStorage (user data only)
  → onRehydrateStorage triggers fetchSession()
  → fetchSession calls /users/me
  → httpClient adds Authorization header (but accessToken is null in memory)
  → Backend receives request without valid auth
  → Returns 401
  → Frontend clears auth and redirects to login
```

### Fixed Flow
```
Page Refresh
  → authStore rehydrates from localStorage (user data only)
  → onRehydrateStorage triggers fetchSession()
  → fetchSession calls /users/me
  → httpClient sends request with cookies (ACCESS_TOKEN cookie auto-sent)
  → Backend validates ACCESS_TOKEN cookie via JwtAuthenticationFilter
  → Returns user data
  → Frontend updates authStore with user data
  → Sets _hydrated = true
  → ProtectedRoute renders protected content
```

## Components and Interfaces

### 1. AuthStore (Zustand)

**State:**
```typescript
{
  user: User | null,
  accessToken: string | null,  // Memory only, not persisted
  loading: boolean,
  _hydrated: boolean,           // True after rehydration + fetchSession complete
}
```

**Actions:**
- `setTokens({ accessToken, accessTokenExpiresIn })`: Updates access token in memory
- `setUser(user)`: Updates user data
- `clearAuth()`: Clears all auth state
- `fetchSession()`: Calls `/users/me` to restore session from cookies
- `logout()`: Logs out user and clears auth state

**Persistence Strategy:**
- Only `user` object is persisted to localStorage
- `accessToken` is kept in memory only (XSS protection)
- On rehydration, `fetchSession()` is automatically called to restore session from HttpOnly cookies

### 2. HttpClient (Axios)

**Configuration:**
```javascript
{
  baseURL: '/api',
  withCredentials: true,  // CRITICAL: Sends cookies with requests
  headers: {
    'Content-Type': 'application/json; charset=UTF-8'
  }
}
```

**Request Interceptor:**
- Adds `Authorization: Bearer ${accessToken}` header if accessToken exists in memory
- Skips auth for requests with `skipAuth: true` config

**Response Interceptor:**
- Handles 401 errors by attempting token refresh
- Implements request queuing during token refresh
- Handles network errors with appropriate user feedback
- Handles 403, 429, 500 errors with toast notifications

### 3. ProtectedRoute Component

**Logic:**
```javascript
if (!_hydrated) {
  return <LoadingFallback />;  // Wait for session recovery
}

if (!user) {
  return <Navigate to="/login" replace />;  // No session, redirect
}

return element;  // Render protected content
```

## Data Models

### User
```typescript
interface User {
  userId: string;
  email: string;
  name: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  otpEnabled: boolean;
  agreeMarketing: boolean;
  loginProvider?: 'EMAIL' | 'KAKAO' | 'GOOGLE';
  oauthConnections?: OAuthConnection[];
  // ... other fields
}
```

### TokenResponse
```typescript
interface TokenResponse {
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken?: string;
  refreshTokenExpiresIn?: number;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Session recovery preserves authentication state
*For any* authenticated user with valid cookies, when the page is refreshed, the system should restore the user's authentication state without requiring re-login.
**Validates: Requirements 1.1, 1.2**

### Property 2: Failed session recovery clears state
*For any* session recovery attempt that fails (expired cookies, network error, etc.), the system should clear all authentication state and set `_hydrated` to true.
**Validates: Requirements 1.3, 2.3**

### Property 3: Loading state prevents premature rendering
*For any* protected route, when `_hydrated` is false, the system should display a loading indicator and not render protected content or redirect to login.
**Validates: Requirements 3.1, 3.2**

### Property 4: Session recovery is idempotent
*For any* sequence of navigation events on protected routes, the system should not trigger redundant session recovery calls if a valid session already exists.
**Validates: Requirements 3.4**

### Property 5: Cookie-based requests work without in-memory token
*For any* API request when `accessToken` is null in memory but valid `ACCESS_TOKEN` cookie exists, the backend should successfully authenticate the request.
**Validates: Requirements 1.1**

## Error Handling

### Session Recovery Errors

1. **Network Error (No Response)**
   - Log error to console
   - Display toast: "서버에 연결할 수 없습니다. 네트워크를 확인해주세요."
   - Clear auth state
   - Set `_hydrated = true`

2. **401 Unauthorized (Expired/Invalid Cookies)**
   - Clear auth state silently (no toast)
   - Set `_hydrated = true`
   - ProtectedRoute will redirect to login

3. **403 Forbidden**
   - Display toast: "접근 권한이 없습니다."
   - Clear auth state
   - Set `_hydrated = true`

4. **500 Server Error**
   - Log traceId if available
   - Display toast: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
   - Clear auth state
   - Set `_hydrated = true`

### Token Refresh Errors

1. **Refresh Token Expired**
   - Clear auth state
   - Process queued requests with error
   - User will be redirected to login by ProtectedRoute

2. **Network Error During Refresh**
   - Clear auth state
   - Process queued requests with error
   - Display network error toast

## Testing Strategy

### Unit Tests

1. **AuthStore Tests**
   - Test `fetchSession` success path
   - Test `fetchSession` failure path
   - Test `clearAuth` clears all state
   - Test `setTokens` updates accessToken
   - Test `logout` calls API and clears state

2. **HttpClient Tests**
   - Test `withCredentials: true` is set
   - Test Authorization header is added when accessToken exists
   - Test Authorization header is not added when accessToken is null
   - Test 401 triggers token refresh
   - Test token refresh success updates accessToken
   - Test token refresh failure clears auth

3. **ProtectedRoute Tests**
   - Test renders loading when `_hydrated` is false
   - Test redirects to login when `_hydrated` is true and user is null
   - Test renders element when `_hydrated` is true and user exists

### Property-Based Tests

Property-based testing will be implemented using `fast-check` library for JavaScript. Each test should run a minimum of 100 iterations.

1. **Property 1: Session recovery preserves authentication state**
   - Generate random valid user objects
   - Mock `/users/me` to return the user
   - Call `fetchSession()`
   - Assert user state is populated and `_hydrated` is true

2. **Property 2: Failed session recovery clears state**
   - Generate random error responses (401, 403, 500, network error)
   - Mock `/users/me` to return the error
   - Call `fetchSession()`
   - Assert user state is null and `_hydrated` is true

3. **Property 3: Loading state prevents premature rendering**
   - Generate random `_hydrated` and `user` combinations
   - Render ProtectedRoute with different states
   - Assert correct rendering based on state

4. **Property 4: Session recovery is idempotent**
   - Generate random sequences of navigation events
   - Track `fetchSession` call count
   - Assert `fetchSession` is called only once when session exists

### Integration Tests

1. **Full Authentication Flow**
   - Login → Navigate to mypage → Refresh page → Verify still logged in
   - Login → Navigate to mypage → Clear cookies → Refresh → Verify redirected to login

2. **Token Refresh Flow**
   - Login → Wait for token expiry → Make API call → Verify token refreshed → Verify request succeeds

3. **Error Recovery Flow**
   - Login → Simulate network error → Verify error handling → Restore network → Verify recovery

## Implementation Notes

### Key Changes Required

1. **authStore.js**
   - Ensure `fetchSession` properly handles success and failure cases
   - Ensure `_hydrated` is always set to true after `fetchSession` completes
   - Add error logging for debugging

2. **httpClient.js**
   - Verify `withCredentials: true` is set (already present)
   - Ensure Authorization header is optional (only added if accessToken exists)
   - Improve error handling for session recovery failures

3. **ProtectedRoute.jsx**
   - Ensure it waits for `_hydrated` before making routing decisions
   - Display appropriate loading state

4. **useMyPage.js**
   - Remove redundant `fetchSession` call in useEffect
   - Rely on authStore's automatic session recovery

### Backend Verification

The backend `JwtAuthenticationFilter` already supports cookie-based authentication:
```java
if (("ACCESS_TOKEN".equals(name) || "accessToken".equals(name)) && StringUtils.hasText(c.getValue())) {
    return c.getValue();
}
```

The backend sets cookies with appropriate flags:
```java
ResponseCookie accessCookie = ResponseCookie.from("ACCESS_TOKEN", token.getAccessToken())
    .httpOnly(true)
    .secure(isHttps)
    .sameSite(isHttps ? "None" : "Lax")
    .path("/")
    .maxAge(accessMaxAge)
    .build();
```

### Security Considerations

1. **XSS Protection**: Access tokens are not stored in localStorage, only in memory
2. **CSRF Protection**: SameSite cookie attribute provides CSRF protection
3. **Secure Transport**: Cookies are marked secure in production (HTTPS)
4. **HttpOnly**: Cookies are HttpOnly to prevent JavaScript access

## Dependencies

- `zustand`: State management
- `zustand/middleware`: Persist middleware
- `axios`: HTTP client
- `react-router-dom`: Routing
- `fast-check`: Property-based testing (to be added)
