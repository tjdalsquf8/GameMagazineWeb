# Game Magazine - 프로젝트 컨텍스트

## 프로젝트 개요
게임 뉴스 매거진 웹서비스. 뉴스 메인/상세 페이지 + 커뮤니티 기능.
1인 개발 + 바이브코딩 장기 운영 프로젝트.

## 기술 스택
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeScript, Prisma ORM
- **Database**: PostgreSQL (AWS RDS)
- **Auth**: Passport.js + JWT (개발: 이메일, 배포: Google OAuth)
- **Storage**: Cloudflare R2
- **Deploy**: Vercel (FE) + AWS EC2 / RDS (BE)

## 레포 구조
```
game-magazine/
├── apps/
│   ├── web/          # Next.js 프론트엔드
│   └── api/          # NestJS 백엔드
├── packages/
│   └── shared/       # 공통 타입, 유틸
├── CLAUDE.md
└── .claude/
    ├── agents/       # 서브에이전트 정의
    └── commands/     # 슬래시 커맨드
```

## 조직 구조 및 지시 체계
```
CEO (나) → orchestrator → frontend / backend → qa → orchestrator → CEO 보고
CEO (나) → security (보안 점검 기간에 직접 호출)
```
- CEO가 orchestrator에게 임무 전달
- orchestrator가 frontend/backend에 역할 분배
- 구현 완료 후 qa가 테스트
- qa 통과 후 orchestrator가 CEO에게 종합 보고
- security는 CEO가 직접 호출, 주기적 전체 보안 점검

## 핵심 개발 원칙
- 모든 코드는 **TypeScript strict 모드**
- 컴포넌트/모듈은 **단일 책임 원칙** 준수
- 공통 컴포넌트, 공통 스타일, 공통 타입은 **반드시 분리**
- API 응답 포맷은 **전역 통일** (아래 참고)
- 커밋 전 lint + type-check 통과 필수

## 통일 API 응답 포맷
```typescript
// 성공
{ success: true, data: T, message?: string }
// 실패
{ success: false, error: { code: string, message: string } }
```

## 공통 스타일 규칙
- 들여쓰기: 2 spaces
- 따옴표: single quote
- 세미콜론: 없음 (no semicolons)
- import 순서: 외부 라이브러리 → 내부 모듈 → 상대 경로
- 컴포넌트 파일명: PascalCase (NewsCard.tsx)
- 훅/유틸 파일명: camelCase (useAuth.ts)
- 상수: UPPER_SNAKE_CASE

## 주요 명령어
```bash
# 프론트엔드
cd apps/web
pnpm dev          # 개발 서버
pnpm build        # 빌드
pnpm lint         # 린트
pnpm type-check   # 타입 체크

# 백엔드
cd apps/api
pnpm start:dev    # 개발 서버
pnpm build        # 빌드
pnpm lint         # 린트
pnpm test         # 유닛 테스트
pnpm test:e2e     # E2E 테스트

# DB
pnpm prisma migrate dev   # 마이그레이션
pnpm prisma studio        # DB GUI
pnpm prisma generate      # 타입 생성
```

## 환경변수
- 절대 하드코딩 금지
- `.env.example` 항상 최신 상태 유지
- 시크릿은 `.env.local` (gitignore)

## 금지 사항
- `any` 타입 사용 금지
- `console.log` 프로덕션 코드에 잔류 금지 (logger 사용)
- 직접 DOM 조작 금지 (React 패턴 사용)
- 인라인 스타일 금지 (Tailwind 클래스 사용)
