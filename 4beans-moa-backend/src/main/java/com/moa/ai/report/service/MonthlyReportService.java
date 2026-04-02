package com.moa.ai.report.service;

import java.util.List;
import java.util.Optional;

import com.moa.ai.report.domain.MonthlyReport;

public interface MonthlyReportService {

    /** LLM으로 리포트 생성 후 DB 저장. 이미 존재하면 덮어씀. */
    MonthlyReport generate(String userId, String targetMonth);

    Optional<MonthlyReport> findByUserIdAndMonth(String userId, String targetMonth);

    List<MonthlyReport> findAllByUserId(String userId);
}
