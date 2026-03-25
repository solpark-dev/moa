package com.moa.user.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordResetStartRequest {
	private String userId;
}
