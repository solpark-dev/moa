package com.moa.user.dto;

import jakarta.validation.constraints.NotBlank;
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
public class AddBlacklistRequest {
	@NotBlank(message = "회원 아이디는 필수입니다.")
	private String userId;

	@NotBlank(message = "사유 구분은 필수입니다.")
	private String reasonType;

	private String reasonDetail;
}
