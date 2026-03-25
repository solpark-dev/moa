package com.moa.user.service;

import java.util.List;

import com.moa.user.domain.OAuthAccount;

public interface OAuthAccountService {

	OAuthAccount getOAuthAccount(String oauthId);

	List<OAuthAccount> getOAuthAccountList(String userId);

	OAuthAccount getOAuthByProvider(String provider, String providerUserId);

	void addOAuthAccount(OAuthAccount account);

	void releaseOAuth(String oauthId);

	void connectOAuthAccount(String userId, String provider, String providerUserId);

	void transferOAuthAccount(String provider, String providerUserId, String fromUserId, String toUserId);
}
