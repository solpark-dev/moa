package com.moa.passkey.repository;


import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.web.webauthn.api.Bytes;
import org.springframework.security.web.webauthn.api.ImmutablePublicKeyCredentialUserEntity;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialUserEntity;
import org.springframework.security.web.webauthn.management.PublicKeyCredentialUserEntityRepository;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;

/**
 * WebAuthn 사용자 엔티티 레포지토리.
 * Spring Security WebAuthn DSL이 이 빈을 자동으로 사용합니다.
 */
@Repository
@RequiredArgsConstructor
public class PasskeyUserEntityRepository implements PublicKeyCredentialUserEntityRepository {

    private final JdbcClient jdbcClient;

    @Override
    public PublicKeyCredentialUserEntity findById(Bytes id) {
        String encodedId = id.toBase64UrlString();
        return jdbcClient.sql("""
                    SELECT id, user_id, display_name FROM PASSKEY_USER_ENTITIES WHERE id = :id
                    """)
                .param("id", encodedId)
                .query((rs, row) -> ImmutablePublicKeyCredentialUserEntity.builder()
                        .id(Bytes.fromBase64(rs.getString("id")))
                        .name(rs.getString("user_id"))
                        .displayName(rs.getString("display_name"))
                        .build())
                .optional()
                .orElse(null);
    }

    @Override
    public PublicKeyCredentialUserEntity findByUsername(String username) {
        return jdbcClient.sql("""
                    SELECT id, user_id, display_name FROM PASSKEY_USER_ENTITIES WHERE user_id = :userId
                    """)
                .param("userId", username)
                .query((rs, row) -> ImmutablePublicKeyCredentialUserEntity.builder()
                        .id(Bytes.fromBase64(rs.getString("id")))
                        .name(rs.getString("user_id"))
                        .displayName(rs.getString("display_name"))
                        .build())
                .optional()
                .orElse(null);
    }

    @Override
    public void save(PublicKeyCredentialUserEntity userEntity) {
        String encodedId = userEntity.getId().toBase64UrlString();
        int updated = jdbcClient.sql("""
                    UPDATE PASSKEY_USER_ENTITIES SET display_name = :displayName WHERE id = :id
                    """)
                .param("displayName", userEntity.getDisplayName())
                .param("id", encodedId)
                .update();

        if (updated == 0) {
            jdbcClient.sql("""
                        INSERT INTO PASSKEY_USER_ENTITIES (id, user_id, display_name)
                        VALUES (:id, :userId, :displayName)
                        """)
                    .param("id", encodedId)
                    .param("userId", userEntity.getName())
                    .param("displayName", userEntity.getDisplayName())
                    .update();
        }
    }

    @Override
    public void delete(Bytes id) {
        jdbcClient.sql("DELETE FROM PASSKEY_USER_ENTITIES WHERE id = :id")
                .param("id", id.toBase64UrlString())
                .update();
    }
}
