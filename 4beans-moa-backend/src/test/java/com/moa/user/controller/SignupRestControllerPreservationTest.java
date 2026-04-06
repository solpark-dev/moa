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
import com.moa.user.dto.response.UserResponse;
import com.moa.user.service.UserService;

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
 *   - 관찰 2: 일반 회원가입 → 이메일 인증 메일 발송, PENDING 상태 (요건 3.2)
 *   - 관찰 3: 이메일 제공 카카오 계정 회원가입 → userId = email 그대로 사용 (요건 3.5)
 *   - 관찰 4: 기존 카카오 로그인 백엔드 콜백 → Set-Cookie 헤더 정상 설정 (요건 3.1)
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("SignupRestController 보존 속성 테스트")
class SignupRestControllerPreservationTest {

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
    // 관찰 2: 일반 회원가입 — 이메일 인증 메일 발송, PENDING 상태 (요건 3.2)
    // ─────────────────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("관찰 2 — 일반 회원가입: 이메일 인증 메일 발송 및 PENDING 상태 (요건 3.2)")
    class Preservation_NormalSignup {

        @Test
        @DisplayName("일반 회원가입 요청 시 addUser()가 호출되고 200 응답을 반환한다")
        void 일반_회원가입_성공() throws Exception {
            /**
             * 보존 동작:
             * - provider 없는 일반 회원가입 요청
             * - userService.addUser() 호출 (addUserAndLogin() 아님)
             * - 200 OK 응답
             * - signupType: "NORMAL" 반환
             *
             * 이 동작은 버그 B 수정(소셜 분기 쿠키 설정) 후에도 변경되지 않아야 함
             */
            UserResponse mockUser = UserResponse.builder()
                    .userId("user@example.com")
                    .nickname("일반유저")
                    .build();

            given(userService.addUser(any())).willReturn(mockUser);

            String requestBodyJson = """
                    {
                        "userId": "user@example.com",
                        "password": "Password1!",
                        "passwordConfirm": "Password1!",
                        "nickname": "일반유저"
                    }
                    """;

            MvcResult result = mockMvc.perform(post("/api/signup/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBodyJson))
                    .andExpect(status().isOk())
                    .andReturn();

            // addUser()가 호출됨 (일반 회원가입 분기)
            verify(userService, times(1)).addUser(any());
            // addUserAndLogin()은 호출되지 않음
            verify(userService, never()).addUserAndLogin(any());

            // 응답 바디에 signupType: "NORMAL" 포함
            String responseBody = result.getResponse().getContentAsString();
            assertThat(responseBody).contains("NORMAL");
        }

        @Test
        @DisplayName("일반 회원가입 응답에는 Set-Cookie 헤더가 없다 (토큰 미발급 — 이메일 인증 대기)")
        void 일반_회원가입_응답에_쿠키_없음() throws Exception {
            /**
             * 보존 동작:
             * 일반 회원가입은 이메일 인증 후 로그인하므로
             * 회원가입 응답에 토큰 쿠키가 없어야 함
             * 이 동작은 버그 B 수정 후에도 변경되지 않아야 함
             */
            UserResponse mockUser = UserResponse.builder()
                    .userId("user@example.com")
                    .nickname("일반유저")
                    .build();

            given(userService.addUser(any())).willReturn(mockUser);

            String requestBodyJson = """
                    {
                        "userId": "user@example.com",
                        "password": "Password1!",
                        "passwordConfirm": "Password1!",
                        "nickname": "일반유저"
                    }
                    """;

            MvcResult result = mockMvc.perform(post("/api/signup/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBodyJson))
                    .andExpect(status().isOk())
                    .andReturn();

            // 일반 회원가입 응답에는 쿠키 없음 (이메일 인증 대기 상태)
            jakarta.servlet.http.Cookie[] cookies = result.getResponse().getCookies();
            assertThat(cookies)
                    .as("일반 회원가입 응답에는 쿠키가 없어야 함 (이메일 인증 대기)")
                    .isEmpty();
        }

        @Test
        @DisplayName("일반 회원가입 시 provider 필드가 없으면 일반 분기로 처리된다")
        void provider_없으면_일반_분기_처리() throws Exception {
            /**
             * 보존 동작:
             * provider가 null이거나 없으면 isSocial=false → addUser() 호출
             */
            UserResponse mockUser = UserResponse.builder()
                    .userId("user@example.com")
                    .nickname("일반유저")
                    .build();

            given(userService.addUser(any())).willReturn(mockUser);

            // provider 필드 없음
            String requestBodyJson = """
                    {
                        "userId": "user@example.com",
                        "password": "Password1!",
                        "passwordConfirm": "Password1!",
                        "nickname": "일반유저"
                    }
                    """;

            mockMvc.perform(post("/api/signup/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBodyJson))
                    .andExpect(status().isOk());

            verify(userService, times(1)).addUser(any());
            verify(userService, never()).addUserAndLogin(any());
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 관찰 3: 이메일 제공 카카오 계정 회원가입 — userId = email 그대로 사용 (요건 3.5)
    // ─────────────────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("관찰 3 — 이메일 제공 카카오 계정 회원가입: userId = email 그대로 사용 (요건 3.5)")
    class Preservation_KakaoWithEmail {

        @Test
        @DisplayName("이메일 제공 카카오 계정 회원가입 시 addUserAndLogin()이 호출된다")
        void 이메일_제공_카카오_회원가입_성공() throws Exception {
            /**
             * 보존 동작 (요건 3.5):
             * - provider="kakao", providerUserId 포함, userId=email 소셜 회원가입
             * - addUserAndLogin() 호출
             * - 200 OK 응답
             * - userId가 email 값 그대로 사용됨
             */
            given(userService.addUserAndLogin(any())).willReturn(Map.of(
                    "signupType", "SOCIAL",
                    "accessToken", "test-access-token",
                    "refreshToken", "test-refresh-token",
                    "accessTokenExpiresIn", System.currentTimeMillis() + 1800_000L,
                    "user", Map.of("userId", "kakao@example.com", "nickname", "카카오유저")
            ));

            String requestBodyJson = """
                    {
                        "userId": "kakao@example.com",
                        "nickname": "카카오유저",
                        "provider": "kakao",
                        "providerUserId": "12345678"
                    }
                    """;

            MvcResult result = mockMvc.perform(post("/api/signup/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBodyJson))
                    .andExpect(status().isOk())
                    .andReturn();

            // addUserAndLogin()이 호출됨 (소셜 분기)
            verify(userService, times(1)).addUserAndLogin(argThat(req ->
                    "kakao@example.com".equals(req.getUserId())
                    && "kakao".equals(req.getProvider())
                    && "12345678".equals(req.getProviderUserId())
            ));
            verify(userService, never()).addUser(any());
        }

        @Test
        @DisplayName("이메일 제공 카카오 계정 회원가입 시 소셜 분기로 처리된다 (provider + providerUserId 모두 있을 때)")
        void provider와_providerUserId_모두_있으면_소셜_분기() throws Exception {
            /**
             * 보존 동작:
             * provider != null && providerUserId != null → isSocial=true → addUserAndLogin() 호출
             */
            given(userService.addUserAndLogin(any())).willReturn(Map.of(
                    "signupType", "SOCIAL",
                    "accessToken", "test-access-token",
                    "refreshToken", "test-refresh-token",
                    "accessTokenExpiresIn", System.currentTimeMillis() + 1800_000L,
                    "user", Map.of("userId", "kakao@example.com")
            ));

            String requestBodyJson = """
                    {
                        "userId": "kakao@example.com",
                        "nickname": "카카오유저",
                        "provider": "kakao",
                        "providerUserId": "99999999"
                    }
                    """;

            mockMvc.perform(post("/api/signup/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBodyJson))
                    .andExpect(status().isOk());

            verify(userService, times(1)).addUserAndLogin(any());
            verify(userService, never()).addUser(any());
        }

        @Test
        @DisplayName("provider만 있고 providerUserId가 없으면 일반 분기로 처리된다")
        void provider만_있고_providerUserId_없으면_일반_분기() throws Exception {
            /**
             * 보존 동작:
             * isSocial = provider != null && !provider.isBlank()
             *            && providerUserId != null && !providerUserId.isBlank()
             * providerUserId가 없으면 isSocial=false → addUser() 호출
             */
            UserResponse mockUser = UserResponse.builder()
                    .userId("user@example.com")
                    .nickname("유저")
                    .build();

            given(userService.addUser(any())).willReturn(mockUser);

            String requestBodyJson = """
                    {
                        "userId": "user@example.com",
                        "password": "Password1!",
                        "passwordConfirm": "Password1!",
                        "nickname": "유저",
                        "provider": "kakao"
                    }
                    """;

            mockMvc.perform(post("/api/signup/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBodyJson))
                    .andExpect(status().isOk());

            verify(userService, times(1)).addUser(any());
            verify(userService, never()).addUserAndLogin(any());
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 관찰 4: 기존 카카오 로그인 백엔드 콜백 — Set-Cookie 헤더 정상 설정 (요건 3.1)
    // OAuthRestController의 kakaoCallback()은 기존 카카오 계정 로그인 시
    // ACCESS_TOKEN, REFRESH_TOKEN HttpOnly 쿠키를 설정하고 ?status=LOGIN으로 리다이렉트
    // 이 동작은 SignupRestController와 별개이므로 별도 테스트로 검증
    // ─────────────────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("관찰 4 — 소셜 회원가입 분기 판별 로직 보존 (요건 3.1, 3.5)")
    class Preservation_SocialBranchLogic {

        @Test
        @DisplayName("userId가 있는 소셜 회원가입은 항상 성공한다 (버그 C 수정 전후 공통)")
        void userId_있는_소셜_회원가입_항상_성공() throws Exception {
            /**
             * 보존 동작 (요건 3.5):
             * 이메일을 제공하는 카카오 계정은 userId=email로 회원가입 성공
             * 이 동작은 버그 C 수정 후에도 변경되지 않아야 함
             */
            given(userService.addUserAndLogin(any())).willReturn(Map.of(
                    "signupType", "SOCIAL",
                    "accessToken", "test-access-token",
                    "refreshToken", "test-refresh-token",
                    "accessTokenExpiresIn", System.currentTimeMillis() + 1800_000L,
                    "user", Map.of("userId", "kakao@example.com")
            ));

            String requestBodyJson = """
                    {
                        "userId": "kakao@example.com",
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

        @Test
        @DisplayName("userId가 있는 소셜 회원가입 응답에 signupType=SOCIAL이 포함된다")
        void 소셜_회원가입_응답에_signupType_SOCIAL_포함() throws Exception {
            /**
             * 보존 동작:
             * 소셜 회원가입 성공 시 응답 바디에 signupType: "SOCIAL" 포함
             */
            given(userService.addUserAndLogin(any())).willReturn(Map.of(
                    "signupType", "SOCIAL",
                    "accessToken", "test-token",
                    "refreshToken", "test-refresh",
                    "accessTokenExpiresIn", System.currentTimeMillis() + 1800_000L,
                    "user", Map.of("userId", "kakao@example.com")
            ));

            String requestBodyJson = """
                    {
                        "userId": "kakao@example.com",
                        "nickname": "카카오유저",
                        "provider": "kakao",
                        "providerUserId": "12345678"
                    }
                    """;

            MvcResult result = mockMvc.perform(post("/api/signup/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBodyJson))
                    .andExpect(status().isOk())
                    .andReturn();

            String responseBody = result.getResponse().getContentAsString();
            assertThat(responseBody).contains("SOCIAL");
        }

        @Test
        @DisplayName("일반 회원가입 응답에 signupType=NORMAL이 포함된다")
        void 일반_회원가입_응답에_signupType_NORMAL_포함() throws Exception {
            /**
             * 보존 동작:
             * 일반 회원가입 성공 시 응답 바디에 signupType: "NORMAL" 포함
             */
            UserResponse mockUser = UserResponse.builder()
                    .userId("user@example.com")
                    .nickname("일반유저")
                    .build();

            given(userService.addUser(any())).willReturn(mockUser);

            String requestBodyJson = """
                    {
                        "userId": "user@example.com",
                        "password": "Password1!",
                        "passwordConfirm": "Password1!",
                        "nickname": "일반유저"
                    }
                    """;

            MvcResult result = mockMvc.perform(post("/api/signup/add")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBodyJson))
                    .andExpect(status().isOk())
                    .andReturn();

            String responseBody = result.getResponse().getContentAsString();
            assertThat(responseBody).contains("NORMAL");
        }
    }
}
