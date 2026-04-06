# Requirements Document

## Introduction

현재 USERS 테이블의 USER_ID는 PK이면서 동시에 이메일 식별자 역할을 겸하고 있다.
소셜 로그인(카카오) 시 이메일을 제공하지 않는 계정의 경우 `kakao_12345678` 형식의 값이
USER_ID에 저장되어, 식별자와 이메일이 혼재하는 구조적 문제가 발생한다.

이 피처는 USER_ID를 순수 식별자(ULID)로 분리하고, EMAIL을 별도 컬럼으로 관리하도록
데이터 모델과 관련 비즈니스 로직을 리팩토링한다.
기존 유저의 USER_ID는 변경하지 않으며, 신규 가입자부터 ULID를 적용한다.

---

## Glossary

- **System**: 본 서비스 백엔드 애플리케이션 전체
- **UserService**: 회원 가입·조회·수정·삭제를 담당하는 서비스 컴포넌트
- **UserAddValidator**: 회원 가입 요청의 유효성을 검증하는 컴포넌트
- **OAuthController**: 소셜 로그인(카카오, 구글) OAuth 콜백 및 연동을 처리하는 컨트롤러
- **UserMapper**: USERS 테이블에 대한 MyBatis SQL 매핑 컴포넌트
- **Flyway**: 데이터베이스 스키마 버전 관리 도구
- **ULID**: Universally Unique Lexicographically Sortable Identifier. 시간순 정렬이 보장되는 26자 식별자 (ulid-creator 라이브러리)
- **일반 회원**: 이메일과 비밀번호로 가입한 사용자
- **소셜 회원**: 카카오 또는 구글 OAuth로 가입한 사용자
- **기존 유저**: 이 마이그레이션 이전에 이미 가입된 사용자 (USER_ID가 이메일 또는 `kakao_*` 형식)
- **신규 유저**: 이 마이그레이션 이후 가입하는 사용자

---

## Requirements

### Requirement 1: ULID 기반 USER_ID 생성

**User Story:** As a 개발자, I want 신규 가입 시 USER_ID가 ULID로 생성되기를, so that 식별자와 이메일이 분리되어 데이터 모델의 일관성이 유지된다.

#### Acceptance Criteria

1. WHEN 신규 일반 회원가입 요청이 수신되면, THE UserService SHALL ulid-creator 라이브러리를 사용하여 26자 ULID를 생성하고 USER_ID로 설정한다.
2. WHEN 신규 소셜 회원가입 요청이 수신되면, THE UserService SHALL ulid-creator 라이브러리를 사용하여 26자 ULID를 생성하고 USER_ID로 설정한다.
3. THE UserService SHALL 요청 본문의 userId 필드 값을 신규 가입자의 USER_ID로 사용하지 않는다.
4. THE System SHALL ulid-creator 의존성을 pom.xml에 포함한다.

---

### Requirement 2: EMAIL 컬럼 분리

**User Story:** As a 개발자, I want USERS 테이블에 EMAIL 컬럼이 별도로 존재하기를, so that 이메일과 식별자가 명확히 분리되어 소셜 회원의 이메일 미제공 케이스를 정상 처리할 수 있다.

#### Acceptance Criteria

1. THE Flyway SHALL V10 마이그레이션 스크립트를 통해 USERS 테이블에 `EMAIL VARCHAR(100) NULL UNIQUE` 컬럼을 추가한다.
2. WHEN V10 마이그레이션이 실행되면, THE Flyway SHALL 기존 USER_ID 값 중 `@` 문자를 포함하는 행의 EMAIL 컬럼에 해당 USER_ID 값을 복사한다.
3. WHEN V10 마이그레이션이 실행되면, THE Flyway SHALL `kakao_` 또는 `google_` 접두사를 가진 USER_ID 행의 EMAIL 컬럼을 NULL로 유지한다.
4. THE UserMapper SHALL insertUser 쿼리에 EMAIL 컬럼을 포함한다.
5. THE UserMapper SHALL resultMap에 email 필드를 포함한다.

---

### Requirement 3: 일반 회원가입 시 EMAIL 저장

**User Story:** As a 일반 회원, I want 가입 시 입력한 이메일이 EMAIL 컬럼에 저장되기를, so that 이메일 기반 조회(비밀번호 찾기 등)가 정상 동작한다.

#### Acceptance Criteria

1. WHEN 일반 회원가입 요청이 수신되면, THE UserService SHALL 요청의 userId 필드 값을 EMAIL 컬럼에 저장한다.
2. WHEN 일반 회원가입 요청이 수신되면, THE UserService SHALL ULID를 생성하여 USER_ID 컬럼에 저장한다.
3. THE UserAddValidator SHALL 일반 회원가입 시 userId 필드가 이메일 형식인지 검증한다.
4. THE UserAddValidator SHALL 일반 회원가입 시 EMAIL 중복 여부를 USERS.EMAIL 컬럼 기준으로 검증한다.

---

### Requirement 4: 소셜 회원가입 시 EMAIL 처리

**User Story:** As a 소셜 회원, I want 이메일 제공 여부와 무관하게 가입이 완료되기를, so that 이메일을 제공하지 않는 카카오 계정도 정상 가입할 수 있다.

#### Acceptance Criteria

1. WHEN 소셜 회원가입 요청에 이메일이 포함된 경우, THE UserService SHALL 해당 이메일을 EMAIL 컬럼에 저장한다.
2. WHEN 소셜 회원가입 요청에 이메일이 없는 경우, THE UserService SHALL EMAIL 컬럼을 NULL로 저장한다.
3. THE UserAddValidator SHALL 소셜 회원가입 시 userId 필드의 이메일 형식 검증을 수행하지 않는다.
4. THE UserAddValidator SHALL 소셜 회원가입 시 userId 필드의 중복 검증을 수행하지 않는다.
5. WHEN 소셜 회원가입 요청의 이메일이 이미 다른 계정의 EMAIL 컬럼에 존재하는 경우, THE UserService SHALL 중복 이메일 오류를 반환한다.

---

### Requirement 5: 프론트엔드 소셜 가입 페이로드 수정

**User Story:** As a 프론트엔드 개발자, I want 소셜 가입 시 userId 필드를 서버로 전송하지 않기를, so that 클라이언트가 임의로 생성한 `kakao_*` 형식의 값이 서버에 전달되지 않는다.

#### Acceptance Criteria

1. WHEN 소셜 회원가입 폼이 제출되면, THE useSignup SHALL provider, providerUserId, nickname, phone, agreeMarketing 필드만 포함한 페이로드를 전송한다.
2. THE useSignup SHALL 소셜 가입 페이로드에 userId 필드를 포함하지 않는다.

---

### Requirement 6: 비밀번호 찾기 EMAIL 컬럼 기준 조회

**User Story:** As a 일반 회원, I want 비밀번호 찾기 시 이메일로 계정을 조회할 수 있기를, so that EMAIL 컬럼 분리 이후에도 비밀번호 재설정 기능이 정상 동작한다.

#### Acceptance Criteria

1. WHEN 비밀번호 재설정 요청이 수신되면, THE UserService SHALL USERS.EMAIL 컬럼을 기준으로 사용자를 조회한다.
2. IF 요청한 이메일에 해당하는 EMAIL 컬럼 값이 존재하지 않으면, THEN THE UserService SHALL NOT_FOUND 오류를 반환한다.
3. THE UserMapper SHALL EMAIL 컬럼으로 사용자를 조회하는 `findByEmail` 쿼리를 제공한다.

---

### Requirement 7: 기존 유저 하위 호환성 유지

**User Story:** As a 기존 유저, I want 마이그레이션 이후에도 기존 USER_ID로 로그인이 가능하기를, so that 서비스 전환 과정에서 기존 계정이 영향을 받지 않는다.

#### Acceptance Criteria

1. THE Flyway SHALL 기존 유저의 USER_ID 값을 변경하지 않는다.
2. WHEN 기존 유저가 로그인하면, THE System SHALL 기존 USER_ID(이메일 또는 `kakao_*` 형식)를 그대로 인증 식별자로 사용한다.
3. WHILE 기존 유저의 USER_ID가 이메일 형식인 경우, THE System SHALL 해당 USER_ID로 비밀번호 찾기 요청을 처리할 수 있다.

---

### Requirement 8: User 도메인 객체 email 필드 추가

**User Story:** As a 백엔드 개발자, I want User 도메인 객체에 email 필드가 추가되기를, so that 서비스 레이어에서 이메일 값을 명시적으로 다룰 수 있다.

#### Acceptance Criteria

1. THE User SHALL email 필드(String 타입)를 포함한다.
2. THE UserCreateRequest SHALL email 필드(String 타입, optional)를 포함한다.
3. THE UserResponse SHALL email 필드를 포함하여 클라이언트에 이메일 정보를 노출한다.
