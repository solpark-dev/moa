package com.moa.settlement.scheduler;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;

import com.moa.account.repository.AccountDao;
import com.moa.openbanking.repository.TransferTransactionMapper;
import com.moa.party.repository.PartyDao;
import com.moa.product.service.ProductNameResolver;
import com.moa.settlement.repository.SettlementDao;
import com.moa.account.domain.Account;
import com.moa.party.domain.Party;

import com.moa.settlement.domain.Settlement;
import com.moa.party.domain.enums.PushCodeType;
import com.moa.openbanking.domain.TransactionStatus;
import com.moa.openbanking.domain.TransferTransaction;
import com.moa.openbanking.dto.TransferDepositRequest;
import com.moa.openbanking.dto.TransferDepositResponse;
import com.moa.push.dto.request.TemplatePushRequest;
import com.moa.openbanking.service.OpenBankingClient;
import com.moa.push.service.PushService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class SettlementTransferScheduler {

	private final SettlementDao settlementDao;
	private final AccountDao accountDao;
	private final TransferTransactionMapper transactionMapper;
	private final OpenBankingClient openBankingClient;
	private final PushService pushService;
	private final PartyDao partyDao;
	private final ProductNameResolver productNameResolver;
	private final SettlementTransactionExecutor txExecutor;

	@Scheduled(cron = "0 0 10 * * *")
	@SchedulerLock(name = "settlement_transfer_daily", lockAtMostFor = "2h", lockAtLeastFor = "1m")
	public void processSettlementTransfers() {
		log.info("[정산스케줄러] 자동 이체 처리 시작");
		List<Settlement> pendingSettlements = settlementDao.findByStatus("PENDING");

		if (pendingSettlements.isEmpty()) {
			log.info("[정산스케줄러] 처리할 정산 건이 없습니다");
			return;
		}

		log.info("[정산스케줄러] 처리 대상: {}건", pendingSettlements.size());

		int successCount = 0;
		int failCount = 0;
		int skipCount = 0;

		for (Settlement settlement : pendingSettlements) {
			try {
				boolean result = processSettlement(settlement);
				if (result) {
					successCount++;
				} else {
					skipCount++;
				}
			} catch (Exception e) {
				log.error("[정산스케줄러] 정산 처리 실패 - settlementId: {}", settlement.getSettlementId(), e);
				failCount++;
			}
		}

		log.info("[정산스케줄러] 처리 완료 - 성공: {}, 실패: {}, 건너뜀: {}", successCount, failCount, skipCount);
	}

	// @Transactional 제거: 은행 API 호출은 트랜잭션 밖에서 실행해야 한다.
	// DB 상태 변경은 SettlementTransactionExecutor를 통해 즉시 커밋한다.
	public boolean processSettlement(Settlement settlement) {
		log.info("[정산처리] 시작 - settlementId: {}, 파티장: {}, 금액: {}", settlement.getSettlementId(),
				settlement.getPartyLeaderId(), settlement.getNetAmount());

		Optional<Account> accountOpt = accountDao.findActiveByUserId(settlement.getPartyLeaderId());

		if (accountOpt.isEmpty()) {
			log.warn("[정산처리] 계좌 미등록 - 파티장: {}", settlement.getPartyLeaderId());
			sendAccountRequiredPush(settlement);
			return false;
		}

		Account account = accountOpt.get();

		if (account.getFintechUseNum() == null || account.getFintechUseNum().isBlank()) {
			log.warn("[정산처리] 핀테크번호 없음 - 파티장: {}", settlement.getPartyLeaderId());
			sendAccountRequiredPush(settlement);
			return false;
		}

		// 1단계: IN_PROGRESS 상태를 즉시 커밋 (은행 API 호출 전)
		txExecutor.markInProgress(settlement.getSettlementId());

		// 2단계: 트랜잭션 밖에서 은행 API 호출
		return executeBankTransfer(settlement, account);
	}

	private boolean executeBankTransfer(Settlement settlement, Account account) {
		TransferDepositRequest request = TransferDepositRequest.builder().fintechUseNum(account.getFintechUseNum())
				.tranAmt(settlement.getNetAmount()).printContent("MOA정산").reqClientName("MOA").build();

		TransferDepositResponse response;
		try {
			response = openBankingClient.transferDeposit(request);
		} catch (Exception e) {
			log.error("[정산처리] 은행 API 호출 실패 - settlementId: {}", settlement.getSettlementId(), e);
			txExecutor.markFailed(settlement.getSettlementId());
			sendSettlementFailedPush(settlement, "은행 API 호출 실패: " + e.getMessage());
			return false;
		}

		TransferTransaction transaction = TransferTransaction.builder().settlementId(settlement.getSettlementId())
				.bankTranId(response.getBankTranId()).fintechUseNum(account.getFintechUseNum())
				.tranAmt(settlement.getNetAmount()).printContent("MOA정산").reqClientName("MOA")
				.rspCode(response.getRspCode()).rspMessage(response.getRspMessage())
				.status("A0000".equals(response.getRspCode()) ? TransactionStatus.SUCCESS : TransactionStatus.FAILED)
				.build();

		transactionMapper.insert(transaction);

		if ("A0000".equals(response.getRspCode())) {
			// 3단계: 성공 시 COMPLETED 상태와 거래ID를 즉시 커밋
			txExecutor.markCompleted(settlement.getSettlementId(), response.getBankTranId());
			log.info("[정산처리] 성공 - settlementId: {}, 거래ID: {}", settlement.getSettlementId(), response.getBankTranId());
			sendSettlementCompletedPush(settlement);
			return true;
		} else {
			// 3단계: 실패 시 FAILED 상태를 즉시 커밋
			txExecutor.markFailed(settlement.getSettlementId());
			log.error("[정산처리] 실패 - settlementId: {}, 에러: {}", settlement.getSettlementId(), response.getRspMessage());
			sendSettlementFailedPush(settlement, response.getRspMessage());
			return false;
		}
	}

	public boolean processSettlementManually(Integer settlementId) {
		Settlement settlement = settlementDao.findById(settlementId).orElse(null);
		if (settlement == null) {
			log.error("[수동정산] 정산 정보 없음 - settlementId: {}", settlementId);
			return false;
		}
		return processSettlement(settlement);
	}

	private void sendSettlementCompletedPush(Settlement settlement) {
		try {
			Party party = partyDao.findById(settlement.getPartyId()).orElse(null);
			if (party == null)
				return;

			String productName = productNameResolver.getProductName(party.getProductId());

			Map<String, String> params = Map.of("productName", productName, "amount",
					String.valueOf(settlement.getNetAmount()), "targetMonth", settlement.getSettlementMonth());

			TemplatePushRequest pushRequest = TemplatePushRequest.builder().receiverId(settlement.getPartyLeaderId())
					.pushCode(PushCodeType.SETTLE_COMPLETED.getCode()).params(params)
					.moduleId(String.valueOf(settlement.getSettlementId()))
					.moduleType(PushCodeType.SETTLE_COMPLETED.getModuleType()).build();

			pushService.addTemplatePush(pushRequest);
			log.info("푸시알림 발송 완료: SETTLE_COMPLETED -> userId={}", settlement.getPartyLeaderId());

		} catch (Exception e) {
			log.error("푸시알림 발송 실패: settlementId={}, error={}", settlement.getSettlementId(), e.getMessage());
		}
	}

	private void sendSettlementFailedPush(Settlement settlement, String errorMessage) {
		try {
			Party party = partyDao.findById(settlement.getPartyId()).orElse(null);
			if (party == null)
				return;

			String productName = productNameResolver.getProductName(party.getProductId());

			Map<String, String> params = Map.of("productName", productName, "amount",
					String.valueOf(settlement.getNetAmount()), "errorMessage",
					errorMessage != null ? errorMessage : "이체 처리 중 오류가 발생했습니다.");

			TemplatePushRequest pushRequest = TemplatePushRequest.builder().receiverId(settlement.getPartyLeaderId())
					.pushCode(PushCodeType.SETTLE_FAILED.getCode()).params(params)
					.moduleId(String.valueOf(settlement.getSettlementId()))
					.moduleType(PushCodeType.SETTLE_FAILED.getModuleType()).build();

			pushService.addTemplatePush(pushRequest);
			log.info("푸시알림 발송 완료: SETTLE_FAILED -> userId={}", settlement.getPartyLeaderId());

		} catch (Exception e) {
			log.error("푸시알림 발송 실패: settlementId={}, error={}", settlement.getSettlementId(), e.getMessage());
		}
	}

	private void sendAccountRequiredPush(Settlement settlement) {
		try {
			Party party = partyDao.findById(settlement.getPartyId()).orElse(null);
			if (party == null)
				return;

			String productName = productNameResolver.getProductName(party.getProductId());

			Map<String, String> params = Map.of("productName", productName, "amount",
					String.valueOf(settlement.getNetAmount()));

			TemplatePushRequest pushRequest = TemplatePushRequest.builder().receiverId(settlement.getPartyLeaderId())
					.pushCode(PushCodeType.ACCOUNT_REQUIRED.getCode()).params(params)
					.moduleId(String.valueOf(settlement.getSettlementId()))
					.moduleType(PushCodeType.ACCOUNT_REQUIRED.getModuleType()).build();

			pushService.addTemplatePush(pushRequest);
			log.info("푸시알림 발송 완료: ACCOUNT_REQUIRED -> userId={}", settlement.getPartyLeaderId());

		} catch (Exception e) {
			log.error("푸시알림 발송 실패: settlementId={}, error={}", settlement.getSettlementId(), e.getMessage());
		}
	}
}