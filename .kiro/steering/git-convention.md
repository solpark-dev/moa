# Git 브랜치 & 커밋 컨벤션

## 브랜치 전략

솔로 개발 기준으로 **GitHub Flow** 방식을 사용한다.
복잡한 Gitflow 대신 `main` + 작업 브랜치 구조로 단순하게 유지한다.

### 브랜치 구조

```
main                    ← 항상 배포 가능한 상태 유지
├── feat/user-auth      ← 기능 개발
├── fix/session-bug     ← 버그 수정
├── refactor/auth-store ← 리팩토링
└── chore/remove-firebase ← 설정/의존성 변경
```

### 브랜치 네이밍 규칙

```
<type>/<short-description>
```

| type | 용도 |
|------|------|
| `feat` | 새로운 기능 |
| `fix` | 버그 수정 |
| `refactor` | 리팩토링 |
| `chore` | 설정, 의존성, 빌드 |
| `style` | UI/CSS 변경 |
| `docs` | 문서 작성 |
| `test` | 테스트 코드 |
| `hotfix` | 프로덕션 긴급 수정 |

**예시**
```
feat/mypage-profile-edit
fix/session-persistence
refactor/auth-store-cleanup
chore/remove-firebase
hotfix/payment-null-error
```

### 작업 흐름

```bash
# 1. main 최신화
git checkout main
git pull origin main

# 2. 작업 브랜치 생성
git checkout -b feat/기능명

# 3. 작업 후 커밋
git add .
git commit -m "feat(scope): 변경 내용"

# 4. main에 병합
git checkout main
git merge feat/기능명

# 5. 원격 푸시
git push origin main

# 6. 작업 브랜치 삭제
git branch -d feat/기능명
```

---

## 커밋 메시지 컨벤션

### 기본 형식

```
<type>(<scope>): <subject>

[body - 선택사항, 변경 이유나 상세 설명]

[footer - 선택사항, 관련 이슈 번호]
```

### Type

| type | 용도 |
|------|------|
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `refactor` | 기능 변경 없는 코드 개선 |
| `chore` | 빌드, 설정, 의존성 변경 |
| `style` | UI/CSS 변경 (기능 무관) |
| `docs` | 문서 작성/수정 |
| `test` | 테스트 코드 추가/수정 |
| `remove` | 코드/파일 삭제 |
| `hotfix` | 프로덕션 긴급 수정 |

### Scope (이 프로젝트 기준)

| scope | 용도 |
|-------|------|
| `auth` | 인증/세션 관련 |
| `user` | 사용자 관련 |
| `payment` | 결제 관련 |
| `admin` | 관리자 관련 |
| `frontend` | 프론트엔드 전반 |
| `backend` | 백엔드 전반 |
| `infra` | Docker, nginx, 배포 |
| `deps` | 의존성 변경 |

### Subject 규칙

- 한국어 사용
- 50자 이내
- 마침표 없음
- 명령형 현재 시제 (`수정`, `추가`, `제거`, `개선`)

### 예시

```bash
# 기능 추가
feat(auth): 마이페이지 새로고침 세션 유지 기능 추가

# 버그 수정
fix(auth): 페이지 새로고침 시 로그인 풀리는 문제 수정

# 의존성 제거
chore(deps): Firebase 전화번호 인증 의존성 제거

# 리팩토링
refactor(auth): fetchSession 중복 호출 방지 로직 추가

# 여러 파일 변경 시 body 활용
fix(auth): 마이페이지 새로고침 시 세션 유지 안 되는 문제 수정

- authStore fetchSession 에러 처리 개선
- httpClient 쿠키 기반 인증 로깅 추가
- ProtectedRoute 로딩 UI 개선
- useMyPage 중복 세션 복구 호출 제거
```

---

## 자주 쓰는 명령어

```bash
# 브랜치 생성 및 이동
git checkout -b feat/기능명

# 현재 브랜치 확인
git branch

# 변경 파일 확인
git status

# 특정 파일만 스테이징
git add 파일경로

# 커밋
git commit -m "type(scope): 내용"

# 원격 푸시
git push origin 브랜치명

# 브랜치 삭제 (로컬)
git branch -d 브랜치명

# 브랜치 삭제 (원격)
git push origin --delete 브랜치명

# 최근 커밋 수정 (푸시 전에만)
git commit --amend -m "수정된 메시지"
```

---

## 이번 변경사항 커밋 예시

```bash
# 세션 유지 버그 수정 커밋
git add 4beans-moa-front/src/store/authStore.js \
        4beans-moa-front/src/api/httpClient.js \
        4beans-moa-front/src/routes/ProtectedRoute.jsx \
        4beans-moa-front/src/hooks/user/useMyPage.js
git commit -m "fix(auth): 마이페이지 새로고침 시 세션 유지 안 되는 문제 수정"

# Firebase 제거 커밋
git add 4beans-moa-front/src/pages/user/mypage/components/UpdateUserDialog.jsx \
        4beans-moa-front/package.json \
        4beans-moa-front/package-lock.json \
        4beans-moa-backend/src/main/java/com/moa/user/service/UserService.java \
        4beans-moa-backend/src/main/java/com/moa/user/service/impl/UserServiceImpl.java \
        4beans-moa-backend/src/main/java/com/moa/user/controller/UserRestController.java \
        4beans-moa-backend/pom.xml
git commit -m "chore(deps): Firebase 전화번호 인증 제거"

git push origin main
```
