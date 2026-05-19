커뮤니티 페이지
후속 작업

- API 연동 시 useSearchParams로  
  CategorySidebar 활성 카테고리 동적 연결
- WriteForm 등록 버튼 POST 요청 로직 추가
  (현재 의도적 비활성화)

커뮤니티 crud
경고 사항:

- eslint@8.57.1 deprecated — ESLint  
  v8은 지원 종료됨. 현재는 동작하지만  
  추후 v9로 마이그레이션 필요.

## 해야할 것

[x] 뉴스 상세 페이지 디자인
[x] 뉴스 조회수, 추천수 연결

[x] 모바일에서 레이아웃 수정

- [x] 뉴스 메인 페이지
- [x] 뉴스 상세 페이지
- [x] 커뮤니티

[x] 마이페이지 구현

[x] 관리자 대시보드 생성

- [x] 뉴스수집 자동화 결과 시각화 (파이프라인 로그, 통계)
- [x] api 비용 시각화
- [x] 카테고리 관리 (수정/삭제/추가, 즉각 db 변경, 뉴스 수집 로직 연동)
- [x] 사용자 관리 및 커뮤글, 댓글 관리 (밴·신고 처리)
- [x] 뉴스 소스 관리 (추가·수정·활성화)
- [x] 뉴스 기사 관리 (발행·숨김 처리)
- [x] 뉴스 자동 수집·재작성 파이프라인 (RSS → Claude AI 재작성 → 카테고리 분류)
- [x] 회원 인증 — 이메일 인증, JWT, Refresh Token DB 저장·Rotation, 로그인 유지
- [x] 비밀번호 찾기·재설정

## 고민사항

[x] 뉴스 더보기 클릭 시 반응 고민 -> 페이징 처리

1. 뉴스 DB 분리?

## 회의 안건

1. 메인 커뮤니티 HOT, 상세 커뮤니티 인기들 통일할지 분리할지 고민
2. 뉴스 썸네일 어떻게 가져올지

- 대분류 카테고리별 이미지 미리 지정해놓고 통일하기
- OG Image로 이미지 만들기 HTML으로 썸네일 실시간 생성
- **[4.30 결정] GPT로 생성해서 삽입 — 썸네일·상세 페이지 이미지 통일**

3. 뉴스상세페이지에서 이미지 어떻게 넣을지(이게 진짜 큰 장벽)

- **[4.30 결정] GPT 생성 이미지로 통일 (썸네일과 동일)**

4. 카드 뉴스 템플릿 디자인 정하기

- **[4.30 결정] 어드민 대시보드에서 발행 기사 보고 "카드뉴스 뽑기" 버튼 → 이미지 생성·다운로드**

---

## 4.30 회의 — 다음 작업

- [x] 메인페이지 카테고리 아이콘 수정
- [x] 메인 페이지 카테고리별 뉴스 Hero 섹션 캐러셸 추가 (3초 자동 슬라이드 + 버튼 수동 전환)
- [x] 뉴스 목록 하단 페이지네이션 위 가로 광고 배너 추가 (커뮤니티 HOT 제거 + 728×90 전체 너비 배너로 교체)
- [x] 마이페이지 프로필 이미지 업로드 (Cloudflare R2 연동)
- [x] 마이페이지 반응형 UI 수정
- [] 마이페이지 이미지 테스트 및 이미지 경로 확인 (cloudeflare 확인)
- [ ] 기사 썸네일 + 뉴스 상세 페이지 이미지 GPT로 생성해서 삽입
- [ ] 어드민 대시보드 — 기사 직접 작성·발행 기능
- [ ] 어드민 대시보드 — 발행 기사에서 카드뉴스 뽑기 버튼 (이미지 생성·다운로드)

---

## 배포 전 체크리스트

> 🔴 이거 안 하면 배포 불가 / 🟡 배포 전에 해두면 좋음 / 🟢 배포 후에 천천히 해도 됨

---

### 1단계. 빌드가 정상적으로 되는지 확인

- [x] 프론트엔드 빌드 오류 없이 통과 — `cd apps/web && pnpm build`
- [x] 백엔드 빌드 오류 없이 통과 — `cd apps/api && pnpm build`
- [x] TypeScript 타입 오류 없이 통과 — `pnpm type-check`
- [x] 코드 스타일 검사 통과 — `pnpm lint` (prettier 오류 자동 수정 완료)
- [x] 코드 안에 `console.log` 남아있는 거 없는지 확인 (없음 확인)
- [x] `ProfileCard.tsx` 68번째 줄, `NewsHistoryList.tsx` 68번째 줄 인라인 스타일 제거 (이미 없음)
- [x] `AccountSettings.tsx` 100번째 줄 페이지 강제 새로고침 코드 제거 (이미 없음)

---

### 2단계. 환경변수 세팅 (비밀번호·주소 같은 설정값들)

> 환경변수 = 서버 주소, API 키 같은 값들. 개발용이랑 실제 배포용이 다르므로 반드시 교체

🔴 **Vercel (프론트엔드)**에 아래 값 등록

- [ ] `NEXT_PUBLIC_API_URL` — 실제 백엔드 서버 주소로 변경 (지금은 localhost:3001로 되어있음)
- [ ] `NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL` — 이미지 저장소 주소 확인

🔴 **EC2 서버 (백엔드)** `.env` 파일에 아래 값 세팅

- [ ] `DATABASE_URL` — 실제 RDS 데이터베이스 주소
- [ ] `JWT_SECRET` — 로그인 토큰 암호화 키. 32자 이상 랜덤 문자열로 교체 (절대 깃에 올리지 말 것)
- [ ] `JWT_REFRESH_SECRET` — 로그인 유지 토큰 암호화 키 (위와 다른 값으로)
- [ ] `CLAUDE_API_KEY` — AI 뉴스 재작성에 쓰는 Anthropic API 키
- [ ] `CLOUDFLARE_R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME` — 이미지 업로드 키
- [ ] `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — 구글 로그인 키 (프로덕션용으로 교체)
- [ ] `CORS_ORIGIN` — 실제 프론트엔드 도메인 주소

🟡

- [ ] `.env.example` 파일에 키 이름만 있고 실제 값은 없는지 확인 (깃에 올라가도 안전한 상태여야 함)
- [ ] `.env`, `.env.local` 파일이 `.gitignore`에 포함되어 있는지 재확인

---

### 3단계. 데이터베이스

🔴

- [ ] **실제 DB에 마이그레이션 적용** — `pnpm prisma migrate deploy` 명령어 실행 (개발용 `migrate dev` 아님)
- [ ] **회원 탈퇴 버그 수정** — 게시글·댓글·좋아요 있는 유저가 탈퇴하면 DB 오류 남. `schema.prisma`에서 관련 테이블에 `onDelete: Cascade` 추가 후 마이그레이션 필요
- [ ] RDS 데이터베이스가 외부에서 직접 접속 안 되게 막혀 있는지 확인 (EC2 서버에서만 접속 가능해야 함)

🟡

- [ ] RDS 자동 백업 켜져 있는지 확인 (최소 7일치 보관 설정)
- [ ] 배포 시 초기에 필요한 데이터 미리 넣어두기 — 어드민 계정, 카테고리 등

---

### 4단계. 구글 로그인 설정

🔴

- [ ] **Google Cloud Console에서 프로덕션 도메인 추가**
  - 구글 로그인 후 돌아오는 주소(리다이렉트 URI)에 실제 배포 주소 추가
  - 현재 테스트 모드면 100명 이상 못 씀 → 프로덕션으로 게시 신청 필요
- [ ] 구글 로그인 콜백 주소가 실제 배포 주소로 되어 있는지 확인

🟡

- [ ] 이메일 인증 메일 실제로 발송되는지 테스트 (Gmail 등 실제 주소로 테스트)

---

### 5단계. 콘텐츠 & 기능 완성도

🔴

- [ ] **VCT 뉴스 수집 안 됨** — 현재 LCK(롤)만 자동 수집 중. 발로란트 VCT는 수집 코드 자체가 없음. Riot Esports API에 VCT 리그 ID 추가 필요
- [ ] **마이페이지 최근 읽은 뉴스 안 나옴** — 항상 빈 목록만 뜸. 배포 전에 구현하거나, 일단 "준비 중입니다" 문구 띄우기

🟡

- [ ] 뉴스 자동 수집이 실제로 잘 돌아가는지 서버에서 한 번 수동 실행해서 확인 (RSS 가져오기 → AI 재작성 → DB 저장)
- [ ] 에디터픽 — 배포 전에 최소 3개 이상 미리 작성해두기 (메인 화면에 빈 섹션 뜨면 이상함)
- [ ] 메인 Hero 배너 — 현재 가짜 데이터(mock) 사용 중. 실제 뉴스 데이터로 바꿀지 결정 필요

---

### 6단계. 법적으로 꼭 있어야 하는 페이지

🔴 회원가입 받는 서비스는 법적으로 아래가 필수

- [ ] **개인정보처리방침 페이지** 만들기 (`/privacy`)
  - 어떤 정보를 수집하는지 (이메일, 닉네임, 프로필 사진)
  - 얼마나 보관하는지
  - 구글 로그인처럼 제3자에게 제공되는 게 있는지 명시
  - 푸터에 링크 연결
- [ ] **이용약관 페이지** 만들기 (`/terms`)
  - 서비스 이용 규칙, 하면 안 되는 행동, 계정 정지 기준
  - 회원가입 화면에 "동의합니다" 체크박스 연결
- [ ] 회원가입 화면에 약관 동의 체크박스 있는지 확인

🟡

- [ ] RSS로 가져온 뉴스 기사에 원본 출처 표기 방식 정하기 (기사 하단에 "출처: 게임메카" 같은 형태)
- [ ] 푸터에 서비스 이름, 연락 이메일, 개인정보처리방침·이용약관 링크 채우기

---

### 7단계. 검색 엔진 노출 (SEO)

🟡

- [ ] `public/robots.txt` 파일 확인 — 구글 등 검색봇이 어드민 페이지(`/admin`)는 못 보게 막혀 있는지
- [ ] 사이트맵(`sitemap.xml`) 만들기 — 검색 엔진이 뉴스 페이지들을 잘 찾을 수 있게
- [ ] 각 페이지 제목(탭에 뜨는 이름)과 설명 태그 확인
  - 뉴스 상세: 기사 제목으로 자동 생성 ✅
  - 에디터픽 상세: 제목·썸네일 정보 추가 필요
  - 커뮤니티·마이페이지: 기본 제목 있는지 확인
- [ ] 카카오톡이나 디스코드 등에 링크 공유 시 미리보기(썸네일+제목)가 잘 뜨는지 테스트

---

### 8단계. 속도 & 성능

🟡

- [ ] 뉴스 상세 페이지 — 현재 1시간에 한 번 자동 새로고침 되도록 설정되어 있음. 적절한지 확인
- [ ] 이미지가 느리게 로딩되진 않는지 — Cloudflare R2 이미지가 빠르게 뜨는지 실제 확인
- [ ] 뉴스 목록, 에디터픽 등 자주 보는 데이터를 서버에서 캐싱하고 있는지 확인

---

### 9단계. 서버 & 도메인 연결

🔴

- [ ] **도메인 연결**
  - 프론트엔드(Vercel) — 구매한 도메인 연결하고 HTTPS 자동 발급 확인
  - 백엔드(EC2) — 도메인 또는 서버 주소로 접근 가능하고 HTTPS 적용됐는지 확인
- [ ] **서버 자동 재시작 설정** — EC2 서버가 재부팅됐을 때 백엔드 앱이 자동으로 다시 켜지는지 확인 (`pm2` 사용)

🟡

- [ ] EC2 방화벽 설정 — 웹(80, 443)이랑 관리용 SSH(22, 내 IP만) 포트 외엔 다 막기
- [ ] Nginx 설정 — 외부 요청을 백엔드 앱(3001 포트)으로 넘겨주는 설정 확인
- [ ] 이미지 업로드(Cloudflare R2) — 실제 도메인에서 업로드가 잘 되는지 확인
- [ ] 서버 다운되면 알림 받을 수 있게 모니터링 설정 (UptimeRobot 같은 무료 서비스 활용 가능)

---

### 10단계. 최종 실제 사용 테스트 (배포 직전)

> 코드가 아니라 실제로 써보면서 확인

- [ ] 회원가입 → 이메일 인증 → 로그인 → 로그아웃 순서로 해보기
- [ ] 구글 계정으로 로그인 해보기 (프로덕션 환경에서)
- [ ] 뉴스 클릭해서 상세 페이지 들어가기, 추천 버튼 눌러보기, 조회수 올라가는지 확인
- [ ] 커뮤니티 글 쓰기 → 댓글 달기 → 수정 → 삭제 해보기
- [ ] 마이페이지에서 프로필 사진 바꿔보기
- [ ] 어드민 계정으로 에디터픽 작성 → 숨기기 → 삭제 해보기
- [ ] 휴대폰(아이폰·안드로이드)으로 주요 페이지 레이아웃 확인
- [ ] 없는 주소 들어갔을 때 404 페이지 뜨는지 확인 (예: `/없는페이지`)
- [ ] 로그인 안 한 상태에서 `/admin`, `/my` 들어가면 로그인 페이지로 이동하는지 확인

---

## 추후 붙여야 할 것 — Redis

### 도입 시점
트래픽 증가, 오토스케일링, JWT 즉시 무효화 필요 시점에 도입.  
초기에는 EC2에 직접 설치($0), 안정화 후 ElastiCache 이전.

---

### 1. JWT 블랙리스트 (accessToken 즉시 무효화)
**도입 트리거:** 로그아웃 후 탈취된 토큰이 1시간 유효한 보안 이슈

수정 파일:
- `apps/api/src/auth/auth.service.ts` — `logout()` 에서 accessToken을 Redis에 `SET blacklist:{token} 1 EX 3600` 저장
- `apps/api/src/auth/strategies/jwt.strategy.ts` — `validate()` 에서 Redis 블랙리스트 조회 후 차단
- `apps/api/src/auth/auth.module.ts` — RedisModule import 추가

---

### 2. 뉴스 목록 / 커뮤니티 목록 캐시
**도입 트리거:** 메인 페이지 로딩 느려질 때, 동시 접속자 증가 시

수정 파일:
- `apps/api/src/news/news.service.ts` — `getNewsList()` 결과를 `news:list:{category}:{page}` 키로 캐시 (TTL 2분)
- `apps/api/src/posts/posts.service.ts` — `getPosts()` 결과를 `posts:list:{category}:{page}` 키로 캐시 (TTL 1분)
- 뉴스/게시글 생성·수정·삭제 시 관련 캐시 키 invalidate 처리

---

### 3. 인기글 캐시 (뉴스 상세 페이지 사이드바)
**도입 트리거:** 위와 동일, 상세 페이지 진입 시 사이드바 쿼리 부하

수정 파일:
- `apps/api/src/news/news.service.ts` — `getPopularNews()` 결과를 `news:popular:{category}` 키로 캐시 (TTL 10분)
- `apps/api/src/posts/posts.service.ts` — 커뮤니티 인기글 결과를 `posts:popular` 키로 캐시 (TTL 5분)
- `apps/web/src/app/news/[id]/page.tsx` — 사이드바 인기글 API 호출 그대로 유지 (백엔드에서 처리)

---

### 4. 조회수 카운터
**도입 트리거:** 인기 기사에 동시 조회수 UPDATE 병목 발생 시

수정 파일:
- `apps/api/src/news/news.service.ts` — `incrementViewCount()` 를 DB UPDATE 대신 `INCR news:view:{id}` 로 변경
- 배치 작업(크론) 추가 — 5분마다 Redis 카운터를 DB에 반영 후 초기화
- `apps/api/prisma/schema.prisma` — 변경 없음 (DB 컬럼 유지)

---

### 5. Rate Limit 분산 처리
**도입 트리거:** EC2 인스턴스 2대 이상으로 늘릴 때

수정 파일:
- `apps/api/package.json` — `@nestjs/throttler`, `@nestjs-modules/ioredis` 또는 `cache-manager-redis-store` 추가
- `apps/api/src/app.module.ts` — `ThrottlerModule` storage를 `ThrottlerStorageRedisService`로 교체
- `apps/api/.env.example` — `REDIS_URL` 환경변수 추가
- `apps/api/src/auth/auth.controller.ts` — Rate Limit 하드코딩 값(`limit: 3, ttl: 300000` 등)을 config로 분리
- `apps/api/src/editor-picks/editor-picks.controller.ts` — 동일
- `apps/api/src/uploads/upload.controller.ts` — 동일

---

### 공통 작업 (Redis 도입 시 무조건 필요)
- `apps/api/src/redis/redis.module.ts` — RedisModule 생성 (ioredis 기반)
- `apps/api/.env.example` — `REDIS_URL=redis://localhost:6379` 추가
- EC2 설정 — `sudo apt install redis-server` 또는 ElastiCache 엔드포인트 연결
