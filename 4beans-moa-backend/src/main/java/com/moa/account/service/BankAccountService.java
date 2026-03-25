package com.moa.account.service;

import com.moa.account.domain.Account;
import com.moa.openbanking.dto.InquiryReceiveResponse;
import com.moa.openbanking.dto.InquiryVerifyResponse;

public interface BankAccountService {

	InquiryReceiveResponse requestVerification(String userId, String bankCode, String accountNum, String accountHolder);

	InquiryVerifyResponse verifyAndRegister(String userId, String bankTranId, String verifyCode);

	Account getAccount(String userId);

	void deleteAccount(String userId);

	InquiryReceiveResponse changeAccount(String userId, String bankCode, String accountNum, String accountHolder);
}
