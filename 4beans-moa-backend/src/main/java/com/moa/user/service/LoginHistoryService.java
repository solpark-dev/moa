package com.moa.user.service;

import com.moa.community.dto.response.PageResponse;
import com.moa.user.dto.response.LoginHistoryResponse;

public interface LoginHistoryService {

	void recordSuccess(String userId, String loginType, String loginIp, String userAgent);

	void recordFailure(String userId, String loginType, String loginIp, String userAgent, String failReason);

	PageResponse<LoginHistoryResponse> getMyLoginHistory(int page, int size);

	PageResponse<LoginHistoryResponse> getUserLoginHistory(String userId, int page, int size);
}
