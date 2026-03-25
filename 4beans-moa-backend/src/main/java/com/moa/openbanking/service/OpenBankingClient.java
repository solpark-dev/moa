package com.moa.openbanking.service;

import com.moa.openbanking.dto.InquiryReceiveRequest;
import com.moa.openbanking.dto.InquiryReceiveResponse;
import com.moa.openbanking.dto.InquiryVerifyRequest;
import com.moa.openbanking.dto.InquiryVerifyResponse;
import com.moa.openbanking.dto.TransferDepositRequest;
import com.moa.openbanking.dto.TransferDepositResponse;

public interface OpenBankingClient {

	InquiryReceiveResponse requestVerification(InquiryReceiveRequest request);

	InquiryVerifyResponse verifyCode(InquiryVerifyRequest request);

	TransferDepositResponse transferDeposit(TransferDepositRequest request);
}
