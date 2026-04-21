# 뉴스 메인페이지 — 프론트엔드 API 연동 명세서

## 목표

현재 mock 데이터로 렌더링 중인 뉴스 메인페이지를
실제 백엔드 API 데이터로 교체한다.

**1차 연동 범위 (이번 작업)**

- 제목(title)
- 카테고리(subCategory)
- 날짜(createdAt)
- 이미지 없음

**2차 연동 (뉴스 상세 페이지 작업 시)**

- 한 줄 요약(summary)
- 태그(tags)
- 본문(body)
- 이미지(thumbnailUrl)

---

## 현재 상태

```
현재: mock 데이터 (하드코딩된 배열)
목표: GET /news API 응답 데이터로 교체
```

---

## API 명세

### 뉴스 목록 조회

```
GET /news

Query Parameters:
  mainCategory  string   "PC" | "Mobile" | "Console" | "Esports"  (없으면 전체)
  subCategory   string   "리그오브레전드" | "원신" 등              (없으면 전체)
  page          number   기본값 1
  limit         number   기본값 20
```

**응답 (목록용 — 1차)**

```typescript
{
  data: [
    {
      id:           string,  // "clxxx..."
      mainCategory: string,  // "PC"
      subCategory:  string,  // "리그오브레전드"
      title:        string,  // 재작성된 제목
      createdAt:    string,  // "2026-04-19T09:00:00.000Z"
    }
  ],
  meta: {
    total: number,  // 전체 기사 수
    page:  number,
    limit: number,
  }
}
```

> summary, tags, body는 상세 페이지 API에서 반환 (2차 작업)

---

## 수정할 파일

```
apps/web/src/
└── app/
    └── news/
        ├── page.tsx                    ← 메인 진입점 (서버 컴포넌트)
        ├── _components/
        │   ├── NewsGrid.tsx            ← 카드 그리드
        │   ├── NewsCard.tsx            ← 개별 카드
        │   ├── CategoryTabs.tsx        ← 대분류 탭
        │   └── SubCategoryFilter.tsx   ← 소분류 필터
        └── _hooks/
            └── useNewsQuery.ts         ← 데이터 fetching (클라이언트용)
```

---

## 구현 상세

### 1. 카테고리 상수 정의

```typescript
// apps/web/src/constants/categories.ts

export const MAIN_CATEGORIES = [
  "전체",
  "PC",
  "콘솔",
  "모바일",
  "Esports",
] as const;
export type MainCategoryTab = (typeof MAIN_CATEGORIES)[number];

// 화면 탭 텍스트 → API 파라미터 변환
export const MAIN_CATEGORY_MAP: Record<string, string> = {
  전체: "",
  PC: "PC",
  콘솔: "Console",
  모바일: "Mobile",
  Esports: "Esports",
};

// 대분류별 소분류 목록
export const SUB_CATEGORIES: Record<string, string[]> = {
  PC: [
    "전체",
    "리그오브레전드",
    "발로란트",
    "오버워치",
    "배틀그라운드",
    "로스트아크",
    "메이플스토리",
    "던전앤파이터",
    "디아블로",
    "붉은사막",
    "기타 PC",
  ],
  Console: [
    "전체",
    "파이널판타지",
    "GTA",
    "젤다",
    "몬스터헌터",
    "붉은사막",
    "기타 콘솔",
  ],
  Mobile: [
    "전체",
    "원신",
    "붕괴: 스타레일",
    "워스텔링",
    "배틀그라운드 모바일",
    "리니지M",
    "나혼자만레벨업",
    "메이플스토리M",
    "승리의 여신: 니케",
    "기타 모바일",
  ],
  Esports: ["전체", "LCK", "VCT", "기타 Esports"],
};
```

---

### 2. 메인 페이지 (`page.tsx`)

```typescript
// app/news/page.tsx
// 서버 컴포넌트 — 초기 데이터 SSR

import { CategoryTabs } from './_components/CategoryTabs';
import { NewsGrid } from './_components/NewsGrid';

interface PageProps {
  searchParams: {
    mainCategory?: string;
    subCategory?: string;
    page?: string;
  };
}

interface NewsArticle {
  id: string;
  mainCategory: string;
  subCategory: string;
  title: string;
  createdAt: string;
}

interface NewsResponse {
  data: NewsArticle[];
  meta: { total: number; page: number; limit: number };
}

async function fetchNews(params: PageProps['searchParams']): Promise<NewsResponse> {
  const query = new URLSearchParams();
  if (params.mainCategory) query.set('mainCategory', params.mainCategory);
  if (params.subCategory)  query.set('subCategory',  params.subCategory);
  if (params.page)         query.set('page',          params.page);
  query.set('limit', '20');

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/news?${query}`,
    { next: { revalidate: 300 } }, // 5분 캐시
  );

  if (!res.ok) return { data: [], meta: { total: 0, page: 1, limit: 20 } };
  return res.json();
}

export default async function NewsPage({ searchParams }: PageProps) {
  const newsData = await fetchNews(searchParams);

  return (
    <main>
      <CategoryTabs
        activeMain={searchParams.mainCategory ?? ''}
        activeSub={searchParams.subCategory ?? ''}
      />
      <NewsGrid
        articles={newsData.data}
        meta={newsData.meta}
      />
    </main>
  );
}
```

---

### 3. 카테고리 탭 (`CategoryTabs.tsx`)

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { MAIN_CATEGORIES, MAIN_CATEGORY_MAP, SUB_CATEGORIES } from '@/constants/categories';

interface Props {
  activeMain: string;
  activeSub:  string;
}

export function CategoryTabs({ activeMain, activeSub }: Props) {
  const router = useRouter();

  const handleMainClick = (tab: string) => {
    const params = new URLSearchParams();
    const apiValue = MAIN_CATEGORY_MAP[tab];
    if (apiValue) params.set('mainCategory', apiValue);
    router.push(`/news?${params}`);
  };

  const handleSubClick = (sub: string) => {
    const params = new URLSearchParams();
    if (activeMain) params.set('mainCategory', activeMain);
    if (sub !== '전체') params.set('subCategory', sub);
    router.push(`/news?${params}`);
  };

  const subList = SUB_CATEGORIES[activeMain] ?? [];

  return (
    <div>
      {/* 대분류 탭 */}
      <div>
        {MAIN_CATEGORIES.map(tab => (
          <button
            key={tab}
            onClick={() => handleMainClick(tab)}
            data-active={MAIN_CATEGORY_MAP[tab] === activeMain}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 소분류 필터 — 대분류 선택 시만 노출 */}
      {subList.length > 0 && (
        <div>
          {subList.map(sub => (
            <button
              key={sub}
              onClick={() => handleSubClick(sub)}
              data-active={sub === (activeSub || '전체')}
            >
              {sub}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

### 4. 뉴스 카드 (`NewsCard.tsx`)

```typescript
// 1차: 제목 / 카테고리 / 날짜만 표시
// 이미지 영역은 회색 placeholder 유지 (2차 작업에서 thumbnailUrl 연결)

interface NewsArticle {
  id:           string;
  mainCategory: string;
  subCategory:  string;
  title:        string;
  createdAt:    string;
}

export function NewsCard({ article }: { article: NewsArticle }) {
  const date = new Date(article.createdAt).toLocaleDateString('ko-KR', {
    month: '2-digit',
    day:   '2-digit',
  });

  return (
    <a href={`/news/${article.id}`}>

      {/* 이미지 placeholder — 2차 작업 시 <Image> 로 교체 */}
      <div className="aspect-video bg-gray-100 rounded-lg" />

      {/* 카테고리 뱃지 */}
      <span>{article.subCategory}</span>

      {/* 제목 */}
      <h3>{article.title}</h3>

      {/* 날짜 */}
      <span>{date}</span>

    </a>
  );
}
```

---

### 5. 뉴스 그리드 (`NewsGrid.tsx`)

```typescript
import { NewsCard } from './NewsCard';

interface NewsArticle {
  id:           string;
  mainCategory: string;
  subCategory:  string;
  title:        string;
  createdAt:    string;
}

interface Props {
  articles: NewsArticle[];
  meta:     { total: number; page: number; limit: number };
}

export function NewsGrid({ articles, meta }: Props) {
  if (articles.length === 0) {
    return (
      <div>
        <p>아직 뉴스가 없습니다.</p>
      </div>
    );
  }

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {articles.map(article => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      {/* 더보기 — 전체 수보다 적을 때만 노출 */}
      {meta.total > meta.page * meta.limit && (
        <div>
          <a href={`?page=${meta.page + 1}`}>더보기 →</a>
        </div>
      )}
    </section>
  );
}
```

---

## 환경 변수

```env
# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001   # 개발
NEXT_PUBLIC_API_URL=https://api.yourdomain.com  # 배포
```

---

## Mock 데이터 교체 체크리스트

```
□ NEXT_PUBLIC_API_URL 환경변수 설정
□ 기존 mock 데이터 import 제거
□ page.tsx → fetchNews() 함수로 교체
□ NewsArticle 타입 필드 확인 (id, mainCategory, subCategory, title, createdAt)
□ CategoryTabs URL params 동작 확인
□ 빈 데이터일 때 UI 처리 확인
□ 백엔드 CORS 설정 확인 (웹 도메인 허용)
□ categories.ts 소분류 목록 mock과 다른 항목 교체 확인
  (쿠키런 제거, 붕괴:스타레일/워스텔링/승리의여신:니케 추가)
```

---

## 확인 순서

```
1. 백엔드 실행 후 API 직접 호출해서 응답 확인
   curl http://localhost:3001/news

2. 전체 탭 — 모든 카테고리 기사 나오는지

3. 모바일 탭 클릭 — Mobile 기사만 필터되는지

4. 소분류(원신 등) 클릭 — 해당 게임 기사만 나오는지

5. 제목이 재작성된 우리 스타일인지 확인

6. 날짜 포맷 확인 (04.19 형식)
```

---

## 2차 작업 예고 (뉴스 상세 페이지)

```
GET /news/:id 응답에 추가될 필드:
  summary      — 카드 하단 한 줄 요약 노출
  tags         — 태그 칩 노출
  body         — 본문 전체
  thumbnailUrl — 이미지 (추후 RSS에서 수집 추가)
```
