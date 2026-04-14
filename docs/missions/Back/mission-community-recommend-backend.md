# MISSION: 커뮤니티 추천 + 검색 — Backend

## 운영 원칙

- 중간에 CEO에게 질문하거나 확인을 구하지 않는다
- 모호한 부분은 합리적으로 판단하고 진행, 최종 보고서에 명시
- 완료 후 한 번만 보고

---

## 기술 스택 컨텍스트

- **Backend**: NestJS / Prisma ORM / TypeScript
- **관련 DB 모델**: `posts`, `comments`, `categories`, `users` (기존)
- **추가할 DB 모델**: `post_recommends`, `comment_recommends`
- **공통 타입**: packages/shared/src/types 참고
- **기존 구현**: 게시글 CRUD + 댓글 CRUD (이미 완료)

---

## 1. 기능 개요

기존 게시글/댓글 CRUD에 아래 3가지를 추가한다.

1. 게시글 추천 토글
2. 댓글 추천 토글
3. 게시글 목록 제목 검색

---

## 2. schema.prisma 추가 사항

### 추가할 모델

```prisma
model PostRecommend {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now()) @map("created_at")

  userId String @map("user_id")
  postId Int    @map("post_id")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@unique([userId, postId])
  @@index([postId])
  @@map("post_recommends")
}

model CommentRecommend {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now()) @map("created_at")

  userId    String @map("user_id")
  commentId Int    @map("comment_id")

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  comment Comment @relation(fields: [commentId], references: [id], onDelete: Cascade)

  @@unique([userId, commentId])
  @@index([commentId])
  @@map("comment_recommends")
}
```

### 기존 모델에 관계 추가

```prisma
// User 모델에 추가
postRecommends    PostRecommend[]
commentRecommends CommentRecommend[]

// Post 모델에 추가
postRecommends PostRecommend[]

// Comment 모델에 추가
commentRecommends CommentRecommend[]
```

> 스키마 수정 후 반드시 `pnpm prisma migrate dev --name add-recommends` 실행

---

## 3. API 엔드포인트 명세

| Method | URL                                              | 설명                         | 인증   | Rate Limit |
| ------ | ------------------------------------------------ | ---------------------------- | ------ | ---------- |
| POST   | /api/posts/:postId/recommend                     | 게시글 추천 토글             | 필요   | 기본       |
| POST   | /api/posts/:postId/comments/:commentId/recommend | 댓글 추천 토글               | 필요   | 기본       |
| GET    | /api/posts?search=                               | 게시글 제목 검색 (기존 수정) | 불필요 | 기본       |

---

## 4. 상세 구현 명세

### 게시글 추천 토글

```typescript
// POST /api/posts/:postId/recommend

// 처리
1. 게시글 존재 + deletedAt: null 확인 → 없으면 404
2. PostRecommend findUnique({ where: { userId_postId: { userId, postId } } })
   - 없으면 → create (추천 추가)
   - 있으면 → delete (추천 취소)
3. post_recommends count로 recommendCount 계산 후 반환

// Response 200
{ "recommended": true, "recommendCount": 11 }

// 에러
- 401: 인증 실패
- 404: 게시글 없음
```

### 댓글 추천 토글

```typescript
// POST /api/posts/:postId/comments/:commentId/recommend

// 처리
1. 댓글 존재 + deletedAt: null 확인 → 없으면 404
2. CommentRecommend findUnique({ where: { userId_commentId: { userId, commentId } } })
   - 없으면 → create
   - 있으면 → delete
3. comment_recommends count로 recommendCount 계산 후 반환

// Response 200
{ "recommended": true, "recommendCount": 4 }

// 에러
- 401: 인증 실패
- 404: 댓글 없음
```

### 게시글 목록 search 파라미터 추가 (기존 수정)

```typescript
// PostQueryDto에 추가
@IsOptional()
@IsString()
@MinLength(2, { message: '검색어는 2자 이상이어야 합니다' })
search?: string

// Prisma where 조건 추가
where: {
  deletedAt: null,
  ...(search && {
    title: { contains: search, mode: 'insensitive' }
  }),
}
```

### 기존 응답 필드 추가

**게시글 상세 조회 isRecommended 추가**

```typescript
isRecommended: userId
  ? (await prisma.postRecommend.findUnique({
      where: { userId_postId: { userId, postId } },
    })) !== null
  : false;
```

**댓글 목록 isDeleted, recommendCount, isRecommended 추가**

```typescript
{
  content: deletedAt ? "삭제된 댓글입니다." : content
  isDeleted: deletedAt !== null
  recommendCount: _count.commentRecommends
  isRecommended: 로그인 유저 기준 (비로그인 false)
}
```

---

## 5. DTO 추가/변경

```typescript
// post-query.dto.ts — search 필드 추가
@IsOptional()
@IsString()
@MinLength(2)
search?: string

// recommend-response.dto.ts — 신규 생성
export class RecommendResponseDto {
  recommended: boolean
  recommendCount: number
}
```

---

## 6. 파일 구조

```
apps/api/src/modules/community/
├── dto/
│   ├── create-post.dto.ts
│   ├── update-post.dto.ts
│   ├── create-comment.dto.ts
│   ├── update-comment.dto.ts
│   ├── post-query.dto.ts            ← search 필드 추가
│   └── recommend-response.dto.ts    ← 신규
├── community.controller.ts          ← 추천 엔드포인트 추가
├── community.service.ts             ← 추천 + search + isRecommended 로직 추가
└── community.module.ts
```

---

## 7. 보안 처리

```
- 추천: JwtAuthGuard 필수
- @@unique 제약으로 DB 레벨 중복 추천 방지
- search: MinLength(2) — 1글자 풀스캔 방지
- 모든 조회에 deletedAt: null 필터 적용
- API 응답에 password 필드 포함 금지
- $queryRaw 사용 금지
```

---

## 8. 작업 순서 (Backend Agent 지침)

```
1. schema.prisma PostRecommend, CommentRecommend 모델 추가
2. 기존 모델(User, Post, Comment)에 관계 추가
3. prisma migrate dev --name add-recommends 실행
4. recommend-response.dto.ts 생성
5. post-query.dto.ts search 필드 추가
6. community.service.ts togglePostRecommend 메서드 추가
7. community.service.ts toggleCommentRecommend 메서드 추가
8. community.service.ts findAllPosts search 처리 추가
9. community.service.ts findOnePost isRecommended 추가
10. community.service.ts findComments isDeleted, recommendCount, isRecommended 추가
11. community.controller.ts 추천 엔드포인트 2개 추가
```

---

## 9. 완료 기준 (Done Criteria)

```
□ prisma migrate 성공
□ 게시글 추천 토글 정상 동작 (추가 → 취소 → 추가 반복)
□ 댓글 추천 토글 정상 동작
□ 동일 유저 중복 추천 불가 확인
□ search 파라미터로 제목 검색 동작
□ search 1글자 입력 시 400 에러 반환
□ 게시글 상세 isRecommended 로그인/비로그인 각각 정상 반환
□ 댓글 isDeleted, recommendCount, isRecommended 정상 반환
□ tsc --noEmit 타입 에러 없음
□ pnpm lint 통과
```
