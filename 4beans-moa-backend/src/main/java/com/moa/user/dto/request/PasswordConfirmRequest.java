package com.moa.user.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordConfirmRequest {
	private String password;
	private String passwordConfirm;
}
