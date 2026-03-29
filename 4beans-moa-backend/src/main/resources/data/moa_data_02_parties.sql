-- ============================================
-- MOA 샘플 데이터 Phase 2: 파티 / 파티 멤버
-- 작성일: 2026-03-25
-- 대상: PARTY(20개), PARTY_MEMBER(66명)
--
-- 파티 구성:
--   ACTIVE    8개 (ID  1~ 8) — 현재 운영 중 (4인 만원)
--   CLOSED    6개 (ID  9~14) — 정상 종료 (정산 완료)
--   RECRUITING 4개 (ID 15~18) — 모집 중
--   CANCELLED  2개 (ID 19~20) — 취소
--
-- 상품별 월 분담금 (실제 요금 기준):
--   Netflix Standard  (ID 19): 14,500 / 4인 = 3,625원
--   Netflix Premium   (ID 20): 19,000 / 4인 = 4,750원
--   유튜브 프리미엄    (ID  4): 13,900 / 4인 = 3,475원
--   Disney+ Standard  (ID  2):  9,900 / 4인 = 2,475원
--   Disney+ Premium   (ID 13): 13,900 / 4인 = 3,475원
--   티빙 스탠다드      (ID  7): 10,900 / 4인 = 2,725원
--   웨이브 프리미엄    (ID  8): 13,900 / 4인 = 3,475원
--   왓챠 베이직        (ID  3):  7,900 / 4인 = 1,975원
-- ============================================

USE moa;

-- ============================================
-- 1. PARTY 삽입 (20개)
-- ============================================
INSERT INTO PARTY (
    PARTY_ID, PRODUCT_ID, PARTY_LEADER_ID, PARTY_STATUS,
    MAX_MEMBERS, CURRENT_MEMBERS, MONTHLY_FEE,
    OTT_ID, OTT_PASSWORD, ACCOUNT_ID,
    REG_DATE, START_DATE, END_DATE
) VALUES

-- ═══════════════════════════════════════════
-- ACTIVE 파티 8개 (현재 운영 중)
-- ═══════════════════════════════════════════

-- 파티 1: Netflix Standard 4인 | 리더: 김민준
(1,  19, 'kimminj95@gmail.com',   'ACTIVE', 4, 4, 3625,
 'kimminj_netflix', 'Km@secure2025!', 1,
 '2025-10-25 14:00:00', '2025-11-01 00:00:00', NULL),

-- 파티 2: 유튜브 프리미엄 4인 | 리더: 이서연
(2,   4, 'leeseyeon@naver.com',   'ACTIVE', 4, 4, 3475,
 'leeseyeon_yt', 'Ls#youtube88!', 2,
 '2025-11-08 10:00:00', '2025-11-15 00:00:00', NULL),

-- 파티 3: Disney+ Standard 4인 | 리더: 박지훈
(3,   2, 'parkjihun@kakao.com',   'ACTIVE', 4, 4, 2475,
 'parkjh_disney', 'Pj!disney2025', 3,
 '2025-11-24 09:00:00', '2025-12-01 00:00:00', NULL),

-- 파티 4: 티빙 스탠다드 4인 | 리더: 최수빈
(4,   7, 'choisubin@gmail.com',   'ACTIVE', 4, 4, 2725,
 'choisb_tving', 'Cs$tving9900!', 4,
 '2025-12-08 11:00:00', '2025-12-15 00:00:00', NULL),

-- 파티 5: 웨이브 프리미엄 4인 | 리더: 정현우
(5,   8, 'junghwu@naver.com',     'ACTIVE', 4, 4, 3475,
 'junghw_wavve', 'Jh@wavve2026!', 5,
 '2025-12-25 13:00:00', '2026-01-01 00:00:00', NULL),

-- 파티 6: Netflix Premium 4인 | 리더: 강지은
(6,  20, 'kangjieun@gmail.com',   'ACTIVE', 4, 4, 4750,
 'kangje_netflix', 'Kj#netprem2026', 6,
 '2026-01-08 15:00:00', '2026-01-15 00:00:00', NULL),

-- 파티 7: 왓챠 베이직 4인 | 리더: 조민서
(7,   3, 'chominseo@naver.com',   'ACTIVE', 4, 4, 1975,
 'choms_watcha', 'Cm!watcha7900', 7,
 '2026-01-25 10:00:00', '2026-02-01 00:00:00', NULL),

-- 파티 8: Disney+ Premium 4인 | 리더: 윤준혁
(8,  13, 'yoonjunhyuk@kakao.com', 'ACTIVE', 4, 4, 3475,
 'yoonjh_disney', 'Yj@dplus2026!', 8,
 '2026-02-08 09:00:00', '2026-02-15 00:00:00', NULL),


-- ═══════════════════════════════════════════
-- CLOSED 파티 6개 (정상 종료 — 정산 완료)
-- ═══════════════════════════════════════════

-- 파티 9: Netflix Standard 4인 종료 | 리더: 장나연 (5개월 운영)
(9,  19, 'jangnayeon@gmail.com',  'CLOSED', 4, 4, 3625,
 'jangnay_netflix', 'Jn#netflix25', 9,
 '2025-09-25 14:00:00', '2025-10-01 00:00:00', '2026-02-28 23:59:59'),

-- 파티 10: 유튜브 프리미엄 4인 종료 | 리더: 임태양 (5개월 운영)
(10,  4, 'limtaeyang@naver.com',  'CLOSED', 4, 4, 3475,
 'limty_youtube', 'Lt!yt2025prem', 10,
 '2025-08-25 10:00:00', '2025-09-01 00:00:00', '2026-01-31 23:59:59'),

-- 파티 11: Disney+ Standard 4인 종료 | 리더: 한하은 (5개월 운영)
(11,  2, 'hanhaeun@gmail.com',    'CLOSED', 4, 4, 2475,
 'hanhae_disney', 'Hh@disney9900', 11,
 '2025-07-25 09:00:00', '2025-08-01 00:00:00', '2025-12-31 23:59:59'),

-- 파티 12: 티빙 스탠다드 4인 종료 | 리더: 오정우 (5개월 운영)
(12,  7, 'ohjungwoo@kakao.com',   'CLOSED', 4, 4, 2725,
 'ohjw_tving', 'Oj$tving2025', 12,
 '2025-09-25 11:00:00', '2025-10-01 00:00:00', '2026-02-28 23:59:59'),

-- 파티 13: 웨이브 프리미엄 4인 → 탈퇴자 발생 | 리더: 신예린
-- 신태훈이 중도 탈퇴 → CURRENT_MEMBERS 3명으로 감소
(13,  8, 'shinyerin@gmail.com',   'CLOSED', 4, 3, 3475,
 'shinyr_wavve', 'Sy!wavve2025', 13,
 '2025-09-08 13:00:00', '2025-09-15 00:00:00', '2026-01-31 23:59:59'),

-- 파티 14: 왓챠 베이직 4인 종료 | 리더: 권도현 (4개월 운영)
(14,  3, 'kwondohyun@naver.com',  'CLOSED', 4, 4, 1975,
 'kwondh_watcha', 'Kd@watcha25!', 14,
 '2025-10-25 15:00:00', '2025-11-01 00:00:00', '2026-02-28 23:59:59'),


-- ═══════════════════════════════════════════
-- RECRUITING 파티 4개 (모집 중)
-- ═══════════════════════════════════════════

-- 파티 15: Netflix Standard 모집 중 2/4인 | 리더: 황수아
(15, 19, 'hwangsua@gmail.com',    'RECRUITING', 4, 2, 3625,
 NULL, NULL, 15,
 '2026-03-10 10:00:00', '2026-04-01 00:00:00', NULL),

-- 파티 16: Disney+ Premium 모집 중 1/4인 | 리더: 김건우
(16, 13, 'kimgunwoo@naver.com',   'RECRUITING', 4, 1, 3475,
 NULL, NULL, 16,
 '2026-03-15 14:00:00', '2026-04-01 00:00:00', NULL),

-- 파티 17: 티빙 스탠다드 모집 중 3/4인 | 리더: 이아름
(17,  7, 'leeareum@kakao.com',    'RECRUITING', 4, 3, 2725,
 NULL, NULL, 17,
 '2026-03-18 11:00:00', '2026-04-01 00:00:00', NULL),

-- 파티 18: 유튜브 프리미엄 모집 중 2/4인 | 리더: 박민규
(18,  4, 'parkminkyu@gmail.com',  'RECRUITING', 4, 2, 3475,
 NULL, NULL, 18,
 '2026-03-20 09:00:00', '2026-04-01 00:00:00', NULL),


-- ═══════════════════════════════════════════
-- CANCELLED 파티 2개 (취소)
-- ═══════════════════════════════════════════

-- 파티 19: 웨이브 프리미엄 취소 (모집 기간 초과) | 리더: 최지수
(19,  8, 'choijisoo@naver.com',   'CANCELLED', 4, 1, 3475,
 NULL, NULL, 19,
 '2025-11-05 14:00:00', '2025-12-01 00:00:00', '2025-12-05 00:00:00'),

-- 파티 20: Netflix Standard 취소 (리더 강제 취소) | 리더: 정승현
(20, 19, 'jungsunghyun@gmail.com','CANCELLED', 4, 1, 3625,
 NULL, NULL, 20,
 '2025-11-10 10:00:00', '2025-12-01 00:00:00', '2025-11-25 00:00:00');


-- ============================================
-- 2. PARTY_MEMBER 삽입 (66명)
-- MEMBER_STATUS:
--   ACTIVE     - 현재 파티 운영 중
--   COMPLETED  - 파티 정상 종료
--   WITHDRAWN  - 중도 탈퇴
--   CANCELLED  - 파티 취소로 해제
-- ============================================
INSERT INTO PARTY_MEMBER (
    PARTY_ID, USER_ID, MEMBER_ROLE, MEMBER_STATUS,
    JOIN_DATE, WITHDRAW_DATE
) VALUES

-- ═══════════════════════════════════════════
-- ACTIVE 파티 멤버 (32명: 파티 1~8)
-- ═══════════════════════════════════════════

-- 파티 1: Netflix Standard (PM_ID 1~4)
(1, 'kimminj95@gmail.com',    'LEADER', 'ACTIVE', '2025-10-25 14:00:00', NULL),
(1, 'kanghyeji@naver.com',    'MEMBER', 'ACTIVE', '2025-10-27 19:30:00', NULL),
(1, 'chodyoungwook@gmail.com','MEMBER', 'ACTIVE', '2025-10-28 11:15:00', NULL),
(1, 'yoonchaewon@naver.com',  'MEMBER', 'ACTIVE', '2025-10-29 16:40:00', NULL),

-- 파티 2: 유튜브 프리미엄 (PM_ID 5~8)
(2, 'leeseyeon@naver.com',    'LEADER', 'ACTIVE', '2025-11-08 10:00:00', NULL),
(2, 'janghyunseok@gmail.com', 'MEMBER', 'ACTIVE', '2025-11-10 14:22:00', NULL),
(2, 'limjiyoung@kakao.com',   'MEMBER', 'ACTIVE', '2025-11-11 09:45:00', NULL),
(2, 'hansungmin@naver.com',   'MEMBER', 'ACTIVE', '2025-11-12 17:10:00', NULL),

-- 파티 3: Disney+ Standard (PM_ID 9~12)
(3, 'parkjihun@kakao.com',    'LEADER', 'ACTIVE', '2025-11-24 09:00:00', NULL),
(3, 'ohhayeon@gmail.com',     'MEMBER', 'ACTIVE', '2025-11-26 13:30:00', NULL),
(3, 'kwonyujin@gmail.com',    'MEMBER', 'ACTIVE', '2025-11-27 10:15:00', NULL),
(3, 'kimjiho@naver.com',      'MEMBER', 'ACTIVE', '2025-11-28 20:05:00', NULL),

-- 파티 4: 티빙 스탠다드 (PM_ID 13~16)
(4, 'choisubin@gmail.com',    'LEADER', 'ACTIVE', '2025-12-08 11:00:00', NULL),
(4, 'leejisoo@gmail.com',     'MEMBER', 'ACTIVE', '2025-12-10 15:20:00', NULL),
(4, 'parkseungwoo@kakao.com', 'MEMBER', 'ACTIVE', '2025-12-11 09:55:00', NULL),
(4, 'choihaneum@gmail.com',   'MEMBER', 'ACTIVE', '2025-12-12 18:30:00', NULL),

-- 파티 5: 웨이브 프리미엄 (PM_ID 17~20)
(5, 'junghwu@naver.com',      'LEADER', 'ACTIVE', '2025-12-25 13:00:00', NULL),
(5, 'junghyewon@naver.com',   'MEMBER', 'ACTIVE', '2025-12-27 11:40:00', NULL),
(5, 'kanghyeji@naver.com',    'MEMBER', 'ACTIVE', '2025-12-28 16:55:00', NULL),
(5, 'chodyoungwook@gmail.com','MEMBER', 'ACTIVE', '2025-12-29 10:20:00', NULL),

-- 파티 6: Netflix Premium (PM_ID 21~24)
(6, 'kangjieun@gmail.com',    'LEADER', 'ACTIVE', '2026-01-08 15:00:00', NULL),
(6, 'yoonchaewon@naver.com',  'MEMBER', 'ACTIVE', '2026-01-10 13:15:00', NULL),
(6, 'janghyunseok@gmail.com', 'MEMBER', 'ACTIVE', '2026-01-11 09:30:00', NULL),
(6, 'ohhayeon@gmail.com',     'MEMBER', 'ACTIVE', '2026-01-12 19:45:00', NULL),

-- 파티 7: 왓챠 베이직 (PM_ID 25~28)
(7, 'chominseo@naver.com',    'LEADER', 'ACTIVE', '2026-01-25 10:00:00', NULL),
(7, 'limjiyoung@kakao.com',   'MEMBER', 'ACTIVE', '2026-01-27 14:20:00', NULL),
(7, 'kwonyujin@gmail.com',    'MEMBER', 'ACTIVE', '2026-01-28 11:05:00', NULL),
(7, 'kimjiho@naver.com',      'MEMBER', 'ACTIVE', '2026-01-29 17:35:00', NULL),

-- 파티 8: Disney+ Premium (PM_ID 29~32)
(8, 'yoonjunhyuk@kakao.com',  'LEADER', 'ACTIVE', '2026-02-08 09:00:00', NULL),
(8, 'leejisoo@gmail.com',     'MEMBER', 'ACTIVE', '2026-02-10 12:10:00', NULL),
(8, 'parkseungwoo@kakao.com', 'MEMBER', 'ACTIVE', '2026-02-11 15:45:00', NULL),
(8, 'choihaneum@gmail.com',   'MEMBER', 'ACTIVE', '2026-02-12 10:30:00', NULL),


-- ═══════════════════════════════════════════
-- CLOSED 파티 멤버 (25명: 파티 9~14)
-- ═══════════════════════════════════════════

-- 파티 9: Netflix Standard 종료 (PM_ID 33~36)
(9, 'jangnayeon@gmail.com',   'LEADER', 'COMPLETED', '2025-09-25 14:00:00', NULL),
(9, 'hansungmin@naver.com',   'MEMBER', 'COMPLETED', '2025-09-27 16:20:00', NULL),
(9, 'junghyewon@naver.com',   'MEMBER', 'COMPLETED', '2025-09-28 10:45:00', NULL),
(9, 'kangdohyun@gmail.com',   'MEMBER', 'COMPLETED', '2025-09-29 19:30:00', NULL),

-- 파티 10: 유튜브 프리미엄 종료 (PM_ID 37~40)
(10, 'limtaeyang@naver.com',  'LEADER', 'COMPLETED', '2025-08-25 10:00:00', NULL),
(10, 'kanghyeji@naver.com',   'MEMBER', 'COMPLETED', '2025-08-27 14:10:00', NULL),
(10, 'chodyoungwook@gmail.com','MEMBER','COMPLETED', '2025-08-28 09:55:00', NULL),
(10, 'leejisoo@gmail.com',    'MEMBER', 'COMPLETED', '2025-08-29 17:40:00', NULL),

-- 파티 11: Disney+ Standard 종료 (PM_ID 41~44)
(11, 'hanhaeun@gmail.com',    'LEADER', 'COMPLETED', '2025-07-25 09:00:00', NULL),
(11, 'parkseungwoo@kakao.com','MEMBER', 'COMPLETED', '2025-07-27 13:25:00', NULL),
(11, 'choihaneum@gmail.com',  'MEMBER', 'COMPLETED', '2025-07-28 11:00:00', NULL),
(11, 'junghyewon@naver.com',  'MEMBER', 'COMPLETED', '2025-07-29 16:15:00', NULL),

-- 파티 12: 티빙 스탠다드 종료 (PM_ID 45~48)
(12, 'ohjungwoo@kakao.com',   'LEADER', 'COMPLETED', '2025-09-25 11:00:00', NULL),
(12, 'kangdohyun@gmail.com',  'MEMBER', 'COMPLETED', '2025-09-27 15:30:00', NULL),
(12, 'kwonyujin@gmail.com',   'MEMBER', 'COMPLETED', '2025-09-28 09:20:00', NULL),
(12, 'kimjiho@naver.com',     'MEMBER', 'COMPLETED', '2025-09-29 18:45:00', NULL),

-- 파티 13: 웨이브 프리미엄 (중도 탈퇴 발생) (PM_ID 49~52)
(13, 'shinyerin@gmail.com',   'LEADER',  'COMPLETED', '2025-09-08 13:00:00', NULL),
(13, 'ohhayeon@gmail.com',    'MEMBER',  'COMPLETED', '2025-09-10 11:20:00', NULL),
(13, 'limjiyoung@kakao.com',  'MEMBER',  'COMPLETED', '2025-09-11 14:35:00', NULL),
-- 신태훈: 파티 시작 후 중도 탈퇴 → 보증금 몰수
(13, 'shintaehoon@naver.com', 'MEMBER',  'WITHDRAWN', '2025-09-12 09:45:00', '2025-11-15 14:00:00'),

-- 파티 14: 왓챠 베이직 종료 (PM_ID 53~56)
(14, 'kwondohyun@naver.com',  'LEADER', 'COMPLETED', '2025-10-25 15:00:00', NULL),
(14, 'janghyunseok@gmail.com','MEMBER', 'COMPLETED', '2025-10-27 13:10:00', NULL),
(14, 'limjiyoung@kakao.com',  'MEMBER', 'COMPLETED', '2025-10-28 10:25:00', NULL),
(14, 'hansungmin@naver.com',  'MEMBER', 'COMPLETED', '2025-10-29 16:50:00', NULL),


-- ═══════════════════════════════════════════
-- RECRUITING 파티 멤버 (7명: 파티 15~18)
-- ═══════════════════════════════════════════

-- 파티 15: Netflix Standard 모집 중 2/4인 (PM_ID 57~58)
(15, 'hwangsua@gmail.com',    'LEADER', 'ACTIVE', '2026-03-10 10:00:00', NULL),
(15, 'kangdohyun@gmail.com',  'MEMBER', 'ACTIVE', '2026-03-12 18:20:00', NULL),

-- 파티 16: Disney+ Premium 모집 중 1/4인 (PM_ID 59)
(16, 'kimgunwoo@naver.com',   'LEADER', 'ACTIVE', '2026-03-15 14:00:00', NULL),

-- 파티 17: 티빙 스탠다드 모집 중 3/4인 (PM_ID 60~62)
(17, 'leeareum@kakao.com',    'LEADER', 'ACTIVE', '2026-03-18 11:00:00', NULL),
(17, 'junghyewon@naver.com',  'MEMBER', 'ACTIVE', '2026-03-20 15:30:00', NULL),
(17, 'ohhayeon@gmail.com',    'MEMBER', 'ACTIVE', '2026-03-21 10:45:00', NULL),

-- 파티 18: 유튜브 프리미엄 모집 중 2/4인 (PM_ID 63~64)
(18, 'parkminkyu@gmail.com',  'LEADER', 'ACTIVE', '2026-03-20 09:00:00', NULL),
(18, 'kwonyujin@gmail.com',   'MEMBER', 'ACTIVE', '2026-03-22 11:15:00', NULL),


-- ═══════════════════════════════════════════
-- CANCELLED 파티 멤버 (2명: 파티 19~20)
-- ═══════════════════════════════════════════

-- 파티 19: 웨이브 취소 — 리더만 등록된 채로 모집 기간 초과 (PM_ID 65)
(19, 'choijisoo@naver.com',   'LEADER', 'CANCELLED', '2025-11-05 14:00:00', NULL),

-- 파티 20: Netflix 취소 — 리더가 직접 취소 (PM_ID 66)
(20, 'jungsunghyun@gmail.com','LEADER', 'CANCELLED', '2025-11-10 10:00:00', NULL);


-- ============================================
-- Phase 2 완료
-- 다음: moa_data_03_deposits.sql 실행
--
-- 실행 후 확인:
--   SELECT COUNT(*) FROM PARTY;        -- 20
--   SELECT COUNT(*) FROM PARTY_MEMBER; -- 66
--   SELECT PARTY_STATUS, COUNT(*) FROM PARTY GROUP BY PARTY_STATUS;
-- ============================================
