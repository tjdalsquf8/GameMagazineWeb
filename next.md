# Game Magazine — 작업 노트

---

## ⚠️ 현재 배포 상태

> Vercel + Render 배포는 **정식 퍼블릭 런칭이 아님**
> 팀원이 카드뉴스 기능을 사용하기 위한 **내부 배포 상태**

- 구글 프로덕션 게시 신청 → AWS 정식 배포 시 진행
- 커스텀 도메인 → 구매 계획 없음, AWS 이전 시 재검토

---

## 완료된 작업

### 핵심 기능

- [x] 뉴스 상세 페이지 디자인
- [x] 뉴스 조회수·추천수 연결
- [x] 모바일 반응형 레이아웃 (뉴스 메인·상세·커뮤니티)
- [x] 마이페이지 구현
- [x] 뉴스 더보기 → 페이지네이션 처리

### 관리자 대시보드

- [x] 뉴스수집 자동화 결과 시각화 (파이프라인 로그·통계)
- [x] API 비용 시각화
- [x] 카테고리 관리 (수정·삭제·추가, 즉각 DB 반영)
- [x] 사용자 관리 및 커뮤글·댓글 관리 (밴·신고 처리)
- [x] 뉴스 소스 관리 (추가·수정·활성화)
- [x] 뉴스 기사 관리 (발행·숨김 처리)
- [x] 뉴스 자동 수집·재작성 파이프라인 (RSS → Claude AI → 카테고리 분류)
- [x] 회원 인증 — 이메일 인증, JWT, Refresh Token Rotation, 로그인 유지
- [x] 비밀번호 찾기·재설정

### 4.30 회의 후 작업

- [x] 메인페이지 카테고리 아이콘 수정
- [x] Hero 섹션 캐러셀 (3초 자동 슬라이드 + 버튼 수동 전환)
- [x] 광고 배너 추가 (커뮤니티 HOT 제거 → 728×90 배너 교체)
- [x] 마이페이지 프로필 이미지 업로드 (Cloudflare R2 연동)
- [x] 마이페이지 반응형 UI 수정

---

## 미결 작업

- [x] 마이페이지 이미지 경로 확인 (Cloudflare 실 환경 테스트)
- [ ] 기사 썸네일 + 뉴스 상세 페이지 이미지 — GPT 생성 삽입 (아래 파이프라인 마이그레이션 계획 참고)
- [x] 어드민 — 기사 직접 작성·발행 기능
- [x] 어드민 — 카드뉴스 뽑기 버튼 (이미지 생성·다운로드)

---

## GPT 이미지 파이프라인 마이그레이션 계획

> Codex(GPT 구독)로 전체 파이프라인 이전: RSS 수집 → 재작성 → 이미지 생성 → 발행

### 변경 배경

- Claude API 재작성 → **GPT-4o mini 재작성 + gpt-image-1(GPT-4o) 이미지 생성**으로 통합
- 이미지 품질이 DALL-E 3보다 gpt-image-1이 우수 (텍스트·게임 아트 스타일)
- Codex 환경(GPT 구독)에서 OpenAI API 키로 일괄 처리

### 아키텍처 변경

```
[기존] RSS → Claude(재작성) → DB 저장 (썸네일 없음)
[변경] RSS → GPT-4o mini(재작성) → gpt-image-1(썸네일 생성) → R2 업로드 → DB 저장
```

### 예상 비용 (30~50건/일 기준)

| 항목 | 단가 | 30건/일 | 50건/일 |
|------|------|---------|---------|
| GPT-4o mini 재작성 | ~$0.002/건 | $1.8/월 | $3/월 |
| gpt-image-1 medium (1024×1024) | ~$0.042/장 | $38/월 | $63/월 |
| **합계** | | **~$40/월** | **~$66/월** |

> 파이프라인 1회 실행 시간: 30~50건 × 15초(이미지) ≈ **약 15~20분** (API 병렬화로 단축 가능)

### 구현 파일

| 파일 | 변경 내용 |
|------|-----------|
| `apps/api/src/news/article-rewriter.ts` | Anthropic SDK → OpenAI SDK, 모델 `gpt-4o-mini` |
| `apps/api/src/news/news.service.ts` | 재작성 후 이미지 생성 호출 + R2 업로드 로직 추가 |
| `apps/api/src/news/image-generator.ts` | 신규: gpt-image-1 호출 → base64 → R2 업로드 |
| `apps/api/prisma/schema.prisma` | `News.thumbnailUrl` 컬럼 이미 존재 (변경 불필요) |
| `apps/api/.env.example` | `OPENAI_API_KEY` 추가, `ANTHROPIC_API_KEY` 제거 |
| `apps/web/next.config.js` | `images.remotePatterns`에 R2 도메인 이미 등록됨 |

### 구현 순서

1. `image-generator.ts` 작성: `generateAndUploadThumbnail(title, category)` 함수
   - OpenAI SDK `images.generate({ model: 'gpt-image-1', ... })` 호출
   - base64 응답 → Buffer → R2 `PutObjectCommand` 업로드
   - 업로드된 R2 공개 URL 반환
2. `article-rewriter.ts` OpenAI 마이그레이션
3. `news.service.ts`에서 재작성 완료 후 이미지 생성 호출, `thumbnailUrl` 포함 저장
4. 환경변수 교체 후 Render 재배포

### 주의사항

- 이미지 생성 실패 시 `thumbnailUrl = null`로 저장 (파이프라인 중단 방지)
- Rate limit: gpt-image-1은 기본 5 img/min → 배치 처리 시 딜레이 필요
- 기존 발행 기사 썸네일 소급 적용은 별도 스크립트로 일괄 실행

---

## 4.30 회의 결정사항

| 항목             | 결정                                                                  |
| ---------------- | --------------------------------------------------------------------- |
| 뉴스 썸네일      | GPT로 생성해서 삽입 — 썸네일·상세 이미지 통일                         |
| 뉴스 상세 이미지 | GPT 생성 이미지로 통일 (썸네일과 동일)                                |
| 카드뉴스         | 어드민에서 발행 기사 보고 "카드뉴스 뽑기" 버튼 → 이미지 생성·다운로드 |
| 커뮤니티 HOT     | 메인과 상세 분리 유지                                                 |

---

## 고민 / 미결 사항

- [x] 커뮤니티 API 연동 시 `useSearchParams`로 CategorySidebar 활성 카테고리 동적 연결 — 완료
- [x] WriteForm 등록 버튼 POST 요청 로직 추가 — `createPost()` 연동 완료
- [ ] 뉴스 DB 분리 여부 검토 필요
- [ ] `eslint@8.57.1` deprecated — ESLint v9 마이그레이션 필요 (현재는 정상 동작)

---

## 배포 전 체크리스트

> 🔴 필수 / 🟡 하면 좋음

### 1단계. 빌드 확인 ✅

- [x] 프론트엔드 빌드 통과 — `cd apps/web && pnpm build`
- [x] 백엔드 빌드 통과 — `cd apps/api && pnpm build`
- [x] TypeScript 타입 오류 없음 — `pnpm type-check`
- [x] 린트·포맷 통과 — `pnpm lint`
- [x] `console.log` 잔류 없음 확인
- [x] 인라인 스타일·강제 새로고침 코드 제거 확인

### 2단계. 환경변수 ✅

🔴 Vercel

- [x] `NEXT_PUBLIC_API_URL` — Render 백엔드 주소
- [x] `NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL`

🔴 Render

- [x] `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`
- [x] `ANTHROPIC_API_KEY`
- [x] `CLOUDFLARE_R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`
- [x] `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `CORS_ORIGIN`

🟡

- [x] `.env.example` 실제 값 없이 키 이름만 있는지 확인
- [x] `.env`, `.env.local` `.gitignore` 포함 확인

### 3단계. 데이터베이스 ✅

- [x] 마이그레이션 적용 완료
- [x] 회원 탈퇴 버그 수정 — `onDelete: Cascade / SetNull` 적용 완료
- [x] DB 외부 접속 차단 — Render 내장 PostgreSQL, 자동 내부망 격리
- [x] 자동 백업 — Render PostgreSQL 기본 제공 (7일 보관)
- [x] 초기 데이터 삽입 완료 (어드민 계정, 카테고리)

### 4단계. 구글 로그인

- [x] 프로덕션 리다이렉트 URI 등록 완료
- [x] 콜백 주소 확인 완료
- [x] 이메일 인증 발송 테스트 완료
- [ ] 🔴 테스트 모드 → 프로덕션 게시 신청 — **AWS 정식 배포 시 진행**

### 5단계. 콘텐츠 & 기능 완성도 ✅

- [x] VCT 뉴스 — "곧 제공 예정" 문구 처리
- [x] 마이페이지 최근 읽은 뉴스 — "곧 지원될 예정" 문구 처리
- [x] 뉴스 자동수집 수동 실행 확인
- [x] 에디터픽 3개 이상 작성 완료
- [x] 메인 Hero 배너 실제 뉴스 데이터 연동

### 6단계. 법적 페이지 ✅

- [x] `/privacy` 개인정보처리방침 — 완료, 푸터 연결
- [x] `/terms` 이용약관 — 완료, 푸터 연결 (뉴스 출처 제11조 포함)
- [x] 회원가입 약관 동의 체크박스 — 이메일 가입
- [x] Google OAuth consent screen — Privacy Policy / Terms URL 등록
- [x] 푸터 서비스명·이메일·링크 완성

### 7단계. SEO

- [x] `robots.txt` — `/admin`, `/my`, `/auth` 차단
- [x] `sitemap.xml` — `app/sitemap.ts` 동적 생성
- [x] 메타태그 + OG 태그 — 뉴스 상세(JSON-LD 포함), 에디터픽 상세
- [x] 링크 공유 미리보기 테스트 완료
- [x] **메타 태그 자동 생성** — 제목·설명 완료 / 대표 이미지는 썸네일 미구현으로 보류
- [x] **뉴스 구조화 데이터 (NewsArticle JSON-LD)** — 뉴스 상세 페이지 적용 완료, 검색엔진이 "뉴스 기사"로 인식
- [ ] **URL 슬러그** — 현재 `/news/clxxxxxxx` (cuid) 방식 → `/news/gta6-release-date-revealed` 형태로 변경 필요

  **구현 계획:**

  1. **`schema.prisma`** — `News` 모델에 `slug String @unique` 컬럼 추가 후 `pnpm prisma migrate deploy`
  2. **`article-rewriter.ts`** — Claude 재작성 프롬프트 출력 JSON에 `slug` 필드 추가
     - 예시: `"slug": "gta6-release-date-confirmed"`
     - 규칙: 영문 소문자, 하이픈 구분, 30자 이내, 기사 핵심 키워드 반영
  3. **`news.service.ts`** — `runNewsPipeline()` / `runEsportsPipeline()` 에서 slug 포함해서 DB 저장
  4. **`news.controller.ts`** — 기존 `GET /api/news/:id` 에서 id 또는 slug 둘 다 조회 가능하도록 수정 (하위 호환)
  5. **`apps/web/src/app/news/[id]`** → **`[slug]`** 로 폴더명 변경, `fetchArticle()` 파라미터 slug로 교체
  6. **기존 데이터 마이그레이션** — 발행된 기사 전체에 slug 일괄 생성 스크립트 필요
     - Claude API로 기존 기사 제목 → slug 배치 변환 or 제목 기반 단순 slugify 처리

  > ⚠️ 기존 URL이 변경되므로 공유된 링크 깨짐 주의. 현재 내부 배포 단계라 지금이 적기.

### 8단계. 성능 🟡

- [ ] 뉴스 상세 revalidate 1시간 — 적절한지 검토
- [ ] Cloudflare R2 이미지 로딩 속도 실 환경 확인
- [ ] 뉴스 목록·에디터픽 서버 캐싱 여부 확인

### 9단계. 서버 & 도메인

- [ ] 🔴 도메인 연결 — **AWS 정식 배포 시 진행 (커스텀 도메인 재검토)**
- [ ] 🟡 Cloudflare R2 실 도메인 이미지 업로드 확인
- [ ] 🟡 서버 모니터링 설정 (UptimeRobot 등)

### 10단계. 최종 사용 테스트

> AWS 정식 배포 후 직접 확인

- [ ] 회원가입 → 이메일 인증 → 로그인 → 로그아웃
- [ ] 구글 계정 로그인 (프로덕션 환경)
- [ ] 뉴스 상세 진입 → 추천·조회수 확인
- [ ] 커뮤니티 글 작성 → 댓글 → 수정 → 삭제
- [ ] 마이페이지 프로필 사진 변경
- [ ] 어드민 에디터픽 작성·숨김·삭제
- [ ] 모바일(iOS·Android) 레이아웃 확인
- [ ] 없는 주소 → 404 페이지 확인
- [ ] 미인증 상태 `/admin`, `/my` 접근 → 로그인 리다이렉트 확인

---

## 도메인 확정 후 교체 항목 (AWS 이전 시)

> 실제 도메인 확정되면 아래 일괄 교체

- [ ] `apps/web/public/robots.txt` — `Sitemap:` URL (현재 Vercel URL 임시 세팅)
- [ ] Vercel 환경변수 `NEXT_PUBLIC_SITE_URL` — 실제 도메인 (sitemap.ts 사용)
- [ ] Vercel 환경변수 `NEXT_PUBLIC_API_URL` — 백엔드 도메인 변경 시
- [ ] Render 환경변수 `CORS_ORIGIN` — 프론트엔드 도메인 변경 시
- [ ] Render 환경변수 `GOOGLE_CALLBACK_URL` — 백엔드 도메인 변경 시
- [ ] Google Cloud Console — OAuth consent screen Privacy/Terms URL 교체
- [ ] Google Cloud Console — OAuth 리다이렉트 URI 새 도메인 추가

---

## 추후 도입 — Redis

> 도입 트리거: 트래픽 증가, 오토스케일링, JWT 즉시 무효화 필요 시점
> 초기: EC2 직접 설치($0) → 안정화 후 ElastiCache 이전

| 기능                    | 트리거                     | 핵심 변경                                      |
| ----------------------- | -------------------------- | ---------------------------------------------- |
| JWT 블랙리스트          | 로그아웃 후 토큰 탈취 이슈 | `auth.service.ts` logout에서 Redis SET         |
| 뉴스·커뮤니티 목록 캐시 | 메인 페이지 느려질 때      | `news.service.ts`, `posts.service.ts` TTL 캐시 |
| 인기글 캐시             | 상세 페이지 사이드바 부하  | `getPopularNews()` TTL 10분 캐시               |
| 조회수 카운터           | 동시 UPDATE 병목 발생 시   | `INCR news:view:{id}` → 5분마다 DB 반영        |
| Rate Limit 분산         | EC2 2대 이상 확장 시       | ThrottlerModule storage → Redis                |

**공통 작업:**

- `apps/api/src/redis/redis.module.ts` — RedisModule 생성 (ioredis 기반)
- `apps/api/.env.example` — `REDIS_URL=redis://localhost:6379` 추가
- EC2: `sudo apt install redis-server` 또는 ElastiCache 연결
