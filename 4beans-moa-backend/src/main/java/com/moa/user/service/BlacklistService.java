package com.moa.user.service;

import com.moa.user.dto.AddBlacklistRequest;
import com.moa.user.dto.DeleteBlacklistRequest;

public interface BlacklistService {

	void addBlacklist(AddBlacklistRequest request);

	void deleteBlacklist(DeleteBlacklistRequest request);
}