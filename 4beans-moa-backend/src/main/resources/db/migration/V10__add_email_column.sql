-- ============================================
-- V10: USERS 테이블 EMAIL 컬럼 추가
-- USER_ID와 이메일 식별자 분리
-- ============================================

-- 1. EMAIL 컬럼 추가 (NULL 허용, UNIQUE 제약)
ALTER TABLE USERS ADD COLUMN EMAIL VARCHAR(100) NULL UNIQUE AFTER USER_ID;

-- 2. 기존 유저 데이터 마이그레이션
--    USER_ID가 이메일 형식(@포함)인 경우 EMAIL 컬럼으로 복사
--    kakao_*, google_* 형식은 EMAIL = NULL 유지 (기본값)
UPDATE USERS SET EMAIL = USER_ID WHERE USER_ID LIKE '%@%';
