package com.moa.settlement.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.moa.settlement.domain.SettlementDetail;
import com.moa.settlement.dto.response.SettlementDetailResponse;

@Mapper
public interface SettlementDetailDao {
	int insertSettlementDetail(SettlementDetail detail);

	List<SettlementDetailResponse> findBySettlementId(@Param("settlementId") Integer settlementId);
}
