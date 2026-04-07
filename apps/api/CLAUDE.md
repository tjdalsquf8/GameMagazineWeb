# Backend (apps/api) — 세부 컨텍스트

## 모듈 추가 순서
1. `prisma/schema.prisma` 수정
2. `pnpm prisma migrate dev --name [설명]` 실행
3. `pnpm prisma generate` 실행
4. 모듈 폴더 생성 (dto → service → controller → module)
5. AppModule에 등록

## PrismaService 사용
```typescript
// ✅ 올바른 방법 - constructor injection
constructor(private readonly prisma: PrismaService) {}

// ❌ 직접 import 금지
import { PrismaClient } from '@prisma/client'
```

## 응답에서 비밀번호 제외
```typescript
// ✅ select로 명시적 제외
const user = await this.prisma.user.findUnique({
  where: { id },
  select: { id: true, email: true, nickname: true }
  // password: 절대 포함 금지
})
```

## Guard 사용
```typescript
// 인증 필요 엔드포인트
@UseGuards(JwtAuthGuard)

// 관리자 전용
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
```

## 로깅
```typescript
// console.log 금지, NestJS Logger 사용
private readonly logger = new Logger(NewsService.name)
this.logger.log('뉴스 생성 완료')
this.logger.error('에러 발생', error.stack)
```
