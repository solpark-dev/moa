package com.moa.deposit.service;

import java.util.List;

import com.moa.deposit.domain.Deposit;
import com.moa.party.domain.Party;
import com.moa.deposit.dto.response.DepositResponse;

public interface DepositService {

	Deposit createDeposit(Integer partyId, Integer partyMemberId, String userId, Integer amount, String paymentKey, String orderId, String paymentMethod);

	DepositResponse getDepositDetail(Integer depositId);

	List<DepositResponse> getMyDeposits(String userId);

	List<DepositResponse> getPartyDeposits(Integer partyId);

	Deposit findByPartyIdAndUserId(Integer partyId, String userId);

	void refundDeposit(Integer depositId, String reason);

	void processWithdrawalRefund(Integer depositId, Party party);

	void forfeitDeposit(Integer depositId, String reason);
}
