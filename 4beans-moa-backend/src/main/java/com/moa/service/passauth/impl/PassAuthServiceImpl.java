package com.moa.service.passauth.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.moa.service.passauth.PassAuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PassAuthServiceImpl implements PassAuthService {

	private final RestTemplate restTemplate = new RestTemplate();

	@Value("${portone.imp-key}")
	private String apiKey;

	@Value("${portone.imp-secret}")
	private String apiSecret;

	@Value("${portone.imp-code}")
	private String impCode;

	@Override
	public Map<String, Object> requestCertification() {
		String merchantUid = "pass_" + System.currentTimeMillis();

		Map<String, Object> data = new HashMap<>();
		data.put("merchantUid", merchantUid);
		data.put("impCode", impCode);

		return data;
	}

	@Override
	@SuppressWarnings("unchecked")
	public Map<String, Object> verifyCertification(String impUid) {
		if (impUid == null || impUid.isBlank()) {
			throw new IllegalArgumentException("imp_uid is required");
		}

		try {
			String token = getAccessToken();

			HttpHeaders headers = new HttpHeaders();
			headers.set("Authorization", "Bearer " + token);

			HttpEntity<?> req = new HttpEntity<>(headers);

			ResponseEntity<Map> res = restTemplate.exchange("https://api.iamport.kr/certifications/" + impUid,
					HttpMethod.GET, req, Map.class);

			Map<String, Object> body = res.getBody();
			if (body == null || body.get("response") == null) {
				throw new RuntimeException("PASS 인증 응답이 비어있습니다.");
			}

			Map<String, Object> response = (Map<String, Object>) body.get("response");

			Map<String, Object> data = new HashMap<>();
			data.put("phone", response.get("phone"));
			data.put("name", response.getOrDefault("name", ""));

			if (response.containsKey("verifiedCustomer")) {
				Map<String, Object> customer = (Map<String, Object>) response.get("verifiedCustomer");
				data.put("ci", customer.get("ci"));
			} else {
				data.put("ci", response.get("unique_key"));
			}

			return data;

		} catch (Exception e) {
			throw new RuntimeException("PASS 인증 검증 실패", e);
		}
	}

	@SuppressWarnings("unchecked")
	private String getAccessToken() {
		Map<String, String> body = new HashMap<>();
		body.put("imp_key", apiKey);
		body.put("imp_secret", apiSecret);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		HttpEntity<Map<String, String>> req = new HttpEntity<>(body, headers);

		ResponseEntity<Map> res = restTemplate.exchange("https://api.iamport.kr/users/getToken", HttpMethod.POST, req,
				Map.class);

		Map<String, Object> response = (Map<String, Object>) res.getBody().get("response");
		return (String) response.get("access_token");
	}
}