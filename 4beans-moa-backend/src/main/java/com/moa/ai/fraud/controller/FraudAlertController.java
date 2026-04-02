package com.moa.ai.fraud.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.moa.ai.fraud.domain.FraudAlert;
import com.moa.ai.fraud.repository.FraudAlertDao;
import com.moa.global.common.exception.ApiResponse;

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
    public ApiResponse<List<FraudAlert>> recent(
            @RequestParam(defaultValue = "50") int limit) {
        return ApiResponse.success(fraudAlertDao.findRecent(limit));
    }

    /** 특정 유저 알림 이력 */
    @GetMapping("/user")
    public ApiResponse<List<FraudAlert>> byUser(@RequestParam String userId) {
        return ApiResponse.success(fraudAlertDao.findByUserId(userId));
    }
}
