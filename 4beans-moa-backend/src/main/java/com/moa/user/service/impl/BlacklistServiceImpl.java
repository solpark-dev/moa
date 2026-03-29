package com.moa.user.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moa.global.auth.service.TokenBlacklistService;
import com.moa.global.common.exception.BusinessException;
import com.moa.global.common.exception.ErrorCode;
import com.moa.admin.repository.AdminDao;
import com.moa.user.repository.UserDao;
import com.moa.party.domain.enums.UserStatus;
import com.moa.user.dto.AddBlacklistRequest;
import com.moa.user.dto.DeleteBlacklistRequest;
import com.moa.user.service.BlacklistService;

@Service
@Transactional
public class BlacklistServiceImpl implements BlacklistService {

	private final AdminDao adminDao;
	private final UserDao userDao;
	private final TokenBlacklistService tokenBlacklistService;

	public BlacklistServiceImpl(AdminDao adminDao, UserDao userDao, TokenBlacklistService tokenBlacklistService) {
		this.adminDao = adminDao;
		this.userDao = userDao;
		this.tokenBlacklistService = tokenBlacklistService;
	}

	@Override
	public void addBlacklist(AddBlacklistRequest request) {
		String userId = request.getUserId();

		userDao.findByUserId(userId).orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

		String reason = request.getReasonType();
		if (request.getReasonDetail() != null && !request.getReasonDetail().isBlank()) {
			reason = reason + " - " + request.getReasonDetail();
		}

		adminDao.insertBlacklist(userId, reason);

		int updated = userDao.updateUserStatus(userId, UserStatus.BLOCK);
		if (updated == 0) {
			throw new BusinessException(ErrorCode.INTERNAL_ERROR, "회원 상태 변경에 실패했습니다.");
		}

		tokenBlacklistService.banUser(userId);
	}

	@Override
	public void deleteBlacklist(DeleteBlacklistRequest request) {
		String userId = request.getUserId();

		userDao.findByUserId(userId).orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

		adminDao.deactivateBlacklist(userId, request.getDeleteReason());

		int updated = userDao.updateUserStatus(userId, UserStatus.ACTIVE);
		if (updated == 0) {
			throw new BusinessException(ErrorCode.INTERNAL_ERROR, "회원 상태 복구에 실패했습니다.");
		}

		tokenBlacklistService.unbanUser(userId);
	}
}
