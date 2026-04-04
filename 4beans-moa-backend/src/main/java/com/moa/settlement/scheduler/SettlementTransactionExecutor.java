package com.moa.settlement.scheduler;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.moa.settlement.repository.SettlementDao;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 은행 API 호출과 DB 트랜잭션을 분리하기 위한 헬퍼 컴포넌트.
 *
 * 문제: 은행 외부 API 호출을 @Transactional 안에서 실행하면
 * API 응답 대기 중 DB 커넥션을 점유하고, API 실패 시 이미 커밋된
 * 상태 변경까지 롤백되는 부작용이 생긴다.
 *
 * 해결: DB 상태 변경은 REQUIRES_NEW로 즉시 커밋하고,
 * 은행 API 호출은 트랜잭션 밖(스케줄러)에서 실행한다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SettlementTransactionExecutor {

    private final SettlementDao settlementDao;

    /**
     * IN_PROGRESS 상태로 변경 후 즉시 커밋.
     * 은행 API 호출 전에 호출해야 한다.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void markInProgress(Integer settlementId) {
        settlementDao.updateStatus(settlementId, "IN_PROGRESS");
        log.info("[정산처리] IN_PROGRESS 상태 커밋 - settlementId: {}", settlementId);
    }

    /**
     * 은행 API 성공 후 COMPLETED 상태로 변경 및 거래ID 저장.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void markCompleted(Integer settlementId, String bankTranId) {
        settlementDao.updateStatus(settlementId, "COMPLETED");
        settlementDao.updateBankTranId(settlementId, bankTranId);
        log.info("[정산처리] COMPLETED 상태 커밋 - settlementId: {}, bankTranId: {}", settlementId, bankTranId);
    }

    /**
     * 은행 API 실패 후 FAILED 상태로 변경.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void markFailed(Integer settlementId) {
        settlementDao.updateStatus(settlementId, "FAILED");
        log.warn("[정산처리] FAILED 상태 커밋 - settlementId: {}", settlementId);
    }
}
