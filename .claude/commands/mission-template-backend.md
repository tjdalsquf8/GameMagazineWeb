# MISSION: [기능명] — Backend

## 운영 원칙
- 중간에 CEO에게 질문하거나 확인을 구하지 않는다
- 모호한 부분은 합리적으로 판단하고 진행, 최종 보고서에 명시
- 완료 후 한 번만 보고

---

## 기술 스택 컨텍스트
- **Backend**: NestJS / Prisma ORM / TypeScript
- **관련 DB 모델**: [관련 테이블명] (apps/api/src/prisma/schema.prisma 참고)
- **공통 타입**: packages/shared/src/types 참고
- **공통 검증 규칙**: packages/shared/src/validators 참고
- **기타**: [필요한 외부 패키지 등]

---

## 1. 기능 개요
[기능에 대한 1~3줄 설명]

---

## 2. 핵심 플로우
```
[요청]
↓
[Guard / 인증 확인]
↓
[비즈니스 로직]
↓
[DB 처리]
↓
[응답]
```

---

## 3. API 엔드포인트 명세

| Method | URL | 설명 | 인증 | Rate Limit |
|--------|-----|------|------|------------|
| GET/POST/PUT/DELETE | /api/[경로] | [설명] | 필요/불필요 | 기본/엄격(10회/분) |

---

## 4. 상세 구현 명세

### [엔드포인트명]
```typescript
// Request DTO
{ 필드: 타입 }

// 처리 순서
1. [입력값 검증]
2. [비즈니스 로직]
3. [DB 처리]
4. [응답 반환]

// 에러 케이스
- [상황] → [HTTP 상태코드] "[에러 메시지]"

// Response
{ 필드: 타입 }
```

---

## 5. 보안 / 예외처리 명세

### 입력값 검증 (class-validator)
```
필드명: @데코레이터() — 설명
```
> DTO에 whitelist: true, forbidNonWhitelisted: true 전역 적용 확인

### 접근 제어
```
- 인증 필요: @UseGuards(JwtAuthGuard) 적용
- 어드민 전용: @UseGuards(JwtAuthGuard, RolesGuard) + @Roles(Role.ADMIN)
- 본인 리소스만: authorId === currentUser.id 검증
```

### 데이터 보안
```
- API 응답에 password 필드 절대 포함 금지
- $queryRaw / $executeRaw 사용 금지
- 사용자 입력 HTML 태그 허용 금지
- [기능별 추가 보안 사항]
```

### Rate Limiting (필요 시)
```typescript
// 엔드포인트 단위 적용
@Throttle({ default: { limit: 10, ttl: 60000 } })
```

---

## 6. 파일 구조
```
apps/api/src/modules/[모듈명]/
├── dto/
│   ├── [기능].dto.ts
│   └── ...
├── [모듈명].controller.ts
├── [모듈명].service.ts
└── [모듈명].module.ts
```

---

## 7. 완료 기준 (Done Criteria)
```
□ [정상 케이스 동작 확인]
□ [에러 케이스 처리 확인]
□ [보안 처리 확인]
□ API 응답에 민감 정보 없는지 확인
□ Soft Delete 적용 대상은 deletedAt 필터링 확인
□ tsc --noEmit 타입 에러 없음
□ pnpm lint 통과
```
