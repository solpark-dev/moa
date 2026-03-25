package com.moa.openbanking.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.moa.openbanking.domain.TransferTransaction;

@Mapper
public interface TransferTransactionMapper {

	void insert(TransferTransaction transaction);

	TransferTransaction findByBankTranId(@Param("bankTranId") String bankTranId);

	List<TransferTransaction> findBySettlementId(@Param("settlementId") Integer settlementId);

	void updateStatus(@Param("transactionId") Long transactionId, @Param("status") String status);
}
