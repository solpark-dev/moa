-- ============================================
-- MOA 샘플 데이터 Phase 1: 사용자 / 카드 / 계좌
-- 작성일: 2026-03-25
-- 대상: USERS(37명), USER_CARD(34명), ACCOUNT(20명)
--
-- 사용자 구성:
--   - 관리자     : 1명 (admin@moa.com)
--   - 테스트계정 : 2명 (usertest1, admintest)
--   - 파티장     : 20명 (ACTIVE 8 / CLOSED 6 / RECRUITING 4 / CANCELLED 2)
--   - 파티원     : 14명
--
-- 공통 비밀번호: test1234! (bcrypt)
-- ============================================

USE moa;

-- ============================================
-- 0. 전체 초기화 (외래키 제약 해제 후 TRUNCATE)
-- ============================================
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE TRANSFER_TRANSACTION;
TRUNCATE TABLE ACCOUNT_VERIFICATION;
TRUNCATE TABLE SETTLEMENT_RETRY_HISTORY;
TRUNCATE TABLE REFUND_RETRY_HISTORY;
TRUNCATE TABLE PAYMENT_RETRY_HISTORY;
TRUNCATE TABLE SETTLEMENT;
TRUNCATE TABLE PAYMENT;
TRUNCATE TABLE DEPOSIT;
TRUNCATE TABLE PARTY_MEMBER;
TRUNCATE TABLE PARTY;
TRUNCATE TABLE SUBSCRIPTION;
TRUNCATE TABLE USER_CARD;
TRUNCATE TABLE ACCOUNT;
TRUNCATE TABLE PUSH;
TRUNCATE TABLE COMMUNITY;
TRUNCATE TABLE LOGIN_HISTORY;
TRUNCATE TABLE USER_OTP_BACKUP_CODE;
TRUNCATE TABLE BLACKLIST;
TRUNCATE TABLE OAUTH_ACCOUNT;
TRUNCATE TABLE USERS;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 1. USERS 삽입 (37명)
-- ============================================
INSERT INTO USERS (
    USER_ID, PASSWORD, NICKNAME, PHONE,
    PROFILE_IMAGE, ROLE, USER_STATUS, REG_DATE,
    CI, PASS_CERTIFIED_AT, LAST_LOGIN_DATE,
    LOGIN_FAIL_COUNT, UNLOCK_SCHEDULED_AT,
    DELETE_DATE, DELETE_TYPE, DELETE_DETAIL,
    AGREE_MARKETING, PROVIDER, OTP_SECRET, OTP_ENABLED
) VALUES

-- ─────────────────────────────────────────
-- 관리자 (1명)
-- ─────────────────────────────────────────
('admin@moa.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '관리자', '01099999999', '/img/profile/admin.png',
 'ADMIN', 'ACTIVE', '2025-09-01 09:00:00',
 'CI_ADMIN_MOA_0001', '2025-09-01 09:00:00', '2026-03-25 09:00:00',
 0, NULL, NULL, NULL, NULL, 0, 'LOCAL', NULL, 0),

-- ─────────────────────────────────────────
-- 테스트 계정 (2명) — Easter Egg 용
-- ─────────────────────────────────────────
('usertest1',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '테스트유저', '01011110001', NULL,
 'USER', 'ACTIVE', '2025-09-01 10:00:00',
 'CI_TEST_USER_0001', '2025-09-01 10:00:00', '2026-03-25 09:00:00',
 0, NULL, NULL, NULL, NULL, 0, 'LOCAL', NULL, 0),

('admintest',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '관리자테스트', '01011110002', NULL,
 'ADMIN', 'ACTIVE', '2025-09-01 10:00:00',
 'CI_TEST_ADMIN_0001', '2025-09-01 10:00:00', '2026-03-25 09:00:00',
 0, NULL, NULL, NULL, NULL, 0, 'LOCAL', NULL, 0),

-- ─────────────────────────────────────────
-- ACTIVE 파티 리더 8명 (파티 1~8번)
-- ─────────────────────────────────────────
-- 파티 1: Netflix Standard 4인 리더
('kimminj95@gmail.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '김민준', '01032145678', NULL,
 'USER', 'ACTIVE', '2025-09-03 14:22:00',
 'CI_KIM_MINJUN_0001', '2025-09-03 14:22:00', '2026-03-25 08:45:00',
 0, NULL, NULL, NULL, NULL, 1, 'LOCAL', NULL, 0),

-- 파티 2: 유튜브 프리미엄 4인 리더
('leeseyeon@naver.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '이서연', '01056781234', NULL,
 'USER', 'ACTIVE', '2025-09-05 10:15:00',
 'CI_LEE_SEYEON_0001', '2025-09-05 10:15:00', '2026-03-24 22:10:00',
 0, NULL, NULL, NULL, NULL, 1, 'KAKAO', NULL, 0),

-- 파티 3: Disney+ Standard 4인 리더
('parkjihun@kakao.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '박지훈', '01098765432', NULL,
 'USER', 'ACTIVE', '2025-09-08 16:33:00',
 'CI_PARK_JIHUN_0001', '2025-09-08 16:33:00', '2026-03-23 19:55:00',
 0, NULL, NULL, NULL, NULL, 0, 'LOCAL', NULL, 0),

-- 파티 4: 티빙 스탠다드 4인 리더
('choisubin@gmail.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '최수빈', '01011223344', NULL,
 'USER', 'ACTIVE', '2025-09-10 09:41:00',
 'CI_CHOI_SUBIN_0001', '2025-09-10 09:41:00', '2026-03-25 07:30:00',
 0, NULL, NULL, NULL, NULL, 0, 'GOOGLE', NULL, 0),

-- 파티 5: 웨이브 프리미엄 4인 리더
('junghwu@naver.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '정현우', '01055667788', NULL,
 'USER', 'ACTIVE', '2025-09-12 13:07:00',
 'CI_JUNG_HYUNWOO_0001', '2025-09-12 13:07:00', '2026-03-22 14:20:00',
 0, NULL, NULL, NULL, NULL, 0, 'LOCAL', NULL, 0),

-- 파티 6: Netflix Premium 4인 리더
('kangjieun@gmail.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '강지은', '01033445566', NULL,
 'USER', 'ACTIVE', '2025-09-15 11:55:00',
 'CI_KANG_JIEUN_0001', '2025-09-15 11:55:00', '2026-03-24 16:40:00',
 0, NULL, NULL, NULL, NULL, 1, 'LOCAL', NULL, 0),

-- 파티 7: 왓챠 베이직 4인 리더
('chominseo@naver.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '조민서', '01077889900', NULL,
 'USER', 'ACTIVE', '2025-09-18 15:22:00',
 'CI_CHO_MINSEO_0001', '2025-09-18 15:22:00', '2026-03-25 10:15:00',
 0, NULL, NULL, NULL, NULL, 0, 'KAKAO', NULL, 0),

-- 파티 8: Disney+ Premium 4인 리더
('yoonjunhyuk@kakao.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '윤준혁', '01022334455', NULL,
 'USER', 'ACTIVE', '2025-09-20 09:10:00',
 'CI_YOON_JUNHYUK_0001', '2025-09-20 09:10:00', '2026-03-23 11:30:00',
 0, NULL, NULL, NULL, NULL, 0, 'LOCAL', NULL, 0),

-- ─────────────────────────────────────────
-- CLOSED 파티 리더 6명 (파티 9~14번)
-- ─────────────────────────────────────────
-- 파티 9: Netflix Standard 4인 (종료)
('jangnayeon@gmail.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '장나연', '01044556677', NULL,
 'USER', 'ACTIVE', '2025-09-22 14:38:00',
 'CI_JANG_NAYEON_0001', '2025-09-22 14:38:00', '2026-03-20 18:00:00',
 0, NULL, NULL, NULL, NULL, 1, 'GOOGLE', NULL, 0),

-- 파티 10: 유튜브 프리미엄 4인 (종료)
('limtaeyang@naver.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '임태양', '01088990011', NULL,
 'USER', 'ACTIVE', '2025-09-25 10:50:00',
 'CI_LIM_TAEYANG_0001', '2025-09-25 10:50:00', '2026-03-21 09:15:00',
 0, NULL, NULL, NULL, NULL, 0, 'LOCAL', NULL, 0),

-- 파티 11: Disney+ Standard 4인 (종료)
('hanhaeun@gmail.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '한하은', '01011223355', NULL,
 'USER', 'ACTIVE', '2025-09-28 16:05:00',
 'CI_HAN_HAEUN_0001', '2025-09-28 16:05:00', '2026-03-18 20:30:00',
 0, NULL, NULL, NULL, NULL, 0, 'KAKAO', NULL, 0),

-- 파티 12: 티빙 스탠다드 4인 (종료)
('ohjungwoo@kakao.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '오정우', '01055661122', NULL,
 'USER', 'ACTIVE', '2025-10-01 11:20:00',
 'CI_OH_JUNGWOO_0001', '2025-10-01 11:20:00', '2026-03-15 14:45:00',
 0, NULL, NULL, NULL, NULL, 0, 'LOCAL', NULL, 0),

-- 파티 13: 웨이브 프리미엄 3인 (종료)
('shinyerin@gmail.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '신예린', '01033448877', NULL,
 'USER', 'ACTIVE', '2025-10-03 09:35:00',
 'CI_SHIN_YERIN_0001', '2025-10-03 09:35:00', '2026-03-10 11:00:00',
 0, NULL, NULL, NULL, NULL, 1, 'GOOGLE', NULL, 0),

-- 파티 14: 왓챠 베이직 4인 (종료)
('kwondohyun@naver.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '권도현', '01077662233', NULL,
 'USER', 'ACTIVE', '2025-10-05 14:48:00',
 'CI_KWON_DOHYUN_0001', '2025-10-05 14:48:00', '2026-03-12 17:20:00',
 0, NULL, NULL, NULL, NULL, 0, 'LOCAL', NULL, 0),

-- ─────────────────────────────────────────
-- RECRUITING 파티 리더 4명 (파티 15~18번)
-- ─────────────────────────────────────────
-- 파티 15: Netflix Standard 모집 중 (2/4인)
('hwangsua@gmail.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '황수아', '01022113344', NULL,
 'USER', 'ACTIVE', '2025-10-08 10:22:00',
 'CI_HWANG_SUA_0001', '2025-10-08 10:22:00', '2026-03-24 20:10:00',
 0, NULL, NULL, NULL, NULL, 0, 'KAKAO', NULL, 0),

-- 파티 16: Disney+ Premium 모집 중 (1/4인)
('kimgunwoo@naver.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '김건우', '01066775544', NULL,
 'USER', 'ACTIVE', '2025-10-10 15:33:00',
 'CI_KIM_GUNWOO_0001', '2025-10-10 15:33:00', '2026-03-23 08:55:00',
 0, NULL, NULL, NULL, NULL, 0, 'LOCAL', NULL, 0),

-- 파티 17: 티빙 스탠다드 모집 중 (3/4인)
('leeareum@kakao.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '이아름', '01044337799', NULL,
 'USER', 'ACTIVE', '2025-10-12 11:15:00',
 'CI_LEE_AREUM_0001', '2025-10-12 11:15:00', '2026-03-25 06:40:00',
 0, NULL, NULL, NULL, NULL, 1, 'GOOGLE', NULL, 0),

-- 파티 18: 유튜브 프리미엄 모집 중 (2/4인)
('parkminkyu@gmail.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '박민규', '01011558866', NULL,
 'USER', 'ACTIVE', '2025-10-15 09:48:00',
 'CI_PARK_MINKYU_0001', '2025-10-15 09:48:00', '2026-03-22 21:30:00',
 0, NULL, NULL, NULL, NULL, 0, 'LOCAL', NULL, 0),

-- ─────────────────────────────────────────
-- CANCELLED 파티 리더 2명 (파티 19~20번)
-- ─────────────────────────────────────────
('choijisoo@naver.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '최지수', '01088113355', NULL,
 'USER', 'ACTIVE', '2025-10-18 14:10:00',
 'CI_CHOI_JISOO_0001', '2025-10-18 14:10:00', '2026-02-15 10:30:00',
 0, NULL, NULL, NULL, NULL, 0, 'KAKAO', NULL, 0),

('jungsunghyun@gmail.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '정승현', '01055998877', NULL,
 'USER', 'ACTIVE', '2025-10-20 10:55:00',
 'CI_JUNG_SUNGHYUN_0001', '2025-10-20 10:55:00', '2026-01-30 15:20:00',
 0, NULL, NULL, NULL, NULL, 0, 'LOCAL', NULL, 0),

-- ─────────────────────────────────────────
-- 일반 파티원 14명
-- ─────────────────────────────────────────
('kanghyeji@naver.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '강혜지', '01034562211', NULL,
 'USER', 'ACTIVE', '2025-10-22 09:30:00',
 'CI_KANG_HYEJI_0001', '2025-10-22 09:30:00', '2026-03-25 09:45:00',
 0, NULL, NULL, NULL, NULL, 0, 'LOCAL', NULL, 0),

('chodyoungwook@gmail.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '조동욱', '01077234455', NULL,
 'USER', 'ACTIVE', '2025-10-23 14:20:00',
 'CI_CHO_DONGWOOK_0001', '2025-10-23 14:20:00', '2026-03-24 13:10:00',
 0, NULL, NULL, NULL, NULL, 0, 'GOOGLE', NULL, 0),

('yoonchaewon@naver.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '윤채원', '01055441122', NULL,
 'USER', 'ACTIVE', '2025-10-24 11:05:00',
 'CI_YOON_CHAEWON_0001', '2025-10-24 11:05:00', '2026-03-23 18:25:00',
 0, NULL, NULL, NULL, NULL, 1, 'KAKAO', NULL, 0),

('janghyunseok@gmail.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '장현석', '01033669977', NULL,
 'USER', 'ACTIVE', '2025-10-25 16:40:00',
 'CI_JANG_HYUNSEOK_0001', '2025-10-25 16:40:00', '2026-03-25 07:50:00',
 0, NULL, NULL, NULL, NULL, 0, 'LOCAL', NULL, 0),

('limjiyoung@kakao.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '임지영', '01011445566', NULL,
 'USER', 'ACTIVE', '2025-10-26 09:15:00',
 'CI_LIM_JIYOUNG_0001', '2025-10-26 09:15:00', '2026-03-22 12:00:00',
 0, NULL, NULL, NULL, NULL, 0, 'LOCAL', NULL, 0),

('hansungmin@naver.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '한성민', '01066113388', NULL,
 'USER', 'ACTIVE', '2025-10-27 14:55:00',
 'CI_HAN_SUNGMIN_0001', '2025-10-27 14:55:00', '2026-03-24 10:30:00',
 0, NULL, NULL, NULL, NULL, 0, 'GOOGLE', NULL, 0),

('ohhayeon@gmail.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '오하연', '01044221155', NULL,
 'USER', 'ACTIVE', '2025-10-28 10:33:00',
 'CI_OH_HAYEON_0001', '2025-10-28 10:33:00', '2026-03-21 19:15:00',
 0, NULL, NULL, NULL, NULL, 1, 'KAKAO', NULL, 0),

-- 정지 계정 (블랙리스트 테스트용)
('shintaehoon@naver.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '신태훈', '01077558833', NULL,
 'USER', 'SUSPENDED', '2025-10-29 15:20:00',
 'CI_SHIN_TAEHOON_0001', '2025-10-29 15:20:00', '2025-12-10 11:00:00',
 3, '2025-12-15 11:00:00', NULL, NULL, NULL, 0, 'LOCAL', NULL, 0),

('kwonyujin@gmail.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '권유진', '01022334477', NULL,
 'USER', 'ACTIVE', '2025-10-30 09:45:00',
 'CI_KWON_YUJIN_0001', '2025-10-30 09:45:00', '2026-03-25 08:20:00',
 0, NULL, NULL, NULL, NULL, 0, 'LOCAL', NULL, 0),

('kimjiho@naver.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '김지호', '01055778899', NULL,
 'USER', 'ACTIVE', '2025-11-01 11:10:00',
 'CI_KIM_JIHO_0001', '2025-11-01 11:10:00', '2026-03-23 16:40:00',
 0, NULL, NULL, NULL, NULL, 0, 'GOOGLE', NULL, 0),

('leejisoo@gmail.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '이지수', '01033116644', NULL,
 'USER', 'ACTIVE', '2025-11-03 14:25:00',
 'CI_LEE_JISOO_0001', '2025-11-03 14:25:00', '2026-03-24 09:55:00',
 0, NULL, NULL, NULL, NULL, 0, 'KAKAO', NULL, 0),

('parkseungwoo@kakao.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '박승우', '01044889966', NULL,
 'USER', 'ACTIVE', '2025-11-05 10:50:00',
 'CI_PARK_SEUNGWOO_0001', '2025-11-05 10:50:00', '2026-03-22 22:10:00',
 0, NULL, NULL, NULL, NULL, 0, 'LOCAL', NULL, 0),

('choihaneum@gmail.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '최하늘', '01077332211', NULL,
 'USER', 'ACTIVE', '2025-11-07 16:15:00',
 'CI_CHOI_HANEUM_0001', '2025-11-07 16:15:00', '2026-03-25 11:00:00',
 0, NULL, NULL, NULL, NULL, 1, 'GOOGLE', NULL, 0),

('junghyewon@naver.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '정혜원', '01011667755', NULL,
 'USER', 'ACTIVE', '2025-11-09 09:33:00',
 'CI_JUNG_HYEWON_0001', '2025-11-09 09:33:00', '2026-03-20 14:50:00',
 0, NULL, NULL, NULL, NULL, 0, 'LOCAL', NULL, 0),

('kangdohyun@gmail.com',
 '$2a$10$Wln.vzRj7UQ0/ynhnfYv..BwQP2IOl.R9mNYsaPZLenBylXdBNmWq',
 '강도현', '01055224466', NULL,
 'USER', 'ACTIVE', '2025-11-11 13:48:00',
 'CI_KANG_DOHYUN_0001', '2025-11-11 13:48:00', '2026-03-19 17:30:00',
 0, NULL, NULL, NULL, NULL, 0, 'KAKAO', NULL, 0);


-- ============================================
-- 2. BLACKLIST 삽입 (정지 계정 1건)
-- ============================================
INSERT INTO BLACKLIST (USER_ID, REASON, STATUS, REG_DATE, RELEASE_DATE)
VALUES ('shintaehoon@naver.com',
        '결제 수단 도용 의심 및 반복적인 파티 규정 위반',
        'ACTIVE', '2025-12-10', NULL);


-- ============================================
-- 3. USER_CARD 삽입 (34명 — 파티 참여 이력 보유자)
-- 빌링키는 TossPayments bk_test_ 형식
-- 카드사: KB국민/신한/하나/삼성/현대/우리/농협/토스
-- ============================================
INSERT INTO USER_CARD (USER_ID, BILLING_KEY, CARD_COMPANY, CARD_NUMBER, REG_DATE) VALUES
-- ACTIVE 파티 리더
('kimminj95@gmail.com',    'bk_test_km95_20251001', 'KB국민카드',  '****-****-****-1234', '2025-10-01 14:30:00'),
('leeseyeon@naver.com',    'bk_test_ls01_20251015', '신한카드',    '****-****-****-5678', '2025-10-15 10:20:00'),
('parkjihun@kakao.com',    'bk_test_pj88_20251101', '하나카드',    '****-****-****-9012', '2025-11-01 09:15:00'),
('choisubin@gmail.com',    'bk_test_cs22_20251115', '삼성카드',    '****-****-****-3456', '2025-11-15 11:40:00'),
('junghwu@naver.com',      'bk_test_jh77_20251201', '현대카드',    '****-****-****-7890', '2025-12-01 08:55:00'),
('kangjieun@gmail.com',    'bk_test_kj33_20251215', 'KB국민카드',  '****-****-****-2345', '2025-12-15 13:10:00'),
('chominseo@naver.com',    'bk_test_cm44_20260101', '우리카드',    '****-****-****-6789', '2026-01-01 09:30:00'),
('yoonjunhyuk@kakao.com',  'bk_test_yj66_20260115', '농협카드',    '****-****-****-0123', '2026-01-15 10:45:00'),
-- CLOSED 파티 리더
('jangnayeon@gmail.com',   'bk_test_jn55_20250701', '신한카드',    '****-****-****-4567', '2025-07-01 14:20:00'),
('limtaeyang@naver.com',   'bk_test_lt99_20250801', '토스카드',    '****-****-****-8901', '2025-08-01 09:00:00'),
('hanhaeun@gmail.com',     'bk_test_hh11_20250601', '하나카드',    '****-****-****-2346', '2025-06-01 11:30:00'),
('ohjungwoo@kakao.com',    'bk_test_oj88_20250901', '삼성카드',    '****-****-****-5679', '2025-09-01 10:15:00'),
('shinyerin@gmail.com',    'bk_test_sy22_20250715', 'KB국민카드',  '****-****-****-9013', '2025-07-15 13:00:00'),
('kwondohyun@naver.com',   'bk_test_kd77_20251001', '현대카드',    '****-****-****-3457', '2025-10-01 09:45:00'),
-- RECRUITING 파티 리더
('hwangsua@gmail.com',     'bk_test_hs33_20260201', '우리카드',    '****-****-****-7891', '2026-02-01 14:30:00'),
('kimgunwoo@naver.com',    'bk_test_kg44_20260210', '농협카드',    '****-****-****-1235', '2026-02-10 10:20:00'),
('leeareum@kakao.com',     'bk_test_la55_20260215', '신한카드',    '****-****-****-4568', '2026-02-15 09:15:00'),
('parkminkyu@gmail.com',   'bk_test_pm66_20260220', '토스카드',    '****-****-****-8902', '2026-02-20 11:40:00'),
-- CANCELLED 파티 리더
('choijisoo@naver.com',    'bk_test_cj11_20251120', 'KB국민카드',  '****-****-****-2347', '2025-11-20 08:55:00'),
('jungsunghyun@gmail.com', 'bk_test_js22_20251125', '신한카드',    '****-****-****-6790', '2025-11-25 13:10:00'),
-- 일반 파티원
('kanghyeji@naver.com',    'bk_test_khy_20251022', '하나카드',    '****-****-****-0124', '2025-10-22 09:40:00'),
('chodyoungwook@gmail.com','bk_test_cdy_20251023', '삼성카드',    '****-****-****-3458', '2025-10-23 14:30:00'),
('yoonchaewon@naver.com',  'bk_test_ycw_20251024', '현대카드',    '****-****-****-7892', '2025-10-24 11:15:00'),
('janghyunseok@gmail.com', 'bk_test_jhs_20251025', 'KB국민카드',  '****-****-****-1236', '2025-10-25 16:50:00'),
('limjiyoung@kakao.com',   'bk_test_ljy_20251026', '우리카드',    '****-****-****-4569', '2025-10-26 09:25:00'),
('hansungmin@naver.com',   'bk_test_hsm_20251027', '농협카드',    '****-****-****-8903', '2025-10-27 15:05:00'),
('ohhayeon@gmail.com',     'bk_test_ohy_20251028', '신한카드',    '****-****-****-2348', '2025-10-28 10:45:00'),
('shintaehoon@naver.com',  'bk_test_sth_20251029', '토스카드',    '****-****-****-6791', '2025-10-29 15:30:00'),
('kwonyujin@gmail.com',    'bk_test_kyj_20251030', '하나카드',    '****-****-****-0125', '2025-10-30 09:55:00'),
('kimjiho@naver.com',      'bk_test_kjh_20251101', '삼성카드',    '****-****-****-3459', '2025-11-01 11:20:00'),
('leejisoo@gmail.com',     'bk_test_ljs_20251103', '현대카드',    '****-****-****-7893', '2025-11-03 14:35:00'),
('parkseungwoo@kakao.com', 'bk_test_psw_20251105', 'KB국민카드',  '****-****-****-1237', '2025-11-05 11:00:00'),
('choihaneum@gmail.com',   'bk_test_che_20251107', '신한카드',    '****-****-****-4560', '2025-11-07 16:25:00'),
('junghyewon@naver.com',   'bk_test_jhw_20251109', '우리카드',    '****-****-****-8904', '2025-11-09 09:45:00');
-- kangdohyun은 아직 카드 미등록 (파티 참여 전 상태)


-- ============================================
-- 4. ACCOUNT 삽입 (파티장 20명)
-- ACCOUNT_ID는 AUTO_INCREMENT이므로 순서대로 1~20
-- FINTECH_USE_NUM: 오픈뱅킹 핀테크이용번호 (18자리)
-- ============================================
INSERT INTO ACCOUNT (
    USER_ID, BANK_CODE, BANK_NAME, ACCOUNT_NUMBER,
    ACCOUNT_HOLDER, IS_VERIFIED, FINTECH_USE_NUM,
    STATUS, REG_DATE, VERIFY_DATE
) VALUES
-- ACTIVE 파티 리더 (ACCOUNT_ID 1~8)
('kimminj95@gmail.com',  '088', '신한은행',   '110-123-456789', '김민준', 'Y', '987600000000000101', 'ACTIVE', '2025-10-01 15:00:00', '2025-10-01 15:20:00'),
('leeseyeon@naver.com',  '004', 'KB국민은행', '001-234-567890', '이서연', 'Y', '987600000000000202', 'ACTIVE', '2025-10-15 11:00:00', '2025-10-15 11:15:00'),
('parkjihun@kakao.com',  '090', '카카오뱅크', '333-12-3456789', '박지훈', 'Y', '987600000000000303', 'ACTIVE', '2025-11-01 10:00:00', '2025-11-01 10:18:00'),
('choisubin@gmail.com',  '081', '하나은행',   '102-345-678901', '최수빈', 'Y', '987600000000000404', 'ACTIVE', '2025-11-15 12:00:00', '2025-11-15 12:22:00'),
('junghwu@naver.com',    '020', '우리은행',   '1002-456-789012', '정현우', 'Y', '987600000000000505', 'ACTIVE', '2025-12-01 09:30:00', '2025-12-01 09:48:00'),
('kangjieun@gmail.com',  '088', '신한은행',   '110-567-890123', '강지은', 'Y', '987600000000000606', 'ACTIVE', '2025-12-15 14:00:00', '2025-12-15 14:19:00'),
('chominseo@naver.com',  '011', 'NH농협은행', '302-678-901234', '조민서', 'Y', '987600000000000707', 'ACTIVE', '2026-01-01 10:00:00', '2026-01-01 10:17:00'),
('yoonjunhyuk@kakao.com','092', '토스뱅크',   '100-789-012345', '윤준혁', 'Y', '987600000000000808', 'ACTIVE', '2026-01-15 11:00:00', '2026-01-15 11:21:00'),
-- CLOSED 파티 리더 (ACCOUNT_ID 9~14)
('jangnayeon@gmail.com', '004', 'KB국민은행', '001-890-123456', '장나연', 'Y', '987600000000000909', 'ACTIVE', '2025-07-01 15:00:00', '2025-07-01 15:16:00'),
('limtaeyang@naver.com', '081', '하나은행',   '102-901-234567', '임태양', 'Y', '987600000000001010', 'ACTIVE', '2025-08-01 10:00:00', '2025-08-01 10:14:00'),
('hanhaeun@gmail.com',   '088', '신한은행',   '110-012-345678', '한하은', 'Y', '987600000000001111', 'ACTIVE', '2025-06-01 12:00:00', '2025-06-01 12:18:00'),
('ohjungwoo@kakao.com',  '090', '카카오뱅크', '333-23-4567890', '오정우', 'Y', '987600000000001212', 'ACTIVE', '2025-09-01 11:00:00', '2025-09-01 11:20:00'),
('shinyerin@gmail.com',  '020', '우리은행',   '1002-123-456789', '신예린', 'Y', '987600000000001313', 'ACTIVE', '2025-07-15 14:00:00', '2025-07-15 14:15:00'),
('kwondohyun@naver.com', '092', '토스뱅크',   '100-234-567890', '권도현', 'Y', '987600000000001414', 'ACTIVE', '2025-10-01 10:30:00', '2025-10-01 10:46:00'),
-- RECRUITING 파티 리더 (ACCOUNT_ID 15~18)
('hwangsua@gmail.com',   '011', 'NH농협은행', '302-345-678901', '황수아', 'Y', '987600000000001515', 'ACTIVE', '2026-02-01 15:00:00', '2026-02-01 15:19:00'),
('kimgunwoo@naver.com',  '088', '신한은행',   '110-456-789012', '김건우', 'Y', '987600000000001616', 'ACTIVE', '2026-02-10 11:00:00', '2026-02-10 11:17:00'),
('leeareum@kakao.com',   '004', 'KB국민은행', '001-567-890123', '이아름', 'Y', '987600000000001717', 'ACTIVE', '2026-02-15 10:00:00', '2026-02-15 10:22:00'),
('parkminkyu@gmail.com', '081', '하나은행',   '102-678-901234', '박민규', 'Y', '987600000000001818', 'ACTIVE', '2026-02-20 12:00:00', '2026-02-20 12:16:00'),
-- CANCELLED 파티 리더 (ACCOUNT_ID 19~20)
('choijisoo@naver.com',  '090', '카카오뱅크', '333-34-5678901', '최지수', 'Y', '987600000000001919', 'ACTIVE', '2025-11-20 09:30:00', '2025-11-20 09:48:00'),
('jungsunghyun@gmail.com','020', '우리은행',  '1002-234-567890', '정승현', 'Y', '987600000000002020', 'ACTIVE', '2025-11-25 14:00:00', '2025-11-25 14:18:00');


-- ============================================
-- Phase 1 완료
-- 다음: moa_data_02_parties.sql 실행
-- ============================================
