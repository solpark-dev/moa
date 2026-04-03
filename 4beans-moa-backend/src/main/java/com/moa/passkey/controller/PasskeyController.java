package com.moa.passkey.controller;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.Base64;
import java.util.List;
import java.util.Map;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.webauthn.api.AuthenticatorAssertionResponse;
import org.springframework.security.web.webauthn.api.AuthenticatorAttestationResponse;
import org.springframework.security.web.webauthn.api.PublicKeyCredential;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialCreationOptions;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialRequestOptions;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialUserEntity;
import org.springframework.security.web.webauthn.management.ImmutablePublicKeyCredentialCreationOptionsRequest;
import org.springframework.security.web.webauthn.management.ImmutablePublicKeyCredentialRequestOptionsRequest;
import org.springframework.security.web.webauthn.management.ImmutableRelyingPartyRegistrationRequest;
import org.springframework.security.web.webauthn.management.RelyingPartyAuthenticationRequest;
import org.springframework.security.web.webauthn.management.RelyingPartyPublicKey;
import org.springframework.security.web.webauthn.management.WebAuthnRelyingPartyOperations;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.moa.global.auth.provider.JwtProvider;
import com.moa.global.common.exception.BusinessException;
import com.moa.global.common.exception.ErrorCode;
import com.moa.passkey.repository.PasskeyCredentialRepository;
import com.moa.user.domain.User;
import com.moa.user.dto.TokenResponse;
import com.moa.user.repository.UserDao;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Passkey (WebAuthn) 커스텀 API 컨트롤러.
 *
 * Spring Security 6.5의 WebAuthnRelyingPartyOperations를 직접 호출하여
 * 등록·인증 챌린지 생성, 검증, JWT 발급을 처리합니다.
 *
 * 엔드포인트:
 *   POST /api/passkey/register/options    - 등록 챌린지 생성 (인증 필요)
 *   POST /api/passkey/register            - 등록 완료     (인증 필요)
 *   POST /api/passkey/authenticate/options - 인증 챌린지 생성 (공개)
 *   POST /api/passkey/authenticate        - 인증 완료 + JWT 발급 (공개)
 *   GET  /api/passkey/credentials         - 패스키 목록  (인증 필요)
 *   DELETE /api/passkey/credentials/{id}  - 패스키 삭제  (인증 필요)
 */
@Slf4j
@RestController
@RequestMapping("/api/passkey")
@RequiredArgsConstructor
public class PasskeyController {

    private static final String REG_OPTIONS_KEY  = "passkey:reg:options:";
    private static final String AUTH_OPTIONS_KEY = "passkey:auth:options:";

    private final WebAuthnRelyingPartyOperations webAuthnOps;
    private final PasskeyCredentialRepository    credentialRepository;
    private final UserDao                        userDao;
    private final JwtProvider                    jwtProvider;
    private final StringRedisTemplate            redisTemplate;
    private final ObjectMapper                   objectMapper;

    @Value("${server.ssl.enabled:false}")
    private boolean sslEnabled;

    // ─────────────────────────────────────────────────────────────
    // 패스키 등록 (Registration)
    // ─────────────────────────────────────────────────────────────

    /** Step 1: 등록 챌린지(PublicKeyCredentialCreationOptions) 생성 */
    @PostMapping("/register/options")
    public ResponseEntity<?> registrationOptions(Authentication authentication) {

        String userId = authentication.getName();

        // ImmutablePublicKeyCredentialCreationOptionsRequest(Authentication) 사용
        ImmutablePublicKeyCredentialCreationOptionsRequest request =
                new ImmutablePublicKeyCredentialCreationOptionsRequest(authentication);

        PublicKeyCredentialCreationOptions options =
                webAuthnOps.createPublicKeyCredentialCreationOptions(request);

        redisTemplate.opsForValue().set(
                REG_OPTIONS_KEY + userId,
                toJson(options),
                Duration.ofMinutes(5));

        return ResponseEntity.ok(options);
    }

    /** Step 2: 브라우저가 생성한 credential을 서버에 등록 */
    @PostMapping("/register")
    public ResponseEntity<?> register(
            Authentication authentication,
            @RequestBody String credentialJson) {

        String userId = authentication.getName();
        String regKey = REG_OPTIONS_KEY + userId;
        String optionsJson = redisTemplate.opsForValue().get(regKey);
        redisTemplate.delete(regKey);

        if (optionsJson == null) {
            throw new BusinessException(ErrorCode.INVALID_TOKEN,
                    "등록 세션이 만료되었습니다. 다시 시도해주세요.");
        }

        try {
            PublicKeyCredentialCreationOptions creationOptions =
                    fromJson(optionsJson, PublicKeyCredentialCreationOptions.class);

            PublicKeyCredential<AuthenticatorAttestationResponse> credential =
                    objectMapper.readValue(credentialJson, new TypeReference<>() {});

            RelyingPartyPublicKey publicKey = new RelyingPartyPublicKey(credential, null);
            webAuthnOps.registerCredential(
                    new ImmutableRelyingPartyRegistrationRequest(creationOptions, publicKey));

            return ResponseEntity.ok(Map.of("success", true));

        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("패스키 등록 실패: userId={}, error={}", userId, e.getMessage());
            throw new BusinessException(ErrorCode.INVALID_TOKEN, "패스키 등록에 실패했습니다.");
        }
    }

    // ─────────────────────────────────────────────────────────────
    // 패스키 인증 (Authentication)
    // ─────────────────────────────────────────────────────────────

    /**
     * Step 1: 인증 챌린지(PublicKeyCredentialRequestOptions) 생성.
     * AnonymousAuthenticationToken 전달 → 브라우저 passkey picker 표시
     */
    @PostMapping("/authenticate/options")
    public ResponseEntity<?> authenticationOptions() {

        // 익명 인증 토큰 → trustResolver.isAnonymous() == true → 자격증명 목록 조회 생략
        AnonymousAuthenticationToken anonymousAuth = new AnonymousAuthenticationToken(
                "passkey-anon", "anonymousUser",
                List.of(new SimpleGrantedAuthority("ROLE_ANONYMOUS")));

        ImmutablePublicKeyCredentialRequestOptionsRequest request =
                new ImmutablePublicKeyCredentialRequestOptionsRequest(anonymousAuth);

        PublicKeyCredentialRequestOptions requestOptions =
                webAuthnOps.createCredentialRequestOptions(request);

        String nonce = generateNonce();
        redisTemplate.opsForValue().set(
                AUTH_OPTIONS_KEY + nonce,
                toJson(requestOptions),
                Duration.ofMinutes(5));

        return ResponseEntity.ok(Map.of(
                "options", requestOptions,
                "nonce", nonce));
    }

    /** Step 2: assertion 검증 후 JWT 발급 */
    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(
            @RequestHeader("X-Passkey-Nonce") String nonce,
            @RequestBody String assertionJson,
            HttpServletResponse httpResponse) {

        String authKey = AUTH_OPTIONS_KEY + nonce;
        String optionsJson = redisTemplate.opsForValue().get(authKey);
        redisTemplate.delete(authKey);

        if (optionsJson == null) {
            throw new BusinessException(ErrorCode.INVALID_TOKEN,
                    "인증 세션이 만료되었습니다. 다시 시도해주세요.");
        }

        try {
            PublicKeyCredentialRequestOptions requestOptions =
                    fromJson(optionsJson, PublicKeyCredentialRequestOptions.class);

            PublicKeyCredential<AuthenticatorAssertionResponse> assertion =
                    objectMapper.readValue(assertionJson, new TypeReference<>() {});

            // authenticate() returns PublicKeyCredentialUserEntity (Spring Security 6.5 API)
            PublicKeyCredentialUserEntity userEntity = webAuthnOps.authenticate(
                    new RelyingPartyAuthenticationRequest(requestOptions, assertion));

            String userId = userEntity.getName(); // = 이메일(username)
            User user = userDao.findByUserId(userId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_USER));

            Authentication auth = new UsernamePasswordAuthenticationToken(
                    userId, null,
                    List.of(new SimpleGrantedAuthority(user.getRole())));

            TokenResponse token = jwtProvider.generateToken(auth, "passkey");

            ResponseCookie accessCookie = ResponseCookie.from("ACCESS_TOKEN", token.getAccessToken())
                    .httpOnly(true).secure(sslEnabled).sameSite("None").path("/")
                    .maxAge(token.getAccessTokenExpiresIn() / 1000).build();
            ResponseCookie refreshCookie = ResponseCookie.from("REFRESH_TOKEN", token.getRefreshToken())
                    .httpOnly(true).secure(sslEnabled).sameSite("None").path("/")
                    .maxAge(60L * 60 * 24 * 14).build();

            httpResponse.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
            httpResponse.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "userId", userId,
                    "accessToken", token.getAccessToken(),
                    "refreshToken", token.getRefreshToken(),
                    "accessTokenExpiresIn", token.getAccessTokenExpiresIn()));

        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("패스키 인증 실패: nonce={}, error={}", nonce, e.getMessage());
            throw new BusinessException(ErrorCode.INVALID_TOKEN, "패스키 인증에 실패했습니다.");
        }
    }

    // ─────────────────────────────────────────────────────────────
    // 패스키 관리 (Management)
    // ─────────────────────────────────────────────────────────────

    @GetMapping("/credentials")
    public ResponseEntity<?> listCredentials(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<Map<String, Object>> credentials =
                credentialRepository.findCredentialInfoByUserId(userDetails.getUsername());
        return ResponseEntity.ok(credentials);
    }

    @DeleteMapping("/credentials/{id}")
    public ResponseEntity<?> deleteCredential(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String id) {

        credentialRepository.deleteByIdAndUserId(id, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("success", true));
    }

    // ─────────────────────────────────────────────────────────────
    // helpers
    // ─────────────────────────────────────────────────────────────

    private String generateNonce() {
        byte[] bytes = new byte[32];
        new SecureRandom().nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException("JSON 직렬화 실패", e);
        }
    }

    private <T> T fromJson(String json, Class<T> type) {
        try {
            return objectMapper.readValue(json, type);
        } catch (Exception e) {
            throw new RuntimeException("JSON 역직렬화 실패", e);
        }
    }
}
