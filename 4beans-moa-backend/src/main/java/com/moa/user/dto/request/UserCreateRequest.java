package com.moa.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCreateRequest {

	// 일반 가입: 이메일 입력값 (하위 호환). 소셜 가입 시 서버에서 ULID 생성하므로 불필요
	private String userId;

	// 소셜 가입: OAuth에서 받은 이메일 전달용 (nullable)
	private String email;

	private String password;

	private String passwordConfirm;

	@NotBlank(message = "닉네임을 입력해 주세요.")
	@Pattern(regexp = "^[A-Za-z0-9가-힣]{2,10}$", message = "닉네임은 2~10자, 한글/영문/숫자만 가능합니다.")
	private String nickname;

	private String phone;

	private boolean agreeMarketing;

	private String profileImageBase64;

	private String provider;

	private String providerUserId;
}
