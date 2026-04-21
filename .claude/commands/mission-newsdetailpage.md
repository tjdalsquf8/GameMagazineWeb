# 뉴스 상세 페이지 — 구현 명세서

## 목표

뉴스 카드 클릭 시 이동하는 상세 페이지.
재작성된 제목 / 한 줄 요약 / 본문 / 태그를 표시한다.
이미지는 1차에서 제외, 추후 thumbnailUrl 연결 시 추가한다.

---

## 라우팅

```
/news/[id]
```

---

## API 명세

### 뉴스 상세 조회

```
GET /news/:id

응답:
{
  id:           string,
  mainCategory: string,   // "PC"
  subCategory:  string,   // "리그오브레전드"
  title:        string,   // 재작성된 제목
  summary:      string,   // 한 줄 요약
  body:         string,   // 재작성된 본문 (문단 구분 \n\n)
  tags:         string[], // ["롤", "패치", "시즌"]
  createdAt:    string,   // ISO 날짜
}
```

---

## 수정할 파일

```
apps/web/src/
└── app/
    └── news/
        └── [id]/
            ├── page.tsx               상세 페이지 (서버 컴포넌트)
            └── _components/
                ├── ArticleHeader.tsx  제목 / 메타 정보
                ├── ArticleBody.tsx    본문
                └── ArticleTags.tsx    태그 목록
```

---

## 구현 상세

### 1. 상세 페이지 (`page.tsx`)

```typescript
// app/news/[id]/page.tsx
// 서버 컴포넌트 — SSG/SSR

import { notFound } from 'next/navigation';
import { ArticleHeader } from './_components/ArticleHeader';
import { ArticleBody } from './_components/ArticleBody';
import { ArticleTags } from './_components/ArticleTags';

interface Article {
  id:           string;
  mainCategory: string;
  subCategory:  string;
  title:        string;
  summary:      string;
  body:         string;
  tags:         string[];
  createdAt:    string;
}

async function fetchArticle(id: string): Promise<Article | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/news/${id}`,
    { next: { revalidate: 3600 } }, // 1시간 캐시
  );
  if (res.status === 404) return null;
  if (!res.ok) return null;
  return res.json();
}

interface Props {
  params: { id: string };
}

export default async function NewsDetailPage({ params }: Props) {
  const article = await fetchArticle(params.id);
  if (!article) notFound();

  return (
    <main>
      <ArticleHeader article={article} />
      <ArticleBody body={article.body} />
      <ArticleTags tags={article.tags} />
    </main>
  );
}

// 존재하지 않는 id → 404 페이지
export const dynamicParams = true;
```

---

### 2. 기사 헤더 (`ArticleHeader.tsx`)

```typescript
// 제목 / 카테고리 뱃지 / 날짜 / 한 줄 요약

interface Article {
  mainCategory: string;
  subCategory:  string;
  title:        string;
  summary:      string;
  createdAt:    string;
}

export function ArticleHeader({ article }: { article: Article }) {
  const date = new Date(article.createdAt).toLocaleDateString('ko-KR', {
    year:  'numeric',
    month: '2-digit',
    day:   '2-digit',
  });

  return (
    <header>
      {/* 카테고리 브레드크럼 */}
      <div>
        <a href="/news">뉴스</a>
        <span>/</span>
        <a href={`/news?mainCategory=${article.mainCategory}`}>
          {article.mainCategory}
        </a>
        <span>/</span>
        <span>{article.subCategory}</span>
      </div>

      {/* 카테고리 뱃지 */}
      <span>{article.subCategory}</span>

      {/* 제목 */}
      <h1>{article.title}</h1>

      {/* 한 줄 요약 */}
      <p>{article.summary}</p>

      {/* 날짜 */}
      <time dateTime={article.createdAt}>{date}</time>
    </header>
  );
}
```

---

### 3. 기사 본문 (`ArticleBody.tsx`)

```typescript
// body는 문단 구분이 \n\n으로 되어있음
// 문단별로 <p> 태그로 분리해서 렌더링

interface Props {
  body: string;
}

export function ArticleBody({ body }: Props) {
  const paragraphs = body
    .split('\n\n')
    .map(p => p.trim())
    .filter(Boolean);

  return (
    <article>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </article>
  );
}
```

---

### 4. 태그 (`ArticleTags.tsx`)

```typescript
interface Props {
  tags: string[];
}

export function ArticleTags({ tags }: Props) {
  if (tags.length === 0) return null;

  return (
    <div>
      {tags.map(tag => (
        <span key={tag}>#{tag}</span>
      ))}
    </div>
  );
}
```

---

## 백엔드 수정 사항

### NewsController 상세 조회 추가

```typescript
// news.controller.ts

@Get(':id')
async getNewsDetail(@Param('id') id: string) {
  const article = await this.newsService.getNewsDetail(id);
  if (!article) throw new NotFoundException();
  return article;
}
```

### NewsService 상세 조회

```typescript
async getNewsDetail(id: string) {
  return this.prisma.news.findUnique({
    where: { id, status: 'PUBLISHED' },
    select: {
      id:           true,
      mainCategory: true,
      subCategory:  true,
      rewrittenTitle:   true,
      rewrittenSummary: true,
      rewrittenBody:    true,
      tags:         true,
      createdAt:    true,
    },
  });
}
```

> DTO에서 rewrittenTitle → title, rewrittenSummary → summary,
> rewrittenBody → body 로 변환해서 반환

---

## 페이지 레이아웃 구성

```
브레드크럼      뉴스 > PC > 리그오브레전드
카테고리 뱃지   [리그오브레전드]
제목            (h1, 크게)
한 줄 요약      (muted 텍스트)
날짜            2026.04.19
─────────────────────────────
이미지 영역     (추후 thumbnailUrl 연결, 현재 생략)
─────────────────────────────
본문            (문단별 <p>)
─────────────────────────────
태그            #롤  #패치  #시즌
```

---

## 체크리스트

```
□ GET /news/:id 백엔드 엔드포인트 추가
□ 응답에 summary, body, tags 포함 확인
□ DTO에서 rewritten 접두사 제거 후 반환 확인
□ body의 \n\n 기준 문단 분리 렌더링 확인
□ 존재하지 않는 id → notFound() 처리 확인
□ 브레드크럼 링크 동작 확인
□ 태그가 없을 때 태그 영역 숨김 처리 확인
```

---

## 이미지 연동 (2차 작업)

```
News 모델에 thumbnailUrl 필드 추가
ArticleHeader 상단에 <Image> 컴포넌트 추가
aspect-video 비율 유지

// 추가될 코드
{article.thumbnailUrl && (
  <Image
    src={article.thumbnailUrl}
    alt={article.title}
    width={800}
    height={450}
  />
)}
```
