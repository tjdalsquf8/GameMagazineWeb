# MISSION: [기능명] — Frontend

## 운영 원칙
- 중간에 CEO에게 질문하거나 확인을 구하지 않는다
- 모호한 부분은 합리적으로 판단하고 진행, 최종 보고서에 명시
- 완료 후 한 번만 보고

---

## 기술 스택 컨텍스트
- **Frontend**: Next.js 14 App Router / TypeScript / Tailwind CSS
- **상태관리**: Zustand (전역) / React Query (서버 상태)
- **공통 타입**: packages/shared/src/types 참고
- **공통 검증 규칙**: packages/shared/src/validators 참고
- **API 클라이언트**: apps/web/src/lib/api/client.ts 사용 (직접 fetch 금지)
- **연동할 API**: [백엔드 엔드포인트 목록]

---

## 1. 기능 개요
[기능에 대한 1~3줄 설명]

---

## 2. 핵심 플로우
```
[유저 액션]
↓
[UI 반응 / 상태 변경]
↓
[API 호출]
↓
[결과 반영]
```

---

## 3. 파일 구조
```
apps/web/src/
├── app/
│   └── [경로]/
│       ├── layout.tsx      # 필요 시
│       └── page.tsx
├── components/
│   └── [도메인]/
│       └── [컴포넌트명].tsx
├── hooks/
│   └── use[기능명].ts
└── stores/
    └── [기능명].store.ts   # 필요 시
```

---

## 4. UI/UX 명세

### 레이아웃
- [전체 레이아웃 구조 설명]
- [반응형 breakpoint 요구사항]

### 컴포넌트별 요구사항
```
[컴포넌트명]:
- [역할]
- [Props 목록]
- [인터랙션]
```

### 공통 UX 처리 (필수 적용)
```
- 로딩 상태: Skeleton UI 적용
- 에러 상태: 사용자 피드백 (토스트 or 인라인 에러)
- 빈 상태: Empty State UI
- 버튼 클릭 중: disabled + 스피너
```

---

## 5. 유효성 검사
```
- 프론트 실시간 검사 + 백엔드 이중 적용 원칙
- packages/shared/src/validators의 규칙 import해서 사용

필드명: 규칙 (shared validator 사용)
```

---

## 6. 렌더링 전략
```
해당 페이지: SSG / ISR (revalidate: N초) / SSR / CSR
이유: [선택 이유]
```

---

## 7. 보안 처리
```
- 인증 필요 페이지: middleware.ts에서 리다이렉트 처리
- 민감 정보 localStorage 저장 금지
- NEXT_PUBLIC_ 환경변수에 시크릿 포함 금지
- dangerouslySetInnerHTML 사용 금지
```

---

## 8. 완료 기준 (Done Criteria)
```
□ [핵심 기능 동작 확인]
□ 로딩 / 에러 / 빈 상태 UI 모두 구현 확인
□ 모바일 레이아웃 정상 동작 확인
□ 인증 필요 페이지 비로그인 접근 시 리다이렉트 확인
□ 유효성 검사 동작 확인
□ tsc --noEmit 타입 에러 없음
□ pnpm lint 통과
```
