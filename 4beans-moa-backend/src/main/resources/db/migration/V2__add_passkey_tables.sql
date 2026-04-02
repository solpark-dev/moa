-- ============================================
-- Passkey (WebAuthn) 인증 테이블
-- Spring Security 6.5 WebAuthn 지원용
-- ============================================

-- 사용자별 WebAuthn User Entity ID 매핑
CREATE TABLE PASSKEY_USER_ENTITIES (
    id           VARCHAR(255)  NOT NULL COMMENT 'Base64URL encoded user entity id',
    user_id      VARCHAR(255)  NOT NULL COMMENT 'FK: USERS.USER_ID',
    display_name VARCHAR(255)  COMMENT '표시 이름',
    created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_passkey_user (user_id),
    CONSTRAINT fk_passkey_user FOREIGN KEY (user_id) REFERENCES USERS (USER_ID) ON DELETE CASCADE
) COMMENT = 'WebAuthn 사용자 엔티티';

-- 등록된 Passkey 자격증명
-- credential_json: Spring Security WebAuthn Jackson 모듈로 직렬화된 전체 CredentialRecord
CREATE TABLE PASSKEY_CREDENTIALS (
    id              VARCHAR(36)   NOT NULL COMMENT 'UUID',
    user_id         VARCHAR(255)  NOT NULL COMMENT 'FK: USERS.USER_ID',
    credential_id   VARCHAR(512)  NOT NULL COMMENT 'Base64URL encoded credential id (조회 키)',
    credential_json MEDIUMTEXT    NOT NULL COMMENT 'JSON 직렬화된 CredentialRecord (Spring Security WebAuthn Jackson 모듈)',
    label           VARCHAR(100)  COMMENT '사용자 정의 기기 이름 (예: iPhone 15)',
    created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_used_at    DATETIME,
    PRIMARY KEY (id),
    UNIQUE KEY uq_credential_id (credential_id),
    CONSTRAINT fk_passkey_user2 FOREIGN KEY (user_id) REFERENCES USERS (USER_ID) ON DELETE CASCADE
) COMMENT = 'WebAuthn 등록 자격증명';
