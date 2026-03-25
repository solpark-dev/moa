package com.moa.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder 
public class PasswordResetTokenResponse {
	private String token;
}