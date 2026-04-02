package com.moa.passkey.repository;

import java.time.Instant;
import java.util.Base64;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.web.webauthn.api.AuthenticatorTransport;
import org.springframework.security.web.webauthn.api.Bytes;
import org.springframework.security.web.webauthn.api.CredentialRecord;
import org.springframework.security.web.webauthn.api.ImmutableCredentialRecord;
import org.springframework.security.web.webauthn.api.ImmutablePublicKeyCose;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialType;
import org.springframework.security.web.webauthn.management.UserCredentialRepository;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import lombok.extern.slf4j.Slf4j;

/**
 * WebAuthn 자격증명 레포지토리.
 *
 * CredentialRecord 필드를 JSON으로 직렬화하여 credential_json 컬럼에 저장합니다.
 * ImmutableCredentialRecord 생성자가 private이므로 builder를 통해 역직렬화합니다.
 */
@Slf4j
@Repository
public class PasskeyCredentialRepository implements UserCredentialRepository {

    private final JdbcClient jdbcClient;
    private final ObjectMapper objectMapper;

    public PasskeyCredentialRepository(JdbcClient jdbcClient, ObjectMapper objectMapper) {
        this.jdbcClient = jdbcClient;
        this.objectMapper = objectMapper;
    }

    @Override
    public void save(CredentialRecord credential) {
        String credentialIdB64 = credential.getCredentialId().toBase64UrlString();
        String userEntityIdB64 = credential.getUserEntityUserId().toBase64UrlString();

        String resolvedUserId = jdbcClient.sql(
                "SELECT user_id FROM PASSKEY_USER_ENTITIES WHERE id = :id")
                .param("id", userEntityIdB64)
                .query(String.class)
                .optional()
                .orElse(userEntityIdB64);

        String credentialJson = toJson(credential);

        int updated = jdbcClient.sql("""
                UPDATE PASSKEY_CREDENTIALS SET
                    credential_json = :credentialJson, last_used_at = :lastUsedAt
                WHERE credential_id = :credentialId
                """)
                .param("credentialJson", credentialJson)
                .param("lastUsedAt", credential.getLastUsed() != null
                        ? java.sql.Timestamp.from(credential.getLastUsed()) : null)
                .param("credentialId", credentialIdB64)
                .update();

        if (updated == 0) {
            jdbcClient.sql("""
                    INSERT INTO PASSKEY_CREDENTIALS
                        (id, user_id, credential_id, credential_json, label, created_at, last_used_at)
                    VALUES (:id, :userId, :credentialId, :credentialJson, :label, :createdAt, :lastUsedAt)
                    """)
                    .param("id", UUID.randomUUID().toString())
                    .param("userId", resolvedUserId)
                    .param("credentialId", credentialIdB64)
                    .param("credentialJson", credentialJson)
                    .param("label", credential.getLabel())
                    .param("createdAt", credential.getCreated() != null
                            ? java.sql.Timestamp.from(credential.getCreated()) : new java.sql.Timestamp(System.currentTimeMillis()))
                    .param("lastUsedAt", credential.getLastUsed() != null
                            ? java.sql.Timestamp.from(credential.getLastUsed()) : null)
                    .update();
        }
    }

    @Override
    public void delete(Bytes credentialId) {
        jdbcClient.sql("DELETE FROM PASSKEY_CREDENTIALS WHERE credential_id = :id")
                .param("id", credentialId.toBase64UrlString())
                .update();
    }

    @Override
    public List<CredentialRecord> findByUserId(Bytes userEntityUserId) {
        String userEntityIdB64 = userEntityUserId.toBase64UrlString();

        String userId = jdbcClient.sql(
                "SELECT user_id FROM PASSKEY_USER_ENTITIES WHERE id = :id")
                .param("id", userEntityIdB64)
                .query(String.class)
                .optional()
                .orElse(null);

        if (userId == null) return List.of();

        return jdbcClient.sql(
                "SELECT credential_json FROM PASSKEY_CREDENTIALS WHERE user_id = :userId")
                .param("userId", userId)
                .query((rs, row) -> fromJson(rs.getString("credential_json")))
                .list();
    }

    @Override
    public CredentialRecord findByCredentialId(Bytes credentialId) {
        return jdbcClient.sql(
                "SELECT credential_json FROM PASSKEY_CREDENTIALS WHERE credential_id = :credentialId")
                .param("credentialId", credentialId.toBase64UrlString())
                .query((rs, row) -> fromJson(rs.getString("credential_json")))
                .optional()
                .orElse(null);
    }

    /** JWT 발급용: CredentialId(Base64URL) → userId(이메일) */
    public String findUserIdByCredentialId(String credentialIdB64) {
        return jdbcClient.sql(
                "SELECT user_id FROM PASSKEY_CREDENTIALS WHERE credential_id = :id")
                .param("id", credentialIdB64)
                .query(String.class)
                .optional()
                .orElse(null);
    }

    /** 마이페이지 보안 설정에서 패스키 목록 표시용 */
    public List<Map<String, Object>> findCredentialInfoByUserId(String userId) {
        return jdbcClient.sql("""
                SELECT id, credential_id, label, created_at, last_used_at
                FROM PASSKEY_CREDENTIALS WHERE user_id = :userId
                ORDER BY created_at DESC
                """)
                .param("userId", userId)
                .query((rs, row) -> {
                    Map<String, Object> info = new LinkedHashMap<>();
                    info.put("id", rs.getString("id"));
                    info.put("credentialId", rs.getString("credential_id"));
                    info.put("label", rs.getString("label"));
                    info.put("createdAt", rs.getTimestamp("created_at") != null
                            ? rs.getTimestamp("created_at").toInstant() : null);
                    info.put("lastUsedAt", rs.getTimestamp("last_used_at") != null
                            ? rs.getTimestamp("last_used_at").toInstant() : null);
                    return info;
                })
                .list();
    }

    /** 패스키 삭제: 소유자 확인 후 삭제 */
    public void deleteByIdAndUserId(String id, String userId) {
        jdbcClient.sql("DELETE FROM PASSKEY_CREDENTIALS WHERE id = :id AND user_id = :userId")
                .param("id", id)
                .param("userId", userId)
                .update();
    }

    // ─────────────────────────────────────────────────────────────
    // Custom JSON serialization — ImmutableCredentialRecord has a private constructor
    // so direct Jackson deserialization is not possible; we serialize/deserialize manually.
    // ─────────────────────────────────────────────────────────────

    private String toJson(CredentialRecord r) {
        try {
            ObjectNode node = objectMapper.createObjectNode();
            node.put("credentialType", r.getCredentialType().getValue());
            node.put("credentialId", r.getCredentialId().toBase64UrlString());
            node.put("userEntityUserId", r.getUserEntityUserId().toBase64UrlString());
            node.put("publicKey", Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(r.getPublicKey().getBytes()));
            node.put("signatureCount", r.getSignatureCount());
            node.put("uvInitialized", r.isUvInitialized());
            ArrayNode transports = node.putArray("transports");
            if (r.getTransports() != null) {
                r.getTransports().forEach(t -> transports.add(t.getValue()));
            }
            node.put("backupEligible", r.isBackupEligible());
            node.put("backupState", r.isBackupState());
            node.put("attestationObject", r.getAttestationObject() != null
                    ? r.getAttestationObject().toBase64UrlString() : null);
            node.put("attestationClientDataJSON", r.getAttestationClientDataJSON() != null
                    ? r.getAttestationClientDataJSON().toBase64UrlString() : null);
            node.put("created", r.getCreated() != null ? r.getCreated().toString() : null);
            node.put("lastUsed", r.getLastUsed() != null ? r.getLastUsed().toString() : null);
            node.put("label", r.getLabel());
            return node.toString();
        } catch (Exception e) {
            throw new RuntimeException("CredentialRecord 직렬화 실패", e);
        }
    }

    private CredentialRecord fromJson(String json) {
        try {
            JsonNode node = objectMapper.readTree(json);

            Set<AuthenticatorTransport> transports = new HashSet<>();
            JsonNode transportsNode = node.get("transports");
            if (transportsNode != null && transportsNode.isArray()) {
                for (JsonNode t : transportsNode) {
                    transports.add(AuthenticatorTransport.valueOf(t.asText()));
                }
            }

            Bytes attestationObject = nullableBytes(node, "attestationObject");
            Bytes attestationClientDataJSON = nullableBytes(node, "attestationClientDataJSON");

            return ImmutableCredentialRecord.builder()
                    .credentialType(PublicKeyCredentialType.valueOf(node.get("credentialType").asText()))
                    .credentialId(Bytes.fromBase64(node.get("credentialId").asText()))
                    .userEntityUserId(Bytes.fromBase64(node.get("userEntityUserId").asText()))
                    .publicKey(ImmutablePublicKeyCose.fromBase64(node.get("publicKey").asText()))
                    .signatureCount(node.get("signatureCount").asLong())
                    .uvInitialized(node.get("uvInitialized").asBoolean())
                    .transports(transports)
                    .backupEligible(node.get("backupEligible").asBoolean())
                    .backupState(node.get("backupState").asBoolean())
                    .attestationObject(attestationObject != null ? attestationObject : new Bytes(new byte[0]))
                    .attestationClientDataJSON(attestationClientDataJSON != null ? attestationClientDataJSON : new Bytes(new byte[0]))
                    .created(parseInstant(node, "created"))
                    .lastUsed(parseInstant(node, "lastUsed"))
                    .label(node.has("label") && !node.get("label").isNull() ? node.get("label").asText() : null)
                    .build();
        } catch (Exception e) {
            log.error("CredentialRecord 역직렬화 실패: {}", e.getMessage());
            throw new RuntimeException("CredentialRecord 역직렬화 실패", e);
        }
    }

    private Bytes nullableBytes(JsonNode node, String field) {
        if (!node.has(field) || node.get(field).isNull()) return null;
        String val = node.get(field).asText();
        return val.isEmpty() ? null : Bytes.fromBase64(val);
    }

    private Instant parseInstant(JsonNode node, String field) {
        if (!node.has(field) || node.get(field).isNull()) return null;
        String val = node.get(field).asText();
        return val.isEmpty() ? null : Instant.parse(val);
    }
}
