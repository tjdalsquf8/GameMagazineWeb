# 뉴스 자동 수집 · 재작성 파이프라인 — 백엔드 구현 명세서

## 개요

게임 매거진 웹서비스의 뉴스 자동화 시스템.
RSS 피드에서 게임 뉴스를 수집하고, Claude API로 카테고리 분류 및 재작성 후 DB에 저장한다.
프론트엔드는 저장된 데이터를 API로 조회한다.

---

## 전체 흐름

```
스케줄러 (하루 3회: 09:00 / 15:00 / 21:00)
        ↓
RSS 수집 (게임메카 등 소스별 피드 파싱)
        ↓
중복 체크 (원문 URL 기준으로 DB에 이미 있으면 스킵)
        ↓
카테고리 분류
  - 1단계: 소분류 게임명 키워드 매칭
  - 2단계: 미분류만 Claude API로 판단
        ↓
Claude API 재작성
  (제목 + 요약 + 본문 + 태그 생성)
        ↓
DB 저장 (PostgreSQL)
        ↓
프론트 API 호출 시 응답 (Next.js)
```

---

## 파일 구조

```
apps/api/src/
└── news/
    ├── news.module.ts
    ├── news.controller.ts         # 프론트 API 엔드포인트
    ├── news.service.ts            # 비즈니스 로직
    ├── news.scheduler.ts          # 스케줄러 (하루 3회)
    ├── dto/
    │   ├── news-response.dto.ts
    │   └── news-list-query.dto.ts
    ├── pipeline/
    │   ├── rss-collector.ts       # RSS 수집
    │   ├── category-classifier.ts # 카테고리 분류
    │   └── article-rewriter.ts    # Claude API 재작성
    └── constants/
        ├── feed-sources.ts        # RSS 소스 목록
        └── category-keywords.ts   # 분류 키워드 사전
```

---

## DB 스키마

```prisma
// prisma/schema.prisma 에 추가

model News {
  id                String    @id @default(cuid())

  // 원문 정보
  originalTitle     String
  originalLink      String    @unique   // 중복 체크 기준
  originalPubDate   DateTime?
  sourceName        String              // "게임메카", "PC Gamer" 등

  // 카테고리
  mainCategory      String              // "PC" | "Mobile" | "Console" | "Esports"
  subCategory       String              // "리그오브레전드" | "기타 PC" 등
  classifyMethod    String              // "keyword" | "claude"

  // 재작성 결과
  rewrittenTitle    String
  rewrittenSummary  String
  rewrittenBody     String   @db.Text
  tags              String[]

  // 상태
  status            NewsStatus @default(PUBLISHED)  // 자동 발행

  // 타임스탬프
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  @@index([mainCategory, createdAt(sort: Desc)])
  @@index([subCategory, createdAt(sort: Desc)])
  @@index([createdAt(sort: Desc)])
}

enum NewsStatus {
  PUBLISHED   // 발행됨 (자동 발행)
  HIDDEN      // 숨김 (관리자가 수동으로 숨길 때)
}
```

---

## 구현 상세

### 1. RSS 소스 목록 (`constants/feed-sources.ts`)

```typescript
export interface FeedSource {
  name: string;
  url: string;
  language: "ko" | "en";
}

# PC/Mobile 먼저 진행 후 console, esports 진행 예정
export const FEED_SOURCES: FeedSource[] = [
  // 국내
  { name: "게임메카", url: "https://www.gamemeca.com/rss.php", language: "ko" },

  /* 해외 (Console 카테고리 보조)
  {
    name: "Push Square",
    url: "https://www.pushsquare.com/feeds/latest",
    language: "en",
  },
  {
    name: "Pure Xbox",
    url: "https://www.purexbox.com/feeds/latest",
    language: "en",
  },
  {
    name: "Nintendo Life",
    url: "https://www.nintendolife.com/feeds/latest",
    language: "en",
  },

  // Esports
  { name: "Dot Esports", url: "https://dotesports.com/feed", language: "en" },
   */
];
```

---

### 2. 카테고리 키워드 (`constants/category-keywords.ts`)

> 전체 파일은 `category-keywords.ts` 참고

```typescript
// 소분류 전체 목록 (CATEGORY_TREE) — 프론트 메뉴에서 사용
export const CATEGORY_TREE: Record<MainCategory, string[]> = {
  PC: [
    "리그오브레전드",
    "발로란트",
    "오버워치",
    "배틀그라운드",
    "로스트아크",
    "메이플스토리",
    "던전앤파이터",
    "디아블로",
    "기타 PC",
  ],
  Mobile: [
    "원신",
    "붕괴: 스타레일",
    "워스텔링",
    "배틀그라운드 모바일",
    "리니지M",
    "리니지W",
    "나혼자만레벨업",
    "쿠키런",
    "메이플스토리M",
    "승리의 여신: 니케",
    "기타 모바일",
  ],
  Console: [
    "엘든링",
    "파이널판타지",
    "GTA",
    "젤다",
    "몬스터헌터",
    "스파이더맨",
    "기타 콘솔",
  ],
  Esports: ["LCK", "VCT", "오버워치 리그", "기타 Esports"],
};
```

---

### 3. RSS 수집기 (`pipeline/rss-collector.ts`)

```typescript
import Parser from "rss-parser";

export interface RawArticle {
  title: string;
  link: string;
  pubDate: Date | null;
  content: string; // HTML 제거된 본문 (최대 1000자)
  sourceName: string;
}

export async function collectFeed(source: FeedSource): Promise<RawArticle[]> {
  const parser = new Parser({ timeout: 10000 });
  const feed = await parser.parseURL(source.url);

  return (feed.items ?? []).map((item) => ({
    title: item.title?.trim() ?? "",
    link: item.link ?? "",
    pubDate: item.pubDate ? new Date(item.pubDate) : null,
    content: stripHtml(
      (item as any)["content:encoded"] ?? item.content ?? item.summary ?? "",
    ).substring(0, 1000),
    sourceName: source.name,
  }));
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
```

---

### 4. 카테고리 분류기 (`pipeline/category-classifier.ts`)

```typescript
// 1단계: 키워드 매칭
export function classifyByKeyword(title: string): ClassifyResult | null {
  const t = title.toLowerCase();

  for (const [main, subs] of Object.entries(SUB_CATEGORIES)) {
    for (const sub of subs) {
      for (const kw of sub.keywords) {
        if (!t.includes(kw.toLowerCase())) continue;
        const excluded = sub.exclude?.some((ex) =>
          t.includes(ex.toLowerCase()),
        );
        if (excluded) continue;
        return {
          mainCategory: main as MainCategory,
          subCategory: sub.name,
          method: "keyword",
        };
      }
    }
  }
  return null;
}

// 2단계: Claude API 분류 (미분류 기사 배치 처리)
export async function classifyWithClaude(
  titles: string[],
): Promise<ClassifyResult[]> {
  const prompt = `게임 뉴스 제목을 분류해주세요.
mainCategory: PC / Mobile / Console / Esports / 기타
subCategory: 소분류 목록 중 하나, 없으면 "기타 [대분류]"

PC: 리그오브레전드, 발로란트, 오버워치, 배틀그라운드, 로스트아크, 메이플스토리, 던전앤파이터
Mobile: 원신, 배틀그라운드 모바일, 리니지M, 쿠키런, 나혼자만레벨업, 메이플스토리M
Console: 엘든링, 파이널판타지, GTA, 젤다
Esports: LCK, VCT, 오버워치 리그

JSON으로만 응답:
[{"index": 0, "mainCategory": "PC", "subCategory": "기타 PC"}]

제목 목록:
${titles.map((t, i) => `${i}. ${t}`).join("\n")}`;

  const res = await callClaude(prompt);
  return JSON.parse(res).map((p: any) => ({
    mainCategory: p.mainCategory,
    subCategory: p.subCategory,
    method: "claude",
  }));
}
```

---

### 5. 재작성기 (`pipeline/article-rewriter.ts`)

```typescript
const SYSTEM_PROMPT = `당신은 게임 매거진의 전문 편집자입니다.

[제목 규칙]
- "주어 + 핵심 사건" 구조
- 독자가 제목만 봐도 무슨 일인지 즉시 파악 가능
- 낚시성 표현, 물음표 제목 금지

[본문 규칙]
- 3~4문단, 각 문단 2~3문장
- 1문단: 핵심 (무엇이, 언제, 어떻게)
- 2문단: 주요 세부 내용 (1~2개만)
- 3문단: 배경 또는 의미
- 4문단: 출시일, 플랫폼 (해당시만)
- 여러 게임 다루는 기사는 가장 중요한 것 1~2개에만 집중
- 나열식 금지, 흐름 있는 문장 유지

[문체]
- 간결하고 명확한 사실 중심
- 불확실한 표현 금지
- 원문 문장 재사용 절대 금지
- 출처 언급 금지

JSON으로만 응답:
{
  "title": "재작성된 제목",
  "summary": "한 줄 요약 (50자 이내)",
  "body": "재작성된 본문 (문단 구분은 \\n\\n 사용)",
  "tags": ["태그1", "태그2", "태그3"]
}`;

export async function rewriteArticle(
  title: string,
  content: string,
  mainCategory: string,
  subCategory: string,
): Promise<RewriteResult> {
  const userMessage = `카테고리: ${mainCategory} > ${subCategory}
원문 제목: ${title}
원문 내용: ${content}`;

  const res = await callClaude(userMessage, SYSTEM_PROMPT);
  return JSON.parse(res);
}
```

---

### 6. 스케줄러 (`news.scheduler.ts`)

```typescript
import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { NewsService } from "./news.service";

@Injectable()
export class NewsScheduler {
  private readonly logger = new Logger(NewsScheduler.name);

  constructor(private readonly newsService: NewsService) {}

  // 하루 3회: 오전 9시 / 오후 3시 / 오후 9시
  @Cron("0 9,15,21 * * *", { timeZone: "Asia/Seoul" })
  async runPipeline() {
    this.logger.log("뉴스 파이프라인 시작");
    try {
      const result = await this.newsService.runNewsPipeline();
      this.logger.log(
        `완료 — 저장: ${result.saved}건, 스킵: ${result.skipped}건`,
      );
    } catch (err) {
      this.logger.error("파이프라인 실패", err);
    }
  }
}
```

---

### 7. 서비스 (`news.service.ts`)

```typescript
@Injectable()
export class NewsService {
  async runNewsPipeline(): Promise<{ saved: number; skipped: number }> {
    let saved = 0;
    let skipped = 0;

    for (const source of FEED_SOURCES) {
      // 1. RSS 수집
      const rawArticles = await collectFeed(source);

      for (const article of rawArticles) {
        // 2. 중복 체크
        const exists = await this.prisma.news.findUnique({
          where: { originalLink: article.link },
        });
        if (exists) {
          skipped++;
          continue;
        }

        // 3. 카테고리 분류
        let classify = classifyByKeyword(article.title);
        if (!classify) {
          const results = await classifyWithClaude([article.title]);
          classify = results[0];
        }

        // 4. 재작성
        const rewritten = await rewriteArticle(
          article.title,
          article.content,
          classify.mainCategory,
          classify.subCategory,
        );

        // 5. DB 저장
        await this.prisma.news.create({
          data: {
            originalTitle: article.title,
            originalLink: article.link,
            originalPubDate: article.pubDate,
            sourceName: article.sourceName,
            mainCategory: classify.mainCategory,
            subCategory: classify.subCategory,
            classifyMethod: classify.method,
            rewrittenTitle: rewritten.title,
            rewrittenSummary: rewritten.summary,
            rewrittenBody: rewritten.body,
            tags: rewritten.tags,
            status: "PUBLISHED",
          },
        });

        saved++;

        // API 레이트 리밋 방지
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    return { saved, skipped };
  }
}
```

---

### 8. 컨트롤러 (`news.controller.ts`)

```typescript
@Controller("news")
export class NewsController {
  // 뉴스 목록 조회
  // GET /news?mainCategory=PC&subCategory=리그오브레전드&page=1&limit=20
  @Get()
  async getNewsList(@Query() query: NewsListQueryDto) {
    return this.newsService.getNewsList(query);
  }

  // 뉴스 상세 조회
  // GET /news/:id
  @Get(":id")
  async getNewsDetail(@Param("id") id: string) {
    return this.newsService.getNewsDetail(id);
  }
}
```

**응답 형태 (목록)**

```json
{
  "data": [
    {
      "id": "clxxx",
      "mainCategory": "PC",
      "subCategory": "리그오브레전드",
      "title": "재작성된 제목",
      "summary": "한 줄 요약",
      "tags": ["롤", "패치"],
      "createdAt": "2026-04-19T09:00:00.000Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

**응답 형태 (상세)**

```json
{
  "id": "clxxx",
  "mainCategory": "PC",
  "subCategory": "리그오브레전드",
  "title": "재작성된 제목",
  "summary": "한 줄 요약",
  "body": "본문 전체...",
  "tags": ["롤", "패치"],
  "createdAt": "2026-04-19T09:00:00.000Z"
}
```

---

## NestJS 모듈 설정

```typescript
// news.module.ts
@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [NewsController],
  providers: [NewsService, NewsScheduler],
})
export class NewsModule {}

// app.module.ts 에 NewsModule 추가
@Module({
  imports: [
    ScheduleModule.forRoot(),
    NewsModule,
    // 기존 모듈들...
  ],
})
export class AppModule {}
```

---

## 필요한 패키지

```bash
# apps/api 에서 설치
pnpm add rss-parser @nestjs/schedule
pnpm add -D @types/rss-parser
```

---

## 환경 변수

```env
# apps/api/.env 에 추가
ANTHROPIC_API_KEY=sk-ant-...
```

---

## 구현 순서

```
1. Prisma 스키마에 News 모델 추가 및 마이그레이션
2. constants/ 파일 작성 (소스 목록, 키워드 사전)
3. pipeline/ 파일 작성 (수집 → 분류 → 재작성)
4. NewsService.runNewsPipeline() 구현
5. NewsScheduler 구현
6. NewsController API 구현
7. 수동 실행 테스트 후 스케줄러 활성화
```

---

## 주의사항

- Claude API 호출 간격: 기사당 **500ms 딜레이** 필수 (레이트 리밋 방지)
- 중복 체크는 **originalLink** 기준 (URL이 같으면 동일 기사)
- 재작성 실패 시 해당 기사 스킵하고 다음 기사 계속 처리
- 스케줄러 시간대는 반드시 **Asia/Seoul** 지정
