# MOA — 구독 공유 플랫폼

> 넷플릭스, 유튜브 프리미엄 등 구독 서비스를 여러 명이 함께 이용할 수 있도록 파티를 모집하고 참여하는 플랫폼

[![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.8-brightgreen?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479a1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)

---

## 목차

- [프로젝트 소개](#프로젝트-소개)
- [기술 스택](#기술-스택)
- [시스템 아키텍처](#시스템-아키텍처)
- [주요 기능](#주요-기능)
- [담당 파트 상세](#담당-파트-상세)
- [프로젝트 구조](#프로젝트-구조)
- [실행 방법](#실행-방법)

---

## 프로젝트 소개

MOA는 넷플릭스, 유튜브 프리미엄, 왓챠 등 구독 서비스의 요금을 분할 부담할 파티원을 모집하고 관리하는 플랫폼입니다.

부트캠프 5인 팀 프로젝트를 포트폴리오용으로 리팩토링했습니다. 저는 **결제·정산·파티 생명주기·오픈뱅킹** 파트를 담당했습니다.

**핵심 흐름**

```
파티장 생성 → 파티원 모집 → 보증금 납부 → 빌링키 등록 → 월별 자동결제 → 정산 → 파티 종료
```

---

## 기술 스택

### Backend
| 분류 | 기술 |
|------|------|
| Language | Java 17 |
| Framework | Spring Boot 3.5.8 |
| Security | Spring Security + JWT (JJWT 0.11.5) |
| ORM | MyBatis 3.0.3 |
| Database | MySQL 8.0 |
| Scheduler | Spring `@Scheduled` |
| 외부 API | TossPayments, KFTC 오픈뱅킹, Resend (이메일), Google Authenticator (2FA) |

### Frontend
| 분류 | 기술 |
|------|------|
| Framework | React 19 + Vite 7 |
| 상태 관리 | Zustand 5 |
| UI | shadcn/ui + Radix UI + Tailwind CSS 4 |
| 애니메이션 | Framer Motion 12 |
| 차트 | Recharts, ApexCharts |
| HTTP | Axios |

---

## 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                      Client (React)                      │
└────────────────────────┬────────────────────────────────┘
                         │ REST API
┌────────────────────────▼────────────────────────────────┐
│              Spring Boot Application                      │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Web Layer   │  │ Service Layer│  │  Scheduler    │  │
│  │ (REST + JWT) │  │  + AOP       │  │  (8 jobs)     │  │
│  └──────┬───────┘  └──────┬───────┘  └───────┬───────┘  │
│         │                 │                   │           │
│  ┌──────▼─────────────────▼───────────────────▼───────┐  │
│  │              MyBatis DAO Layer                       │  │
│  └──────────────────────┬──────────────────────────────┘  │
└─────────────────────────│───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                      MySQL 8.0                           │
└─────────────────────────────────────────────────────────┘
           │                           │
┌──────────▼─────────┐   ┌────────────▼──────────────────┐
│   TossPayments API  │   │     KFTC 오픈뱅킹 API          │
│  (빌링키 / 결제)     │   │  (계좌 인증 / 정산 이체)        │
└────────────────────┘   └───────────────────────────────┘
```

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 파티 생성·참여 | OTT 서비스별 파티 모집, 파티원 가입/탈퇴 라이프사이클 관리 |
| 자동 결제 | TossPayments 빌링키 기반 월별 자동결제 (스케줄러, 최대 4회 재시도) |
| 보증금 관리 | 파티 참여 시 보증금 납부, 정상 종료 시 환불 / 중도 탈퇴 시 몰수 |
| 오픈뱅킹 정산 | KFTC 오픈뱅킹 API를 통한 1원 계좌 인증 및 정산 계좌 이체 |
| 회원 인증 | JWT + Refresh Token, OAuth2 (소셜 로그인), TOTP 2FA, 이메일 인증 |
| 관리자 | 사용자 관리, 블랙리스트, 대시보드 (결제/정산/파티 통계) |
| 커뮤니티 | 공지사항, FAQ, 1:1 문의 |
| 챗봇 | 서비스 안내 AI 챗봇 |

---

## 담당 파트 상세

### 1. TossPayments 빌링키 결제

파티 가입 시 빌링키를 발급받아 저장하고, 이후 매월 자동결제를 실행합니다.

**결제 흐름**
```
사용자 카드 등록 → TossPayments 빌링키 발급 → DB 저장
       ↓
매월 1일 PaymentScheduler 실행
       ↓
빌링키로 Toss API 자동결제 호출
       ↓
실패 시 최대 4회 재시도 (PaymentRetryService)
       ↓
최종 실패 → RefundScheduler → 보증금 환불 처리
```

**핵심 설계 포인트**
- `@Scheduled` + `REQUIRES_NEW` 트랜잭션으로 파티원별 결제 실패가 다른 파티원에게 영향을 주지 않도록 격리
- `PaymentRetryHistory`로 재시도 이력 추적, 재시도 간격은 점진적으로 증가
- Spring Event(`ApplicationEventPublisher`)로 결제 성공/실패 시 정산 스케줄러와 푸시 알림 비동기 연계

**관련 스케줄러**
```
PaymentScheduler          ← 매월 1일 자동결제 실행
PaymentTimeoutScheduler   ← 장시간 PENDING 상태 결제 타임아웃 처리
RefundScheduler           ← 최종 결제 실패 후 보증금 환불
```

---

### 2. 파티 생명주기 관리

```
[파티 생성] → [모집 중] → [파티 시작] → [운영 중] → [파티 종료]
                ↓                            ↓
           모집 기간 초과                 파티원 탈퇴
               ↓                            ↓
        자동 취소 (스케줄러)         보증금 처리 (환불/몰수)
```

**파티 상태 전이**

| 상태 | 설명 |
|------|------|
| `RECRUITING` | 파티원 모집 중 |
| `ACTIVE` | 정원 달성, 파티 운영 중 |
| `CLOSED` | 파티 정상 종료 |
| `CANCELLED` | 모집 실패 또는 강제 취소 |

**탈퇴 처리 로직**
- 파티 시작 전 탈퇴 → 보증금 전액 환불
- 파티 시작 후 탈퇴 → 보증금 몰수 (파티장에게 정산)
- 파티장 탈퇴 → 파티 강제 종료, 전 파티원 환불

**관련 스케줄러**
```
ExpiredPartyCleanupScheduler  ← 모집 기간 초과 파티 자동 취소
PartyCloseScheduler           ← 종료일 도래 파티 자동 종료
PendingDepositCleanupScheduler ← 미납 보증금 정리
```

---

### 3. 보증금 처리

파티 참여 시 보증금을 TossPayments로 결제하고, 상황에 따라 환불 또는 몰수 처리합니다.

```java
// 보증금 상태
PAID      → 보관 중 (파티 운영 중)
REFUNDED  → 환불 완료 (정상 종료 또는 시작 전 탈퇴)
FORFEITED → 몰수 (파티 시작 후 중도 탈퇴)
```

---

### 4. KFTC 오픈뱅킹 계좌 인증 및 정산 이체

**계좌 인증 흐름**
```
1. 오픈뱅킹 OAuth2 인가 URL 발급
2. 사용자 동의 → 인증 코드 발급
3. 인증 코드로 사용자 토큰 발급
4. 계좌 정보 조회 → DB 저장
5. 1원 인증 입금 (입금자명: MOA + 4자리 코드)
6. 사용자가 코드 입력 → 계좌 인증 완료
```

**정산 이체**

파티 종료 시 `SettlementScheduler`가 각 파티원의 월 납입금을 파티장 계좌로 이체합니다.

```
SettlementScheduler          ← 파티 종료 후 정산 대상 계산
SettlementTransferScheduler  ← 오픈뱅킹 API 실제 이체 실행
```

---

## 프로젝트 구조

```
moa/
├── 4beans-moa-backend/
│   └── src/main/java/com/moa/
│       ├── auth/               # JWT 필터, OAuth2 핸들러
│       ├── common/             # 예외 처리, AOP, 유틸
│       ├── config/             # Security, OpenBanking, CORS 설정
│       ├── dao/                # MyBatis DAO (도메인별 분류)
│       ├── domain/             # 엔티티, Enum
│       ├── dto/                # Request/Response DTO
│       ├── scheduler/          # 8개 스케줄러
│       ├── service/            # 비즈니스 로직 (도메인별 분류)
│       └── web/                # REST 컨트롤러 (21개)
│
└── 4beans-moa-front/
    └── src/
        ├── api/                # Axios API 클라이언트
        ├── components/         # 공통 컴포넌트
        ├── config/             # 테마 설정 (light / dark)
        ├── pages/              # 페이지 컴포넌트
        │   ├── party/          # 파티 생성·목록·상세
        │   ├── payment/        # 결제·빌링
        │   ├── account/        # 오픈뱅킹 계좌 인증
        │   └── user/           # 회원·마이페이지
        ├── store/              # Zustand 상태 관리 (18개 store)
        └── utils/              # 테마·날짜·포맷 유틸
```

---

## 실행 방법

### 환경 변수 설정

**Backend** (`application.properties` 또는 환경 변수)
```properties
# DB
spring.datasource.url=jdbc:mysql://localhost:3306/moa
spring.datasource.username=...
spring.datasource.password=...

# JWT
jwt.secret=...

# TossPayments
toss.secret-key=...

# KFTC 오픈뱅킹
openbanking.client-id=...
openbanking.client-secret=...
openbanking.platform-account-number=...

# Resend (이메일)
resend.api-key=...
```

**Frontend** (`.env`)
```env
VITE_API_BASE_URL=http://localhost:8080
```

### 실행

```bash
# Backend
cd 4beans-moa-backend
./mvnw spring-boot:run

# Frontend
cd 4beans-moa-front
npm install
npm run dev
```

---

> 부트캠프 팀 프로젝트 원본: [github.com/solpark-dev/moa](https://github.com/solpark-dev/moa)
