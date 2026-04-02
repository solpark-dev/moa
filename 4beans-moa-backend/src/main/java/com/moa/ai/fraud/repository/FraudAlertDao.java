package com.moa.ai.fraud.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.moa.ai.fraud.domain.FraudAlert;

@Mapper
public interface FraudAlertDao {

    void insert(FraudAlert alert);

    /** 관리자 대시보드: 최근 알림 목록 (최신순) */
    List<FraudAlert> findRecent(@Param("limit") int limit);

    /** 특정 유저의 알림 이력 */
    List<FraudAlert> findByUserId(@Param("userId") String userId);
}
