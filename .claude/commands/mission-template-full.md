# MISSION: [기능명] — Full Stack

## 운영 원칙
- 중간에 CEO에게 질문하거나 확인을 구하지 않는다
- 모호한 부분은 합리적으로 판단하고 진행, 최종 보고서에 명시
- 완료 후 한 번만 보고
- **작업 순서: Backend → QA → Frontend → QA → 보고**

---

## 기술 스택 컨텍스트
- **Frontend**: Next.js 14 App Router / TypeScript / Tailwind CSS
- **Backend**: NestJS / Prisma ORM / TypeScript
- **공통 타입**: packages/shared/src/types 참고
- **공통 검증 규칙**: packages/shared/src/validators 참고
- **관련 DB 모델**: [테이블명] (schema.prisma 참고)
- **기타**: [필요한 외부 패키지]

---

## 1. 기능 개요
[기능에 대한 1~3줄 설명]

---

## 2. 전체 플로우
```
[유저 액션]
↓
[Frontend → API 호출]
↓
[Backend 처리]
↓
[DB 반영]
↓
[UI 업데이트]
```

---

## 3. Backend 명세

### API 엔드포인트

| Method | URL | 설명 | 인증 | Rate Limit |
|--------|-----|------|------|------------|
| [METHOD] | /api/[경로] | [설명] | 필요/불필요 | 기본/엄격 |

### 상세 구현
```typescript
// [엔드포인트명]
// Request
{ 필드: 타입 }

// 처리
- [단계별 처리]
- [에러 케이스] → [상태코드] "[메시지]"

// Response
{ 필드: 타입 }
```

### 보안 처리
```
- 입력값: @IsString(), @IsEmail() 등 class-validator 적용
- 인증: JwtAuthGuard / RolesGuard
- 응답: password 등 민감 필드 제외
- $queryRaw 사용 금지
- Rate Limit: [필요 시 명시]
```

---

## 4. Frontend 명세

### 파일 구조
```
apps/web/src/
├── app/[경로]/page.tsx
├── components/[도메인]/[컴포넌트].tsx
└── hooks/use[기능].ts
```

### UI/UX 요구사항
- [레이아웃]
- [인터랙션]
- 로딩: Skeleton UI
- 에러: 인라인 or 토스트
- 빈 상태: Empty State

### 렌더링 전략
```
[페이지]: [SSG/ISR/SSR/CSR] — [이유]
```

### 유효성 검사
```
필드명: 규칙 (shared validator 사용)
```

---

## 5. Shared 타입 추가 (필요 시)
```typescript
// packages/shared/src/types/[파일명].ts 에 추가
export interface [타입명] {
  필드: 타입
}
```

---

## 6. 작업 순서 (Orchestrator → 각 Agent 분배)
```
1. @backend  → API 구현 + 보안 처리
2. @qa       → 백엔드 정상/에러/보안 케이스 검증
3. @frontend → UI 구현 + API 연동
4. @qa       → UI/UX + 연동 검증
5. orchestrator → CEO 보고
```

---

## 7. 완료 기준 (Done Criteria)
```
□ [핵심 기능 정상 동작]
□ [에러 케이스 처리]
□ [보안 처리 확인]
□ 로딩 / 에러 / 빈 상태 UI 확인
□ API 응답에 민감 정보 없음
□ tsc --noEmit 타입 에러 없음 (web + api 모두)
□ pnpm lint 통과
□ QA 테스트 통과
```
