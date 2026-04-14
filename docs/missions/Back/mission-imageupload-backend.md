# MISSION: 이미지 업로드 — Backend

## 운영 원칙

- 중간에 CEO에게 질문하거나 확인을 구하지 않는다
- 모호한 부분은 합리적으로 판단하고 진행, 최종 보고서에 명시
- 완료 후 한 번만 보고

---

## 기술 스택 컨텍스트

- **Backend**: NestJS / Prisma ORM / TypeScript
- **스토리지**: Cloudflare R2 (S3 호환 API)
- **패키지**: `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`
- **관련 DB**: `posts` 테이블 (images 컬럼 추가)

---

## 1. 기능 개요

게시글 작성 시 이미지를 Cloudflare R2에 업로드한다.
Presigned URL 방식 사용 — 프론트에서 R2에 직접 업로드 (백엔드 서버로 이미지 안 지남).

---

## 2. DB 스키마 변경

```sql
-- posts 테이블에 images 컬럼 추가
ALTER TABLE "posts" ADD COLUMN "images" TEXT[] DEFAULT '{}';
```

```prisma
-- schema.prisma posts 모델에 추가
images String[] @default([])
```

> `pnpm prisma migrate dev --name add-post-images` 실행

---

## 3. 환경변수 추가 (.env)

```
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=game-magazine
R2_PUBLIC_URL=https://[커스텀도메인 또는 r2.dev URL]
```

---

## 4. API 엔드포인트 명세

| Method | URL                        | 설명               | 인증 | Rate Limit |
| ------ | -------------------------- | ------------------ | ---- | ---------- |
| POST   | /api/uploads/presigned-url | Presigned URL 발급 | 필요 | 10회/분    |

### Presigned URL 발급

```typescript
// POST /api/uploads/presigned-url

// Request Body
{
  filename: string   // 원본 파일명
  contentType: string // "image/png" | "image/jpeg" | "image/webp"
  fileSize: number   // bytes
}

// 처리
1. contentType 검증 → image/png, image/jpeg, image/jpg, image/webp 외 거부 → 400
2. fileSize 검증 → 10MB(10 * 1024 * 1024) 초과 시 거부 → 400
3. 파일명 생성: posts/{userId}/{uuid}.{ext} (원본 파일명 사용 안 함 — 보안)
4. R2 Presigned URL 생성 (만료: 5분)
5. 업로드 URL + 최종 접근 URL 반환

// Response 200
{
  "uploadUrl": "https://r2-presigned-url...",  // 프론트에서 PUT 요청할 URL
  "publicUrl": "https://r2.gamemag.com/posts/userId/uuid.jpg"  // 실제 접근 URL
}

// 에러
- 400: 허용되지 않는 파일 형식
- 400: 파일 크기 초과 (10MB)
- 401: 인증 실패
```

---

## 5. R2 모듈 구현

```
apps/api/src/modules/upload/
├── upload.controller.ts
├── upload.service.ts     ← R2 presigned URL 생성 로직
└── upload.module.ts
```

```typescript
// upload.service.ts 핵심 로직
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// R2 클라이언트 설정
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// Presigned URL 생성 (만료 5분)
const command = new PutObjectCommand({
  Bucket: process.env.R2_BUCKET_NAME,
  Key: key, // posts/{userId}/{uuid}.{ext}
  ContentType: contentType,
});
const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
```

---

## 6. 보안 처리

```
허용 MIME 타입 화이트리스트:
- image/png
- image/jpeg
- image/jpg
- image/webp

파일 크기: 10MB (10 * 1024 * 1024 bytes) 초과 거부

파일명 보안:
- 원본 파일명 절대 사용 금지 (경로 traversal 방지)
- UUID로 재생성: posts/{userId}/{uuid}.{ext}
- 확장자는 contentType에서 추출 (파일명에서 추출 금지)

Rate Limit:
- @Throttle({ default: { limit: 10, ttl: 60000 } })
- presigned URL 발급 엔드포인트에 적용

인증:
- JwtAuthGuard 필수 — 로그인 유저만 업로드 가능
```

---

## 7. 패키지 설치

```bash
cd apps/api
pnpm add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

---

## 8. 작업 순서 (Backend Agent 지침)

```
1. 패키지 설치 (@aws-sdk/client-s3, @aws-sdk/s3-request-presigner)
2. schema.prisma posts에 images String[] 추가
3. prisma migrate dev --name add-post-images 실행
4. upload.module.ts, upload.service.ts, upload.controller.ts 생성
5. R2 클라이언트 설정 (config에서 환경변수 로드)
6. presigned URL 발급 API 구현
7. UploadModule을 AppModule에 등록
8. app.config.ts에 R2 환경변수 추가
```

---

## 9. 완료 기준 (Done Criteria)

```
□ presigned URL 발급 API 정상 응답
□ 허용되지 않는 MIME 타입 요청 시 400 에러
□ 10MB 초과 요청 시 400 에러
□ 비로그인 요청 시 401 에러
□ 파일 키가 posts/{userId}/{uuid}.{ext} 형식인지 확인
□ tsc --noEmit 타입 에러 없음
□ pnpm lint 통과
```
