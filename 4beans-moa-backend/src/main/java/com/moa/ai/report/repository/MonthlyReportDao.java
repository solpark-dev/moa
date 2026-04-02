package com.moa.ai.report.repository;

import java.util.List;
import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.moa.ai.report.domain.MonthlyReport;

@Mapper
public interface MonthlyReportDao {

    void insert(MonthlyReport report);

    Optional<MonthlyReport> findByUserIdAndMonth(
            @Param("userId") String userId,
            @Param("targetMonth") String targetMonth);

    /** 최신순 리포트 목록 (마이페이지 히스토리용) */
    List<MonthlyReport> findByUserId(@Param("userId") String userId);
}
