# MISSION: 커뮤니티 페이지 — Frontend Only (Mock Data)

## 운영 원칙

- 중간에 CEO에게 질문하거나 확인을 구하지 않는다
- 모호한 부분은 합리적으로 판단하고 진행, 최종 보고서에 명시
- 완료 후 한 번만 보고
- **이번 미션은 UI 구현만. API 연동 하지 않음. Mock 데이터 사용.**

---

## 기술 스택 컨텍스트

- **Frontend**: Next.js 14 App Router / TypeScript / Tailwind CSS
- **폰트**: Pretendard (next/font 또는 CDN)
- **공통 타입**: packages/shared/src/types 참고
- **API 연동**: 이번 미션에서 하지 않음 — Mock 데이터로 대체
- **렌더링**: 추후 API 연동 시 SSR/ISR 전환 예정이므로 컴포넌트 분리 철저히

---

## 1. 기능 개요

인벤(Inven) 스타일을 계승한 Modern & Minimal 게임 커뮤니티 페이지.
커뮤니티 목록 페이지, 게시글 상세 페이지, 게시글 작성 페이지 UI 구현.

---

## 2. 페이지 구조

```
apps/web/src/app/community/
├── layout.tsx              # 커뮤니티 공통 레이아웃 (사이드바 포함)
├── page.tsx                # 커뮤니티 목록
├── [id]/
│   └── page.tsx            # 게시글 상세
└── write/
    └── page.tsx            # 게시글 작성
```

---

## 3. 컴포넌트 구조

```
apps/web/src/components/community/
├── PostList.tsx             # 게시글 목록 테이블
├── PostListItem.tsx         # 게시글 한 줄 (번호-카테고리-제목-작성자-날짜-조회수)
├── PostListSkeleton.tsx     # 로딩 Skeleton
├── Pagination.tsx           # 페이지 번호 (1, 2, 3...)
├── CategorySidebar.tsx      # 좌측 계층형 카테고리 트리
├── PopularPostsWidget.tsx   # 우측 실시간 인기글 Top 5
├── PostDetail.tsx           # 게시글 본문
├── CommentList.tsx          # 댓글 목록
├── CommentItem.tsx          # 댓글 단건 (대댓글 들여쓰기 포함)
└── WriteForm.tsx            # 게시글 작성 폼
```

---

## 4. Mock 데이터 정의

```typescript
// apps/web/src/lib/mock/community.ts 에 작성

// 카테고리 (계층형)
const mockCategories = [
  { id: 1, name: "전체", slug: "all", parentId: null },
  { id: 2, name: "FPS", slug: "fps", parentId: null },
  { id: 3, name: "배틀그라운드", slug: "pubg", parentId: 2 },
  { id: 4, name: "발로란트", slug: "valorant", parentId: 2 },
  { id: 5, name: "RPG", slug: "rpg", parentId: null },
  { id: 6, name: "로스트아크", slug: "lostark", parentId: 5 },
];

// 게시글 목록 (20개)
const mockPosts = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: "게시글 제목 예시입니다",
  category: { id: 3, name: "배틀그라운드" },
  author: { id: "uuid", nickname: "닉네임" + i },
  viewCount: Math.floor(Math.random() * 1000),
  commentCount: Math.floor(Math.random() * 50),
  createdAt: new Date(Date.now() - i * 3600000).toISOString(),
}));

// 게시글 상세
const mockPostDetail = {
  id: 1,
  title: "게시글 제목 예시입니다",
  content: "게시글 본문 내용입니다. 길게 작성된 내용이 들어갑니다.",
  category: { id: 3, name: "배틀그라운드" },
  author: { id: "uuid", nickname: "작성자닉네임" },
  viewCount: 342,
  createdAt: new Date().toISOString(),
};

// 댓글 (대댓글 포함)
const mockComments = [
  {
    id: 1,
    content: "댓글 내용입니다",
    author: { id: "uuid", nickname: "댓글작성자" },
    createdAt: new Date().toISOString(),
    deletedAt: null,
    replies: [
      {
        id: 2,
        content: "대댓글 내용입니다",
        author: { id: "uuid2", nickname: "대댓글작성자" },
        createdAt: new Date().toISOString(),
        deletedAt: null,
      },
    ],
  },
  {
    id: 3,
    content: "",
    author: { id: "uuid3", nickname: "삭제유저" },
    createdAt: new Date().toISOString(),
    deletedAt: new Date().toISOString(), // 삭제된 댓글
    replies: [],
  },
];
```

---

## 5. 페이지별 UI 명세

### A. 커뮤니티 목록 (community/page.tsx)

**레이아웃 (3단 구조)**

```
[좌측 사이드바 200px] | [중앙 리스트 flex-1] | [우측 위젯 240px]
```

**좌측 사이드바 (CategorySidebar)**

- 계층형 카테고리 트리 렌더링
- 부모 카테고리 → 하위 카테고리 들여쓰기
- 현재 선택된 카테고리 강조 (primary 색상 + bold)
- 호버 시 배경색 변경

**중앙 리스트 (PostList)**

- 상단: 카테고리명 + 총 게시글 수
- 리스트 헤더: `번호 | 카테고리 | 제목 | 작성자 | 날짜 | 조회수`
- 한 줄 구성: `PostListItem`
  - 제목 옆 댓글 수 배지 `[8]` (primary 색상)
  - 호버 시 배경 gray-50
  - 행 사이 border-b border-gray-100
- 하단: Pagination 컴포넌트

**우측 위젯 (PopularPostsWidget)**

- "🔥 실시간 인기글" 타이틀
- Top 5 목록 (순위 번호 + 제목 + 조회수)
- 카드 형태, 그림자 없이 border만

---

### B. 게시글 상세 (community/[id]/page.tsx)

**레이아웃**

```
[좌측 사이드바 200px] | [중앙 본문 최대 800px] | [우측 위젯 240px]
```

**본문 영역 (PostDetail)**

- 카테고리 breadcrumb (`커뮤니티 > FPS > 배틀그라운드`)
- 제목 (text-2xl, font-bold)
- 메타 정보 (작성자 | 날짜 | 조회수) — text-sm, text-gray-500
- 구분선
- 본문 (min-height: 300px, text-base, line-height: 1.8)
- 구분선
- 버튼: `목록으로` / 로그인 유저이고 본인 글이면 `수정` `삭제` 추가

**댓글 영역**

- 댓글 수 표시 (`댓글 5개`)
- CommentItem:
  - 작성자 닉네임 + 날짜
  - 본문
  - 삭제된 댓글: 본문 대신 "삭제된 댓글입니다" (gray-400, italic)
  - 대댓글: 왼쪽 border-l-2 + pl-6 들여쓰기
- 댓글 작성 폼 (textarea + 등록 버튼) — 로그인 유저만 표시, 비로그인은 "로그인 후 댓글을 작성할 수 있습니다" 안내

---

### C. 게시글 작성 (community/write/page.tsx)

**레이아웃**

- 중앙 단일 컬럼, 최대 너비 800px, 좌우 auto margin
- 사이드바 없음

**WriteForm**

- 카테고리 선택 드롭다운 (mockCategories에서 하위 카테고리만 선택 가능)
- 제목 입력 (input, maxLength 100)
- 본문 입력 (textarea, minHeight 400px)
- 하단 버튼: `취소` (목록으로 이동) / `등록` (비활성화 상태 — API 미연동)
- 유효성: 카테고리 미선택, 제목 비어있으면 등록 버튼 비활성화

---

## 6. 디자인 원칙

```
- 배경: white / gray-50 교차
- 텍스트: gray-900 (제목) / gray-600 (본문) / gray-400 (메타)
- 브랜드 색상: globals.css의 --color-primary 사용
- 폰트 크기 위계: 제목 text-2xl / 소제목 text-lg / 본문 text-base / 메타 text-sm
- 여백: 인벤보다 넓게 (py-3 이상)
- 호버 효과: 배경 transition-colors duration-150
- 광고 배너 없음
- 불필요한 border 없음 — 구분은 여백으로 처리
```

---

## 7. 보안 처리 (UI 레벨)

```
- 게시글 작성 페이지: 비로그인 접근 시 /login으로 리다이렉트 (middleware.ts)
- 수정/삭제 버튼: 본인 글에서만 노출 (Mock에서는 항상 노출로 처리)
- dangerouslySetInnerHTML 사용 금지
```

---

## 8. 작업 순서 (Frontend Agent 지침)

```
1. Mock 데이터 파일 생성 (apps/web/src/lib/mock/community.ts)
2. 공통 레이아웃 (community/layout.tsx) — 사이드바 + 우측 위젯 구조
3. CategorySidebar 컴포넌트
4. PopularPostsWidget 컴포넌트
5. 커뮤니티 목록 페이지 (PostList, PostListItem, Pagination)
6. 게시글 상세 페이지 (PostDetail, CommentList, CommentItem)
7. 게시글 작성 페이지 (WriteForm)
8. QA → 전체 UI/UX 검증
```

---

## 9. 완료 기준 (Done Criteria)

```
□ 커뮤니티 목록 3단 레이아웃 정상 렌더링
□ 카테고리 사이드바 계층 구조 표시
□ 게시글 목록 Mock 데이터 20개 표시
□ 댓글 수 배지 [N] 표시
□ Pagination UI 표시 (클릭 동작은 Mock)
□ 인기글 위젯 Top 5 표시
□ 게시글 상세 본문 + 댓글 목록 표시
□ 삭제된 댓글 "삭제된 댓글입니다" 처리
□ 대댓글 들여쓰기 표시
□ 게시글 작성 페이지 폼 UI 표시
□ 비로그인 접근 시 /login 리다이렉트
□ 모바일 레이아웃 정상 동작 (사이드바 숨김 또는 토글)
□ tsc --noEmit 타입 에러 없음
□ pnpm lint 통과
```
