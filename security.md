# 보안 이슈 트래커

> 코드 분석 및 보안 점검에서 발견된 이슈들을 추적합니다.
> ✅ = 완료 / 🔴 = 실제 장애·보안 사고 위험 / 🟡 = 운영 품질 저하 가능성

---

## 로그인 / 회원가입

- ✅ **비밀번호 변경·재설정 시 기존 세션 미무효화** — `apps/api/src/users/users.service.ts`, `apps/api/src/auth/auth.service.ts`
  `updatePassword()`, `resetPassword()` 완료 시점에 `prisma.refreshToken.deleteMany({ where: { userId } })` 추가 완료.

- ✅ **회원탈퇴 시 비밀번호 재확인 없음** — `apps/api/src/users/users.controller.ts`
  `DeleteAccountDto`(password 필드) 추가, bcrypt 검증 로직 적용 완료. 프론트 탈퇴 모달에 비밀번호 입력 필드 추가 완료.

- ✅ **JwtModule 기본 expiresIn 24h — 코드 변경 시 회귀 위험** — `apps/api/src/auth/auth.module.ts`
  `signOptions.expiresIn` `"24h"` → `"1h"` 통일 완료.

- ✅ **이메일 대소문자 정규화 미적용** — `apps/api/src/auth/dto/`
  회원가입·로그인·비밀번호찾기·인증코드 등 이메일 관련 DTO 전체에 `@Transform` 소문자 정규화 추가 완료.

- ✅ **이메일 인증 코드 실패 횟수 제한 없음** — `apps/api/src/auth/auth.service.ts`
  `EmailVerification` 모델에 `failCount` 필드 추가, 연속 5회 실패 시 코드 무효화 처리 완료.

- ✅ **정지 만료 시 DB 자동 업데이트 미구현** — `apps/api/src/auth/strategies/jwt.strategy.ts`
  정지 만료 감지 시 `isBanned: false, bannedUntil: null, banReason: null` DB 자동 업데이트 추가 완료.

- ✅ **비밀번호 변경 DTO 복잡도 검증 누락** — `apps/api/src/users/dto/update-password.dto.ts`
  `@Matches(/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/)` 추가 완료.

- ✅ **accessToken localStorage 평문 저장** — `apps/web/src/store/authStore.ts`
  persist `partialize`에서 accessToken 제외 완료. 새로고침 시 AuthProvider silentRefresh로 재발급.

- ✅ **JWT 정지 사용자 체크 누락** — `apps/api/src/auth/strategies/jwt.strategy.ts`
  `JwtStrategy.validate()`에서 `isBanned`, `bannedUntil` 조회 후 정지 시 `ForbiddenException` throw 완료.
  프론트 `client.ts` 403 인터셉터 추가 — 정지 메시지 토스트 표시 후 자동 로그아웃.

- ✅ **Access Token 만료 시간 24시간** — `apps/api/src/auth/auth.service.ts:239,306`
  `expiresIn: "1h"` 로 변경 완료. login, refresh 두 곳 모두 적용.

- ✅ **accessToken 쿠키 max-age 불일치** — `apps/web/src/lib/api/client.ts:84`
  `max-age=3600` 으로 통일 완료. AuthProvider와 일치.

- ✅ **JWT 시크릿 하드코딩 폴백** — `apps/api/src/auth/auth.module.ts`
  `configService.getOrThrow('JWT_SECRET')`로 교체 완료.

- ✅ **JWT Refresh Token Rotation** — `apps/api/src/auth/`
  Refresh Token DB 저장 + 사용 즉시 무효화(Rotation) 완료. 탈취 후 재사용 불가.

- ✅ **쿠키 보안 설정** — `apps/api/src/auth/auth.controller.ts`
  `secure: isProd`, `sameSite: isProd ? 'lax' : 'strict'` 적용 완료.

- ✅ **Rate Limiting** — `apps/api/src/app.module.ts` + `auth.controller.ts`
  전역 100회/분, 로그인 10회/분, 이메일발송·비밀번호찾기 3회/5분.

- ✅ **미들웨어 토큰 서명 검증** — `apps/web/src/middleware.ts`
  `jose` 설치 후 `jwtVerify`로 서명 검증 적용. `JWT_SECRET` env 미설정 시 fail-closed 처리.

- ✅ **Silent Refresh 후 쿠키 갱신** — `apps/web/src/components/auth/AuthProvider.tsx`
  쿠키 갱신 이미 구현됨 확인. `max-age` 86400→3600(JWT 만료와 일치), `samesite=lax`, HTTPS 환경 `secure` 플래그 추가.

- ✅ **API 응답 비밀번호 필드 노출** — 전체 user 쿼리 검증 완료.
  `USER_PROFILE_SELECT` 상수 및 모든 `prisma.user` 쿼리에 `select` 명시 확인. password 필드 응답 노출 없음.

---

## 뉴스 (메인 + 상세)

- ✅ **Lolesports API 키 하드코딩** — `apps/api/src/news/pipeline/esports-collector.ts`
  `apiKey` 인자로 주입받도록 변경. `news.service.ts`에서 `ConfigService.getOrThrow('LOLESPORTS_API_KEY')` 전달. `.env.example` 추가 완료.

- ✅ **뉴스 조회수 API Rate Limiting 없음** — `apps/api/src/news/news.controller.ts`
  `POST /:id/view`에 `@Throttle({ default: { limit: 1, ttl: 86400000 } })` 추가. IP당 24시간 1회 제한 완료.

- ✅ **popular 엔드포인트 limit 상한 없음** — `apps/api/src/news/news.controller.ts`
  `Math.min(limit, 50)` 클램핑 적용 완료. 최대 50개 강제.

- ✅ **sanitize 허용 속성에 style 포함** — `apps/web/src/lib/utils/sanitize.ts`
  `ALLOWED_ATTR`에서 `'style'` 제거 완료. 클릭재킹 벡터 차단.

- ✅ **뉴스 ID 경로 파라미터 형식 검증 없음** — `apps/api/src/news/news.controller.ts`
  `ParseCuidPipe` 신규 생성(`common/pipes/parse-cuid.pipe.ts`). cuid v1 형식(`/^c[a-z0-9]{24}$/`) 검증, 실패 시 400 반환 완료.

- ✅ **RSS 수집 무한 리다이렉트·대용량 응답 방어 없음** — `apps/api/src/news/pipeline/rss-collector.ts`
  `maxRedirects: 3` 추가. 파싱 후 5MB 초과 시 오류 처리 완료.

- ✅ **AI 재작성 JSON 파싱 실패 시 원본 응답 미로깅** — `apps/api/src/news/pipeline/article-rewriter.ts`
  catch 블록에 `this.logger.error(\`원본 응답: \${responseText.slice(0, 500)}\`)` 추가 완료.

- ✅ **ArticleBody XSS** — `apps/web/src/app/news/[id]/_components/ArticleBody.tsx`
  RSS 수집 기사 포함 모든 본문에 `sanitizeHTML()` 적용 완료.

- ✅ **SSR 환경 XSS 방어 비활성** — `apps/web/src/lib/utils/sanitize.ts`
  `dompurify` → `isomorphic-dompurify` 교체, `typeof window === 'undefined'` 건너뜀 제거 완료.

- ✅ **뉴스 limit 쿼리 파라미터 검증** — `apps/api/src/news/news.controller.ts`
  `ParseIntPipe` + `DefaultValuePipe` 적용 완료. 음수·문자열 차단.

---

## 커뮤니티

- ✅ **게시글·댓글 content 길이 제한** — `create-post.dto.ts`, `create-comment.dto.ts`
  `@MaxLength(50000)` 추가 완료. 수십 MB 텍스트 저장으로 인한 DB 과부하 방지.

- ✅ **페이지네이션 limit 상한** — `apps/api/src/posts/dto/post-query.dto.ts`
  `@Max(100)` 추가 완료. `limit=99999` DoS 차단.

- ✅ **신고 목록 N+1 쿼리** — `apps/api/src/admin/admin.service.ts`
  배치 쿼리로 개선 완료.

- ✅ **수정 DTO MaxLength 누락** — `apps/api/src/posts/dto/update-post.dto.ts`, `apps/api/src/comments/dto/update-comment.dto.ts`
  title `@MaxLength(100)`, content `@MaxLength(50000)`, comment content `@MaxLength(1000)` 추가 완료.

- ✅ **조회수 API Rate Limiting 없음** — `apps/api/src/posts/posts.controller.ts`
  `@Throttle({ default: { limit: 1, ttl: 86400000 } })` 추가. IP당 24시간 1회 제한 완료.

- (정책 결정) **자기 자신 게시글·댓글 추천** — 본인 추천 허용으로 정책 확정. 차단 로직 미적용.

- ✅ **댓글 총 개수 집계에 삭제 댓글 포함** — `apps/api/src/comments/comments.service.ts`
  `count` where 조건에 `deletedAt: null, isHidden: false` 추가 완료.

- ✅ **수정 textarea maxLength 없음 (프론트)** — `apps/web/src/components/community/CommentItem.tsx`
  인라인 수정 textarea 2곳에 `maxLength={1000}` 추가 완료.

- ✅ **숨김 처리된 댓글 본인이 수정 가능** — `apps/api/src/comments/comments.service.ts`
  `updateComment` where 조건에 `isHidden: false` 추가 완료.

---

## 마이페이지

- ✅ **프로필 이미지 URL 도메인 검증 누락** — `apps/api/src/users/users.service.ts`
  `updateProfileImage`에 R2_PUBLIC_URL 화이트리스트 검증 추가. 외부 URL 시 BadRequestException 완료.

- ✅ **파일 업로드 Magic Number 검증** — `apps/api/src/uploads/`
  `POST /uploads/verify` 추가. R2 업로드 후 첫 12바이트로 JPEG·PNG·WEBP Magic Number 검증.
  실패 시 R2 파일 즉시 삭제. `useImageUpload.ts`에서 XHR 완료 직후 verify 호출.

- ✅ **R2 자격증명 ConfigService 미사용** — `apps/api/src/uploads/upload.service.ts`
  `process.env.R2_*!` → `ConfigService.getOrThrow()`로 전부 교체 완료.

---

## 관리자

- ✅ **어드민이 자기 자신을 강등·정지·삭제 가능** — `apps/api/src/admin/admin.service.ts`
  `banUser`, `unbanUser`, `updateRole`, `deleteUser`에 `actorId` 파라미터 추가, 자기 자신 대상 시 `BadRequestException` throw 완료.

- ✅ **어드민 페이지네이션 limit 상한 없음** — `apps/api/src/admin/admin.service.ts`
  `getArticles`, `getPipelineLogs`, `getUsers`, `getPosts`, `getReports` 전체에 `Math.min(limit, 100)` 적용 완료.

- ✅ **어드민 작업 감사 로그에 행위자 정보 없음** — `apps/api/prisma/schema.prisma`
  `BanHistory`에 `adminId String?` 필드 추가. 마이그레이션 적용 완료. `banUser` 호출 시 adminId 저장.

- ✅ **신고 처리 Race Condition** — `apps/api/src/admin/admin.service.ts`
  `handleReport` 트랜잭션 진입 전 `report.status !== 'PENDING'` 검사 추가. 중복 처리 시 `ConflictException` 완료.

- ✅ **뉴스 파이프라인 API 인증 없음** — `apps/api/src/news/news.controller.ts`
  `@UseGuards(AdminGuard)` 추가 완료.

- ✅ **`/admin` 라우트 미들웨어 미보호** — `apps/web/src/middleware.ts`
  `matcher`에 `/admin/:path*` 추가 및 adminOnly 체크 로직 적용 완료.

- ✅ **CardNewsSlide XSS** — `apps/web/src/components/admin/CardNewsSlide.tsx`
  `dangerouslySetInnerHTML`에 `sanitizeHTML()` 래핑 완료.

- ✅ **Anthropic API 키 process.env 직접 접근** — `news.service.ts`, `admin.service.ts`
  `ConfigService`로 교체 완료.

- ✅ **어드민 API 접근 제어 검증**
  `admin/*` 전체 컨트롤러 레벨 AdminGuard, 에디터픽·뉴스파이프라인 메서드 레벨 AdminGuard 확인 완료. 일반 계정 호출 시 403 반환.

---

## 공통 / 인프라

- ✅ **Next.js 신규 CVE 미패치 (14.2.32 → 14.2.35)** — `apps/web/package.json`
  `next@14.2.35`, `eslint-config-next@14.2.35` 업그레이드 완료. CVE-2025-55184, CVE-2025-67779 패치.

- ✅ **accessToken localStorage 평문 저장** — `apps/web/src/store/authStore.ts`
  로그인 섹션에서 이미 완료. persist partialize에서 accessToken 제외, silentRefresh 재발급 적용.

- ✅ **API URL localhost 폴백 패턴 잔존** — `NewsMainClient.tsx`, `Sidebar.tsx`
  이미 `env.apiUrl` 사용 중으로 확인. 추가 수정 불필요.

- ✅ **accessToken 쿠키 HttpOnly 미적용** — `apps/api/src/auth/auth.controller.ts`
  login·refresh·logout 3개 엔드포인트 모두 accessToken HttpOnly 쿠키로 설정. `client.ts`·`AuthProvider.tsx`에서 document.cookie 수동 설정 코드 제거 완료.

- ✅ **Prisma 쿼리 로그 명시적 설정 없음** — `apps/api/src/prisma/prisma.service.ts`
  `log: isProd ? ['error'] : ['warn', 'error']` 추가 완료. 프로덕션 쿼리 로그 차단.

- ✅ **Next.js 복수 CVE** — `apps/web/package.json`
  `next@14.2.29` → `14.2.32` 업그레이드 완료. CVE-2025-57822, CVE-2025-57752, CVE-2025-55173 패치.

- ✅ **glob CLI Command Injection (CVE-2025-64756)** — 루트 `package.json`
  `pnpm.overrides`에 `"glob": ">=10.5.0"` 추가 완료.

- ✅ **Helmet.js 미적용** — `apps/api/src/main.ts`
  `helmet` 패키지 설치 후 `app.use(helmet())` 추가 완료.

- ✅ **`.env.example` API 키 패턴 노출** — `apps/api/.env.example`
  `sk-ant-...` → `your-anthropic-api-key` 교체 완료.

- ✅ **API URL localhost 하드코딩 폴백** — `lib/api/client.ts`, `AuthProvider.tsx` 등 다수
  폴백 제거, env 누락 시 빌드 시점 에러 처리 적용 완료.

- ✅ **CORS 설정** — `apps/api/src/main.ts`
  `NODE_ENV=production`에서 `FRONTEND_URL` 미설정 시 서버 시작 차단. 개발 환경은 localhost:3000 유지.

- ✅ **에러 바운더리** — `apps/web/src/app/`
  루트·admin·news/[id]·community에 `error.tsx` 추가. `error.message` 화면 노출 차단, `console.error`로만 기록.

- 🟡 **RDS 외부 접속 차단 확인**
  EC2에서만 접속 가능하도록 RDS 보안 그룹 설정 검증 필요.

- 🟡 **EC2 방화벽 포트 최소화**
  80, 443, SSH(22, 내 IP만) 외 모든 포트 차단 확인.

---

## 배포 시 체크

- `robots.txt`에서 `/admin` 크롤링 차단 확인
- 비밀번호 bcrypt 암호화 저장 확인
- HTTPS 강제 리다이렉트 (HTTP → HTTPS)
- Google OAuth 프로덕션 앱 게시 및 리다이렉트 URI 확인
