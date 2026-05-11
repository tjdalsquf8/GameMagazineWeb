# MISSION: 카드뉴스 생성 기능 — Full Stack

## 운영 원칙

- 중간에 CEO에게 질문하거나 확인을 구하지 않는다
- 모호한 부분은 합리적으로 판단하고 진행, 최종 보고서에 명시
- 완료 후 한 번만 보고
- **작업 순서: Backend → QA → Frontend → QA → 보고**

---

## 기술 스택 컨텍스트

- **Frontend**: Next.js 14 App Router / TypeScript / Tailwind CSS
- **Backend**: NestJS / Prisma ORM / TypeScript
- **Claude API**: `@anthropic-ai/sdk` — 이미 뉴스 파이프라인에서 사용 중 (apps/api/src/news/news.service.ts 참고)
- **이미지 캡처**: `html2canvas` (프론트엔드 신규 설치 필요)
- **관련 DB 모델**: News (schema.prisma) — DB 저장 없음, 생성 후 바로 프론트 반환
- **프롬프트 저장**: SystemConfig 테이블의 `CARD_NEWS_PROMPT` 키 사용

---

## 1. 기능 개요

관리자 기사 테이블에서 [카드뉴스] 버튼을 클릭하면 해당 기사 내용을 기반으로
Claude API가 인스타그램용 카드뉴스 슬라이드 텍스트를 생성하고,
html2canvas로 PNG 이미지를 다운로드할 수 있는 기능.

**DB 저장 없음** — 생성 결과는 프론트 상태에만 보관, 다운로드 후 인스타에 직접 업로드.

---

## 2. 전체 플로우

```
관리자 기사 테이블 → [카드뉴스] 버튼 클릭
↓
CardNewsModal 오픈 (기사 제목 표시)
↓
[생성하기] 클릭
↓
POST /api/admin/articles/:id/card-news
↓
백엔드: 기사 조회 → SystemConfig에서 프롬프트 로드 → Claude API 호출
↓
슬라이드 JSON 반환 (DB 저장 없음)
↓
프론트: 슬라이드 카드 렌더링 (← 1/N →)
↓
[슬라이드별 PNG 다운로드] 또는 [전체 다운로드]
```

---

## 3. Backend 명세

### API 엔드포인트

| Method | URL                               | 설명          | 인증                             |
| ------ | --------------------------------- | ------------- | -------------------------------- |
| POST   | /api/admin/articles/:id/card-news | 카드뉴스 생성 | JwtAuthGuard + RolesGuard(ADMIN) |

### 요청/응답

```typescript
// POST /api/admin/articles/:id/card-news
// Request: body 없음 (id만 path param)

// Response
{
  success: true,
  data: {
    slides: CardSlide[]
  }
}

interface CardSlide {
  slideNo: number     // 1부터 시작
  title: string       // 슬라이드 제목
  body: string        // 본문 (2~4문장)
  tag?: string        // 태그 or 카테고리 (선택)
}
```

### 처리 로직

```typescript
// 1. 기사 조회
const news = await prisma.news.findUnique({ where: { id } });
// 없으면 → 404 "기사를 찾을 수 없습니다."

// 2. 프롬프트 로드 (SystemConfig → CARD_NEWS_PROMPT 키)
// 없으면 아래 기본 프롬프트 사용:
const DEFAULT_PROMPT = `
당신은 게임 뉴스를 인스타그램 카드뉴스로 변환하는 전문가입니다.
아래 기사를 읽고 5~7장의 카드뉴스 슬라이드를 JSON 배열로 작성하세요.

규칙:
- 각 슬라이드는 title(짧고 임팩트 있는 제목)과 body(핵심 내용 2~4문장)로 구성
- 첫 슬라이드는 전체 내용을 요약하는 훅(hook) 문장
- 마지막 슬라이드는 요약 또는 의견 유도
- 반드시 JSON 배열만 반환, 다른 텍스트 없음
- 형식: [{"slideNo":1,"title":"...","body":"...","tag":"..."}]

기사 제목: {title}
기사 요약: {summary}
기사 본문: {body}
태그: {tags}
`;

// 3. Claude API 호출 (claude-haiku-4-5 — 비용 효율)
// 응답에서 JSON 파싱 → slides 배열 추출

// 4. slides 배열 반환 (DB 저장 없음)
```

### 보안 처리

```
- 인증: JwtAuthGuard + RolesGuard(ADMIN)
- 입력: path param id만 존재, Prisma 쿼리로 처리 (injection 없음)
- Claude API 에러 시 → 500 "카드뉴스 생성에 실패했습니다."
- JSON 파싱 실패 시 → 500 "응답 파싱에 실패했습니다."
```

---

## 4. Frontend 명세

### 파일 구조

```
apps/web/src/
├── components/admin/
│   ├── CardNewsModal.tsx       # 신규 — 메인 모달
│   └── CardNewsSlide.tsx       # 신규 — 개별 슬라이드 카드 렌더링 (캡처 대상)
└── lib/api/admin.api.ts        # generateCardNews() 함수 추가
```

### CardNewsModal UI/UX

```
[상태 A] 초기 (슬라이드 없음)
  → 기사 제목 표시
  → "카드뉴스를 생성하면 인스타그램 업로드용 이미지를 다운로드할 수 있습니다."
  → [생성하기] 버튼

[상태 B] 생성 중 (isLoading)
  → 스피너 + "Claude가 카드뉴스를 작성 중입니다..."

[상태 C] 완료
  → 슬라이드 뷰어: ← {현재}/{전체} →
  → 현재 슬라이드 카드 렌더링 (1080×1080 비율, 정사각형)
  → [이 슬라이드 다운로드] — html2canvas로 PNG 저장
  → [전체 다운로드] — 모든 슬라이드 순차 PNG 저장
  → [재생성] 버튼

[상태 D] 에러
  → "생성에 실패했습니다. 다시 시도해주세요." + [재시도] 버튼
```

### CardNewsSlide 카드 디자인 (캡처 대상 영역)

```
- 크기: 1080×1080 (정사각형, scale로 화면엔 작게 표시)
- 배경: 다크 그라디언트 (게임 매거진 브랜드 컬러 활용)
- 상단: 슬라이드 번호 + 태그
- 중앙: title (큰 폰트)
- 하단: body 텍스트 + "Game Magazine" 워터마크
- ref를 통해 html2canvas 캡처
```

### html2canvas 다운로드 로직

```typescript
// pnpm add html2canvas @types/html2canvas (apps/web에 설치)
import html2canvas from "html2canvas";

const downloadSlide = async (
  ref: RefObject<HTMLDivElement>,
  filename: string,
) => {
  const canvas = await html2canvas(ref.current, { scale: 2, useCORS: true });
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
};
```

### API 연동

```typescript
// apps/web/src/lib/api/admin.api.ts 에 추가
export async function generateCardNews(
  articleId: string,
): Promise<ApiResponse<{ slides: CardSlide[] }>> {
  return apiClient.post(`/api/admin/articles/${articleId}/card-news`);
}
```

### 기사 테이블 버튼 연결

```
apps/web/src/app/admin/articles/page.tsx
- 현재: onClick={() => alert('준비 중')}
- 변경: CardNewsModal을 state로 관리, 버튼 클릭 시 selectedArticleId 세팅 → 모달 오픈
```

---

## 5. 패키지 설치

```bash
# apps/web
cd apps/web && pnpm add html2canvas
```

---

## 6. 작업 순서

```
1. @backend  → 엔드포인트 구현 (Claude API 호출 + JSON 반환)
2. @qa       → 정상/에러/인증 케이스 검증
3. @frontend → CardNewsModal + CardNewsSlide + html2canvas 다운로드 구현
4. @qa       → UI 렌더링 + 슬라이드 뷰어 + 다운로드 검증
5. orchestrator → CEO 보고
```

---

## 7. 완료 기준 (Done Criteria)

```
□ [카드뉴스] 버튼 클릭 → 모달 오픈
□ 생성하기 클릭 → Claude API 호출 → 슬라이드 렌더링
□ 슬라이드 뷰어 좌우 이동 정상 동작
□ 슬라이드별 PNG 다운로드 정상 동작
□ 전체 다운로드 정상 동작
□ 로딩 / 에러 / 재생성 상태 UI 확인
□ ADMIN 권한 없는 경우 403 반환 확인
□ tsc --noEmit 타입 에러 없음 (web + api 모두)
□ pnpm lint 통과
□ QA 테스트 통과
```
