package com.moa.ai.fraud.controller;

import java.util.List;
import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.moa.ai.fraud.domain.FraudAlert;
import com.moa.ai.fraud.repository.FraudAlertDao;
import com.moa.global.common.exception.ApiResponse;
import com.moa.global.common.exception.BusinessException;
import com.moa.global.common.exception.ErrorCode;

/**
 * 비정상 결제 감지 알림 조회 API (관리자용).
 * SecurityConfig의 anyRequest().authenticated() 로 인증 필요.
 */
@RestController
@RequestMapping("/api/ai/fraud-alerts")
public class FraudAlertController {

    private final FraudAlertDao fraudAlertDao;

    public FraudAlertController(FraudAlertDao fraudAlertDao) {
        this.fraudAlertDao = fraudAlertDao;
    }

    /** 최근 알림 목록 */
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<List<FraudAlert>> recent(
            @RequestParam(defaultValue = "50") int limit) {
        return ApiResponse.success(fraudAlertDao.findRecent(limit));
    }

    /** 특정 유저 알림 이력 */
    @GetMapping("/user")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<List<FraudAlert>> byUser(@RequestParam String userId) {
        return ApiResponse.success(fraudAlertDao.findByUserId(userId));
    }

    /** 알림 처리 상태 변경 (RESOLVED / DISMISSED) */
    @PatchMapping("/{alertId}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<Void> updateStatus(
            @PathVariable Long alertId,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        String memo = request.get("memo");
        if (status == null || status.isBlank()) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "상태 값이 필요합니다.");
        }
        fraudAlertDao.updateStatus(alertId, status, memo);
        return ApiResponse.success(null);
    }
}
