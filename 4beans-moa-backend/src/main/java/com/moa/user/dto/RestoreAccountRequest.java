package com.moa.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RestoreAccountRequest {

	@NotBlank
	private String userId;

	@NotBlank
	private String impUid;
}
