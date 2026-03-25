package com.moa.admin.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moa.global.common.exception.ApiResponse;
import com.moa.admin.dto.request.MonthlyGoalRequest;
import com.moa.admin.dto.response.DashboardStatsResponse;
import com.moa.admin.dto.response.MonthlyGoalResponse;
import com.moa.admin.service.AdminDashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardRestController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping("/stats")
    public ApiResponse<DashboardStatsResponse> getStats() {
        return ApiResponse.success(adminDashboardService.getDashboardStats());
    }

    @GetMapping("/goal")
    public ApiResponse<MonthlyGoalResponse> getMonthlyGoal() {
        return ApiResponse.success(adminDashboardService.getMonthlyGoal());
    }

    @PutMapping("/goal")
    public ApiResponse<MonthlyGoalResponse> updateMonthlyGoal(@RequestBody MonthlyGoalRequest request) {
        return ApiResponse.success(adminDashboardService.updateMonthlyGoal(request.getGoalAmount()));
    }
}
