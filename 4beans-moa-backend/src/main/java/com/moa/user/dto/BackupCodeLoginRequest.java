package com.moa.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BackupCodeLoginRequest {

	@NotBlank
	private String otpToken;

	@NotBlank
	private String code;
	private String userId;
}
