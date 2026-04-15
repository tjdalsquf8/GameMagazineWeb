# MISSION: 뉴스 메인페이지 — Frontend Only (Mock Data)

## 운영 원칙

- 중간에 CEO에게 질문하거나 확인을 구하지 않는다
- 모호한 부분은 합리적으로 판단하고 진행, 최종 보고서에 명시
- 완료 후 한 번만 보고
- **이번 미션은 UI 구현만. API 연동 없음. Mock 데이터 사용.**

---

## 기술 스택 컨텍스트

- **Frontend**: Next.js 14 App Router / TypeScript / Tailwind CSS
- **아이콘**: lucide-react (Clock 등)
- **상태관리**: useState (Hero 선택 상태, 카테고리 필터 상태)
- **렌더링**: 추후 ISR (revalidate: 600) 전환 예정 — 컴포넌트 분리 철저히
- **디자인**: 기존 프로젝트 globals.css CSS 변수 기반 (하드코딩 금지)
- **API 연동**: 이번 미션 없음 — Mock 데이터 사용

---

## 1. 기능 개요

게임 매거진 스타일 뉴스 메인페이지.
인벤의 정보 구조 + 매거진의 여백/타이포를 결합한 차별화된 레이아웃.

**카테고리 탭 동작 핵심:**

- 전체 탭: Hero = 통합 1위, 사이드카드 = 각 카테고리 1위
- 특정 카테고리 탭: Hero = 해당 카테고리 1위, 사이드카드 = 2~4위
- 뉴스 그리드: 선택된 카테고리 최신순 필터링
- 인기 기준: 7일간 조회수

---

## 2. 카테고리 구조

```
전체 | PC | 콘솔 | 모바일 | e스포츠

뱃지 색상 (CSS 변수 없는 경우 Tailwind 사용):
- PC:      bg-blue-100   text-blue-800   dark:bg-blue-900   dark:text-blue-200
- 콘솔:    bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200
- 모바일:  bg-green-100  text-green-800  dark:bg-green-900  dark:text-green-200
- e스포츠: bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200
```

---

## 3. 파일 구조

```
apps/web/src/
├── app/(main)/
│   └── page.tsx                    ← 메인페이지 (Server Component)
├── components/news/
│   ├── HeroSection.tsx             ← Hero + 사이드카드 묶음 (Client)
│   ├── HeroMain.tsx                ← 좌측 메인 뷰어
│   ├── HeroSideCard.tsx            ← 우측 사이드카드 단건
│   ├── CategoryFilter.tsx          ← 카테고리 탭 (Client)
│   ├── NewsGrid.tsx                ← 최신 뉴스 그리드
│   ├── NewsCard.tsx                ← 뉴스 카드 단건
│   ├── CategoryBadge.tsx           ← 카테고리 뱃지
│   └── CommunityHotWidget.tsx      ← 커뮤니티 HOT
└── lib/mock/
    └── news.ts                     ← Mock 데이터
```

---

## 4. Mock 데이터 정의

```typescript
// apps/web/src/lib/mock/news.ts

// 카테고리 목록
export const mockCategories = [
  { id: 0, name: "전체", slug: "all" },
  { id: 1, name: "PC", slug: "pc" },
  { id: 2, name: "콘솔", slug: "console" },
  { id: 3, name: "모바일", slug: "mobile" },
  { id: 4, name: "e스포츠", slug: "esports" },
];

// 카테고리별 Top4 뉴스 (7일간 조회수 기준)
// all.top1 = 전체 통합 1위
// pc.top1~4, console.top1~4, mobile.top1~4, esports.top1~4
export const mockHeroNewsByCategory = {
  all: {
    top1: {
      id: 1,
      slug: "t1-lck-final",
      title: 'T1 LCK 스프링 결승 진출 확정 — 페이커 "우승 반드시 가져간다"',
      summary:
        "T1이 LCK 스프링 4강에서 KT를 3:1로 꺾고 결승에 올랐다. 페이커가 세트 MVP를 3번 수상했다.",
      thumbnail: "https://picsum.photos/seed/all1/1200/600",
      category: { id: 4, name: "e스포츠", slug: "esports" },
      viewCount: 49000,
      readTime: 3,
      publishedAt: "2026-04-10T00:00:00.000Z",
    },
    // 사이드카드: 각 카테고리 1위
    sides: [
      {
        id: 11,
        slug: "valorant-tier",
        title: "발로란트 현 시즌 최강 조합 공개 — 레디언트 달성 꿀팁",
        thumbnail: "https://picsum.photos/seed/pc1/400/300",
        category: { id: 1, name: "PC", slug: "pc" },
        viewCount: 39000,
        readTime: 3,
        publishedAt: "2026-04-09T00:00:00.000Z",
      },
      {
        id: 21,
        slug: "switch2-reveal",
        title: "닌텐도 스위치 2 공개 — 출시일·가격·라인업 총정리",
        thumbnail: "https://picsum.photos/seed/con1/400/300",
        category: { id: 2, name: "콘솔", slug: "console" },
        viewCount: 42000,
        readTime: 5,
        publishedAt: "2026-04-08T00:00:00.000Z",
      },
      {
        id: 31,
        slug: "brawlstars-update",
        title: "브롤스타즈 시즌 업데이트 — 신규 브롤러 3종 동시 공개",
        thumbnail: "https://picsum.photos/seed/mob1/400/300",
        category: { id: 3, name: "모바일", slug: "mobile" },
        viewCount: 28000,
        readTime: 2,
        publishedAt: "2026-04-07T00:00:00.000Z",
      },
    ],
  },
  pc: {
    top1: {
      id: 11,
      slug: "valorant-tier",
      title: "발로란트 현 시즌 최강 조합 공개 — 레디언트 달성 꿀팁",
      summary:
        "현 시즌 레디언트 달성률 1위 조합이 공개됐다. 챔버+세이지 조합이 핵심.",
      thumbnail: "https://picsum.photos/seed/pc1/1200/600",
      category: { id: 1, name: "PC", slug: "pc" },
      viewCount: 39000,
      readTime: 3,
      publishedAt: "2026-04-09T00:00:00.000Z",
    },
    sides: [
      {
        id: 12,
        slug: "lol-champion",
        title: "리그오브레전드 신규 챔피언 공개 — 역대급 스킬셋 예고",
        thumbnail: "https://picsum.photos/seed/pc2/400/300",
        category: { id: 1, name: "PC", slug: "pc" },
        viewCount: 35000,
        readTime: 4,
        publishedAt: "2026-04-08T00:00:00.000Z",
      },
      {
        id: 13,
        slug: "overwatch2-season",
        title: "오버워치2 시즌 10 — 신규 영웅 베네사 공식 합류",
        thumbnail: "https://picsum.photos/seed/pc3/400/300",
        category: { id: 1, name: "PC", slug: "pc" },
        viewCount: 21000,
        readTime: 3,
        publishedAt: "2026-04-07T00:00:00.000Z",
      },
      {
        id: 14,
        slug: "starcraft-tournament",
        title: "스타크래프트2 GSL 결승 — 역대 최고 시청자 기록",
        thumbnail: "https://picsum.photos/seed/pc4/400/300",
        category: { id: 1, name: "PC", slug: "pc" },
        viewCount: 18000,
        readTime: 2,
        publishedAt: "2026-04-06T00:00:00.000Z",
      },
    ],
  },
  console: {
    top1: {
      id: 21,
      slug: "switch2-reveal",
      title: "닌텐도 스위치 2 드디어 공개 — 출시일·가격·게임 라인업 총정리",
      summary:
        "닌텐도가 스위치 2를 공식 발표했다. 6월 출시, 449달러. 마리오 카트 신작 동시 출시.",
      thumbnail: "https://picsum.photos/seed/con1/1200/600",
      category: { id: 2, name: "콘솔", slug: "console" },
      viewCount: 42000,
      readTime: 5,
      publishedAt: "2026-04-08T00:00:00.000Z",
    },
    sides: [
      {
        id: 22,
        slug: "ps5-pro-specs",
        title: "PS5 Pro 스펙 유출 — GPU 성능 2배, 4K 120fps 지원",
        thumbnail: "https://picsum.photos/seed/con2/400/300",
        category: { id: 2, name: "콘솔", slug: "console" },
        viewCount: 33000,
        readTime: 3,
        publishedAt: "2026-04-07T00:00:00.000Z",
      },
      {
        id: 23,
        slug: "xbox-gamepass",
        title: "엑스박스 게임패스 4월 신규 타이틀 20개 공개",
        thumbnail: "https://picsum.photos/seed/con3/400/300",
        category: { id: 2, name: "콘솔", slug: "console" },
        viewCount: 19000,
        readTime: 2,
        publishedAt: "2026-04-06T00:00:00.000Z",
      },
      {
        id: 24,
        slug: "sony-vr2",
        title: "소니 PS VR2 신형 출시 임박 — 가격·스펙 공개",
        thumbnail: "https://picsum.photos/seed/con4/400/300",
        category: { id: 2, name: "콘솔", slug: "console" },
        viewCount: 15000,
        readTime: 4,
        publishedAt: "2026-04-05T00:00:00.000Z",
      },
    ],
  },
  mobile: {
    top1: {
      id: 31,
      slug: "brawlstars-update",
      title: "브롤스타즈 시즌 업데이트 — 신규 브롤러 3종 동시 공개",
      summary:
        "수퍼셀이 브롤스타즈 최대 업데이트를 공개했다. 신규 브롤러 3종과 새 게임 모드 추가.",
      thumbnail: "https://picsum.photos/seed/mob1/1200/600",
      category: { id: 3, name: "모바일", slug: "mobile" },
      viewCount: 28000,
      readTime: 2,
      publishedAt: "2026-04-07T00:00:00.000Z",
    },
    sides: [
      {
        id: 32,
        slug: "genshin-natlan",
        title: "원신 5.0 나타 지역 전체 맵 첫 공개",
        thumbnail: "https://picsum.photos/seed/mob2/400/300",
        category: { id: 3, name: "모바일", slug: "mobile" },
        viewCount: 25000,
        readTime: 5,
        publishedAt: "2026-04-06T00:00:00.000Z",
      },
      {
        id: 33,
        slug: "pubgmobile-update",
        title: "배그모바일 역대급 업데이트 — 새 맵·무기 추가",
        thumbnail: "https://picsum.photos/seed/mob3/400/300",
        category: { id: 3, name: "모바일", slug: "mobile" },
        viewCount: 22000,
        readTime: 3,
        publishedAt: "2026-04-05T00:00:00.000Z",
      },
      {
        id: 34,
        slug: "honkai-starrail",
        title: "붕괴: 스타레일 신규 캐릭터 공개 — 출시 일정 확정",
        thumbnail: "https://picsum.photos/seed/mob4/400/300",
        category: { id: 3, name: "모바일", slug: "mobile" },
        viewCount: 18000,
        readTime: 2,
        publishedAt: "2026-04-04T00:00:00.000Z",
      },
    ],
  },
  esports: {
    top1: {
      id: 1,
      slug: "t1-lck-final",
      title: 'T1 LCK 스프링 결승 진출 확정 — 페이커 "우승 반드시 가져간다"',
      summary: "T1이 LCK 스프링 4강에서 KT를 3:1로 꺾고 결승에 올랐다.",
      thumbnail: "https://picsum.photos/seed/all1/1200/600",
      category: { id: 4, name: "e스포츠", slug: "esports" },
      viewCount: 49000,
      readTime: 3,
      publishedAt: "2026-04-10T00:00:00.000Z",
    },
    sides: [
      {
        id: 42,
        slug: "worlds-schedule",
        title: "2026 LoL 월드챔피언십 일정 공개 — 한국 개최 확정",
        thumbnail: "https://picsum.photos/seed/es2/400/300",
        category: { id: 4, name: "e스포츠", slug: "esports" },
        viewCount: 37000,
        readTime: 4,
        publishedAt: "2026-04-09T00:00:00.000Z",
      },
      {
        id: 43,
        slug: "valorant-masters",
        title: "VCT 마스터즈 도쿄 — 한국팀 4강 전원 진출",
        thumbnail: "https://picsum.photos/seed/es3/400/300",
        category: { id: 4, name: "e스포츠", slug: "esports" },
        viewCount: 29000,
        readTime: 3,
        publishedAt: "2026-04-08T00:00:00.000Z",
      },
      {
        id: 44,
        slug: "gsc-final",
        title: "GSC 결승전 — 역대 최고 시청자 200만 돌파",
        thumbnail: "https://picsum.photos/seed/es4/400/300",
        category: { id: 4, name: "e스포츠", slug: "esports" },
        viewCount: 21000,
        readTime: 2,
        publishedAt: "2026-04-07T00:00:00.000Z",
      },
    ],
  },
};

// 최신 뉴스 (발행순, 20개 — 카테고리 필터에 사용)
export const mockLatestNews = [
  // 각 카테고리 5개씩 총 20개, publishedAt 최신순
];
```

---

## 5. 카테고리 탭 동작 명세

```typescript
// CategoryFilter + HeroSection + NewsGrid 공유 상태
// (main)/page.tsx 에서 상태 관리 후 props로 전달

type CategorySlug = "all" | "pc" | "console" | "mobile" | "esports";
const [activeCategory, setActiveCategory] = useState<CategorySlug>("all");

// 탭 클릭 → activeCategory 변경
// → HeroSection: mockHeroNewsByCategory[activeCategory] 데이터로 교체
// → NewsGrid: mockLatestNews 중 해당 카테고리 필터링
//   (all이면 전체, 특정 카테고리면 해당만)
```

---

## 6. Hero 섹션 명세

### 레이아웃

```
┌──────────────────────────────┬──────────────────┐
│                              │  사이드카드 1       │
│   Hero 메인 (7)               ├──────────────────┤
│   현재 선택된 뉴스 표시           │  사이드카드 2       │
│                              ├──────────────────┤
│                              │  사이드카드 3       │
└──────────────────────────────┴──────────────────┘

전체 탭: 메인=자동순환(PC→콘솔→모바일→e스포츠 각 1위, 3초)
         사이드=PC1위, 콘솔1위, 모바일1위, e스포츠1위 (4개)
특정 탭: 메인=해당카테고리 1위 (고정, 자동순환 없음)
         사이드=2위, 3위, 4위
```

### 전체 탭 자동 순환 동작

```typescript
// HeroSection 상태
const autoSlideOrder = ["pc", "console", "mobile", "esports"]; // 순환 순서
const [currentAutoIndex, setCurrentAutoIndex] = useState(0); // 현재 순환 인덱스
const [manualOverride, setManualOverride] = useState(false); // 사이드카드 클릭 여부
const [selectedNews, setSelectedNews] = useState(null); // 사이드카드 클릭 시 선택된 뉴스

// 자동 순환 (전체 탭 + manualOverride가 false일 때만)
useEffect(() => {
  if (activeCategory !== "all" || manualOverride) return;
  const timer = setInterval(() => {
    setCurrentAutoIndex((prev) => (prev + 1) % 4);
  }, 3000);
  return () => clearInterval(timer);
}, [activeCategory, manualOverride]);

// 사이드카드 클릭 시
const handleSideCardClick = (news) => {
  setSelectedNews(news); // 클릭한 뉴스를 Hero로
  setManualOverride(true); // 자동순환 일시 중단
  setTimeout(() => {
    setManualOverride(false); // 10초 후 자동순환 재개
    setSelectedNews(null);
  }, 10000);
};

// Hero에 표시할 뉴스 결정
// 전체 탭:
//   manualOverride=true → selectedNews 표시
//   manualOverride=false → autoSlideOrder[currentAutoIndex] 카테고리의 top1 표시
// 특정 탭:
//   해당 카테고리 top1 고정 표시
```

### 자동 순환 인디케이터 (전체 탭만)

```
Hero 메인 하단에 4개 도트 표시
PC • 콘솔 • 모바일 • e스포츠
현재 순환 중인 카테고리 도트 강조 (primary 색상 + 넓어짐)
사이드카드 클릭 시 해당 카테고리 도트 강조
```

### HeroMain

```
- 이미지: aspect-ratio 16/9, object-cover, rounded-lg
- 슬라이드 전환 시 fade 애니메이션 (opacity transition 300ms)
- 하단 그라데이션 오버레이 (transparent → rgba(0,0,0,0.85))
- 카테고리 뱃지 (CategoryBadge)
- 제목: text-2xl font-medium text-white leading-snug
- 요약: text-sm text-white/75 line-clamp-2 mt-2
- 메타: ⏱ N분 읽기 · N만 조회 (text-xs text-white/60)
- "지금 읽기 →" 버튼: 클릭 시 /news/[slug] 이동
- 전체 클릭 가능 (cursor-pointer)
```

### HeroSideCard

```
- 썸네일 (w-20 h-16) + 우측 정보
- 카테고리 뱃지 + 제목 (line-clamp-2) + 날짜
- 클릭 시: handleSideCardClick(news) 호출
  → Hero 메인 교체 + 자동순환 10초 중단
- 현재 Hero에 표시 중인 뉴스와 같은 카드: border-[var(--color-primary)] border-2
- 미선택: border-[var(--color-border)]
- hover: bg-[var(--color-surface-hover)]
- 전체 탭 사이드카드: 4개 (PC/콘솔/모바일/e스포츠 각 1위)
- 특정 탭 사이드카드: 3개 (2위/3위/4위)
```

---

## 7. 최신 뉴스 그리드 명세

```
- 4열 그리드 (grid-cols-1 sm:grid-cols-2 lg:grid-cols-4)
- activeCategory 기준 필터링 후 최신순 정렬
- 카드 호버: 이미지 scale-105 transition-transform duration-300
- 제목 호버: text-[var(--color-primary)] transition-colors
- 이미지: aspect-ratio 16/9 overflow-hidden
- 카드 정보: CategoryBadge + 제목(line-clamp-2) + ⏱읽기시간 + 조회수 + 날짜
- "더보기 →" 버튼 (추후 구현 예정 — 링크만)
```

---

## 8. 광고 + 커뮤니티 HOT

```
2단 그리드 (grid-cols-2, 모바일: grid-cols-1)

좌: 광고 영역 (336x280) placeholder
    - 점선 border, gray 배경
    - "광고 영역 (336×280)" 텍스트
    - 실제 광고 코드 주석 처리

우: 커뮤니티 HOT
    - 섹션 타이틀 + 더보기 →
    - 순위번호(primary 색상) + 제목 + 조회수
    - 클릭 → /community
```

---

## 9. 디자인 원칙

```
모든 색상: var(--color-*) CSS 변수 사용 (하드코딩 절대 금지)
예외: 카테고리 뱃지 Tailwind 색상 클래스 (dark: prefix 포함)

섹션 타이틀:
  - 좌측 3px primary 색상 세로 bar
  - text-xl font-medium

읽기 시간: Clock 아이콘 (lucide, size=12) + "N분 읽기"
여백: 섹션 간 mt-10 md:mt-14
카드 border-radius: rounded-lg (var(--border-radius-lg))
```

---

## 10. 모바일 처리

```
Hero: 사이드카드 숨김 (md:grid) → 메인만 표시
뉴스 그리드: 1열 → 2열 → 4열 (반응형)
광고+HOT: 세로 배열
카테고리 탭: 가로 스크롤 (overflow-x-auto)
```

---

## 11. 작업 순서 (Frontend Agent 지침)

```
1. lib/mock/news.ts Mock 데이터 생성
2. CategoryBadge.tsx
3. HeroSideCard.tsx
4. HeroMain.tsx
5. HeroSection.tsx (useState — selectedIndex, activeCategory props 수신)
6. CategoryFilter.tsx (activeCategory props + onChange)
7. NewsCard.tsx
8. NewsGrid.tsx
9. CommunityHotWidget.tsx
10. (main)/page.tsx 전체 조합
    - useState(activeCategory) 여기서 관리
    - CategoryFilter, HeroSection, NewsGrid에 props 전달
```

---

## 12. 완료 기준 (Done Criteria)

```
□ 전체 탭: Hero=통합1위, 사이드=각 카테고리 1위 표시
□ PC 탭: Hero=PC 1위, 사이드=PC 2~4위 표시
□ 탭 전환 시 Hero + 사이드카드 + 뉴스 그리드 모두 교체
□ 사이드카드 클릭 → Hero 메인 교체
□ Hero "지금 읽기" 클릭 → /news/[slug] 이동
□ 뉴스 그리드 카테고리 필터링 동작
□ 카드 호버 이미지 확대 + 제목 색상 변경
□ ⏱ N분 읽기 표시
□ 광고 placeholder 표시
□ 커뮤니티 HOT 5개 표시
□ 다크모드 정상 동작 (CSS 변수 기반 확인)
□ 모바일 레이아웃 정상 동작
□ tsc --noEmit 타입 에러 없음
□ pnpm lint 통과
```

---

## 12-updated. 완료 기준 (Done Criteria) — 최종

```
□ 전체 탭: Hero 3초마다 PC→콘솔→모바일→e스포츠 자동 순환
□ 전체 탭: 인디케이터 도트 현재 카테고리 강조
□ 전체 탭: 사이드카드 4개 (각 카테고리 1위) 표시
□ 사이드카드 클릭 → Hero 교체 + 자동순환 10초 중단
□ 10초 후 자동순환 재개 확인
□ 특정 탭: Hero 고정 (자동순환 없음), 사이드카드 3개 (2~4위)
□ 탭 전환 시 Hero + 사이드카드 + 뉴스 그리드 모두 교체
□ Hero 전환 시 fade 애니메이션 동작
□ Hero "지금 읽기" 클릭 → /news/[slug] 이동
□ 뉴스 그리드 카테고리 필터링 동작
□ 카드 호버 이미지 확대 + 제목 색상 변경
□ ⏱ N분 읽기 표시
□ 광고 placeholder 표시
□ 커뮤니티 HOT 5개 표시
□ 다크모드 정상 동작
□ 모바일 레이아웃 정상 동작
□ tsc --noEmit 타입 에러 없음
□ pnpm lint 통과
```
