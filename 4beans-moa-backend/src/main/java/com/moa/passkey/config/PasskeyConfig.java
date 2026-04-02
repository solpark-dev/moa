package com.moa.passkey.config;

import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialRpEntity;
import org.springframework.security.web.webauthn.jackson.WebauthnJackson2Module;
import org.springframework.security.web.webauthn.management.PublicKeyCredentialUserEntityRepository;
import org.springframework.security.web.webauthn.management.UserCredentialRepository;
import org.springframework.security.web.webauthn.management.WebAuthnRelyingPartyOperations;
import org.springframework.security.web.webauthn.management.Webauthn4JRelyingPartyOperations;

/**
 * Passkey (WebAuthn) 설정.
 *
 * - WebauthnJackson2Module: CredentialRecord 등 WebAuthn 타입을 Jackson으로 직렬화/역직렬화
 * - WebAuthnRelyingPartyOperations: 등록·인증 챌린지 생성 및 검증
 */
@Configuration
public class PasskeyConfig {

    @Value("${app.webauthn.rp-id}")
    private String rpId;

    @Value("${app.webauthn.rp-name}")
    private String rpName;

    @Value("${app.webauthn.allowed-origins}")
    private String allowedOrigins;

    /**
     * Spring Boot Jackson 자동 구성이 이 Bean을 감지해 primary ObjectMapper에 자동 등록합니다.
     * PasskeyCredentialRepository의 credential_json 직렬화에 필수입니다.
     */
    @Bean
    public WebauthnJackson2Module webauthnJackson2Module() {
        return new WebauthnJackson2Module();
    }

    /**
     * WebAuthn 등록·인증 챌린지 생성 및 검증을 담당하는 빈.
     * PasskeyController에서 직접 사용합니다.
     */
    @Bean
    public WebAuthnRelyingPartyOperations webAuthnRelyingPartyOperations(
            PublicKeyCredentialUserEntityRepository userEntityRepository,
            UserCredentialRepository credentialRepository) {

        PublicKeyCredentialRpEntity rpEntity = PublicKeyCredentialRpEntity.builder()
                .id(rpId)
                .name(rpName)
                .build();

        Set<String> origins = Set.of(allowedOrigins.split(","));

        return new Webauthn4JRelyingPartyOperations(
                userEntityRepository,
                credentialRepository,
                rpEntity,
                origins);
    }
}
