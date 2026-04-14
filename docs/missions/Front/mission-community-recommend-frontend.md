# MISSION: 커뮤니티 추천 + 검색 — Frontend

## 운영 원칙

- 중간에 CEO에게 질문하거나 확인을 구하지 않는다
- 모호한 부분은 합리적으로 판단하고 진행, 최종 보고서에 명시
- 완료 후 한 번만 보고
- **백엔드 미션 완료 후 진행 (API 실제 연동)**

---

## 기술 스택 컨텍스트

- **Frontend**: Next.js 14 App Router / TypeScript / Tailwind CSS
- **아이콘**: lucide-react의 `ThumbsUp` 아이콘 사용
- **상태관리**: Zustand (전역) / React Query (서버 상태)
- **공통 타입**: packages/shared/src/types 참고
- **API 클라이언트**: apps/web/src/lib/api/client.ts 사용 (직접 fetch 금지)
- **연동할 API**:
  - `POST /api/posts/:postId/recommend` — 게시글 추천 토글
  - `POST /api/posts/:postId/comments/:commentId/recommend` — 댓글 추천 토글
  - `GET /api/posts?search=` — 게시글 제목 검색

---

## 1. 기능 개요

기존 커뮤니티 UI에 아래 3가지를 추가한다.

1. 게시글 추천 버튼 (따봉 아이콘, 토글, 카운트 표시)
2. 댓글 추천 버튼 (따봉 아이콘, 토글, 카운트 표시)
3. 게시글 목록 제목 검색 인풋

---

## 2. 파일 구조

```
apps/web/src/
├── components/community/
│   ├── RecommendButton.tsx     ← 신규 (게시글/댓글 공용)
│   ├── PostDetail.tsx          ← 기존 수정 (추천 버튼 추가)
│   ├── CommentItem.tsx         ← 기존 수정 (추천 버튼 추가)
│   └── SearchBar.tsx           ← 신규
├── hooks/
│   ├── usePostRecommend.ts     ← 신규
│   └── useCommentRecommend.ts  ← 신규
└── app/community/
    └── page.tsx                ← 기존 수정 (검색바 추가)
```

---

## 3. 컴포넌트 상세 명세

### RecommendButton.tsx

```typescript
import { ThumbsUp } from "lucide-react";

interface RecommendButtonProps {
  recommended: boolean;
  recommendCount: number;
  onRecommend: () => void;
  isLoading?: boolean;
  disabled?: boolean; // 비로그인 시 true
}
```

**아이콘 상태**

```typescript
// 추천한 상태
<ThumbsUp className="fill-primary text-primary" size={18} />

// 미추천 상태
<ThumbsUp className="text-gray-400" size={18} />
```

**동작 규칙**

- 클릭 시 즉시 UI 반영 (Optimistic Update) → API 실패 시 롤백
- 비로그인 클릭 시 → "추천은 로그인 후 이용할 수 있습니다" 토스트 표시
- 로딩 중 버튼 비활성화 + 스피너

### SearchBar.tsx

```typescript
interface SearchBarProps {
  onSearch: (keyword: string) => void;
  placeholder?: string;
  defaultValue?: string;
}
```

- 입력 후 Enter 또는 검색 버튼 클릭 시 onSearch 호출
- 2자 미만 입력 시 검색 버튼 비활성화
- 검색어 초기화 버튼 (X) — 검색어 있을 때만 표시
- 검색 중 로딩 스피너

---

## 4. 훅 명세

### usePostRecommend.ts

```typescript
// React Query useMutation 사용
// Optimistic Update 적용
// 캐시 무효화: ['post', postId] 쿼리

const { mutate: toggleRecommend, isPending } = usePostRecommend(postId);
```

### useCommentRecommend.ts

```typescript
// React Query useMutation 사용
// Optimistic Update 적용
// 캐시 무효화: ['comments', postId] 쿼리

const { mutate: toggleRecommend, isPending } = useCommentRecommend(
  postId,
  commentId,
);
```

---

## 5. UI/UX 요구사항

### 게시글 상세 (PostDetail.tsx 수정)

```
- 본문 하단 중앙에 추천 버튼 배치
- ThumbsUp 아이콘 + 추천 수 숫자 표시
- 버튼 클릭 시 즉시 UI 반영 (Optimistic Update)
- 버튼 크기: 일반보다 크게 (size={24})
```

### 댓글 (CommentItem.tsx 수정)

```
- 댓글 우측 하단에 추천 버튼 배치 (소형, size={16})
- 추천 수 숫자 표시
- 삭제된 댓글(isDeleted: true)에는 추천 버튼 미표시
```

### 커뮤니티 목록 (page.tsx 수정)

```
- 리스트 상단에 SearchBar 배치
- 검색 시 URL 쿼리 파라미터 업데이트 (?search=검색어)
- 검색 결과 없을 때 Empty State UI ("검색 결과가 없습니다")
- 검색어 있을 때 "N개의 검색 결과" 표시
```

### 공통 UX

```
- 로딩 상태: 버튼 disabled + 스피너
- 에러 상태: 토스트 메시지
- 비로그인 추천 클릭: "추천은 로그인 후 이용할 수 있습니다" 토스트
```

---

## 6. 렌더링 전략

```
커뮤니티 목록: SSR (검색 파라미터 반영)
게시글 상세:   SSR + Client (추천 상태는 클라이언트)
```

---

## 7. 보안 처리

```
- 비로그인 유저: 추천 버튼 클릭 시 API 호출하지 않고 토스트 안내
- dangerouslySetInnerHTML 사용 금지
- NEXT_PUBLIC_ 환경변수에 시크릿 포함 금지
```

---

## 8. 작업 순서 (Frontend Agent 지침)

```
1. RecommendButton.tsx 컴포넌트 구현 (ThumbsUp 아이콘)
2. usePostRecommend.ts 훅 구현 (Optimistic Update 포함)
3. useCommentRecommend.ts 훅 구현 (Optimistic Update 포함)
4. PostDetail.tsx 추천 버튼 추가
5. CommentItem.tsx 추천 버튼 추가 (isDeleted 처리 포함)
6. SearchBar.tsx 컴포넌트 구현
7. community/page.tsx SearchBar 추가 + 검색 결과 Empty State
```

---

## 9. 완료 기준 (Done Criteria)

```
□ 게시글 추천 버튼 ThumbsUp 아이콘 정상 표시
□ 추천 토글 UI 동작 (fill ↔ outline)
□ Optimistic Update — 클릭 즉시 UI 반영, 실패 시 롤백
□ 댓글 추천 버튼 동작
□ 삭제된 댓글(isDeleted: true)에 추천 버튼 미표시
□ 검색바 입력 → 목록 필터링 동작
□ 2자 미만 검색 버튼 비활성화
□ 검색 결과 없음 Empty State 표시
□ 비로그인 추천 클릭 시 토스트 메시지 표시
□ 모바일 레이아웃 정상 동작
□ tsc --noEmit 타입 에러 없음
□ pnpm lint 통과
```
