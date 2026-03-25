package com.moa.admin.service;

import com.moa.admin.dto.response.DashboardStatsResponse;
import com.moa.admin.dto.response.MonthlyGoalResponse;

public interface AdminDashboardService {

	DashboardStatsResponse getDashboardStats();

	MonthlyGoalResponse getMonthlyGoal();

	MonthlyGoalResponse updateMonthlyGoal(Long goalAmount);
}
