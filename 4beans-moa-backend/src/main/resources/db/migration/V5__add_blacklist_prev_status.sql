-- BLACKLIST 테이블에 이전 사용자 상태 컬럼 추가
-- 블랙리스트 해제 시 원래 상태(PENDING/ACTIVE)로 정확하게 복구하기 위해 필요
ALTER TABLE BLACKLIST
    ADD COLUMN PREV_STATUS VARCHAR(20) NULL COMMENT '블랙리스트 등록 전 사용자 상태';
