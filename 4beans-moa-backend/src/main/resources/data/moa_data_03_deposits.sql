-- ============================================
-- MOA 샘플 데이터 Phase 3: 보증금 (DEPOSIT)
-- 작성일: 2026-03-25
-- 대상: DEPOSIT (65건)
--
-- 보증금 규칙:
--   DEPOSIT_TYPE:
--     LEADER   - 파티장 예치금 (20,000원)
--     SECURITY - 멤버 보증금   ( 5,000원)
--
--   DEPOSIT_STATUS:
--     PAID            - 결제완료 (ACTIVE·RECRUITING 파티)
--     REFUNDED        - 환불완료 (CLOSED·CANCELLED 정상 종료)
--     FORFEITED       - 몰수     (중도 탈퇴: 신태훈 파티13)
--
-- PARTY_MEMBER_ID 매핑 (Phase 2 삽입 순서 기준):
--   파티  1 (Netflix Std  / ACTIVE   ): PM  1~ 4
--   파티  2 (YouTube      / ACTIVE   ): PM  5~ 8
--   파티  3 (Disney+ Std  / ACTIVE   ): PM  9~12
--   파티  4 (Tving Std    / ACTIVE   ): PM 13~16
--   파티  5 (Wavve Prem   / ACTIVE   ): PM 17~20
--   파티  6 (Netflix Prem / ACTIVE   ): PM 21~24
--   파티  7 (Watcha Basic / ACTIVE   ): PM 25~28
--   파티  8 (Disney+ Prem / ACTIVE   ): PM 29~32
--   파티  9 (Netflix Std  / CLOSED   ): PM 33~36
--   파티 10 (YouTube      / CLOSED   ): PM 37~40
--   파티 11 (Disney+ Std  / CLOSED   ): PM 41~44
--   파티 12 (Tving Std    / CLOSED   ): PM 45~48
--   파티 13 (Wavve Prem   / CLOSED   ): PM 49~52  ← PM 52 = 신태훈 FORFEITED
--   파티 14 (Watcha Basic / CLOSED   ): PM 53~56
--   파티 15 (Netflix Std  / RECRUITING): PM 57~58
--   파티 16 (Disney+ Prem / RECRUITING): PM 59
--   파티 17 (Tving Std    / RECRUITING): PM 60~62
--   파티 18 (YouTube      / RECRUITING): PM 63~64
--   파티 19 (Wavve Prem   / CANCELLED): PM 65
--   파티 20 (Netflix Std  / CANCELLED): PM 66
-- ============================================

USE moa;

-- ============================================
-- DEPOSIT 삽입 (65건)
-- ============================================
INSERT INTO DEPOSIT (
    PARTY_ID,
    PARTY_MEMBER_ID,
    USER_ID,
    DEPOSIT_TYPE,
    DEPOSIT_AMOUNT,
    DEPOSIT_STATUS,
    PAYMENT_DATE,
    REFUND_DATE,
    REFUND_AMOUNT,
    TRANSACTION_DATE,
    TOSS_PAYMENT_KEY,
    ORDER_ID
) VALUES

-- ═══════════════════════════════════════════
-- ACTIVE 파티 보증금 (파티 1~8, 32건)
-- 상태: PAID / REFUND 없음
-- ═══════════════════════════════════════════

-- 파티 1: Netflix Standard | 시작 2025-11-01
--   PM 1  리더 김민준
(1,  1, 'kimminj95@gmail.com',    'LEADER',   20000, 'PAID', '2025-10-25 14:35:00', NULL, NULL, '2025-10-25 14:35:12', 'tgen_20251025BkqR7zXmN2pLwA', 'DEP-20251025-143500-P01-LEADER'),
--   PM 2  멤버 강혜지
(1,  2, 'kanghyeji@naver.com',    'SECURITY',  5000, 'PAID', '2025-10-27 19:42:00', NULL, NULL, '2025-10-27 19:42:08', 'tgen_20251027Mv3nTsQpYhJ6Wd', 'DEP-20251027-194200-P01-M001'),
--   PM 3  멤버 조동욱
(1,  3, 'chodyoungwook@gmail.com','SECURITY',  5000, 'PAID', '2025-10-28 11:28:00', NULL, NULL, '2025-10-28 11:28:21', 'tgen_20251028RxKcLzFqH9mVbS', 'DEP-20251028-112800-P01-M002'),
--   PM 4  멤버 윤채원
(1,  4, 'yoonchaewon@naver.com',  'SECURITY',  5000, 'PAID', '2025-10-29 16:52:00', NULL, NULL, '2025-10-29 16:52:44', 'tgen_20251029GtPjD8nWrEu2Qy', 'DEP-20251029-165200-P01-M003'),

-- 파티 2: 유튜브 프리미엄 | 시작 2025-11-15
--   PM 5  리더 이서연
(2,  5, 'leeseyeon@naver.com',    'LEADER',   20000, 'PAID', '2025-11-08 10:18:00', NULL, NULL, '2025-11-08 10:18:33', 'tgen_20251108ZwCmXvAqT7nkBf', 'DEP-20251108-101800-P02-LEADER'),
--   PM 6  멤버 장현석
(2,  6, 'janghyunseok@gmail.com', 'SECURITY',  5000, 'PAID', '2025-11-10 14:35:00', NULL, NULL, '2025-11-10 14:35:17', 'tgen_20251110UdSeLpJhF4rYgN', 'DEP-20251110-143500-P02-M001'),
--   PM 7  멤버 임지영
(2,  7, 'limjiyoung@kakao.com',   'SECURITY',  5000, 'PAID', '2025-11-11 10:02:00', NULL, NULL, '2025-11-11 10:02:56', 'tgen_20251111KbQzMwVxT6sHcR', 'DEP-20251111-100200-P02-M002'),
--   PM 8  멤버 한성민
(2,  8, 'hansungmin@naver.com',   'SECURITY',  5000, 'PAID', '2025-11-12 17:25:00', NULL, NULL, '2025-11-12 17:25:09', 'tgen_20251112NpAeWqDmG8fLbT', 'DEP-20251112-172500-P02-M003'),

-- 파티 3: Disney+ Standard | 시작 2025-12-01
--   PM 9  리더 박지훈
(3,  9, 'parkjihun@kakao.com',    'LEADER',   20000, 'PAID', '2025-11-24 09:22:00', NULL, NULL, '2025-11-24 09:22:41', 'tgen_20251124FsRjYwBkP3nCxH', 'DEP-20251124-092200-P03-LEADER'),
--   PM 10 멤버 오하연
(3, 10, 'ohhayeon@gmail.com',     'SECURITY',  5000, 'PAID', '2025-11-26 13:48:00', NULL, NULL, '2025-11-26 13:48:22', 'tgen_20251126VmTqZsLdE9wKgJ', 'DEP-20251126-134800-P03-M001'),
--   PM 11 멤버 권유진
(3, 11, 'kwonyujin@gmail.com',    'SECURITY',  5000, 'PAID', '2025-11-27 10:30:00', NULL, NULL, '2025-11-27 10:30:05', 'tgen_20251127HnBcXpAuQ7eMfY', 'DEP-20251127-103000-P03-M002'),
--   PM 12 멤버 김지호
(3, 12, 'kimjiho@naver.com',      'SECURITY',  5000, 'PAID', '2025-11-28 20:18:00', NULL, NULL, '2025-11-28 20:18:37', 'tgen_20251128DwRkFjNvS4tLpC', 'DEP-20251128-201800-P03-M003'),

-- 파티 4: 티빙 스탠다드 | 시작 2025-12-15
--   PM 13 리더 최수빈
(4, 13, 'choisubin@gmail.com',    'LEADER',   20000, 'PAID', '2025-12-08 11:14:00', NULL, NULL, '2025-12-08 11:14:28', 'tgen_20251208QzGwLbMeH6vRxP', 'DEP-20251208-111400-P04-LEADER'),
--   PM 14 멤버 이지수
(4, 14, 'leejisoo@gmail.com',     'SECURITY',  5000, 'PAID', '2025-12-10 15:33:00', NULL, NULL, '2025-12-10 15:33:51', 'tgen_20251210AxKmTuWrB9sNdF', 'DEP-20251210-153300-P04-M001'),
--   PM 15 멤버 박승우
(4, 15, 'parkseungwoo@kakao.com', 'SECURITY',  5000, 'PAID', '2025-12-11 10:07:00', NULL, NULL, '2025-12-11 10:07:14', 'tgen_20251211YhPzEcJqD5fVbG', 'DEP-20251211-100700-P04-M002'),
--   PM 16 멤버 최하늠
(4, 16, 'choihaneum@gmail.com',   'SECURITY',  5000, 'PAID', '2025-12-12 18:44:00', NULL, NULL, '2025-12-12 18:44:02', 'tgen_20251212LnSxCmFwU3kAeT', 'DEP-20251212-184400-P04-M003'),

-- 파티 5: 웨이브 프리미엄 | 시작 2026-01-01
--   PM 17 리더 정현우
(5, 17, 'junghwu@naver.com',      'LEADER',   20000, 'PAID', '2025-12-25 13:11:00', NULL, NULL, '2025-12-25 13:11:39', 'tgen_20251225WqBjRtHnK8pMzX', 'DEP-20251225-131100-P05-LEADER'),
--   PM 18 멤버 정혜원
(5, 18, 'junghyewon@naver.com',   'SECURITY',  5000, 'PAID', '2025-12-27 11:55:00', NULL, NULL, '2025-12-27 11:55:23', 'tgen_20251227EvCkLdQsY6nWgA', 'DEP-20251227-115500-P05-M001'),
--   PM 19 멤버 강혜지
(5, 19, 'kanghyeji@naver.com',    'SECURITY',  5000, 'PAID', '2025-12-28 17:08:00', NULL, NULL, '2025-12-28 17:08:46', 'tgen_20251228TpXrFmBuZ4hJcN', 'DEP-20251228-170800-P05-M002'),
--   PM 20 멤버 조동욱
(5, 20, 'chodyoungwook@gmail.com','SECURITY',  5000, 'PAID', '2025-12-29 10:35:00', NULL, NULL, '2025-12-29 10:35:12', 'tgen_20251229MsGwPeVkR7bDqH', 'DEP-20251229-103500-P05-M003'),

-- 파티 6: Netflix Premium | 시작 2026-01-15
--   PM 21 리더 강지은
(6, 21, 'kangjieun@gmail.com',    'LEADER',   20000, 'PAID', '2026-01-08 15:22:00', NULL, NULL, '2026-01-08 15:22:07', 'tgen_20260108BzNqKtHwL9mRxS', 'DEP-20260108-152200-P06-LEADER'),
--   PM 22 멤버 윤채원
(6, 22, 'yoonchaewon@naver.com',  'SECURITY',  5000, 'PAID', '2026-01-10 13:28:00', NULL, NULL, '2026-01-10 13:28:34', 'tgen_20260110CjAfPdYvE6sTbG', 'DEP-20260110-132800-P06-M001'),
--   PM 23 멤버 장현석
(6, 23, 'janghyunseok@gmail.com', 'SECURITY',  5000, 'PAID', '2026-01-11 09:45:00', NULL, NULL, '2026-01-11 09:45:19', 'tgen_20260111WnXmQsJuD4kFzP', 'DEP-20260111-094500-P06-M002'),
--   PM 24 멤버 오하연
(6, 24, 'ohhayeon@gmail.com',     'SECURITY',  5000, 'PAID', '2026-01-12 20:01:00', NULL, NULL, '2026-01-12 20:01:53', 'tgen_20260112RhTbLcVwM8nEgY', 'DEP-20260112-200100-P06-M003'),

-- 파티 7: 왓챠 베이직 | 시작 2026-02-01
--   PM 25 리더 조민서
(7, 25, 'chominseo@naver.com',    'LEADER',   20000, 'PAID', '2026-01-25 10:14:00', NULL, NULL, '2026-01-25 10:14:28', 'tgen_20260125ZkGpAeHrT3nBwF', 'DEP-20260125-101400-P07-LEADER'),
--   PM 26 멤버 임지영
(7, 26, 'limjiyoung@kakao.com',   'SECURITY',  5000, 'PAID', '2026-01-27 14:35:00', NULL, NULL, '2026-01-27 14:35:41', 'tgen_20260127SxMjDqKvN9fCbU', 'DEP-20260127-143500-P07-M001'),
--   PM 27 멤버 권유진
(7, 27, 'kwonyujin@gmail.com',    'SECURITY',  5000, 'PAID', '2026-01-28 11:18:00', NULL, NULL, '2026-01-28 11:18:06', 'tgen_20260128PwEzFnBsX6mJtQ', 'DEP-20260128-111800-P07-M002'),
--   PM 28 멤버 김지호
(7, 28, 'kimjiho@naver.com',      'SECURITY',  5000, 'PAID', '2026-01-29 17:48:00', NULL, NULL, '2026-01-29 17:48:33', 'tgen_20260129LcRuYhWqA4vGmK', 'DEP-20260129-174800-P07-M003'),

-- 파티 8: Disney+ Premium | 시작 2026-02-15
--   PM 29 리더 윤준혁
(8, 29, 'yoonjunhyuk@kakao.com',  'LEADER',   20000, 'PAID', '2026-02-08 09:17:00', NULL, NULL, '2026-02-08 09:17:22', 'tgen_20260208VdBnTpMwE7rHsX', 'DEP-20260208-091700-P08-LEADER'),
--   PM 30 멤버 이지수
(8, 30, 'leejisoo@gmail.com',     'SECURITY',  5000, 'PAID', '2026-02-10 12:22:00', NULL, NULL, '2026-02-10 12:22:48', 'tgen_20260210KqFjZsLbC9nAwT', 'DEP-20260210-122200-P08-M001'),
--   PM 31 멤버 박승우
(8, 31, 'parkseungwoo@kakao.com', 'SECURITY',  5000, 'PAID', '2026-02-11 15:58:00', NULL, NULL, '2026-02-11 15:58:14', 'tgen_20260211GxNmRvPdH4kYeB', 'DEP-20260211-155800-P08-M002'),
--   PM 32 멤버 최하늠
(8, 32, 'choihaneum@gmail.com',   'SECURITY',  5000, 'PAID', '2026-02-12 10:43:00', NULL, NULL, '2026-02-12 10:43:37', 'tgen_20260212ZwSqUcJfM6pDnL', 'DEP-20260212-104300-P08-M003'),


-- ═══════════════════════════════════════════
-- CLOSED 파티 보증금 (파티 9~14, 23건)
-- 파티 9~12, 14: REFUNDED
-- 파티 13: COMPLETED 3명 REFUNDED + 신태훈 FORFEITED
-- 환불일: 파티 END_DATE 기준 3영업일 내
-- ═══════════════════════════════════════════

-- 파티 9: Netflix Standard | 종료 2026-02-28 → 환불 2026-03-03
--   PM 33 리더 장나연
(9, 33, 'jangnayeon@gmail.com',   'LEADER',   20000, 'REFUNDED', '2025-09-25 14:20:00', '2026-03-03 11:00:00', 20000, '2025-09-25 14:20:18', 'tgen_20250925HkPzTwVmQ8nRbA', 'DEP-20250925-142000-P09-LEADER'),
--   PM 34 멤버 한성민
(9, 34, 'hansungmin@naver.com',   'SECURITY',  5000, 'REFUNDED', '2025-09-27 16:35:00', '2026-03-03 11:15:00',  5000, '2025-09-27 16:35:09', 'tgen_20250927BsEjLdXfN4cWgY', 'DEP-20250927-163500-P09-M001'),
--   PM 35 멤버 정혜원
(9, 35, 'junghyewon@naver.com',   'SECURITY',  5000, 'REFUNDED', '2025-09-28 10:58:00', '2026-03-03 11:30:00',  5000, '2025-09-28 10:58:31', 'tgen_20250928MqCvAuRpD7tKzS', 'DEP-20250928-105800-P09-M002'),
--   PM 36 멤버 강도현
(9, 36, 'kangdohyun@gmail.com',   'SECURITY',  5000, 'REFUNDED', '2025-09-29 19:42:00', '2026-03-03 11:45:00',  5000, '2025-09-29 19:42:07', 'tgen_20250929FnWxJbGeT5mPvH', 'DEP-20250929-194200-P09-M003'),

-- 파티 10: 유튜브 프리미엄 | 종료 2026-01-31 → 환불 2026-02-03
--   PM 37 리더 임태양
(10, 37, 'limtaeyang@naver.com',  'LEADER',   20000, 'REFUNDED', '2025-08-25 10:22:00', '2026-02-03 14:00:00', 20000, '2025-08-25 10:22:45', 'tgen_20250825QzYkSdHwP3nAxM', 'DEP-20250825-102200-P10-LEADER'),
--   PM 38 멤버 강혜지
(10, 38, 'kanghyeji@naver.com',   'SECURITY',  5000, 'REFUNDED', '2025-08-27 14:23:00', '2026-02-03 14:15:00',  5000, '2025-08-27 14:23:13', 'tgen_20250827VcRmNzBsL6fEjT', 'DEP-20250827-142300-P10-M001'),
--   PM 39 멤버 조동욱
(10, 39, 'chodyoungwook@gmail.com','SECURITY', 5000, 'REFUNDED', '2025-08-28 10:08:00', '2026-02-03 14:30:00',  5000, '2025-08-28 10:08:52', 'tgen_20250828GwKpDxUqF9bCnR', 'DEP-20250828-100800-P10-M002'),
--   PM 40 멤버 이지수
(10, 40, 'leejisoo@gmail.com',    'SECURITY',  5000, 'REFUNDED', '2025-08-29 17:55:00', '2026-02-03 14:45:00',  5000, '2025-08-29 17:55:24', 'tgen_20250829XhTnJvAeM4kQwB', 'DEP-20250829-175500-P10-M003'),

-- 파티 11: Disney+ Standard | 종료 2025-12-31 → 환불 2026-01-03
--   PM 41 리더 한하은
(11, 41, 'hanhaeun@gmail.com',    'LEADER',   20000, 'REFUNDED', '2025-07-25 09:15:00', '2026-01-03 10:00:00', 20000, '2025-07-25 09:15:38', 'tgen_20250725LsZrWbFkH8mPdN', 'DEP-20250725-091500-P11-LEADER'),
--   PM 42 멤버 박승우
(11, 42, 'parkseungwoo@kakao.com','SECURITY',  5000, 'REFUNDED', '2025-07-27 13:40:00', '2026-01-03 10:15:00',  5000, '2025-07-27 13:40:19', 'tgen_20250727EqMjBvSxC5nRtK', 'DEP-20250727-134000-P11-M001'),
--   PM 43 멤버 최하늠
(11, 43, 'choihaneum@gmail.com',  'SECURITY',  5000, 'REFUNDED', '2025-07-28 11:15:00', '2026-01-03 10:30:00',  5000, '2025-07-28 11:15:07', 'tgen_20250728AzGwDqPuN7fLhX', 'DEP-20250728-111500-P11-M002'),
--   PM 44 멤버 정혜원
(11, 44, 'junghyewon@naver.com',  'SECURITY',  5000, 'REFUNDED', '2025-07-29 16:28:00', '2026-01-03 10:45:00',  5000, '2025-07-29 16:28:41', 'tgen_20250729TpKcYnVsB4mWzQ', 'DEP-20250729-162800-P11-M003'),

-- 파티 12: 티빙 스탠다드 | 종료 2026-02-28 → 환불 2026-03-04
--   PM 45 리더 오정우
(12, 45, 'ohjungwoo@kakao.com',   'LEADER',   20000, 'REFUNDED', '2025-09-25 11:18:00', '2026-03-04 09:00:00', 20000, '2025-09-25 11:18:55', 'tgen_20250925RdFnTwLeM6sAkJ', 'DEP-20250925-111800-P12-LEADER'),
--   PM 46 멤버 강도현
(12, 46, 'kangdohyun@gmail.com',  'SECURITY',  5000, 'REFUNDED', '2025-09-27 15:47:00', '2026-03-04 09:15:00',  5000, '2025-09-27 15:47:33', 'tgen_20250927WxBmQsZvP9hNgC', 'DEP-20250927-154700-P12-M001'),
--   PM 47 멤버 권유진
(12, 47, 'kwonyujin@gmail.com',   'SECURITY',  5000, 'REFUNDED', '2025-09-28 09:34:00', '2026-03-04 09:30:00',  5000, '2025-09-28 09:34:11', 'tgen_20250928YhUeJkDrF3bSxV', 'DEP-20250928-093400-P12-M002'),
--   PM 48 멤버 김지호
(12, 48, 'kimjiho@naver.com',     'SECURITY',  5000, 'REFUNDED', '2025-09-29 19:01:00', '2026-03-04 09:45:00',  5000, '2025-09-29 19:01:28', 'tgen_20250929NqCvXwBaK8pRmT', 'DEP-20250929-190100-P12-M003'),

-- 파티 13: 웨이브 프리미엄 | 종료 2026-01-31
--   → COMPLETED 3명 환불 2026-02-04, 신태훈 FORFEITED (보증금 몰수)
--   PM 49 리더 신예린 → REFUNDED
(13, 49, 'shinyerin@gmail.com',   'LEADER',   20000, 'REFUNDED', '2025-09-08 13:25:00', '2026-02-04 10:00:00', 20000, '2025-09-08 13:25:17', 'tgen_20250908KbLzQwMdH7vAnP', 'DEP-20250908-132500-P13-LEADER'),
--   PM 50 멤버 오하연 → REFUNDED
(13, 50, 'ohhayeon@gmail.com',    'SECURITY',  5000, 'REFUNDED', '2025-09-10 11:38:00', '2026-02-04 10:15:00',  5000, '2025-09-10 11:38:42', 'tgen_20250910FsRjTxVbE4mNwC', 'DEP-20250910-113800-P13-M001'),
--   PM 51 멤버 임지영 → REFUNDED
(13, 51, 'limjiyoung@kakao.com',  'SECURITY',  5000, 'REFUNDED', '2025-09-11 14:48:00', '2026-02-04 10:30:00',  5000, '2025-09-11 14:48:09', 'tgen_20250911ZwGnYuSkQ9cDhR', 'DEP-20250911-144800-P13-M002'),
--   PM 52 멤버 신태훈 → FORFEITED (중도 탈퇴 2025-11-15, 보증금 5,000원 몰수)
(13, 52, 'shintaehoon@naver.com', 'SECURITY',  5000, 'FORFEITED', '2025-09-12 09:58:00', NULL, NULL, '2025-09-12 09:58:31', 'tgen_20250912PxCmBsJfN6tWeA', 'DEP-20250912-095800-P13-M003'),

-- 파티 14: 왓챠 베이직 | 종료 2026-02-28 → 환불 2026-03-03
--   PM 53 리더 권도현
(14, 53, 'kwondohyun@naver.com',  'LEADER',   20000, 'REFUNDED', '2025-10-25 15:18:00', '2026-03-03 15:00:00', 20000, '2025-10-25 15:18:44', 'tgen_20251025MdVkRnXqT8pBzL', 'DEP-20251025-151800-P14-LEADER'),
--   PM 54 멤버 장현석
(14, 54, 'janghyunseok@gmail.com','SECURITY',  5000, 'REFUNDED', '2025-10-27 13:25:00', '2026-03-03 15:15:00',  5000, '2025-10-27 13:25:06', 'tgen_20251027SjEqFwHuC5nAkP', 'DEP-20251027-132500-P14-M001'),
--   PM 55 멤버 임지영
(14, 55, 'limjiyoung@kakao.com',  'SECURITY',  5000, 'REFUNDED', '2025-10-28 10:38:00', '2026-03-03 15:30:00',  5000, '2025-10-28 10:38:22', 'tgen_20251028QzNmYtDvG7rBxW', 'DEP-20251028-103800-P14-M002'),
--   PM 56 멤버 한성민
(14, 56, 'hansungmin@naver.com',  'SECURITY',  5000, 'REFUNDED', '2025-10-29 17:05:00', '2026-03-03 15:45:00',  5000, '2025-10-29 17:05:39', 'tgen_20251029HwAeZbLcK4sJnT', 'DEP-20251029-170500-P14-M003'),


-- ═══════════════════════════════════════════
-- RECRUITING 파티 보증금 (파티 15~18, 8건)
-- 상태: PAID / REFUND 없음 (아직 진행 중)
-- ═══════════════════════════════════════════

-- 파티 15: Netflix Standard 모집 중 2/4인
--   PM 57 리더 황수아
(15, 57, 'hwangsua@gmail.com',    'LEADER',   20000, 'PAID', '2026-03-10 10:28:00', NULL, NULL, '2026-03-10 10:28:16', 'tgen_20260310DnFkYrVwP9mGsB', 'DEP-20260310-102800-P15-LEADER'),
--   PM 58 멤버 강도현
(15, 58, 'kangdohyun@gmail.com',  'SECURITY',  5000, 'PAID', '2026-03-12 18:35:00', NULL, NULL, '2026-03-12 18:35:04', 'tgen_20260312XqBhTcMnL6eJwZ', 'DEP-20260312-183500-P15-M001'),

-- 파티 16: Disney+ Premium 모집 중 1/4인
--   PM 59 리더 김건우
(16, 59, 'kimgunwoo@naver.com',   'LEADER',   20000, 'PAID', '2026-03-15 14:18:00', NULL, NULL, '2026-03-15 14:18:47', 'tgen_20260315KsWmQzRpA7vCxH', 'DEP-20260315-141800-P16-LEADER'),

-- 파티 17: 티빙 스탠다드 모집 중 3/4인
--   PM 60 리더 이아름
(17, 60, 'leeareum@kakao.com',    'LEADER',   20000, 'PAID', '2026-03-18 11:14:00', NULL, NULL, '2026-03-18 11:14:33', 'tgen_20260318UeGjBvFdS4nTpY', 'DEP-20260318-111400-P17-LEADER'),
--   PM 61 멤버 정혜원
(17, 61, 'junghyewon@naver.com',  'SECURITY',  5000, 'PAID', '2026-03-20 15:42:00', NULL, NULL, '2026-03-20 15:42:08', 'tgen_20260320NxLqCtZwH8kMbR', 'DEP-20260320-154200-P17-M001'),
--   PM 62 멤버 오하연
(17, 62, 'ohhayeon@gmail.com',    'SECURITY',  5000, 'PAID', '2026-03-21 10:58:00', NULL, NULL, '2026-03-21 10:58:27', 'tgen_20260321JwSdPmEzV3fBnK', 'DEP-20260321-105800-P17-M002'),

-- 파티 18: 유튜브 프리미엄 모집 중 2/4인
--   PM 63 리더 박민규
(18, 63, 'parkminkyu@gmail.com',  'LEADER',   20000, 'PAID', '2026-03-20 09:14:00', NULL, NULL, '2026-03-20 09:14:52', 'tgen_20260320RcYnHbFsM6qWxP', 'DEP-20260320-091400-P18-LEADER'),
--   PM 64 멤버 권유진
(18, 64, 'kwonyujin@gmail.com',   'SECURITY',  5000, 'PAID', '2026-03-22 11:28:00', NULL, NULL, '2026-03-22 11:28:39', 'tgen_20260322AvTkDjNwG9eCzL', 'DEP-20260322-112800-P18-M001'),


-- ═══════════════════════════════════════════
-- CANCELLED 파티 보증금 (파티 19~20, 2건)
-- 리더만 등록 → REFUNDED (모집 취소 환불)
-- ═══════════════════════════════════════════

-- 파티 19: 웨이브 프리미엄 취소 | 취소일 2025-12-05 → 환불 2025-12-08
--   PM 65 리더 최지수
(19, 65, 'choijisoo@naver.com',   'LEADER',   20000, 'REFUNDED', '2025-11-05 14:28:00', '2025-12-08 11:00:00', 20000, '2025-11-05 14:28:19', 'tgen_20251105BpZwKrSuN5mGhC', 'DEP-20251105-142800-P19-LEADER'),

-- 파티 20: Netflix Standard 취소 | 취소일 2025-11-25 → 환불 2025-11-27
--   PM 66 리더 정승현
(20, 66, 'jungsunghyun@gmail.com','LEADER',   20000, 'REFUNDED', '2025-11-10 10:22:00', '2025-11-27 14:00:00', 20000, '2025-11-10 10:22:35', 'tgen_20251110WmDqFjBxE8vRnH', 'DEP-20251110-102200-P20-LEADER');


-- ============================================
-- Phase 3 완료
-- 다음: moa_data_04_payments.sql 실행
--
-- 실행 후 확인:
--   SELECT COUNT(*) FROM DEPOSIT;                                      -- 65
--   SELECT DEPOSIT_STATUS, COUNT(*) FROM DEPOSIT GROUP BY DEPOSIT_STATUS;
--     PAID       : 40 (ACTIVE 32 + RECRUITING 8)
--     REFUNDED   : 24 (CLOSED 22 + CANCELLED 2)
--     FORFEITED  :  1 (신태훈 - 파티 13 중도 탈퇴)
--
--   SELECT DEPOSIT_TYPE, SUM(DEPOSIT_AMOUNT) FROM DEPOSIT GROUP BY DEPOSIT_TYPE;
--     LEADER   : 20 * 20,000 = 400,000원  (파티 20개 × 리더 각 1명)
--     SECURITY : 45 *  5,000 = 225,000원  (멤버 45명)
-- ============================================
