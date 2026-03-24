# 4beans-moa

> **OTT 구독 공유 플랫폼** - 함께 나누면 더 저렴하게!

[![Deploy](https://img.shields.io/badge/Deploy-AWS-FF9900?logo=amazon-aws)](https://www.moamoa.cloud/)
[![Frontend](https://img.shields.io/badge/Frontend-React_19-61DAFB?logo=react)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-Spring_Boot_3.5-6DB33F?logo=spring-boot)](https://spring.io/)

**Live Demo**: [https://www.moamoa.cloud/](https://www.moamoa.cloud/)

Netflix, Disney+, Wavve 등 OTT 서비스를 파티원들과 함께 공유하여
**월 구독료를 최대 75% 절감**할 수 있는 매칭 플랫폼입니다.

<br>

## 프로젝트 소개

### 개발 배경
- OTT 서비스 구독료 부담 증가 (넷플릭스 프리미엄 17,000원/월)
- 계정 공유 시 **신뢰 문제** (정산, 탈퇴 등)
- 기존 공유 서비스의 **보안 취약점** 해결 필요

### 해결 방안
| 문제 | 해결책 |
|------|--------|
| 정산 불이행 | 자동 빌링 시스템 |
| 무단 탈퇴 | 보증금 제도 |
| 계정 노출 | 암호화 저장 + 권한 기반 노출 |
| 신뢰 부족 | 파티장/파티원 평점 시스템 |

### 타겟 사용자
- OTT 비용을 절감하고 싶은 20~30대
- 1인 가구 또는 소규모 가정
- 다양한 OTT를 이용하고 싶은 사용자

<br>

---

## 시스템 아키텍처

```mermaid
flowchart TB
    subgraph Client["Client"]
        React[React 19 + Vite]
    end

    subgraph AWS["AWS Cloud"]
        subgraph EC2["EC2"]
            Spring[Spring Boot 3.5]
        end
        RDS[(RDS MySQL)]
        S3[S3 Storage]
    end

    subgraph External["External Services"]
        Toss[토스페이먼츠]
        OAuth[카카오/구글 OAuth]
        Bank[오픈뱅킹]
        Resend[Resend Email]
    end

    React -->|HTTPS| Spring
    Spring --> RDS
    Spring --> S3
    Spring -->|결제 API| Toss
    Spring -->|소셜 로그인| OAuth
    Spring -->|계좌 인증| Bank
    Spring -->|이메일| Resend
```

<br>

---

## 인증 플로우

```mermaid
sequenceDiagram
    participant U as 사용자
    participant F as Frontend
    participant B as Backend
    participant DB as Database

    Note over U,DB: 로그인 프로세스
    U->>F: 로그인 요청
    F->>B: POST /api/auth/login
    B->>DB: 사용자 조회 & 검증
    DB-->>B: 사용자 정보
    B->>B: JWT 토큰 생성
    B-->>F: AccessToken + RefreshToken
    F->>F: Zustand Store 저장

    Note over U,DB: 토큰 갱신 (자동)
    F->>B: API 요청 (만료된 토큰)
    B-->>F: 401 Unauthorized
    F->>B: POST /api/auth/refresh
    B->>B: RefreshToken 검증
    B-->>F: 새 AccessToken
    F->>B: 원래 요청 재시도
```

<br>

---

## 파티 가입 플로우

```mermaid
flowchart TD
    A[파티 목록 조회] --> B{파티 선택}
    B --> C[파티 상세 페이지]
    C --> D{가입 조건 확인}

    D -->|미로그인| E[로그인 페이지]
    E --> C

    D -->|빌링키 없음| F[카드 등록]
    F --> G[토스페이먼츠 빌링]
    G --> C

    D -->|조건 충족| H[가입 신청]
    H --> I[보증금 결제]
    I --> J{결제 성공?}

    J -->|성공| K[파티원 등록]
    K --> L[OTT 계정 정보 노출]

    J -->|실패| M[결제 재시도]
    M --> I
```

<br>

---

## 구독 관리 플로우

```mermaid
flowchart LR
    subgraph User["사용자"]
        A[구독 상품 목록] --> B[상품 상세]
        B --> C[구독 신청]
        C --> D[결제 처리]
    end

    subgraph MyPage["내 구독"]
        E[구독 목록 조회]
        F[구독 상세 조회]
        G[구독 정보 수정]
        H[구독 해지]
    end

    D --> E
    E --> F
    F --> G
    F --> H
```

<br>

---

## 정산 시스템

```mermaid
flowchart LR
    subgraph Monthly["매월 정산"]
        A[스케줄러 실행] --> B[파티원 자동결제]
        B --> C{전원 성공?}
        C -->|Yes| D[파티장 정산금 계산]
        C -->|No| E[미납자 알림]
        E --> F[4회 재시도]
        F -->|4회 실패| G[파티 일시정지]
        D --> H{계좌 등록됨?}
        H -->|Yes| I[파티장 계좌 입금]
        H -->|No| J[계좌 등록 요청]
    end

    subgraph Calculation["정산 계산"]
        K[월 구독료] --> L[플랫폼 수수료 15%]
        L --> M[파티장 수령액]
    end
```

<br>

---

## 예외 처리 시스템

```mermaid
flowchart TB
    subgraph UserDeletion["사용자 탈퇴 처리"]
        A[사용자 탈퇴 요청] --> B{역할 확인}
        B -->|파티장| C[파티 해산 처리]
        C --> D[모집중: 파티 DISBANDED]
        C --> E[이용중: 파티원 보증금 환불]
        B -->|파티원| F[멤버십 해제]
        F --> G[보증금 환불 처리]
        G --> H[파티장에게 알림]
    end

    subgraph PaymentFailure["결제 실패 처리"]
        I[월 구독료 결제] --> J{결제 성공?}
        J -->|실패| K[재시도 스케줄링]
        K --> L{재시도 횟수}
        L -->|4회 미만| M[다음 날 재시도]
        L -->|4회 실패| N[파티 SUSPENDED]
        N --> O[전체 멤버 알림]
    end

    subgraph SettlementException["정산 예외 처리"]
        P[정산 생성] --> Q{파티장 계좌?}
        Q -->|미등록| R[PENDING_ACCOUNT]
        R --> S[계좌 등록 요청 알림]
        Q -->|등록됨| T[정산 진행]
    end
```

<br>

---

## ERD (핵심 테이블)

```mermaid
erDiagram
    USER ||--o{ PARTY : creates
    USER ||--o{ PARTY_MEMBER : joins
    USER ||--o{ PAYMENT : makes
    USER ||--o{ DEPOSIT : owns
    USER ||--o{ SUBSCRIPTION : subscribes

    PARTY ||--|{ PARTY_MEMBER : has
    PARTY ||--|| PRODUCT : belongs_to
    PARTY ||--o{ PAYMENT : generates

    PRODUCT ||--o{ PARTY : has
    PRODUCT ||--o{ SUBSCRIPTION : offers

    USER {
        bigint user_id PK
        varchar email UK
        varchar password
        varchar nickname
        enum role
        datetime created_at
    }

    PARTY {
        bigint party_id PK
        bigint leader_id FK
        bigint product_id FK
        int max_members
        int current_members
        varchar ott_account_id
        varchar ott_password
        enum status
    }

    PRODUCT {
        bigint product_id PK
        varchar name
        int monthly_price
        int max_share_count
        varchar logo_url
    }

    SUBSCRIPTION {
        bigint subscription_id PK
        bigint user_id FK
        bigint product_id FK
        datetime start_date
        datetime end_date
        enum status
    }

    PAYMENT {
        bigint payment_id PK
        bigint user_id FK
        bigint party_id FK
        int amount
        enum status
        datetime paid_at
    }

    DEPOSIT {
        bigint deposit_id PK
        bigint user_id FK
        int amount
        enum status
    }
```

<br>

---

## 주요 기능

### 1. 파티 매칭 시스템
| 기능 | 설명 |
|------|------|
| 파티 생성 | OTT 선택 → 인원 설정 → 계정 정보 입력 |
| 파티 검색 | OTT별 필터링, 가격순/인원순 정렬 |
| 파티 가입 | 보증금 결제 → 자동 승인 |
| 파티 탈퇴 | 보증금 환불 (위약 시 차감) |

### 2. 구독 관리 시스템
| 기능 | 설명 |
|------|------|
| 상품 조회 | OTT 구독 상품 목록/상세 |
| 구독 신청 | 상품 선택 → 결제 → 구독 시작 |
| 내 구독 관리 | 구독 현황 조회, 정보 수정 |
| 구독 해지 | 해지 신청 → 잔여 기간 후 종료 |

### 3. 결제 시스템
| 기능 | 설명 |
|------|------|
| 빌링키 등록 | 토스페이먼츠 카드 자동결제 |
| 월간 자동결제 | 매월 결제일 자동 청구 (파티 상태 검증 포함) |
| 결제 실패 처리 | 4회 재시도 → 파티 일시정지 (SUSPENDED) |
| 보증금 관리 | 가입 시 납부, 탈퇴 시 환불/몰수 처리 |
| 환불 에러 분류 | 재시도 가능/불가능 에러 자동 분류 |

### 4. 보안 기능
| 기능 | 설명 |
|------|------|
| JWT 인증 | Access + Refresh Token |
| OAuth 2.0 | 카카오, 구글 소셜 로그인 |
| 2FA | TOTP 기반 2단계 인증 |
| 계정 암호화 | OTT 계정 정보 암호화 저장 |

### 5. 고객센터 & 알림
| 기능 | 설명 |
|------|------|
| 공지사항 | 서비스 공지 관리 |
| FAQ | 자주 묻는 질문 |
| 1:1 문의 | 문의 등록 및 답변 |
| 이메일 알림 | 결제, 정산, 공지 알림 |

<br>

---

## 기술 스택

### Frontend
| 기술 | 버전 | 선정 이유 |
|------|------|-----------|
| **React** | 19.2 | 컴포넌트 기반 개발, 대규모 생태계 |
| **Vite** | 7.2 | 빠른 HMR, ESM 기반 번들링 |
| **Tailwind CSS** | 4.1 | 유틸리티 우선, 일관된 디자인 |
| **shadcn/ui** | - | Radix 기반 접근성, 커스터마이징 용이 |
| **Zustand** | 5.0 | 경량 상태관리, Redux 대비 보일러플레이트 감소 |
| **Framer Motion** | 12.x | 선언적 애니메이션, 복잡한 인터랙션 구현 |

### Backend
| 기술 | 버전 | 선정 이유 |
|------|------|-----------|
| **Spring Boot** | 3.5.5 | 엔터프라이즈 표준, 보안 기능 내장 |
| **Java** | 17 | LTS 버전, Record/Pattern Matching 등 |
| **MyBatis** | 3.0 | SQL 직접 제어, 복잡한 쿼리 최적화 |
| **MySQL** | 8.0 | 안정성, 트랜잭션 지원 |
| **JWT** | - | Stateless 인증, 수평 확장 용이 |

### Infrastructure (AWS)
| 서비스 | 용도 |
|--------|------|
| **EC2** | Spring Boot 애플리케이션 서버 |
| **RDS** | MySQL 데이터베이스 |
| **S3** | 정적 파일 저장 (이미지 등) |
| **Route 53** | 도메인 관리 (moamoa.cloud) |

### External Services
| 서비스 | 용도 |
|--------|------|
| 토스페이먼츠 | 결제 처리, 빌링키 발급 |
| Resend | 이메일 발송 (인증, 알림) |
| 오픈뱅킹 | 계좌 인증, 정산 이체 |
| 카카오/구글 | OAuth 소셜 로그인 |

<br>

---

## 프로젝트 구조

```
4beans-moa/
│
├── 4beans-moa-front/                 # Frontend
│   └── src/
│       ├── api/                      # API 통신 (Axios)
│       │   ├── httpClient.js         # 인터셉터, 토큰 갱신
│       │   ├── authApi.js
│       │   ├── partyApi.js
│       │   └── paymentApi.js
│       │
│       ├── components/
│       │   ├── common/               # Header, Footer
│       │   ├── ui/                   # shadcn/ui 컴포넌트
│       │   └── party/                # 파티 관련 컴포넌트
│       │
│       ├── pages/
│       │   ├── party/                # 파티 CRUD
│       │   ├── subscription/         # 구독 관리
│       │   ├── payment/              # 결제 페이지
│       │   ├── user/                 # 회원 관리
│       │   ├── admin/                # 관리자
│       │   ├── community/            # 고객센터
│       │   └── landing/              # 랜딩 페이지
│       │
│       ├── store/                    # Zustand 스토어
│       │   └── authStore.js          # 인증 상태
│       │
│       └── hooks/                    # 커스텀 훅
│
└── 4beans-moa-backend/               # Backend
    └── src/main/java/com/moa/
        ├── web/                      # Controllers
        │   ├── auth/
        │   ├── party/
        │   ├── subscription/
        │   ├── payment/
        │   ├── settlement/
        │   └── community/
        │
        ├── service/                  # Business Logic
        ├── dao/                      # MyBatis Mappers
        ├── domain/                   # Entity
        ├── dto/                      # Request/Response DTO
        ├── config/                   # Security, CORS 등
        └── scheduler/                # 정산 스케줄러
```

<br>

---

## 팀 구성

| 이름 | 역할 | 담당 기능 | GitHub |
|------|------|-----------|--------|
| **육주영** | 팀장 | 회원관리, 어드민, 인증 | [@github](https://github.com/) |
| **박한솔** | Git 관리자 | 파티, 결제, 보증금, 정산 | [@github](https://github.com/) |
| **김진원** | 클라우드 관리자 | 구독상품, AWS 인프라 | [@github](https://github.com/) |
| **김이서** | DBA | 고객센터, 알림, DB 설계 | [@github](https://github.com/) |

<br>

---

## 담당 기능 상세

### 박한솔 - 파티 / 결제 / 보증금 / 정산

#### 구현 기능
- 파티 생성/목록/상세/가입/탈퇴 CRUD
- 토스페이먼츠 빌링키 연동
- 보증금 결제 및 환불 처리
- 월간 자동결제 스케줄러
- 파티장 정산 시스템
- **예외 처리 시스템 (v2.0)**
  - 사용자 탈퇴 이벤트 핸들러
  - 결제 4회 실패 시 파티 SUSPENDED 처리
  - 정산 계좌 미등록 시 PENDING_ACCOUNT 처리
  - 환불 API 에러 분류 및 재시도 로직

#### 기술적 챌린지
- 동시 토큰 갱신 시 Promise Queue 패턴 적용
- 결제 실패 시 재시도 로직 및 파티 일시정지 처리
- Spring Event 기반 사용자 탈퇴 이벤트 처리
- 토스페이먼츠 에러 코드별 재시도 가능 여부 분류

---

### 육주영 - 회원관리 / 어드민

#### 구현 기능
- 회원가입/로그인/로그아웃
- JWT + Refresh Token 인증
- OAuth 2.0 (카카오, 구글)
- 2FA (TOTP) 2단계 인증
- 관리자 대시보드

---

### 김진원 - 구독상품 / AWS 인프라

#### 구현 기능
- 구독 상품 CRUD
- 내 구독 관리 (조회/수정/해지)
- AWS EC2/RDS/S3 구성
- 도메인 연결 (Route 53)

---

### 김이서 - 고객센터 / 알림

#### 구현 기능
- 공지사항 CRUD
- FAQ 관리
- 1:1 문의/답변 시스템
- 이메일 알림 (Resend)
- DB 스키마 설계

<br>

---

## 트러블슈팅

### 1. 동시 토큰 갱신 문제

**문제 상황**
- Access Token 만료 시 여러 API 요청이 동시에 refresh 호출
- 중복 갱신으로 인한 토큰 불일치 발생

**해결 방법**
```javascript
// Promise Queue 패턴 적용
let isTokenRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};
```

**결과**
- 동시 요청 시에도 단일 refresh 호출 보장
- 대기 중인 요청들은 새 토큰으로 자동 재시도

---

### 2. 결제 실패 처리 및 파티 일시정지

**문제 상황**
- 카드 한도 초과, 잔액 부족 등으로 월간 자동결제 실패
- 실패한 결제에 대한 체계적인 처리 로직 필요
- 결제 전 파티 상태 검증 필요 (해산/일시정지 파티 결제 방지)

**해결 방법**
```java
// 1. 결제 전 파티 상태 검증
private boolean isPartyPaymentEligible(Party party) {
    return switch (party.getPartyStatus()) {
        case ACTIVE -> true;  // 정상 이용 중인 파티만 결제
        case RECRUITING, PENDING_PAYMENT, SUSPENDED, DISBANDED, CLOSED -> false;
    };
}

// 2. 4회 결제 실패 시 파티 일시정지
public void suspendPartyOnPaymentFailure(Integer partyId) {
    partyDao.updatePartyStatus(partyId, PartyStatus.SUSPENDED.name());
    // 파티장 및 모든 멤버에게 PARTY_SUSPENDED 푸시 알림
}

// 3. 환불 API 에러 분류 (재시도 가능 여부 판단)
private boolean isRetryableError(String errorCode) {
    return switch (errorCode) {
        case "ALREADY_CANCELED", "INVALID_CANCEL_AMOUNT" -> false;  // 영구 실패
        default -> true;  // 재시도 가능
    };
}
```

**결과**
- 4회 재시도 후에도 실패 시 파티 자동 일시정지
- 결제 처리 중 파티 상태 실시간 검증
- 토스페이먼츠 에러 코드별 자동 분류 및 처리

---

### 3. 사용자 탈퇴 시 파티 처리

**문제 상황**
- 파티장이 탈퇴하면 파티원들은 어떻게 되는가?
- 파티원이 탈퇴하면 보증금은 어떻게 처리되는가?

**해결 방법**
```java
// Spring Event 기반 비동기 처리
@EventListener
@Async
@Transactional
public void handleUserDeleted(UserDeletedEvent event) {
    // 1. 파티장으로서의 파티 처리 (DISBANDED로 변경)
    handleLeaderParties(event.getUserId());

    // 2. 파티원으로서의 멤버십 처리 (보증금 환불)
    handleMemberParties(event.getUserId());
}
```

**결과**
- 파티장 탈퇴 시 파티 자동 해산 + 전체 멤버 보증금 환불
- 파티원 탈퇴 시 보증금 환불 + 파티장에게 알림
- 이벤트 기반 처리로 서비스 간 결합도 감소

<br>

---

## 배운 점

### 기술적 성장
- JWT 기반 인증 시스템의 토큰 갱신 전략 이해
- 결제 시스템 연동 및 빌링키 관리 경험
- Zustand를 활용한 전역 상태 관리 패턴
- AWS 클라우드 인프라 구축 경험

### 협업 경험
- Git Flow 브랜치 전략
- PR 기반 코드 리뷰
- 컴포넌트 설계 시 충돌 방지 규칙 수립
- 역할 분담을 통한 효율적인 협업

<br>

---

## 실행 방법

### 사전 요구사항
- Node.js 18+
- Java 17+
- MySQL 8.0+

### 환경 변수 설정

**Frontend** (`.env`)
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_TOSS_CLIENT_KEY=your_toss_client_key
```

**Backend** (`application.yml`)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/moa
    username: root
    password: your_password

jwt:
  secret: your_jwt_secret

toss:
  secret-key: your_toss_secret_key
```

### 로컬 실행

```bash
# Frontend
cd 4beans-moa-front
npm install
npm run dev

# Backend
cd 4beans-moa-backend
./mvnw spring-boot:run
```

### 배포 환경
- **URL**: [https://www.moamoa.cloud/](https://www.moamoa.cloud/)
- **Infrastructure**: AWS (EC2, RDS, S3, Route 53)

<br>

---

## 라이선스

This project is licensed under the MIT License.
