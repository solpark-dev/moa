# MOA Design Brief

> 이 문서는 MOA 프론트엔드 리디자인의 단일 진실 소스입니다.
> Figma 작업 전 반드시 읽고 모든 결정을 이 문서 기준으로 진행하세요.

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 서비스 | 구독 공유 플랫폼 (넷플릭스, 유튜브 등 파티 모집/참여) |
| 목적 | 포트폴리오용 리디자인 |
| Figma File Key | `gt13K3x9ZBLpfkBgiIbFsc` |
| 로컬 경로 | `D:\Gitcodes\Portfolio\moa\4beans-moa-front` |

---

## 2. 레이아웃 전략

### Mobile-Only (중앙 정렬)

- **최대 너비:** `390px` (iPhone 14 기준)
- 데스크탑 접속 시 중앙 정렬, 좌우 빈 공간은 글래스 배경 처리
- **예외:** Admin 영역만 full-width 허용 (차트/테이블 가독성)

```
데스크탑 뷰:
┌─────────────────────────────────────┐
│  [배경 그라디언트 오브]              │
│       ┌──────────────┐              │
│       │  앱 (390px)  │              │
│       └──────────────┘              │
└─────────────────────────────────────┘
```

---

## 3. 디자인 스타일

**Apple Glassmorphism** — 절제되고 깔끔한 글래스 레이어

### 핵심 원칙
- 배경: 그라디언트 오브(Orb) 위에 글래스 레이어
- 카드: `backdrop-blur-xl` + 반투명 배경 + 미세한 흰 테두리
- 모션: Framer Motion, 부드럽고 물리적인 인터랙션
- 텍스트: 최소화, 계층 명확히

---

## 4. 색상 시스템

### Accent (확정, 추후 대안 검토 가능)

| 역할 | 현재 값 | 대안 후보 |
|------|---------|---------|
| Primary | `#635bff` (Stripe Indigo) | `#7c3aed` (Violet), `#8b5cf6` (Soft Violet) |

> 추후 넷플릭스/유튜브 썸네일과의 충돌을 보고 `#7c3aed`로 전환 검토

### 배경 오브 (확정)

| 오브 | 값 |
|------|-----|
| Orb 1 | `#818cf8` (Indigo-400) |
| Orb 2 | `#c084fc` (Purple-400) |

> 대안: `#a78bfa` + `#7dd3fc` (Soft Violet + Sky — 맑은 WWDC 느낌)

### 글래스 토큰

| 토큰 | Light | Dark |
|------|-------|------|
| `--glass-bg` | `rgba(255,255,255,0.65)` | `rgba(15,23,42,0.75)` |
| `--glass-bg-card` | `rgba(255,255,255,0.5)` | `rgba(30,41,59,0.6)` |
| `--glass-border` | `rgba(255,255,255,0.5)` | `rgba(255,255,255,0.12)` |
| `--glass-blur` | `20px` | `20px` |
| `--glass-bg-overlay` | `rgba(99,91,255,0.08)` | `rgba(99,91,255,0.15)` |

### 기존 Theme 토큰 (유지)

| 토큰 | Light | Dark |
|------|-------|------|
| `--theme-primary` | `#635bff` | `#635bff` |
| `--theme-primary-hover` | `#5851e8` | `#5851e8` |
| `--theme-bg` | `#ffffff` | `#0B1120` |
| `--theme-bg-card` | `#ffffff` | `#1E293B` |
| `--theme-text` | `#111827` | `#f8fafc` |
| `--theme-text-muted` | `#6b7280` | `#94a3b8` |
| `--theme-border` | `#e5e7eb` | `#334155` |
| `--theme-radius` | `1rem` | `1rem` |

---

## 5. 타이포그래피

| 스타일 | 폰트 | Weight | Size |
|--------|------|--------|------|
| Display | Pretendard | Bold (700) | 32px |
| H1 | Pretendard | Bold (700) | 28px |
| H2 | Pretendard | SemiBold (600) | 24px |
| H3 | Pretendard | SemiBold (600) | 20px |
| H4 | Pretendard | Medium (500) | 18px |
| Body LG | Pretendard | Regular (400) | 16px |
| Body MD | Pretendard | Regular (400) | 14px |
| Body SM | Pretendard | Regular (400) | 13px |
| Label | Pretendard | Medium (500) | 12px |
| Caption | Pretendard | Regular (400) | 11px |

---

## 6. 이펙트 스타일 (Shadow)

| 이름 | 값 |
|------|-----|
| `shadow/soft` | `0 1px 3px rgba(0,0,0,0.08)` |
| `shadow/default` | `0 4px 12px rgba(99,91,255,0.1)` |
| `shadow/hover` | `0 8px 24px rgba(99,91,255,0.15)` |
| `shadow/glass` | `0 8px 32px rgba(31,38,135,0.15)` |
| `shadow/glass-dark` | `0 8px 32px rgba(0,0,0,0.4)` |

---

## 7. 컴포넌트 스택

### 유지 (shadcn/ui 기반)
Button, Input, Card, Badge, Avatar, Tabs, Select, Dialog,
Switch, Checkbox, Separator, Skeleton, Toast(Sonner), Tooltip

### 추가 (이미 설치됨)
- **Vaul** — Bottom Sheet (모바일 핵심 패턴)
- **Framer Motion** — 페이지 전환, 글래스 애니메이션
- **Lucide React** — 아이콘 (shadcn 기본)

---

## 8. Figma Variable Collections 계획

> **결정:** Figma Free 요금제 → 컬렉션당 모드 1개 제한
> **전략:** Figma = Light 모드만 디자인. Dark는 코드(CSS variables)로 처리.

| Collection | Mode | 목적 |
|-----------|------|------|
| `Primitives` | Value | 원시 색상값 (blue/500 등) |
| `Color` | Light | shadcn semantic 토큰 (Light only) |
| `Glass` | Light | 글래스모피즘 전용 토큰 (Light only) |
| `Spacing` | Value | 4px 기반 스케일 |
| `Radius` | Value | 테두리 둥글기 스케일 |

### Dark 모드 처리 방식 (코드)
- Figma 토큰명과 CSS variable명을 1:1 매핑
- `global.css`의 `[data-theme="dark"]` 블록에서 동일 토큰명으로 다른 값 지정
- 예: Figma `color/bg/primary` = Light `#ffffff` → Dark `#0B1120` (코드에서만)

---

## 9. Figma 페이지 구조

```
Cover
Getting Started
Foundations / Color
Foundations / Typography
Foundations / Glass Effects
Foundations / Spacing & Radius
---
Components / Button
Components / Input
Components / Card
Components / Badge
Components / Avatar
Components / Navigation Bar
Components / Bottom Navigation
Components / Bottom Sheet
---
Screens / Main
Screens / Auth
Screens / Party List
Screens / Subscription
Screens / MyPage
---
Utilities
```

---

## 10. 빌드 진행 상태

| Phase | 내용 | 상태 |
|-------|------|------|
| Phase 0 | Discovery & Planning | ✅ 완료 |
| Phase 1 | Foundations (Variables + Styles) | ✅ 완료 |
| Phase 2 | File Structure | ✅ 완료 |
| Phase 3 | Components | ✅ 완료 |
| Phase 4 | Screen Templates | ✅ 완료 |
| Phase 5 | Code Handoff | ✅ 완료 |

---

## 11. 세션 간 일관성 유지 규칙

1. 작업 시작 시 이 파일을 먼저 읽는다
2. 색상/스타일 결정이 바뀌면 이 파일을 즉시 업데이트한다
3. Phase 완료 시 섹션 10의 상태를 업데이트한다
4. Figma Variable ID 등 중요한 ID는 `/tmp/dsb-state.json`에 별도 관리
