# Admin Dashboard 하드코딩 데이터 실제 API 연동 계획

**작성일**: 2024-12-19
**작성자**: Claude
**대상 파일**: `AdminDashboardPage.jsx`, `AdminDashboardServiceImpl.java`

---

## 1. 현재 상태 분석

### 1.1 이미 실제 데이터로 연동된 항목 (✅ 완료)

| 프론트엔드 항목 | 백엔드 필드 | Mapper 쿼리 |
|----------------|-------------|-------------|
| 총 매출 | `totalRevenue` | `getTotalRevenue` |
| 이번 달 매출 | `thisMonthRevenue` | `getThisMonthRevenue` |
| 이번 달 결제 건수 | `thisMonthPaymentCount` | `getThisMonthPaymentCount` |
| 총 회원 수 | `totalUserCount` | `getTotalUserCount` |
| 오늘 신규 가입 | `todayNewUsers` | `getTodayNewUsers` |
| 활성 파티 수 | `activePartyCount` | `getActivePartyCount` |
| 모집중 파티 수 | `recruitingPartyCount` | `getRecruitingPartyCount` |
| 총 파티 수 | `totalPartyCount` | `getTotalPartyCount` |
| 결제 대기 건수 | `pendingPaymentCount` | `getPendingPaymentCount` |
| 완료된 결제 건수 | `completedPaymentCount` | `getCompletedPaymentCount` |
| 일별 매출 (7일) | `dailyRevenues` | `getDailyRevenues` |
| OTT별 파티 통계 | `ottPartyStats` | `getOttPartyStats` |
| 최근 가입자 (5명) | `recentUsers` | `getRecentUsers` |
| 최근 결제 (5건) | `recentPayments` | `getRecentPayments` |

### 1.2 하드코딩된 항목 (❌ 수정 필요)

| # | 항목 | 파일 위치 | 현재 값 |
|---|------|----------|---------|
| 1 | 실시간 알림 | `AdminDashboardPage.jsx:241-245` | Mock 데이터 3건 |
| 2 | 월별 매출 차트 | `AdminDashboardPage.jsx:342-345` | `[450만, 380만, 520만, 490만, 610만, thisMonthRevenue]` |
| 3 | 주간 사용자 추이 | `AdminDashboardPage.jsx:359-362` | 신규: `[45, 62, 55, ?]`, 활성: `[120, 145, 160, 180]` |
| 4 | 증감률 (Trend) | `AdminDashboardPage.jsx:493,502,511,520,530` | `12%, 8%, 15%, 5%, -3%` |

---

## 2. 리팩토링 상세 계획

### 2.1 월별 매출 차트 (우선순위: 1)

**현재 코드** (`AdminDashboardPage.jsx:342-345`)
```javascript
const monthlyBarSeries = [{
    name: "월 매출",
    data: [4500000, 3800000, 5200000, 4900000, 6100000, safeStats.thisMonthRevenue || 5500000],
}];
```

#### 백엔드 수정

**1. DAO 추가** (`AdminDashboardDao.java`)
```java
List<Map<String, Object>> getMonthlyRevenues();
```

**2. Mapper 추가** (`AdminDashboardMapper.xml`)
```xml
<!-- 최근 6개월 월별 매출 -->
<select id="getMonthlyRevenues" resultType="map">
    SELECT
        DATE_FORMAT(dates.month, '%Y-%m') as month,
        DATE_FORMAT(dates.month, '%m월') as label,
        COALESCE(SUM(p.PAYMENT_AMOUNT), 0) as amount
    FROM (
        SELECT DATE_FORMAT(CURDATE(), '%Y-%m-01') as month
        UNION SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')
        UNION SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 2 MONTH), '%Y-%m-01')
        UNION SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 3 MONTH), '%Y-%m-01')
        UNION SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 4 MONTH), '%Y-%m-01')
        UNION SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 5 MONTH), '%Y-%m-01')
    ) dates
    LEFT JOIN PAYMENT p ON DATE_FORMAT(p.PAYMENT_DATE, '%Y-%m') = DATE_FORMAT(dates.month, '%Y-%m')
        AND p.PAYMENT_STATUS = 'COMPLETED'
    GROUP BY dates.month
    ORDER BY dates.month ASC
</select>
```

**3. Response DTO 추가** (`DashboardStatsResponse.java`)
```java
private List<MonthlyRevenue> monthlyRevenues;

@Getter
@Builder
public static class MonthlyRevenue {
    private String month;   // "2024-12"
    private String label;   // "12월"
    private long amount;
}
```

**4. Service 수정** (`AdminDashboardServiceImpl.java`)
```java
List<MonthlyRevenue> monthlyRevenues = adminDashboardDao.getMonthlyRevenues().stream()
    .map(m -> MonthlyRevenue.builder()
        .month((String) m.get("month"))
        .label((String) m.get("label"))
        .amount(toLong(m.get("amount")))
        .build())
    .collect(Collectors.toList());
```

#### 프론트엔드 수정

**`AdminDashboardPage.jsx`**
```javascript
// Before
const monthlyBarSeries = [{
    name: "월 매출",
    data: [4500000, 3800000, 5200000, 4900000, 6100000, safeStats.thisMonthRevenue || 5500000],
}];

// After
const monthlyRevenues = safeStats.monthlyRevenues || [];
const monthlyBarOptions = {
    // ...
    xaxis: { categories: monthlyRevenues.map(m => m.label) },
};
const monthlyBarSeries = [{
    name: "월 매출",
    data: monthlyRevenues.map(m => m.amount),
}];
```

---

### 2.2 증감률 (Trend) 계산 (우선순위: 2)

**현재 코드** (`AdminDashboardPage.jsx`)
```javascript
<StatCard ... trend={12} />  // 총 매출
<StatCard ... trend={8} />   // 이번 달 매출
<StatCard ... trend={15} />  // 총 회원
<StatCard ... trend={5} />   // 활성 파티
<StatCard ... trend={-3} />  // 오늘 가입
```

#### 백엔드 수정

**1. DAO 추가** (`AdminDashboardDao.java`)
```java
long getLastMonthRevenue();
long getLastMonthUserCount();
long getLastMonthActivePartyCount();
long getYesterdayNewUsers();
```

**2. Mapper 추가** (`AdminDashboardMapper.xml`)
```xml
<!-- 지난 달 매출 -->
<select id="getLastMonthRevenue" resultType="long">
    SELECT COALESCE(SUM(PAYMENT_AMOUNT), 0)
    FROM PAYMENT
    WHERE PAYMENT_STATUS = 'COMPLETED'
      AND YEAR(PAYMENT_DATE) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
      AND MONTH(PAYMENT_DATE) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
</select>

<!-- 지난 달 말 기준 회원 수 -->
<select id="getLastMonthUserCount" resultType="long">
    SELECT COUNT(*)
    FROM USERS
    WHERE REG_DATE < DATE_FORMAT(CURDATE(), '%Y-%m-01')
      AND USER_STATUS != 'WITHDRAWN'
</select>

<!-- 지난 달 활성 파티 수 (현재 기준 근사값) -->
<select id="getLastMonthActivePartyCount" resultType="long">
    SELECT COUNT(*)
    FROM PARTY
    WHERE PARTY_STATUS IN ('ACTIVE', 'CLOSED')
      AND START_DATE < DATE_FORMAT(CURDATE(), '%Y-%m-01')
</select>

<!-- 어제 신규 가입 -->
<select id="getYesterdayNewUsers" resultType="long">
    SELECT COUNT(*)
    FROM USERS
    WHERE DATE(REG_DATE) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
      AND USER_STATUS != 'WITHDRAWN'
</select>
```

**3. Response DTO 추가** (`DashboardStatsResponse.java`)
```java
// 증감률 필드 추가
private Double revenueTrend;        // 전월 대비 매출 증감률
private Double userTrend;           // 전월 대비 회원 증감률
private Double partyTrend;          // 전월 대비 파티 증감률
private Double todayUserTrend;      // 전일 대비 신규가입 증감률
```

**4. Service에서 계산** (`AdminDashboardServiceImpl.java`)
```java
// 증감률 계산 헬퍼 메소드
private Double calculateTrend(long current, long previous) {
    if (previous == 0) return current > 0 ? 100.0 : 0.0;
    return Math.round(((double)(current - previous) / previous) * 1000) / 10.0;
}

// 증감률 계산
long lastMonthRevenue = adminDashboardDao.getLastMonthRevenue();
long lastMonthUserCount = adminDashboardDao.getLastMonthUserCount();
long yesterdayNewUsers = adminDashboardDao.getYesterdayNewUsers();

Double revenueTrend = calculateTrend(thisMonthRevenue, lastMonthRevenue);
Double userTrend = calculateTrend(totalUserCount, lastMonthUserCount);
Double todayUserTrend = calculateTrend(todayNewUsers, yesterdayNewUsers);
```

#### 프론트엔드 수정

**`AdminDashboardPage.jsx`**
```javascript
// Before
<StatCard ... trend={12} />

// After
<StatCard ... trend={safeStats.revenueTrend} />
```

---

### 2.3 주간 사용자 추이 (우선순위: 3)

**현재 코드** (`AdminDashboardPage.jsx:359-362`)
```javascript
const userGrowthSeries = [
    { name: "신규 가입", data: [45, 62, 55, safeStats.todayNewUsers ? safeStats.todayNewUsers * 7 : 78] },
    { name: "활성 사용자", data: [120, 145, 160, 180] },
];
```

#### 백엔드 수정

**1. DAO 추가** (`AdminDashboardDao.java`)
```java
List<Map<String, Object>> getWeeklyNewUsers();
List<Map<String, Object>> getWeeklyActiveUsers();
```

**2. Mapper 추가** (`AdminDashboardMapper.xml`)
```xml
<!-- 최근 4주간 신규 가입자 -->
<select id="getWeeklyNewUsers" resultType="map">
    SELECT
        CONCAT(WEEK(REG_DATE, 1) - WEEK(DATE_SUB(CURDATE(), INTERVAL 3 WEEK), 1) + 1, '주') as week,
        COUNT(*) as count
    FROM USERS
    WHERE REG_DATE >= DATE_SUB(CURDATE(), INTERVAL 4 WEEK)
      AND USER_STATUS != 'WITHDRAWN'
    GROUP BY WEEK(REG_DATE, 1)
    ORDER BY WEEK(REG_DATE, 1) ASC
</select>

<!-- 최근 4주간 활성 사용자 (로그인 기록 기반) -->
<select id="getWeeklyActiveUsers" resultType="map">
    SELECT
        CONCAT(WEEK(LOGIN_DATE, 1) - WEEK(DATE_SUB(CURDATE(), INTERVAL 3 WEEK), 1) + 1, '주') as week,
        COUNT(DISTINCT USER_ID) as count
    FROM LOGIN_HISTORY
    WHERE LOGIN_DATE >= DATE_SUB(CURDATE(), INTERVAL 4 WEEK)
      AND LOGIN_SUCCESS = TRUE
    GROUP BY WEEK(LOGIN_DATE, 1)
    ORDER BY WEEK(LOGIN_DATE, 1) ASC
</select>
```

**3. Response DTO 추가** (`DashboardStatsResponse.java`)
```java
private List<WeeklyUserStats> weeklyNewUsers;
private List<WeeklyUserStats> weeklyActiveUsers;

@Getter
@Builder
public static class WeeklyUserStats {
    private String week;    // "1주", "2주", ...
    private long count;
}
```

#### 프론트엔드 수정

**`AdminDashboardPage.jsx`**
```javascript
// Before
const userGrowthSeries = [
    { name: "신규 가입", data: [45, 62, 55, 78] },
    { name: "활성 사용자", data: [120, 145, 160, 180] },
];

// After
const weeklyNewUsers = safeStats.weeklyNewUsers || [];
const weeklyActiveUsers = safeStats.weeklyActiveUsers || [];

const userGrowthOptions = {
    // ...
    xaxis: { categories: weeklyNewUsers.map(w => w.week) },
};

const userGrowthSeries = [
    { name: "신규 가입", data: weeklyNewUsers.map(w => w.count) },
    { name: "활성 사용자", data: weeklyActiveUsers.map(w => w.count) },
];
```

---

### 2.4 실시간 알림 (우선순위: 4)

**현재 코드** (`AdminDashboardPage.jsx:241-245`)
```javascript
const alerts = useMemo(() => [
    { type: "error", title: "결제 실패", message: "user123 님의 20,000원 결제 실패", time: "5분 전" },
    { type: "warning", title: "만료 예정", message: "Netflix 파티 3개 이번 주 만료", time: "1시간 전" },
    { type: "info", title: "신규 가입", message: "오늘 신규 가입자 15명", time: "3시간 전" },
], []);
```

#### 백엔드 수정

**1. DAO 추가** (`AdminDashboardDao.java`)
```java
List<Map<String, Object>> getRecentFailedPayments();
List<Map<String, Object>> getExpiringParties();
```

**2. Mapper 추가** (`AdminDashboardMapper.xml`)
```xml
<!-- 최근 24시간 결제 실패 내역 -->
<select id="getRecentFailedPayments" resultType="map">
    SELECT
        p.USER_ID as userId,
        p.PAYMENT_AMOUNT as amount,
        TIMESTAMPDIFF(MINUTE, p.PAYMENT_DATE, NOW()) as minutesAgo
    FROM PAYMENT p
    WHERE p.PAYMENT_STATUS = 'FAILED'
      AND p.PAYMENT_DATE >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    ORDER BY p.PAYMENT_DATE DESC
    LIMIT 5
</select>

<!-- 이번 주 만료 예정 파티 -->
<select id="getExpiringParties" resultType="map">
    SELECT
        pr.PRODUCT_NAME as ottName,
        COUNT(*) as count
    FROM PARTY p
    JOIN PRODUCT pr ON p.PRODUCT_ID = pr.PRODUCT_ID
    WHERE p.PARTY_STATUS = 'ACTIVE'
      AND p.END_DATE BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
    GROUP BY pr.PRODUCT_NAME
</select>
```

**3. Response DTO 추가** (`DashboardStatsResponse.java`)
```java
private List<AlertItem> alerts;

@Getter
@Builder
public static class AlertItem {
    private String type;      // "error", "warning", "info"
    private String title;
    private String message;
    private String time;      // "5분 전", "1시간 전"
}
```

**4. Service에서 알림 생성** (`AdminDashboardServiceImpl.java`)
```java
private List<AlertItem> generateAlerts() {
    List<AlertItem> alerts = new ArrayList<>();

    // 1. 결제 실패 알림
    List<Map<String, Object>> failedPayments = adminDashboardDao.getRecentFailedPayments();
    for (Map<String, Object> fp : failedPayments) {
        alerts.add(AlertItem.builder()
            .type("error")
            .title("결제 실패")
            .message(fp.get("userId") + " 님의 " + formatAmount(fp.get("amount")) + " 결제 실패")
            .time(formatTimeAgo(toLong(fp.get("minutesAgo"))))
            .build());
    }

    // 2. 만료 예정 알림
    List<Map<String, Object>> expiringParties = adminDashboardDao.getExpiringParties();
    for (Map<String, Object> ep : expiringParties) {
        alerts.add(AlertItem.builder()
            .type("warning")
            .title("만료 예정")
            .message(ep.get("ottName") + " 파티 " + ep.get("count") + "개 이번 주 만료")
            .time("이번 주")
            .build());
    }

    // 3. 신규 가입 알림
    long todayUsers = adminDashboardDao.getTodayNewUsers();
    if (todayUsers > 0) {
        alerts.add(AlertItem.builder()
            .type("info")
            .title("신규 가입")
            .message("오늘 신규 가입자 " + todayUsers + "명")
            .time("오늘")
            .build());
    }

    return alerts.stream().limit(5).collect(Collectors.toList());
}

private String formatTimeAgo(long minutes) {
    if (minutes < 60) return minutes + "분 전";
    if (minutes < 1440) return (minutes / 60) + "시간 전";
    return (minutes / 1440) + "일 전";
}

private String formatAmount(Object amount) {
    return String.format("%,d원", toLong(amount));
}
```

#### 프론트엔드 수정

**`AdminDashboardPage.jsx`**
```javascript
// Before
const alerts = useMemo(() => [
    { type: "error", title: "결제 실패", ... },
    ...
], []);

// After
const alerts = safeStats.alerts || [];
```

---

## 3. 파일 수정 요약

### 백엔드 (4개 파일)

| 파일 | 수정 내용 |
|------|----------|
| `AdminDashboardDao.java` | 6개 메소드 추가 |
| `AdminDashboardMapper.xml` | 6개 쿼리 추가 |
| `DashboardStatsResponse.java` | 5개 필드 + 3개 inner class 추가 |
| `AdminDashboardServiceImpl.java` | 데이터 조회 및 계산 로직 추가 |

### 프론트엔드 (1개 파일)

| 파일 | 수정 내용 |
|------|----------|
| `AdminDashboardPage.jsx` | 하드코딩 값을 API 데이터로 교체 |

---

## 4. 작업 순서

```
Phase 1: 월별 매출 차트
├── 백엔드: Mapper 쿼리 추가
├── 백엔드: DTO, Service 수정
└── 프론트: 차트 데이터 연동

Phase 2: 증감률 계산
├── 백엔드: 비교 데이터 쿼리 추가
├── 백엔드: 증감률 계산 로직 추가
└── 프론트: StatCard trend 연동

Phase 3: 주간 사용자 추이
├── 백엔드: 주간 통계 쿼리 추가
├── 백엔드: DTO, Service 수정
└── 프론트: 차트 데이터 연동

Phase 4: 실시간 알림
├── 백엔드: 알림 데이터 쿼리 추가
├── 백엔드: 알림 생성 로직 구현
└── 프론트: 알림 섹션 연동
```

---

## 5. 테스트 체크리스트

### 백엔드 테스트
- [ ] 월별 매출 쿼리 - 6개월 데이터 정상 조회
- [ ] 증감률 계산 - 0으로 나누기 예외 처리
- [ ] 주간 통계 - 데이터 없는 주 처리
- [ ] 알림 생성 - 빈 결과 처리

### 프론트엔드 테스트
- [ ] 데이터 로딩 중 스켈레톤/로딩 표시
- [ ] API 에러 시 fallback 값 표시
- [ ] 빈 데이터 시 "데이터 없음" 표시
- [ ] 차트 애니메이션 정상 동작

### 통합 테스트
- [ ] 대시보드 페이지 전체 로딩 시간 < 2초
- [ ] 모든 차트 데이터 정상 렌더링
- [ ] 실시간 알림 정상 표시

---

## 6. 추후 개선 사항 (Optional)

1. **캐싱 적용**: 대시보드 데이터 Redis 캐싱 (TTL: 5분)
2. **실시간 업데이트**: WebSocket으로 알림 실시간 푸시
3. **기간 필터 확장**: 일별 매출 기간 선택 (7일/30일/90일)
4. **CSV 내보내기**: 통계 데이터 다운로드 기능
