# Implementation Plan: user-identity-refactor

## Overview

USER_ID를 ULID 기반 순수 식별자로 분리하고, EMAIL을 별도 컬럼으로 관리하도록 데이터 모델과 비즈니스 로직을 리팩토링한다.
구현 순서는 DB 스키마 → 도메인 객체 → 데이터 접근 계층 → 비즈니스 로직 → 프론트엔드 → 테스트 순으로 진행한다.

## Tasks

- [x] 1. 의존성 추가 및 DB 마이그레이션 스크립트 작성
  - [x] 1.1 pom.xml에 ulid-creator 의존성 추가
    - `com.github.f4b6a3:ulid-creator:5.2.3` 의존성을 `4beans-moa-backend/pom.xml`에 추가
    - _Requirements: 1.4_

  - [x] 1.2 Flyway V10 마이그레이션 스크립트 작성
    - `4beans-moa-backend/src/main/resources/db/migration/V10__add_email_column.sql` 파일 생성
    - `ALTER TABLE USERS ADD COLUMN EMAIL VARCHAR(100) NULL UNIQUE;` 추가
    - `UPDATE USERS SET EMAIL = USER_ID WHERE USER_ID LIKE '%@%';` 추가 (기존 이메일 형식 USER_ID 복사)
    - `kakao_*`, `google_*` 형식 USER_ID는 EMAIL = NULL 유지 (기본값)
    - _Requirements: 2.1, 2.2, 2.3, 7.1_

  - [ ]* 1.3 Flyway 마이그레이션 통합 테스트 작성
    - H2 in-memory DB로 V10 마이그레이션 실행 후 EMAIL 컬럼 존재 확인
    - `@` 포함 USER_ID → EMAIL 복사 확인, `kakao_*` → EMAIL = NULL 확인
    - _Requirements: 2.1, 2.2, 2.3_

- [x] 2. User 도메인 객체 및 DTO email 필드 추가
  - [x] 2.1 User.java에 email 필드 추가
    - `private String email;` 필드 추가 (getter/setter 포함)
    - _Requirements: 8.1_

  - [x] 2.2 UserCreateRequest.java 수정
    - `private String email;` 필드 추가 (소셜 가입 시 OAuth 이메일 전달용)
    - `userId` 필드의 `@NotBlank` 어노테이션 제거 (소셜 가입 시 불필요)
    - _Requirements: 8.2_

  - [x] 2.3 UserResponse.java에 email 필드 추가
    - `private String email;` 필드 추가
    - `UserResponse.from(User user)` 팩토리 메서드에서 `email` 필드 포함
    - _Requirements: 8.3_

  - [ ]* 2.4 Property 6 테스트 작성: UserResponse.from() email 필드 노출
    - **Property 6: UserResponse.from()은 User의 email 필드를 그대로 노출한다**
    - 임의 email 값을 가진 User 객체에 대해 `UserResponse.from(user).getEmail() == user.getEmail()` 검증
    - `@Property(tries = 100)` 적용, 태그: `// Feature: user-identity-refactor, Property 6`
    - **Validates: Requirements 8.3**

- [x] 3. UserMapper.xml 및 UserDao.java 수정
  - [x] 3.1 UserMapper.xml resultMap에 email 필드 추가
    - `<result property="email" column="EMAIL" />` 추가
    - _Requirements: 2.5_

  - [x] 3.2 UserMapper.xml insertUser 쿼리에 EMAIL 컬럼 추가
    - INSERT 쿼리에 `EMAIL` 컬럼 및 `#{email}` 값 추가
    - _Requirements: 2.4_

  - [x] 3.3 UserMapper.xml에 findByEmail, existsByEmail 쿼리 추가
    - `findByEmail`: `WHERE EMAIL = #{email}` 조건으로 User 조회
    - `existsByEmail`: `SELECT COUNT(*) FROM USERS WHERE EMAIL = #{email}` 쿼리 추가
    - _Requirements: 6.3_

  - [x] 3.4 UserDao.java에 findByEmail, existsByEmail 메서드 추가
    - `Optional<User> findByEmail(@Param("email") String email);`
    - `int existsByEmail(@Param("email") String email);`
    - _Requirements: 6.3_

  - [ ]* 3.5 Property 5 테스트 작성: findByEmail 조회 정확성
    - **Property 5: EMAIL 컬럼 기준 비밀번호 찾기 조회는 올바른 유저를 반환한다**
    - 임의 이메일로 유저 생성 후 `findByEmail` 호출 시 동일 USER_ID 반환 검증
    - `@Property(tries = 100)` 적용, 태그: `// Feature: user-identity-refactor, Property 5`
    - **Validates: Requirements 6.1, 6.3**

- [x] 4. Checkpoint - 데이터 계층 검증
  - 모든 테스트가 통과하는지 확인하고, 질문이 있으면 사용자에게 문의한다.

- [x] 5. UserAddValidator.java 수정
  - [x] 5.1 일반 가입 검증 로직 수정
    - `validateForSignup`: 이메일 형식 검증 추가 (userId가 이메일 형식인지 확인)
    - `validateEmailDuplicate`: `existsByUserId` → `existsByEmail` 호출로 변경
    - _Requirements: 3.3, 3.4_

  - [x] 5.2 소셜 가입 검증 로직 수정
    - `validateForSocialSignup`: userId 관련 이메일 형식 검증 및 중복 검증 로직 제거
    - _Requirements: 4.3, 4.4_

  - [ ]* 5.3 Property 3 테스트 작성: 이메일 형식 아닌 userId 거부
    - **Property 3: 이메일 형식이 아닌 userId는 일반 가입 검증에서 거부된다**
    - `@` 미포함 또는 형식 불일치 문자열을 userId로 전달 시 `BusinessException` 발생 검증
    - `@Property(tries = 100)` 적용, 태그: `// Feature: user-identity-refactor, Property 3`
    - **Validates: Requirements 3.3**

- [x] 6. UserServiceImpl.java 수정
  - [x] 6.1 addUser() 메서드 ULID 생성 및 email 세팅 로직 수정
    - `UlidCreator.getMonotonicUlid().toString()`으로 신규 USER_ID 생성
    - 일반 가입: `email = request.getUserId()`, 소셜 가입: `email = request.getEmail()` (없으면 null)
    - 요청 본문의 userId 필드를 USER_ID로 사용하지 않도록 변경
    - _Requirements: 1.1, 1.2, 1.3, 3.1, 3.2, 4.1, 4.2_

  - [x] 6.2 startPasswordReset() 메서드 findByEmail 기준으로 변경
    - `userDao.findByUserId(request.getUserId())` → `userDao.findByEmail(request.getUserId())`로 변경
    - 미존재 시 `BusinessException(NOT_FOUND, "사용자를 찾을 수 없습니다.")` 반환
    - _Requirements: 6.1, 6.2_

  - [ ]* 6.3 Property 1 테스트 작성: 신규 가입 USER_ID ULID 형식 검증
    - **Property 1: 신규 가입 시 USER_ID는 항상 ULID 형식이다**
    - 임의 닉네임/이메일/전화번호 조합으로 가입 시 저장된 USER_ID가 26자이고 `[0-9A-HJKMNP-TV-Z]{26}` 패턴 검증
    - 요청 본문의 userId 필드 값과 다름을 검증
    - `@Property(tries = 100)` 적용, 태그: `// Feature: user-identity-refactor, Property 1`
    - **Validates: Requirements 1.1, 1.2, 1.3**

  - [ ]* 6.4 Property 2 테스트 작성: 일반 가입 시 EMAIL 컬럼 저장 검증
    - **Property 2: 일반 가입 시 EMAIL 컬럼에는 요청의 userId 값이 저장된다**
    - 유효한 이메일 형식 userId로 일반 가입 시 저장된 User의 email 필드가 userId와 동일한지 검증
    - `@Property(tries = 100)` 적용, 태그: `// Feature: user-identity-refactor, Property 2`
    - **Validates: Requirements 3.1, 3.2**

  - [ ]* 6.5 Property 4 테스트 작성: 소셜 가입 EMAIL 컬럼 저장 검증
    - **Property 4: 소셜 가입 시 이메일 제공 여부에 따라 EMAIL 컬럼이 올바르게 저장된다**
    - 이메일 있는 소셜 가입 → EMAIL = 해당 이메일, 이메일 없는 소셜 가입 → EMAIL = null 검증
    - `@Property(tries = 100)` 적용, 태그: `// Feature: user-identity-refactor, Property 4`
    - **Validates: Requirements 4.1, 4.2**

- [x] 7. Checkpoint - 백엔드 비즈니스 로직 검증
  - 모든 테스트가 통과하는지 확인하고, 질문이 있으면 사용자에게 문의한다.

- [x] 8. useSignup.js 소셜 가입 페이로드 수정
  - [x] 8.1 소셜 가입 payload에서 userId 필드 제거 및 email 필드 추가
    - 소셜 가입 payload에서 `userId` 필드 제거
    - `email: socialInfo.email || null` 필드 추가
    - payload에 `provider`, `providerUserId`, `email`, `nickname`, `phone`, `agreeMarketing`만 포함
    - _Requirements: 5.1, 5.2_

- [x] 9. 기존 유저 하위 호환성 단위 테스트 작성
  - [ ]* 9.1 기존 이메일 형식 USER_ID 유저의 findByEmail 조회 확인
    - V10 마이그레이션 후 기존 `user@example.com` 형식 USER_ID 유저가 `findByEmail`로 정상 조회되는지 검증
    - _Requirements: 7.2, 7.3_

  - [ ]* 9.2 기존 kakao_* 형식 USER_ID 유저의 EMAIL = NULL 확인
    - V10 마이그레이션 후 `kakao_*` 형식 USER_ID 유저의 EMAIL 컬럼이 NULL인지 검증
    - _Requirements: 7.1, 7.2_

- [x] 10. Final Checkpoint - 전체 통합 검증
  - 모든 테스트가 통과하는지 확인하고, 질문이 있으면 사용자에게 문의한다.

## Notes

- `*` 표시 태스크는 선택 사항으로 MVP 구현 시 건너뛸 수 있음
- Property 테스트는 jqwik (`net.jqwik:jqwik:1.8.2`, 이미 pom.xml 포함)으로 작성
- 각 태스크는 이전 태스크 완료 후 진행 (특히 DB 마이그레이션 → 도메인 객체 → DAO → 서비스 순서 준수)
- 기존 유저의 USER_ID 및 로그인 흐름(`findByUserId`)은 변경하지 않음
