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
public class DeleteBlacklistRequest {
	@NotBlank(message = "회원 아이디는 필수입니다.")
	private String userId;

	@NotBlank(message = "해제 사유는 필수입니다.")
	private String deleteReason;
}
