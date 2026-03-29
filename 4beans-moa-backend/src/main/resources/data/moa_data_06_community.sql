-- ============================================
-- MOA 샘플 데이터 Phase 6: 커뮤니티 / 알림 / 로그인 이력
-- 작성일: 2026-03-25
-- 대상:
--   COMMUNITY     35건 (POST 공지 12 + INQUIRY 문의 23)
--   PUSH          48건 (파티가입/결제/정산/보증금/문의 이벤트)
--   LOGIN_HISTORY 30건 (성공 26 + 실패 4)
--
-- COMMUNITY_CODE_ID:
--   INQUIRY: 1=회원, 2=결제, 3=기타
--   POST   : 4=FAQ, 5=회원, 6=결제, 7=구독, 8=파티, 9=정산, 10=시스템
-- ============================================

USE moa;

-- ============================================
-- 1. COMMUNITY 삽입 (35건)
-- ============================================
INSERT INTO COMMUNITY (
    USER_ID, COMMUNITY_CODE_ID, TITLE, CONTENT,
    CREATED_AT, VIEW_COUNT,
    FILE_ORIGINAL, FILE_UUID,
    ANSWER_CONTENT, ANSWERED_AT, ANSWER_STATUS
) VALUES

-- ─────────────────────────────────────────────
-- [공지/FAQ] POST — admin@moa.com 작성 (12건)
-- ─────────────────────────────────────────────

-- FAQ (CODE_ID 4)
('admin@moa.com', 4,
 'MOA 서비스 이용 가이드',
 'MOA는 OTT 구독을 최대 4인이 공유하는 파티 구독 플랫폼입니다. 파티장이 파티를 생성하면 멤버가 참여하여 저렴하게 구독을 이용할 수 있습니다. 결제는 매월 5일 자동으로 이루어지며, 보증금은 파티 종료 시 환불됩니다.',
 '2025-09-01 10:00:00', 412, NULL, NULL, NULL, NULL, NULL),

('admin@moa.com', 4,
 '파티 생성 및 참여 방법 안내',
 '파티 생성: 상품 선택 → 파티 설정 → 보증금 납부 → OTT 계정 입력 순으로 진행됩니다. 파티 참여: 모집 중인 파티 목록에서 원하는 파티를 선택하고 보증금을 납부하면 즉시 OTT 계정 정보가 공개됩니다. 모집 인원이 충족되면 파티가 자동으로 시작됩니다.',
 '2025-09-10 14:00:00', 388, NULL, NULL, NULL, NULL, NULL),

('admin@moa.com', 4,
 '결제, 보증금, 환불 정책 안내',
 '월회비는 매월 5일 자동 결제됩니다. 보증금은 파티 종료 시 전액 환불되나, 중도 탈퇴 시에는 환불되지 않습니다(몰수). 결제 실패 시 최대 3회 재시도하며, 최종 실패 시 파티에서 자동 해제됩니다. 환불은 영업일 기준 3일 이내 처리됩니다.',
 '2025-09-20 11:00:00', 521, NULL, NULL, NULL, NULL, NULL),

-- 회원 공지 (CODE_ID 5)
('admin@moa.com', 5,
 '[안내] 개인정보 처리방침 개정 안내 (2025.10.01)',
 '안녕하세요, MOA입니다. 2025년 10월 1일부로 개인정보 처리방침이 일부 개정됩니다. 주요 변경 사항: 결제 정보 보관 기간 조정(3년→5년), 오픈뱅킹 연동 관련 조항 추가. 자세한 내용은 서비스 내 개인정보 처리방침 페이지를 확인해 주세요.',
 '2025-09-25 09:00:00', 203, NULL, NULL, NULL, NULL, NULL),

('admin@moa.com', 5,
 '[필독] OTP 2단계 인증 도입 안내',
 '2025년 11월 1일부터 계정 보안 강화를 위해 Google OTP 2단계 인증을 지원합니다. 설정 > 보안 메뉴에서 OTP를 활성화하시면 로그인 시 추가 인증이 적용됩니다. 백업 코드를 반드시 안전한 곳에 보관하세요.',
 '2025-10-15 10:00:00', 317, NULL, NULL, NULL, NULL, NULL),

-- 결제 공지 (CODE_ID 6)
('admin@moa.com', 6,
 '[안내] 자동결제 일정 및 재시도 정책 안내',
 '월회비는 매월 5일 오전 9시에 자동 결제됩니다. 결제 실패 시 D+2일, D+5일에 자동 재시도합니다. 3회 모두 실패할 경우 해당 월 미납 처리되며 파티 이용이 제한될 수 있습니다. 결제 수단은 마이페이지 > 결제 관리에서 언제든 변경하실 수 있습니다.',
 '2025-10-01 09:00:00', 289, NULL, NULL, NULL, NULL, NULL),

('admin@moa.com', 6,
 '[공지] 결제 시스템 정기 점검 안내 (2025.12.28)',
 '2025년 12월 28일(일) 오전 2시~6시 결제 시스템 정기 점검이 진행됩니다. 점검 시간 중에는 결제 및 환불 서비스가 일시 중단됩니다. 해당 시간대에 예정된 자동결제는 점검 완료 후 순차적으로 처리됩니다.',
 '2025-12-22 10:00:00', 176, NULL, NULL, NULL, NULL, NULL),

-- 구독 공지 (CODE_ID 7)
('admin@moa.com', 7,
 '[안내] Netflix 요금제 변경 반영 안내 (2025.11)',
 '2025년 11월부터 Netflix Standard 요금이 월 13,500원에서 14,500원으로 조정되어 파티 월회비가 변경됩니다. 기존 파티는 다음 결제일부터 변경된 금액이 적용됩니다. 이에 따라 파티 멤버 모집 금액도 3,375원에서 3,625원으로 변경됩니다.',
 '2025-10-20 14:00:00', 445, NULL, NULL, NULL, NULL, NULL),

('admin@moa.com', 7,
 '[신규] 웨이브(Wavve) 프리미엄 구독 상품 추가',
 '웨이브 프리미엄 구독 상품이 MOA에 추가되었습니다. 월 13,900원을 최대 4명이 나눠 월 3,475원으로 이용 가능합니다. 4K UHD 화질과 동시 접속 4대를 지원하며, 국내 드라마와 영화 콘텐츠를 중심으로 다양한 콘텐츠를 제공합니다.',
 '2025-08-01 10:00:00', 512, NULL, NULL, NULL, NULL, NULL),

-- 파티 공지 (CODE_ID 8)
('admin@moa.com', 8,
 '[중요] 파티 이용 규정 강화 안내',
 'OTT 계정 공유 정책 변경에 따라 일부 서비스에서 계정 공유를 제한하고 있습니다. MOA는 해당 정책을 준수하며, 파티장은 정확한 계정 정보를 입력해야 합니다. 허위 정보 입력 또는 계정 오류 발생 시 해당 파티는 즉시 종료되며 보증금이 몰수될 수 있습니다.',
 '2025-11-01 09:00:00', 634, NULL, NULL, NULL, NULL, NULL),

('admin@moa.com', 8,
 '[정책] 중도 탈퇴 페널티 정책 강화 안내',
 '파티 시작 이후 중도 탈퇴 시 보증금(5,000원)은 환불되지 않습니다. 이는 파티장과 나머지 멤버들의 서비스 이용 안정성을 보장하기 위한 조치입니다. 불가피한 사정이 있는 경우 MOA 고객센터로 문의해 주세요.',
 '2025-10-05 11:00:00', 758, NULL, NULL, NULL, NULL, NULL),

-- 정산 공지 (CODE_ID 9)
('admin@moa.com', 9,
 '[안내] 정산 주기 및 수수료 정책 안내',
 '파티장 정산은 매월 10일에 진행됩니다. 정산 금액 = 멤버 수납금 합계 - 서비스 수수료(15%). 정산금은 등록된 계좌로 오픈뱅킹을 통해 자동 이체됩니다. 계좌 미등록 시 정산이 보류되므로, 반드시 마이페이지에서 계좌를 등록해 주세요.',
 '2025-09-15 14:00:00', 341, NULL, NULL, NULL, NULL, NULL),


-- ─────────────────────────────────────────────
-- [문의] INQUIRY — 실제 유저 작성 (23건)
-- ─────────────────────────────────────────────

-- == 회원 문의 (CODE_ID 1) ==

('kanghyeji@naver.com', 1,
 '비밀번호를 잊어버렸어요',
 '로그인하려는데 비밀번호가 기억나지 않습니다. 비밀번호 초기화는 어떻게 하나요?',
 '2025-11-03 14:22:00', 2, NULL, NULL,
 '안녕하세요, 강혜지님! 로그인 화면 하단의 "비밀번호 찾기"를 클릭하시면 가입 이메일로 재설정 링크가 발송됩니다. 이메일 수신 후 24시간 이내에 링크를 클릭하여 새 비밀번호를 설정해 주세요.',
 '2025-11-03 16:10:00', 'ANSWERED'),

('leejisoo@gmail.com', 1,
 'OTP 인증 앱을 새 폰으로 옮기고 싶어요',
 '핸드폰을 새로 구입했는데 Google OTP를 새 폰으로 옮기는 방법을 알고 싶습니다. 기존 폰은 아직 가지고 있습니다.',
 '2025-11-15 10:45:00', 3, NULL, NULL,
 '이지수님, 안녕하세요! 기존 폰의 Google Authenticator 앱에서 계정 내보내기 기능을 이용하시거나, MOA 설정 > 보안 > OTP 관리에서 재등록하실 수 있습니다. 재등록 시 백업 코드가 필요하오니 미리 준비해 주세요.',
 '2025-11-15 14:30:00', 'ANSWERED'),

('shintaehoon@naver.com', 1,
 '파티 탈퇴 후 계정 삭제하고 싶습니다',
 '현재 파티에서 탈퇴했는데 더 이상 MOA를 이용하지 않을 것 같아서 계정을 삭제하고 싶습니다. 어떻게 하면 되나요?',
 '2025-10-20 09:30:00', 1, NULL, NULL,
 '신태훈님, 안녕하세요. 회원 탈퇴는 마이페이지 > 계정 설정 > 회원 탈퇴에서 가능합니다. 단, 현재 진행 중인 파티가 없어야 탈퇴가 가능합니다. 탈퇴 후 개인정보는 법령에 따라 일정 기간 보관 후 파기됩니다.',
 '2025-10-20 11:00:00', 'ANSWERED'),

('ohhayeon@gmail.com', 1,
 '닉네임 변경이 안 됩니다',
 '마이페이지에서 닉네임을 바꾸려고 하는데 "이미 사용 중인 닉네임입니다"라고 나옵니다. 분명히 다른 닉네임인데 왜 그런 건가요?',
 '2025-12-05 16:11:00', 2, NULL, NULL,
 '안녕하세요, 오하연님! 닉네임은 영문/한글 2~10자, 특수문자 미포함 조건을 충족해야 합니다. 공백이나 특수문자가 포함되어 있는지 확인해 보시고, 문제 지속 시 다시 문의 주세요.',
 '2025-12-05 17:45:00', 'ANSWERED'),

('chodyoungwook@gmail.com', 1,
 '프로필 사진 업로드가 계속 실패합니다',
 'JPG 파일로 프로필 사진을 올리려고 하는데 "업로드 실패" 오류가 납니다. 파일 크기는 1MB 이하입니다.',
 '2026-01-08 13:25:00', 1, NULL, NULL,
 NULL, NULL, 'PENDING'),

('kimjiho@naver.com', 1,
 '회원 탈퇴 후 재가입이 가능한가요?',
 '사정이 생겨 탈퇴했다가 나중에 다시 가입하고 싶은데, 동일한 이메일로 재가입이 가능한지 궁금합니다.',
 '2025-12-18 11:40:00', 2, NULL, NULL,
 '안녕하세요, 김지호님! 탈퇴 후 30일 이후에 동일 이메일로 재가입이 가능합니다. 단, 기존 파티 이력 및 포인트는 복구되지 않습니다.',
 '2025-12-18 15:20:00', 'ANSWERED'),

('hansungmin@naver.com', 1,
 '가입 인증 이메일이 오지 않습니다',
 '회원가입을 했는데 이메일 인증 메일이 10분이 지나도 오지 않습니다. 스팸함도 확인했는데 없습니다.',
 '2026-02-14 10:15:00', 1, NULL, NULL,
 NULL, NULL, 'PENDING'),

-- == 결제 문의 (CODE_ID 2) ==

('janghyunseok@gmail.com', 2,
 '결제가 실패했는데 카드에서 돈이 빠져나갔어요',
 '12월 결제 실패 알림을 받았는데 카드 내역에는 3,475원이 결제되어 있습니다. 어떻게 된 건가요?',
 '2025-12-06 09:48:00', 4, NULL, NULL,
 '장현석님, 안녕하세요. 일시적인 카드사 응답 지연으로 잔액 부족 오류가 발생했으나 이후 재시도에서 정상 결제 처리되었습니다. 12월 7일 재시도 결제가 성공되었으므로 중복 결제는 아닙니다. 불편을 드려 죄송합니다.',
 '2025-12-06 14:30:00', 'ANSWERED'),

('kangdohyun@gmail.com', 2,
 '보증금 환불은 얼마나 걸리나요?',
 '파티가 종료되었다는 알림을 받았습니다. 보증금 5,000원은 언제 환불되나요?',
 '2026-03-04 11:20:00', 2, NULL, NULL,
 '안녕하세요, 강도현님! 파티 종료 후 영업일 기준 3일 이내에 환불됩니다. 환불은 결제 시 사용하신 카드로 처리되며, 카드사에 따라 청구 취소까지 1~5 영업일이 추가로 소요될 수 있습니다.',
 '2026-03-04 14:15:00', 'ANSWERED'),

('junghyewon@naver.com', 2,
 '이번 달 결제 금액이 지난달과 다릅니다',
 '웨이브 파티 12월 결제금액이 3,475원인데 11월에는 같은 금액이었습니다. 파티 인원이 줄었는데도 금액이 같네요?',
 '2025-12-06 17:03:00', 1, NULL, NULL,
 '정혜원님, 안녕하세요. MOA에서는 파티 가입 시 약정한 MONTHLY_FEE를 기준으로 청구되므로, 중도 탈퇴 멤버가 있어도 기존 멤버의 결제 금액은 변동되지 않습니다. 이 점 양해 부탁드립니다.',
 '2025-12-07 10:00:00', 'ANSWERED'),

('limjiyoung@kakao.com', 2,
 '결제 카드를 변경하고 싶습니다',
 '현재 등록된 카드가 만료될 예정입니다. 새 카드로 변경하는 방법을 알려주세요.',
 '2026-02-20 15:30:00', 1, NULL, NULL,
 NULL, NULL, 'PENDING'),

('hansungmin@naver.com', 2,
 '파티 중도 탈퇴 시 보증금은 돌려받을 수 없나요?',
 '급한 사정이 생겨서 파티를 중간에 탈퇴해야 할 것 같습니다. 이 경우 보증금 5,000원은 환불이 안 되나요?',
 '2025-10-28 14:10:00', 3, NULL, NULL,
 '한성민님, 안녕하세요. 파티 시작 이후 중도 탈퇴 시에는 파티 운영 안정성 보호를 위해 보증금이 환불되지 않습니다. 부득이한 사유가 있으실 경우 증빙자료와 함께 고객센터로 문의 주시면 검토해 드리겠습니다.',
 '2025-10-28 16:40:00', 'ANSWERED'),

('yoonchaewon@naver.com', 2,
 '파티 취소 시 환불 기간이 어떻게 되나요?',
 '모집 중이던 파티가 취소되었다는 알림을 받았습니다. 보증금은 언제 환불되나요?',
 '2025-12-06 10:05:00', 2, NULL, NULL,
 '윤채원님, 안녕하세요! 파티 취소 시 납부하신 보증금은 영업일 기준 3일 이내에 전액 환불됩니다. 이미 환불 처리가 시작되었으니 카드사 기준에 따라 며칠 내로 확인하실 수 있습니다.',
 '2025-12-06 13:50:00', 'ANSWERED'),

('jangnayeon@gmail.com', 2,
 '2월 정산 입금이 아직 안 되었습니다',
 '파티가 2월 28일 종료되었고 정산 예정이었는데 3월 15일 현재까지 계좌에 입금이 없습니다.',
 '2026-03-15 16:00:00', 1, NULL, NULL,
 '장나연님, 안녕하세요. 확인 결과 2월 정산(12,325원)은 2026년 3월 10일에 정상 처리되었습니다. KB국민은행 계좌로 입금되었으니 거래 내역을 다시 확인해 주세요. 입금자명은 "(주)포빈즈모아"입니다.',
 '2026-03-15 17:30:00', 'ANSWERED'),

('limtaeyang@naver.com', 2,
 '수수료가 15%인 이유가 궁금합니다',
 '매달 정산을 받는데 15% 수수료는 너무 높은 것 같습니다. 수수료 인하 계획이 있나요?',
 '2026-02-12 13:40:00', 2, NULL, NULL,
 NULL, NULL, 'PENDING'),

('parkjihun@kakao.com', 2,
 '파티 멤버 결제 실패 시 파티가 종료되나요?',
 '제가 운영하는 파티 멤버 중 한 명이 결제를 못 했다고 알림이 왔습니다. 어떻게 처리되나요?',
 '2025-12-07 09:55:00', 2, NULL, NULL,
 '박지훈님, 안녕하세요! 멤버 결제 실패 시 MOA에서 자동으로 2회 재시도합니다. 3회 모두 실패할 경우 해당 멤버는 파티에서 자동 해제되고 보증금이 몰수됩니다. 파티 자체는 나머지 멤버들과 계속 유지됩니다.',
 '2025-12-07 14:20:00', 'ANSWERED'),

('kwonyujin@gmail.com', 2,
 '결제 영수증 발급이 가능한가요?',
 '세금 처리를 위해 결제 영수증이 필요합니다. MOA에서 영수증 발급이 가능한지 궁금합니다.',
 '2026-01-20 11:25:00', 1, NULL, NULL,
 NULL, NULL, 'PENDING'),

('shintaehoon@naver.com', 2,
 '보증금이 몰수되었다는 알림이 왔습니다',
 '파티에서 나왔는데 보증금 환불이 아니라 몰수되었다는 알림이 왔습니다. 파티에 문제가 있어서 나온 건데 왜 몰수인가요?',
 '2025-11-17 10:30:00', 2, NULL, NULL,
 '신태훈님, 안녕하세요. 확인 결과 파티 시작(2025-09-15) 이후 진행 중에 탈퇴하셨습니다. MOA 이용약관 제15조에 따라 파티 운영 중 자발적 탈퇴의 경우 보증금이 환불되지 않습니다. 불편을 드려 죄송합니다.',
 '2025-11-17 14:00:00', 'ANSWERED'),

-- == 기타 문의 (CODE_ID 3) ==

('choihaneum@gmail.com', 3,
 'MOA 앱(앱스토어)이 있나요?',
 '모바일로 이용하고 싶은데 앱스토어나 플레이스토어에서 MOA 앱을 찾을 수가 없습니다.',
 '2025-12-10 20:15:00', 3, NULL, NULL,
 '안녕하세요, 최하늠님! 현재 MOA는 모바일 웹 브라우저를 통해 이용하실 수 있으며, 네이티브 앱은 2026년 1분기 출시를 목표로 개발 중입니다. 빠른 시일 내에 좋은 소식 전해드리겠습니다!',
 '2025-12-11 09:30:00', 'ANSWERED'),

('parkseungwoo@kakao.com', 3,
 '파티원과 메시지를 주고받을 수 있나요?',
 '같은 파티원과 문의 사항이 생겼을 때 직접 연락할 방법이 있는지 궁금합니다.',
 '2026-01-03 15:44:00', 2, NULL, NULL,
 '박승우님, 안녕하세요! 현재 파티원 간 직접 메시지 기능은 제공되지 않습니다. OTT 계정 접속 문제 등 파티 관련 이슈는 MOA 고객센터를 통해 접수해 주시면 파티장에게 전달해 드립니다.',
 '2026-01-03 17:00:00', 'ANSWERED'),

('leeareum@kakao.com', 3,
 '모집 중인 파티 알림 설정은 어떻게 하나요?',
 '특정 OTT 파티가 모집을 시작하면 알림을 받고 싶습니다. 설정할 수 있는 방법이 있나요?',
 '2026-03-19 14:28:00', 1, NULL, NULL,
 NULL, NULL, 'PENDING'),

('kwondohyun@naver.com', 3,
 '전화 상담이 가능한가요?',
 '문의 내용이 복잡해서 채팅이나 전화로 상담하고 싶습니다.',
 '2026-02-25 09:10:00', 2, NULL, NULL,
 NULL, NULL, 'PENDING'),

('chominseo@naver.com', 3,
 '서비스 이용약관을 PDF로 받을 수 있나요?',
 '이용약관 전문을 PDF 파일로 받고 싶습니다.',
 '2026-01-15 18:05:00', 1, NULL, NULL,
 '조민서님, 안녕하세요! 현재 PDF 파일 다운로드 기능은 지원되지 않습니다. 서비스 하단의 이용약관 링크에서 전문을 확인하실 수 있으며, 인쇄 기능을 이용해 PDF로 저장하시는 방법을 추천드립니다.',
 '2026-01-15 20:30:00', 'ANSWERED');


-- ============================================
-- 2. PUSH 삽입 (48건)
-- ============================================
INSERT INTO PUSH (
    RECEIVER_ID, PUSH_CODE, TITLE, CONTENT,
    MODULE_ID, MODULE_TYPE, SENT_AT, READ_AT, IS_READ, IS_DELETED
) VALUES

-- ─────────────────────────────────────────────
-- 파티 가입 알림 (PARTY_JOIN) — 8건
-- ─────────────────────────────────────────────
('kanghyeji@naver.com',   'PARTY_JOIN','파티 가입 완료','강혜지님, Netflix Standard 파티에 성공적으로 참여하셨습니다. (현재 2/4명)','1','PARTY','2025-10-27 19:42:30','2025-10-27 20:10:00','Y','N'),
('chodyoungwook@gmail.com','PARTY_JOIN','파티 가입 완료','조동욱님, Netflix Standard 파티에 성공적으로 참여하셨습니다. (현재 3/4명)','1','PARTY','2025-10-28 11:28:45','2025-10-28 12:00:00','Y','N'),
('yoonchaewon@naver.com', 'PARTY_JOIN','파티 가입 완료','윤채원님, Netflix Standard 파티에 성공적으로 참여하셨습니다. (현재 4/4명)','1','PARTY','2025-10-29 16:52:30','2025-10-29 17:30:00','Y','N'),
('ohhayeon@gmail.com',    'PARTY_JOIN','파티 가입 완료','오하연님, Disney+ Standard 파티에 성공적으로 참여하셨습니다. (현재 2/4명)','3','PARTY','2025-11-26 13:48:30','2025-11-26 14:20:00','Y','N'),
('kangjieun@gmail.com',   'PARTY_JOIN','파티 가입 완료','강지은님, Netflix Premium 파티 생성이 완료되었습니다. (현재 1/4명)','6','PARTY','2026-01-08 15:22:30',NULL,'N','N'),
('chominseo@naver.com',   'PARTY_JOIN','파티 가입 완료','조민서님, 왓챠 Basic 파티 생성이 완료되었습니다. (현재 1/4명)','7','PARTY','2026-01-25 10:14:30','2026-01-25 10:30:00','Y','N'),
('kangdohyun@gmail.com',  'PARTY_JOIN','파티 가입 완료','강도현님, Netflix Standard 파티에 성공적으로 참여하셨습니다. (현재 2/4명)','15','PARTY','2026-03-12 18:35:30',NULL,'N','N'),
('junghyewon@naver.com',  'PARTY_JOIN','파티 가입 완료','정혜원님, 티빙 Standard 파티에 성공적으로 참여하셨습니다. (현재 2/4명)','17','PARTY','2026-03-20 15:42:30','2026-03-20 16:05:00','Y','N'),

-- ─────────────────────────────────────────────
-- 결제 예정 알림 (PAY_UPCOMING) — 8건
-- 2026-03-04: 이번 달 결제 전날 알림
-- ─────────────────────────────────────────────
('kimminj95@gmail.com',    'PAY_UPCOMING','결제 예정 안내','Netflix Standard 파티 구독료 3,625원이 내일(2026-03-05) 결제됩니다.','1','PAYMENT','2026-03-04 09:00:00','2026-03-04 10:15:00','Y','N'),
('leeseyeon@naver.com',    'PAY_UPCOMING','결제 예정 안내','유튜브 프리미엄 파티 구독료 3,475원이 내일(2026-03-05) 결제됩니다.','2','PAYMENT','2026-03-04 09:00:00','2026-03-04 09:45:00','Y','N'),
('parkjihun@kakao.com',    'PAY_UPCOMING','결제 예정 안내','Disney+ Standard 파티 구독료 2,475원이 내일(2026-03-05) 결제됩니다.','3','PAYMENT','2026-03-04 09:00:00',NULL,'N','N'),
('choisubin@gmail.com',    'PAY_UPCOMING','결제 예정 안내','티빙 Standard 파티 구독료 2,725원이 내일(2026-03-05) 결제됩니다.','4','PAYMENT','2026-03-04 09:00:00','2026-03-04 11:30:00','Y','N'),
('junghwu@naver.com',      'PAY_UPCOMING','결제 예정 안내','웨이브 프리미엄 파티 구독료 3,475원이 내일(2026-03-05) 결제됩니다.','5','PAYMENT','2026-03-04 09:00:00','2026-03-04 09:20:00','Y','N'),
('kangjieun@gmail.com',    'PAY_UPCOMING','결제 예정 안내','Netflix Premium 파티 구독료 4,750원이 내일(2026-03-05) 결제됩니다.','6','PAYMENT','2026-03-04 09:00:00',NULL,'N','N'),
('chominseo@naver.com',    'PAY_UPCOMING','결제 예정 안내','왓챠 Basic 파티 구독료 1,975원이 내일(2026-03-05) 결제됩니다.','7','PAYMENT','2026-03-04 09:00:00','2026-03-04 10:00:00','Y','N'),
('yoonjunhyuk@kakao.com',  'PAY_UPCOMING','결제 예정 안내','Disney+ Premium 파티 구독료 3,475원이 내일(2026-03-05) 결제됩니다.','8','PAYMENT','2026-03-04 09:00:00','2026-03-04 09:55:00','Y','N'),

-- ─────────────────────────────────────────────
-- 결제 성공 알림 (PAY_SUCCESS) — 8건
-- 2026-03-05 결제 완료 (ACTIVE 파티 1~8 리더)
-- ─────────────────────────────────────────────
('kimminj95@gmail.com',    'PAY_SUCCESS','결제 완료','Netflix Standard 2026-03 구독료 3,625원이 결제되었습니다.','17','PAYMENT','2026-03-05 09:00:10','2026-03-05 09:30:00','Y','N'),
('leeseyeon@naver.com',    'PAY_SUCCESS','결제 완료','유튜브 프리미엄 2026-03 구독료 3,475원이 결제되었습니다.','37','PAYMENT','2026-03-05 09:00:10','2026-03-05 09:10:00','Y','N'),
('parkjihun@kakao.com',    'PAY_SUCCESS','결제 완료','Disney+ Standard 2026-03 구독료 2,475원이 결제되었습니다.','53','PAYMENT','2026-03-05 09:00:10',NULL,'N','N'),
('choisubin@gmail.com',    'PAY_SUCCESS','결제 완료','티빙 Standard 2026-03 구독료 2,725원이 결제되었습니다.','69','PAYMENT','2026-03-05 09:00:10','2026-03-05 09:20:00','Y','N'),
('junghwu@naver.com',      'PAY_SUCCESS','결제 완료','웨이브 프리미엄 2026-03 구독료 3,475원이 결제되었습니다.','81','PAYMENT','2026-03-05 09:00:10','2026-03-05 09:08:00','Y','N'),
('kangjieun@gmail.com',    'PAY_SUCCESS','결제 완료','Netflix Premium 2026-03 구독료 4,750원이 결제되었습니다.','93','PAYMENT','2026-03-05 09:00:10',NULL,'N','N'),
('chominseo@naver.com',    'PAY_SUCCESS','결제 완료','왓챠 Basic 2026-03 구독료 1,975원이 결제되었습니다.','101','PAYMENT','2026-03-05 09:00:10','2026-03-05 09:25:00','Y','N'),
('yoonjunhyuk@kakao.com',  'PAY_SUCCESS','결제 완료','Disney+ Premium 2026-03 구독료 3,475원이 결제되었습니다.','109','PAYMENT','2026-03-05 09:00:10','2026-03-05 09:15:00','Y','N'),

-- ─────────────────────────────────────────────
-- 결제 실패 알림 (PAY_FAIL) — 재시도 케이스 3건
-- ─────────────────────────────────────────────
('janghyunseok@gmail.com','PAY_FAIL','결제 실패','유튜브 프리미엄 2025-12 구독료 3,475원 결제가 실패했습니다. 결제 수단을 확인해주세요.','22','PAYMENT','2025-12-05 09:01:10','2025-12-05 14:00:00','Y','N'),
('hansungmin@naver.com',  'PAY_FAIL','결제 실패','Netflix Standard 2025-11 구독료 3,625원 결제가 실패했습니다. 결제 수단을 확인해주세요.','102','PAYMENT','2025-11-05 09:01:10','2025-11-05 10:30:00','Y','N'),
('kanghyeji@naver.com',   'PAY_FAIL','결제 실패','유튜브 프리미엄 2025-09 구독료 3,475원 결제가 실패했습니다. 카드 상태를 확인해주세요.','118','PAYMENT','2025-09-05 09:01:10','2025-09-05 11:00:00','Y','N'),

-- ─────────────────────────────────────────────
-- 보증금 환불 알림 (DEPOSIT_REFUNDED) — 6건
-- CLOSED 파티 멤버 대표
-- ─────────────────────────────────────────────
('jangnayeon@gmail.com',  'DEPOSIT_REFUNDED','보증금 환불 완료','Netflix Standard 파티 보증금 20,000원이 환불되었습니다.','33','DEPOSIT','2026-03-03 11:00:30','2026-03-03 12:00:00','Y','N'),
('limtaeyang@naver.com',  'DEPOSIT_REFUNDED','보증금 환불 완료','유튜브 프리미엄 파티 보증금 20,000원이 환불되었습니다.','37','DEPOSIT','2026-02-03 14:00:30','2026-02-03 15:30:00','Y','N'),
('hanhaeun@gmail.com',    'DEPOSIT_REFUNDED','보증금 환불 완료','Disney+ Standard 파티 보증금 20,000원이 환불되었습니다.','41','DEPOSIT','2026-01-03 10:00:30','2026-01-03 10:45:00','Y','N'),
('ohjungwoo@kakao.com',   'DEPOSIT_REFUNDED','보증금 환불 완료','티빙 Standard 파티 보증금 20,000원이 환불되었습니다.','45','DEPOSIT','2026-03-04 09:00:30','2026-03-04 09:50:00','Y','N'),
('shinyerin@gmail.com',   'DEPOSIT_REFUNDED','보증금 환불 완료','웨이브 프리미엄 파티 보증금 20,000원이 환불되었습니다.','49','DEPOSIT','2026-02-04 10:00:30','2026-02-04 10:30:00','Y','N'),
('kwondohyun@naver.com',  'DEPOSIT_REFUNDED','보증금 환불 완료','왓챠 Basic 파티 보증금 20,000원이 환불되었습니다.','53','DEPOSIT','2026-03-03 15:00:30','2026-03-03 16:10:00','Y','N'),

-- ─────────────────────────────────────────────
-- 보증금 몰수 알림 (DEPOSIT_FORFEITED) — 1건
-- 신태훈 파티13 중도 탈퇴
-- ─────────────────────────────────────────────
('shintaehoon@naver.com', 'DEPOSIT_FORFEITED','보증금 몰수 안내','웨이브 프리미엄 파티 보증금 5,000원이 중도 탈퇴 정책에 따라 몰수되었습니다.','52','DEPOSIT','2025-11-15 14:00:30','2025-11-15 14:05:00','Y','N'),

-- ─────────────────────────────────────────────
-- 정산 완료 알림 (SETTLE_COMPLETED) — 6건
-- CLOSED 파티 리더 최종 월 정산
-- ─────────────────────────────────────────────
('jangnayeon@gmail.com',  'SETTLE_COMPLETED','정산 입금 완료','2026-02 정산금 12,325원이 KB국민은행 계좌로 입금되었습니다.','5','SETTLEMENT','2026-02-10 13:31:30','2026-02-10 14:00:00','Y','N'),
('limtaeyang@naver.com',  'SETTLE_COMPLETED','정산 입금 완료','2026-01 정산금 11,815원이 하나은행 계좌로 입금되었습니다.','10','SETTLEMENT','2026-01-10 15:02:30','2026-01-10 15:30:00','Y','N'),
('hanhaeun@gmail.com',    'SETTLE_COMPLETED','정산 입금 완료','2025-12 정산금 8,415원이 신한은행 계좌로 입금되었습니다.','15','SETTLEMENT','2025-12-10 14:40:30','2025-12-10 15:20:00','Y','N'),
('ohjungwoo@kakao.com',   'SETTLE_COMPLETED','정산 입금 완료','2026-02 정산금 9,265원이 카카오뱅크 계좌로 입금되었습니다.','20','SETTLEMENT','2026-02-10 09:11:30','2026-02-10 09:40:00','Y','N'),
('shinyerin@gmail.com',   'SETTLE_COMPLETED','정산 입금 완료','2026-01 정산금 8,862원이 우리은행 계좌로 입금되었습니다.','24','SETTLEMENT','2026-01-10 10:28:30','2026-01-10 11:00:00','Y','N'),
('kwondohyun@naver.com',  'SETTLE_COMPLETED','정산 입금 완료','2026-02 정산금 6,715원이 토스뱅크 계좌로 입금되었습니다.','28','SETTLEMENT','2026-02-10 10:43:30','2026-02-10 11:15:00','Y','N'),

-- ─────────────────────────────────────────────
-- 문의 답변 알림 (INQUIRY_ANSWER) — 5건
-- ─────────────────────────────────────────────
('kanghyeji@naver.com',    'INQUIRY_ANSWER','문의 답변 완료','강혜지님이 남기신 문의에 답변이 등록되었습니다.','1','COMMUNITY','2025-11-03 16:10:30','2025-11-03 17:00:00','Y','N'),
('janghyunseok@gmail.com', 'INQUIRY_ANSWER','문의 답변 완료','장현석님이 남기신 문의에 답변이 등록되었습니다.','14','COMMUNITY','2025-12-06 14:30:30','2025-12-06 15:00:00','Y','N'),
('hansungmin@naver.com',   'INQUIRY_ANSWER','문의 답변 완료','한성민님이 남기신 문의에 답변이 등록되었습니다.','18','COMMUNITY','2025-10-28 16:40:30','2025-10-28 17:10:00','Y','N'),
('shintaehoon@naver.com',  'INQUIRY_ANSWER','문의 답변 완료','신태훈님이 남기신 문의에 답변이 등록되었습니다.','21','COMMUNITY','2025-11-17 14:00:30','2025-11-17 14:30:00','Y','N'),
('jangnayeon@gmail.com',   'INQUIRY_ANSWER','문의 답변 완료','장나연님이 남기신 문의에 답변이 등록되었습니다.','22','COMMUNITY','2026-03-15 17:30:30','2026-03-15 18:00:00','Y','N');


-- ============================================
-- 3. LOGIN_HISTORY 삽입 (30건)
-- ============================================
INSERT INTO LOGIN_HISTORY (
    USER_ID, LOGIN_AT, SUCCESS, LOGIN_IP, USER_AGENT, FAIL_REASON, LOGIN_TYPE
) VALUES

-- admin@moa.com (3건 — 관리자 정기 접속)
('admin@moa.com','2026-03-20 09:05:00',1,'121.134.55.210',
 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
 NULL,'EMAIL'),
('admin@moa.com','2026-03-22 14:30:00',1,'121.134.55.210',
 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
 NULL,'EMAIL'),
('admin@moa.com','2026-03-25 09:10:00',1,'121.134.55.210',
 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
 NULL,'EMAIL'),

-- kimminj95@gmail.com (3건)
('kimminj95@gmail.com','2026-03-04 08:50:00',1,'58.226.141.33',
 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1',
 NULL,'EMAIL'),
('kimminj95@gmail.com','2026-03-10 19:22:00',1,'58.226.141.33',
 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1',
 NULL,'EMAIL'),
('kimminj95@gmail.com','2026-03-25 11:05:00',1,'58.226.141.33',
 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1',
 NULL,'EMAIL'),

-- kanghyeji@naver.com (3건 — PC + 모바일 혼용)
('kanghyeji@naver.com','2025-11-03 14:10:00',1,'175.223.18.92',
 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
 NULL,'EMAIL'),
('kanghyeji@naver.com','2025-12-28 17:40:00',1,'175.223.18.92',
 'Mozilla/5.0 (Linux; Android 14; SM-A546B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.43 Mobile Safari/537.36',
 NULL,'EMAIL'),
('kanghyeji@naver.com','2026-03-05 09:05:00',1,'175.223.18.92',
 'Mozilla/5.0 (Linux; Android 14; SM-A546B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.64 Mobile Safari/537.36',
 NULL,'EMAIL'),

-- shintaehoon@naver.com (4건 — 2 성공(정지 전) + 2 실패(정지 후))
('shintaehoon@naver.com','2025-09-12 09:40:00',1,'221.160.83.45',
 'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
 NULL,'EMAIL'),
('shintaehoon@naver.com','2025-10-05 08:55:00',1,'221.160.83.45',
 'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Mobile Safari/537.36',
 NULL,'EMAIL'),
-- 정지 후 로그인 시도 실패
('shintaehoon@naver.com','2025-12-10 15:30:00',0,'221.160.83.45',
 'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
 '계정이 정지되었습니다.','EMAIL'),
('shintaehoon@naver.com','2026-01-05 10:15:00',0,'221.160.83.45',
 'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36',
 '계정이 정지되었습니다.','EMAIL'),

-- leejisoo@gmail.com (3건)
('leejisoo@gmail.com','2025-12-08 11:00:00',1,'112.169.44.77',
 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
 NULL,'EMAIL'),
('leejisoo@gmail.com','2026-02-10 09:35:00',1,'112.169.44.77',
 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
 NULL,'EMAIL'),
('leejisoo@gmail.com','2026-03-05 09:00:00',1,'112.169.44.77',
 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
 NULL,'EMAIL'),

-- janghyunseok@gmail.com (2건 — 비밀번호 오입력 후 성공)
('janghyunseok@gmail.com','2025-12-05 09:00:00',0,'59.10.78.133',
 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
 '비밀번호가 일치하지 않습니다.','EMAIL'),
('janghyunseok@gmail.com','2025-12-05 09:02:00',1,'59.10.78.133',
 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
 NULL,'EMAIL'),

-- parkjihun@kakao.com (2건 — 카카오 소셜 로그인)
('parkjihun@kakao.com','2025-11-24 08:55:00',1,'118.235.11.204',
 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
 NULL,'OAUTH_KAKAO'),
('parkjihun@kakao.com','2026-03-04 22:10:00',1,'118.235.11.204',
 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
 NULL,'OAUTH_KAKAO'),

-- ohhayeon@gmail.com (2건)
('ohhayeon@gmail.com','2025-11-26 13:25:00',1,'203.252.88.51',
 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
 NULL,'EMAIL'),
('ohhayeon@gmail.com','2026-03-21 10:50:00',1,'203.252.88.51',
 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
 NULL,'EMAIL'),

-- limtaeyang@naver.com (2건 — CLOSED 파티 리더)
('limtaeyang@naver.com','2026-01-10 14:55:00',1,'61.74.129.8',
 'Mozilla/5.0 (Linux; Android 14; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36',
 NULL,'EMAIL'),
('limtaeyang@naver.com','2026-02-03 14:10:00',1,'61.74.129.8',
 'Mozilla/5.0 (Linux; Android 14; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.101 Mobile Safari/537.36',
 NULL,'EMAIL'),

-- jangnayeon@gmail.com (2건)
('jangnayeon@gmail.com','2026-02-10 13:25:00',1,'220.118.65.42',
 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
 NULL,'EMAIL'),
('jangnayeon@gmail.com','2026-03-15 15:50:00',1,'220.118.65.42',
 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
 NULL,'EMAIL'),

-- 최근 가입/활성 유저 (1건씩)
('hwangsua@gmail.com','2026-03-10 09:55:00',1,'175.196.22.104',
 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1',
 NULL,'EMAIL'),
('kimgunwoo@naver.com','2026-03-15 13:40:00',1,'222.107.34.91',
 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
 NULL,'EMAIL'),
('leeareum@kakao.com','2026-03-18 10:58:00',1,'210.91.147.23',
 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Mobile/15E148 Safari/604.1',
 NULL,'OAUTH_KAKAO'),
('yoonchaewon@naver.com','2026-01-10 12:30:00',1,'218.38.76.55',
 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.43 Mobile Safari/537.36',
 NULL,'EMAIL');


-- ============================================
-- Phase 6 완료 — 전체 샘플 데이터 삽입 완료
--
-- 실행 후 확인:
--   SELECT COUNT(*) FROM COMMUNITY;           -- 35
--   SELECT COUNT(*) FROM PUSH;                -- 48
--   SELECT COUNT(*) FROM LOGIN_HISTORY;       -- 30
--
--   SELECT ANSWER_STATUS, COUNT(*) FROM COMMUNITY
--     WHERE COMMUNITY_CODE_ID IN (1,2,3)
--     GROUP BY ANSWER_STATUS;
--     -- ANSWERED: 16 / PENDING: 7
--
--   SELECT IS_READ, COUNT(*) FROM PUSH GROUP BY IS_READ;
--     -- Y: 38 / N: 10
--
--   SELECT SUCCESS, COUNT(*) FROM LOGIN_HISTORY GROUP BY SUCCESS;
--     -- 성공: 26 / 실패: 4
-- ============================================
