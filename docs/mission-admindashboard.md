# 어드민 페이지 — 구현 명세서

## 목표

뉴스 자동화 파이프라인을 모니터링하고 제어하는 관리자 전용 페이지.
Next.js `/admin` 경로에 추가. 별도 서비스 없이 기존 스택 사용.

---

## 페이지 구조

```
/admin
├── /dashboard     대시보드 (현황 모니터링)
├── /pipeline      파이프라인 제어 및 로그
├── /articles      기사 관리
└── /sources       RSS 소스 관리
```

---

## 접근 제한

```typescript
// middleware.ts — 어드민 경로 보호
// JWT 토큰에서 role 확인, ADMIN이 아니면 /로 리다이렉트

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const token = request.cookies.get("token")?.value;
    const payload = verifyToken(token);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}
```

---

## API 엔드포인트 (백엔드 추가 필요)

```
GET  /admin/stats                  대시보드 지표
GET  /admin/pipeline/logs          파이프라인 실행 로그 목록
POST /admin/pipeline/run           수동 실행
POST /admin/pipeline/pause         일시정지
POST /admin/pipeline/resume        재개
GET  /admin/sources                소스 목록
PUT  /admin/sources/:id/toggle     on/off 토글
GET  /admin/articles               기사 목록 (필터/페이지)
PUT  /admin/articles/:id/hide      숨기기
PUT  /admin/articles/:id/show      다시 보이기
POST /admin/articles/:id/retry     재작성 재시도
```

---

## 수정할 파일

```
apps/web/src/
└── app/
    └── admin/
        ├── layout.tsx                  어드민 공통 레이아웃 (사이드바)
        ├── dashboard/
        │   └── page.tsx                대시보드
        ├── pipeline/
        │   └── page.tsx                파이프라인 제어
        ├── articles/
        │   └── page.tsx                기사 관리
        └── sources/
            └── page.tsx                소스 관리
```

---

## 1. 대시보드 (`/admin/dashboard`)

### API

```
GET /admin/stats

응답:
{
  today: {
    collected:   number,  // 오늘 수집 건수
    saved:       number,  // 저장 성공
    skipped:     number,  // 중복 스킵
    failed:      number,  // 재작성 실패
    successRate: number,  // 성공률 (%)
  },
  apiCost: {
    today:       number,  // 오늘 비용 ($)
    thisMonth:   number,  // 이번 달 누적 ($)
  },
  totalArticles: number,  // 전체 누적 기사 수
  byCategory: {
    PC:      number,
    Mobile:  number,
    Console: number,
    Esports: number,
  },
  pipelineStatus: "running" | "paused",
  lastRunAt:      string,  // ISO 날짜
}
```

### UI 구성

```
상단 액션바
  ├── 마지막 수집 시각
  ├── [수집 일시정지] 버튼  → POST /admin/pipeline/pause
  └── [지금 수집 실행] 버튼 → POST /admin/pipeline/run

지표 카드 (4개)
  ├── 오늘 수집: N건
  ├── 재작성 성공률: N%
  ├── 이번 달 API 비용: $N
  └── 전체 기사: N건

카테고리별 수집량 막대 그래프
  └── PC / Mobile / Console / Esports

소스 상태 카드
  └── 소스별 마지막 수집 시각 + on/off 상태

파이프라인 실행 로그 (최근 5건)
  └── 완료/경고/실패 상태 + 시각

최근 발행 기사 목록 (최근 10건)
  └── 제목 / 카테고리 / 시각 / [숨기기] 버튼
```

---

## 2. 파이프라인 (`/admin/pipeline`)

### API

```
GET /admin/pipeline/logs?page=1&limit=50

응답:
{
  data: [
    {
      id:        string,
      status:    "success" | "warning" | "error",
      message:   string,   // "오전 수집 — 47건 저장, 83건 스킵"
      savedCount:  number,
      skippedCount: number,
      failedCount:  number,
      runAt:     string,
    }
  ],
  meta: { total, page, limit }
}
```

### UI 구성

```
상단 제어 패널
  ├── 현재 상태: 실행 중 / 일시정지
  ├── 스케줄: 매일 09:00 / 15:00 / 21:00 (KST)
  ├── [지금 실행] 버튼
  └── [일시정지 / 재개] 토글 버튼

실행 로그 테이블
  컬럼: 상태 / 내용 / 저장 / 스킵 / 실패 / 실행 시각
  상태별 색상:
    success → 초록
    warning → 노랑 (일부 실패)
    error   → 빨강 (전체 실패)
```

---

## 3. 기사 관리 (`/admin/articles`)

### API

```
GET /admin/articles?mainCategory=PC&status=PUBLISHED&page=1&limit=30

응답:
{
  data: [
    {
      id:           string,
      mainCategory: string,
      subCategory:  string,
      title:        string,     // 재작성된 제목
      originalTitle: string,    // 원문 제목
      sourceName:   string,     // "게임메카"
      status:       "PUBLISHED" | "HIDDEN",
      classifyMethod: "keyword" | "claude",
      createdAt:    string,
    }
  ],
  meta: { total, page, limit }
}

PUT /admin/articles/:id/hide   → { status: "HIDDEN" }
PUT /admin/articles/:id/show   → { status: "PUBLISHED" }
POST /admin/articles/:id/retry → 재작성 재시도 후 { success: boolean }
```

### UI 구성

```
필터 바
  ├── 대분류 탭 (전체 / PC / Mobile / Console / Esports)
  ├── 상태 필터 (전체 / 발행 / 숨김 / 실패)
  └── 소스 필터 (전체 / 게임메카 / Push Square / ...)

기사 테이블
  컬럼:
    제목 (재작성)      클릭 시 상세 페이지로 이동
    원문 제목          회색으로 표시
    카테고리           대분류 > 소분류
    소스               "게임메카"
    분류 방법          "키워드" | "Claude"
    상태               발행 / 숨김 / 실패
    날짜
    관리               [숨기기] / [보이기] / [재시도] 버튼

  실패 기사 → 빨간 배경으로 하이라이트
  숨김 기사 → 회색으로 표시
```

---

## 4. 소스 관리 (`/admin/sources`)

### API

```
GET /admin/sources

응답:
{
  data: [
    {
      id:          string,
      name:        string,   // "게임메카"
      url:         string,
      language:    "ko" | "en",
      isActive:    boolean,
      lastFetchAt: string,
      lastCount:   number,   // 마지막 수집 건수
    }
  ]
}

PUT /admin/sources/:id/toggle
요청: { isActive: boolean }
```

### UI 구성

```
소스 목록 카드
  각 소스마다:
    소스 이름 + 언어 뱃지 (KO / EN)
    URL
    마지막 수집 시각 + 수집 건수
    on/off 토글 스위치
```

---

## 백엔드 추가 작업

### Prisma 스키마 추가

```prisma
// 파이프라인 실행 로그
model PipelineLog {
  id           String   @id @default(cuid())
  status       String   // "success" | "warning" | "error"
  message      String
  savedCount   Int      @default(0)
  skippedCount Int      @default(0)
  failedCount  Int      @default(0)
  runAt        DateTime @default(now())
}

// RSS 소스 (DB로 관리)
model NewsSource {
  id          String    @id @default(cuid())
  name        String
  url         String    @unique
  language    String    // "ko" | "en"
  isActive    Boolean   @default(true)
  lastFetchAt DateTime?
  lastCount   Int       @default(0)
  createdAt   DateTime  @default(now())
}
```

### NestJS 어드민 모듈 추가

```
apps/api/src/
└── admin/
    ├── admin.module.ts
    ├── admin.controller.ts   GET/POST 엔드포인트
    └── admin.service.ts      stats 집계, 로그 조회 등
```

---

## 구현 순서

```
1. Prisma 스키마에 PipelineLog, NewsSource 추가 및 마이그레이션
2. NewsSource를 하드코딩 상수 대신 DB에서 불러오도록 변경
3. 파이프라인 실행 시 PipelineLog 기록
4. NestJS admin 모듈 + 엔드포인트 구현
5. Next.js /admin 레이아웃 (사이드바) 구현
6. 대시보드 → 파이프라인 → 기사 관리 → 소스 관리 순으로 구현
```

---

## 주의사항

```
- /admin 경로 전체 middleware로 ADMIN 권한 체크
- 어드민 API 엔드포인트도 백엔드에서 Guard로 보호
- [지금 실행] 버튼은 중복 실행 방지 (실행 중이면 비활성화)
- 재시도 버튼은 실패 기사에만 노출
```
