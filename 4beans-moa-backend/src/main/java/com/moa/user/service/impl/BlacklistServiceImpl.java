package com.moa.user.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import com.moa.global.auth.service.TokenBlacklistService;
import com.moa.global.common.exception.BusinessException;
import com.moa.global.common.exception.ErrorCode;
import com.moa.admin.repository.AdminDao;
import com.moa.user.domain.Blacklist;
import com.moa.user.domain.User;
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

		User user = userDao.findByUserId(userId)
				.orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

		// 이미 활성 블랙리스트가 있으면 중복 등록 방지
		Blacklist existing = adminDao.findActiveBlacklistByUserId(userId);
		if (existing != null) {
			throw new BusinessException(ErrorCode.ALREADY_BLACKLISTED);
		}

		String reason = request.getReasonType();
		if (request.getReasonDetail() != null && !request.getReasonDetail().isBlank()) {
			reason = reason + " - " + request.getReasonDetail();
		}

		// 등록 전 현재 상태 저장 (해제 시 원래 상태로 복구하기 위해)
		String prevStatus = user.getStatus().name();
		adminDao.insertBlacklist(userId, reason, prevStatus);

		int updated = userDao.updateUserStatus(userId, UserStatus.BLOCK);
		if (updated == 0) {
			throw new BusinessException(ErrorCode.INTERNAL_ERROR, "회원 상태 변경에 실패했습니다.");
		}

		// DB 커밋 이후에 Redis 처리 — DB 롤백 시 Redis 오염 방지
		TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
			@Override
			public void afterCommit() {
				tokenBlacklistService.banUser(userId);
			}
		});
	}

	@Override
	public void deleteBlacklist(DeleteBlacklistRequest request) {
		String userId = request.getUserId();

		userDao.findByUserId(userId)
				.orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

		// ACTIVE 블랙리스트가 없으면 해제 불가
		Blacklist active = adminDao.findActiveBlacklistByUserId(userId);
		if (active == null) {
			throw new BusinessException(ErrorCode.NOT_BLACKLISTED);
		}

		int deactivated = adminDao.deactivateBlacklist(userId, request.getDeleteReason());
		if (deactivated == 0) {
			throw new BusinessException(ErrorCode.INTERNAL_ERROR, "블랙리스트 해제에 실패했습니다.");
		}

		// 블랙리스트 등록 전 상태로 복구 (prevStatus가 없는 기존 데이터는 ACTIVE로 fallback)
		UserStatus restoreStatus = (active.getPrevStatus() != null)
				? UserStatus.valueOf(active.getPrevStatus())
				: UserStatus.ACTIVE;

		int updated = userDao.updateUserStatus(userId, restoreStatus);
		if (updated == 0) {
			throw new BusinessException(ErrorCode.INTERNAL_ERROR, "회원 상태 복구에 실패했습니다.");
		}

		// DB 커밋 이후에 Redis 처리
		TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
			@Override
			public void afterCommit() {
				tokenBlacklistService.unbanUser(userId);
			}
		});
	}
}
