package com.moa.user.controller;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.moa.global.service.passauth.PassAuthService;
import com.moa.user.service.UserService;

/**
 * 버그 조건 탐색 테스트 — 버그 B, 버그 C
 *
 * 목적: 수정 전 코드에서 버그가 실제로 존재함을 증명한다.
 * 이 테스트는 수정 전 코드에서 반드시 FAIL해야 한다 — 실패가 버그 존재를 증명한다.
 *
 * Validates: Requirements 1.2, 1.3
 *
 * 버그 B: POST /api/signup/add (소셜 분기) 응답 헤더에 Set-Cookie 없음
 *   - SignupRestController.add()가 HttpServletResponse를 파라미터로 받지 않아
 *     소셜 회원가입 시 ACCESS_TOKEN, REFRESH_TOKEN 쿠키를 설정하지 못함
 *
 * 버그 C: userId=null로 POST /api/signup/add 요청 시 422 반환
 *   - 카카오가 이메일을 제공하지 않는 경우 userId=null이 전송되어
 *     @NotBlank 검증 실패로 422 Unprocessable Entity 반환
 *
 * 반례(counterexample):
 *   - 버그 B: 소셜 회원가입 응답에 Set-Cookie 헤더 없음
 *   - 버그 C: userId=null 요청 시 422 응답
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("SignupRestController 버그 조건 탐색 테스트")
class SignupRestControllerBugConditionTest {

    @InjectMocks
    private SignupRestController signupRestController;

    @Mock
    private UserService userService;

    @Mock
    private PassAuthService passAuthService;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(signupRestController)
                .build();
        objectMapper = new ObjectMapper();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 버그 B: 소셜 회원가입 시 Set-Cookie 헤더 미설정
    // ─────────────────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("버그 B — 소셜 회원가입 응답에 Set-Cookie 헤더 없음")
    class BugB_SocialSignupNoCookie {

        @Test
        @DisplayName("bugFixed_B: 소셜 회원가입 요청 시 응답에 Set-Cookie 헤더가 있다 (버그 수정 확인)")
        void 소셜_회원가입_응답에_Set_Cookie_헤더_없음() throws Exception {
            /**
             * 버그 B 수정 확인:
             * - provider="kakao", providerUserId="12345678" 포함 소셜 회원가입 요청
             * - 수정 후: 응답 헤더에 ACCESS_TOKEN, REFRESH_TOKEN HttpOnly 쿠키 설정
             *
             * 기대 동작 (수정 후): 응답 헤더에 ACCESS_TOKEN, REFRESH_TOKEN HttpOnly 쿠키 설정
             */

            long expiresIn = System.currentTimeMillis() + 1800_000L; // 30분 후
            given(userService.addUserAndLogin(any())).willReturn(new java.util.HashMap<>(Map.of(
                    "signupType", "SOCIAL",
                    "accessToken", "eyJhbGciOiJIUzI1NiJ9.test.access",
                    "refreshToken", "eyJhbGciOiJIUzI1NiJ9.test.refresh",
                    "accessTokenExpiresIn", expiresIn,
                    "user", Map.of("userId", "kakao@test.com", "nickname", "카카오유저")
            )));

            // 소셜 회원가입 요청 (provider, providerUserId 포함)
            Map<String, Object> requestBody = Map.of(
                    "userId", "kakao@test.com",
                    "nickname", "카카오유저",
                    "provider", "kakao",
                    "providerUserId", "12345678"
            );

            MvcResult result = mockMvc.perform(post("/api/signup/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(requestBody)))
                    .andExpect(status().isOk())
                    .andReturn();

            // 버그 B 수정 확인: 응답 헤더에 Set-Cookie가 있어야 함
            String setCookieHeader = result.getResponse().getHeader("Set-Cookie");

            assertThat(setCookieHeader)
                    .as("버그 B 수정 확인: 소셜 회원가입 응답에 Set-Cookie 헤더가 설정되어야 함")
                    .isNotNull();

            // 응답 바디에 accessToken이 포함되지 않아야 함 (보안 개선)
            String responseBody = result.getResponse().getContentAsString();
            assertThat(responseBody)
                    .as("버그 B 수정 확인: 토큰이 응답 바디에 노출되지 않아야 함")
                    .doesNotContain("accessToken");
        }

        @Test
        @DisplayName("bugFixed_B: 소셜 회원가입 후 쿠키가 설정되어 인증 가능 (버그 수정 확인)")
        void 소셜_회원가입_후_쿠키_없어_인증_불가() throws Exception {
            /**
             * 버그 B 수정 확인:
             * 소셜 회원가입 응답에 Set-Cookie가 설정되므로
             * 이후 /api/users/me 호출 시 쿠키 기반 인증이 가능하다.
             */

            long expiresIn = System.currentTimeMillis() + 1800_000L;
            given(userService.addUserAndLogin(any())).willReturn(new java.util.HashMap<>(Map.of(
                    "signupType", "SOCIAL",
                    "accessToken", "test-access-token",
                    "refreshToken", "test-refresh-token",
                    "accessTokenExpiresIn", expiresIn,
                    "user", Map.of("userId", "kakao@test.com")
            )));

            Map<String, Object> requestBody = Map.of(
                    "userId", "kakao@test.com",
                    "nickname", "카카오유저",
                    "provider", "kakao",
                    "providerUserId", "99999999"
            );

            MvcResult result = mockMvc.perform(post("/api/signup/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(requestBody)))
                    .andExpect(status().isOk())
                    .andReturn();

            // 쿠키 목록 확인 — 쿠키가 설정되어야 함 (버그 수정 확인)
            jakarta.servlet.http.Cookie[] cookies = result.getResponse().getCookies();
            assertThat(cookies)
                    .as("버그 B 수정 확인: 소셜 회원가입 응답에 쿠키가 설정되어야 함")
                    .isNotEmpty();
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 버그 C: userId=null 시 422 에러
    // ─────────────────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("버그 C — userId=null 소셜 회원가입 시 422 반환")
    class BugC_NullUserId422 {

        @Test
        @DisplayName("isBugCondition_C: userId=null로 소셜 회원가입 요청 시 422 반환 (버그 존재 증명)")
        void userId_null_소셜_회원가입_422_반환() throws Exception {
            /**
             * 버그 C 시나리오:
             * - 카카오가 이메일을 제공하지 않는 계정
             * - 프론트엔드에서 userId=null로 전송
             * - @NotBlank 검증 실패 → 422 Unprocessable Entity
             *
             * 기대 동작 (수정 후): providerUserId 기반 userId 생성으로 422 없이 처리
             * 버그 동작 (수정 전): 422 반환
             */

            // userId=null인 소셜 회원가입 요청 (카카오 이메일 미제공 케이스)
            // JSON에서 userId를 null로 명시적으로 전송
            String requestBodyJson = """
                    {
                        "userId": null,
                        "nickname": "카카오유저",
                        "provider": "kakao",
                        "providerUserId": "12345678"
                    }
                    """;

            MvcResult result = mockMvc.perform(post("/api/signup/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBodyJson))
                    .andReturn();

            int status = result.getResponse().getStatus();

            /**
             * 버그 C 핵심 검증:
             * userId=null이면 @NotBlank 검증 실패로 400 또는 422가 반환되어야 함.
             * Spring Boot 기본 동작: @Valid 실패 시 400 Bad Request 또는
             * MethodArgumentNotValidException → 400
             *
             * 실제 버그: 프론트엔드에서 null을 전송하면 검증 실패로 회원가입 불가
             */
            assertThat(status)
                    .as("버그 C 증명: userId=null 요청 시 검증 실패 (400 또는 422) 반환")
                    .isIn(400, 422);
        }

        @Test
        @DisplayName("isBugCondition_C: userId 빈 문자열로 소셜 회원가입 요청 시 검증 실패")
        void userId_빈문자열_소셜_회원가입_검증_실패() throws Exception {
            /**
             * 버그 C 변형:
             * userId=""(빈 문자열)로 전송해도 @NotBlank 검증 실패
             */

            String requestBodyJson = """
                    {
                        "userId": "",
                        "nickname": "카카오유저",
                        "provider": "kakao",
                        "providerUserId": "12345678"
                    }
                    """;

            MvcResult result = mockMvc.perform(post("/api/signup/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBodyJson))
                    .andReturn();

            int status = result.getResponse().getStatus();

            assertThat(status)
                    .as("버그 C 증명: userId='' 요청 시 @NotBlank 검증 실패")
                    .isIn(400, 422);
        }

        @Test
        @DisplayName("isBugCondition_C: userId 없이 소셜 회원가입 요청 시 검증 실패")
        void userId_필드_없음_소셜_회원가입_검증_실패() throws Exception {
            /**
             * 버그 C 변형:
             * userId 필드 자체가 없는 경우 (undefined → JSON에서 누락)
             */

            String requestBodyJson = """
                    {
                        "nickname": "카카오유저",
                        "provider": "kakao",
                        "providerUserId": "12345678"
                    }
                    """;

            MvcResult result = mockMvc.perform(post("/api/signup/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBodyJson))
                    .andReturn();

            int status = result.getResponse().getStatus();

            assertThat(status)
                    .as("버그 C 증명: userId 필드 누락 시 @NotBlank 검증 실패")
                    .isIn(400, 422);
        }

        @Test
        @DisplayName("정상 케이스: userId가 있는 소셜 회원가입은 성공한다 (회귀 방지 기준)")
        void userId_있는_소셜_회원가입_성공() throws Exception {
            /**
             * 정상 케이스 확인:
             * userId가 있으면 소셜 회원가입이 성공해야 함
             * 이 테스트는 버그 C 수정 후에도 유지되어야 함
             */

            long expiresIn = System.currentTimeMillis() + 1800_000L;
            given(userService.addUserAndLogin(any())).willReturn(new java.util.HashMap<>(Map.of(
                    "signupType", "SOCIAL",
                    "accessToken", "test-token",
                    "refreshToken", "test-refresh",
                    "accessTokenExpiresIn", expiresIn,
                    "user", Map.of("userId", "kakao@test.com")
            )));

            String requestBodyJson = """
                    {
                        "userId": "kakao@test.com",
                        "nickname": "카카오유저",
                        "provider": "kakao",
                        "providerUserId": "12345678"
                    }
                    """;

            mockMvc.perform(post("/api/signup/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBodyJson))
                    .andExpect(status().isOk());
        }
    }
}
