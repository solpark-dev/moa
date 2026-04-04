package com.moa.global.common.util;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class AESUtil {

	private static final String ALGORITHM = "AES/GCM/NoPadding";
	private static final int IV_LENGTH = 12;
	private static final int TAG_LENGTH = 128;

	private static String secretKey;

	@Value("${app.security.aes-key}")
	public void setSecretKey(String key) {
		AESUtil.secretKey = key;
	}

	public static String encrypt(String plainText) {
		if (plainText == null)
			return null;
		try {
			SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "AES");
			Cipher cipher = Cipher.getInstance(ALGORITHM);

			byte[] iv = new byte[IV_LENGTH];
			new SecureRandom().nextBytes(iv);
			GCMParameterSpec gcmParameterSpec = new GCMParameterSpec(TAG_LENGTH, iv);
			cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, gcmParameterSpec);

			byte[] encryptedBytes = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));

			ByteBuffer byteBuffer = ByteBuffer.allocate(IV_LENGTH + encryptedBytes.length);
			byteBuffer.put(iv);
			byteBuffer.put(encryptedBytes);

			return Base64.getEncoder().encodeToString(byteBuffer.array());
		} catch (Exception e) {
			log.error("Encryption failed", e);
			throw new RuntimeException("Encryption failed", e);
		}
	}

	public static String decrypt(String encryptedText) {
		if (encryptedText == null)
			return null;
		try {
			SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "AES");
			Cipher cipher = Cipher.getInstance(ALGORITHM);

			byte[] decodedBytes = Base64.getDecoder().decode(encryptedText);
			ByteBuffer byteBuffer = ByteBuffer.wrap(decodedBytes);

			byte[] iv = new byte[IV_LENGTH];
			byteBuffer.get(iv);
			byte[] cipherText = new byte[byteBuffer.remaining()];
			byteBuffer.get(cipherText);

			GCMParameterSpec gcmParameterSpec = new GCMParameterSpec(TAG_LENGTH, iv);
			cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, gcmParameterSpec);

			return new String(cipher.doFinal(cipherText), StandardCharsets.UTF_8);
		} catch (Exception e) {
			log.error("Decryption failed for text: {}", e.getMessage());
			throw new RuntimeException("Decryption failed", e);
		}
	}
}
