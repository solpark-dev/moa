package com.moa.user.service;

import com.moa.user.dto.OtpSetupResponse;
import com.moa.user.dto.OtpVerifyRequest;

public interface OtpService {

	OtpSetupResponse setup();

	void verify(OtpVerifyRequest request);

	void disable();

	void verifyLoginCode(String userId, String code);
	
	void disableWithCode(String userId, String code);
}
