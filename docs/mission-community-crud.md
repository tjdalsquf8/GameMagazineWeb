# Community API Spec — Group 1 (게시글 + 댓글)

## 공통 사항

- Base URL: `/api`
- 인증이 필요한 API: `Authorization: Bearer <accessToken>` 헤더 필요
- 소프트 딜리트: `deletedAt` 필드로 처리 (`null`이면 활성, 값이 있으면 삭제)

---

## 1. 게시글 (Post)

### 1-1. 게시글 목록 조회

```
GET /posts
```

- 인증: 불필요
- Query Parameters

| 파라미터   | 타입   | 필수 | 설명                                                   |
| ---------- | ------ | ---- | ------------------------------------------------------ |
| page       | number | N    | 페이지 번호 (기본값: 1)                                |
| limit      | number | N    | 페이지당 개수 (기본값: 20)                             |
| categoryId | number | N    | 카테고리 필터                                          |
| sort       | string | N    | 정렬 기준: `latest`(기본값) \| `popular` \| `comments` |
| search     | string | N    | 제목+내용 검색                                         |

- Response `200`

```json
{
  "items": [
    {
      "id": 1,
      "title": "게시글 제목",
      "viewCount": 100,
      "likeCount": 10,
      "commentCount": 5,
      "createdAt": "2026-04-09T00:00:00.000Z",
      "author": {
        "id": "uuid",
        "nickname": "성민",
        "profileImage": null
      },
      "category": {
        "id": 1,
        "name": "자유게시판",
        "slug": "free"
      }
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5
}
```

---

### 1-2. 게시글 상세 조회

```
GET /posts/:postId
```

- 인증: 불필요
- 조회 시 `viewCount` +1 증가

- Response `200`

```json
{
  "id": 1,
  "title": "게시글 제목",
  "content": "게시글 내용",
  "viewCount": 101,
  "likeCount": 10,
  "commentCount": 5,
  "createdAt": "2026-04-09T00:00:00.000Z",
  "updatedAt": "2026-04-09T00:00:00.000Z",
  "author": {
    "id": "uuid",
    "nickname": "성민",
    "profileImage": null
  },
  "category": {
    "id": 1,
    "name": "자유게시판",
    "slug": "free"
  }
}
```

- Response `404`: 게시글 없음

---

### 1-3. 게시글 작성

```
POST /posts
```

- 인증: 필요

- Request Body

```json
{
  "title": "게시글 제목",
  "content": "게시글 내용",
  "categoryId": 1
}
```

| 필드       | 타입   | 필수 | 제약              |
| ---------- | ------ | ---- | ----------------- |
| title      | string | Y    | 최대 255자        |
| content    | string | Y    | -                 |
| categoryId | number | Y    | 존재하는 카테고리 |

- Response `201`

```json
{
  "id": 1,
  "title": "게시글 제목",
  "content": "게시글 내용",
  "createdAt": "2026-04-09T00:00:00.000Z",
  "author": {
    "id": "uuid",
    "nickname": "성민"
  },
  "category": {
    "id": 1,
    "name": "자유게시판"
  }
}
```

- Response `400`: 유효성 검사 실패
- Response `401`: 인증 실패

---

### 1-4. 게시글 수정

```
PATCH /posts/:postId
```

- 인증: 필요 (작성자 본인만)

- Request Body

```json
{
  "title": "수정된 제목",
  "content": "수정된 내용"
}
```

| 필드    | 타입   | 필수 | 제약       |
| ------- | ------ | ---- | ---------- |
| title   | string | N    | 최대 255자 |
| content | string | N    | -          |

- Response `200`: 수정된 게시글 객체
- Response `401`: 인증 실패
- Response `403`: 작성자 아님
- Response `404`: 게시글 없음

---

### 1-5. 게시글 삭제

```
DELETE /posts/:postId
```

- 인증: 필요 (작성자 본인 또는 ADMIN)
- 소프트 딜리트 (`deletedAt` 업데이트)

- Response `200`

```json
{ "message": "게시글이 삭제되었습니다." }
```

- Response `401`: 인증 실패
- Response `403`: 권한 없음
- Response `404`: 게시글 없음

---

## 2. 댓글 (Comment)

### 2-1. 댓글 목록 조회

```
GET /posts/:postId/comments
```

- 인증: 불필요
- 대댓글은 각 댓글의 `replies` 배열로 포함

- Response `200`

```json
{
  "items": [
    {
      "id": 1,
      "content": "댓글 내용",
      "createdAt": "2026-04-09T00:00:00.000Z",
      "author": {
        "id": "uuid",
        "nickname": "성민",
        "profileImage": null
      },
      "replies": [
        {
          "id": 2,
          "content": "대댓글 내용",
          "createdAt": "2026-04-09T00:00:00.000Z",
          "author": {
            "id": "uuid",
            "nickname": "유저2",
            "profileImage": null
          }
        }
      ]
    }
  ],
  "total": 5
}
```

---

### 2-2. 댓글 작성

```
POST /posts/:postId/comments
```

- 인증: 필요

- Request Body

```json
{
  "content": "댓글 내용",
  "parentId": null
}
```

| 필드     | 타입   | 필수 | 제약                                 |
| -------- | ------ | ---- | ------------------------------------ |
| content  | string | Y    | -                                    |
| parentId | number | N    | 대댓글이면 부모 댓글 id, 없으면 null |

- Response `201`

```json
{
  "id": 1,
  "content": "댓글 내용",
  "parentId": null,
  "createdAt": "2026-04-09T00:00:00.000Z",
  "author": {
    "id": "uuid",
    "nickname": "성민"
  }
}
```

- Response `400`: 유효성 검사 실패
- Response `401`: 인증 실패
- Response `404`: 게시글 없음

---

### 2-3. 댓글 수정

```
PATCH /posts/:postId/comments/:commentId
```

- 인증: 필요 (작성자 본인만)

- Request Body

```json
{
  "content": "수정된 댓글 내용"
}
```

- Response `200`: 수정된 댓글 객체
- Response `401`: 인증 실패
- Response `403`: 작성자 아님
- Response `404`: 댓글 없음

---

### 2-4. 댓글 삭제

```
DELETE /posts/:postId/comments/:commentId
```

- 인증: 필요 (작성자 본인 또는 ADMIN)
- 소프트 딜리트 (`deletedAt` 업데이트)
- 대댓글이 있는 댓글 삭제 시 내용을 "삭제된 댓글입니다."로 표시

- Response `200`

```json
{ "message": "댓글이 삭제되었습니다." }
```

- Response `401`: 인증 실패
- Response `403`: 권한 없음
- Response `404`: 댓글 없음

---

## 3. 라우터 요약

| Method | Endpoint                           | 설명        | 인증 |
| ------ | ---------------------------------- | ----------- | ---- |
| GET    | /posts                             | 게시글 목록 | X    |
| GET    | /posts/:postId                     | 게시글 상세 | X    |
| POST   | /posts                             | 게시글 작성 | O    |
| PATCH  | /posts/:postId                     | 게시글 수정 | O    |
| DELETE | /posts/:postId                     | 게시글 삭제 | O    |
| GET    | /posts/:postId/comments            | 댓글 목록   | X    |
| POST   | /posts/:postId/comments            | 댓글 작성   | O    |
| PATCH  | /posts/:postId/comments/:commentId | 댓글 수정   | O    |
| DELETE | /posts/:postId/comments/:commentId | 댓글 삭제   | O    |

---

## 4. 디렉토리 구조

```
src/
├── routes/
│   ├── post.route.js
│   └── comment.route.js
├── controllers/
│   ├── post.controller.js
│   └── comment.controller.js
├── services/
│   ├── post.service.js
│   └── comment.service.js
├── repositories/
│   ├── post.repository.js
│   └── comment.repository.js
└── validations/
    ├── post.validation.js
    └── comment.validation.js
```
