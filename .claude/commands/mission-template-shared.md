# MISSION: [기능명] — Shared Types & Validators

## 운영 원칙
- 중간에 CEO에게 질문하거나 확인을 구하지 않는다
- 완료 후 한 번만 보고

---

## 1. 추가할 타입 (packages/shared/src/types/)

```typescript
// [파일명].ts
export interface [타입명] {
  [필드]: [타입]
}

export type [타입명] = [정의]
```

---

## 2. 추가할 검증 규칙 (packages/shared/src/validators/)

```typescript
// 정규식 상수
export const [RULE_NAME]_REGEX = /[정규식]/

// 에러 메시지 (프론트/백 통일)
export const [RULE_NAME]_MESSAGE = '[에러 메시지]'

// 길이 제한
export const [FIELD]_MAX_LENGTH = N
export const [FIELD]_MIN_LENGTH = N
```

---

## 3. 추가할 상수 (packages/shared/src/constants/)

```typescript
export const [CONSTANT_NAME] = {
  [KEY]: [VALUE],
} as const
```

---

## 4. index.ts export 업데이트
```typescript
// packages/shared/src/index.ts 에 추가
export * from './types/[파일명]'
export * from './validators/[파일명]'
export * from './constants/[파일명]'
```

---

## 5. 완료 기준
```
□ 타입 추가 후 import 정상 동작 확인
□ 프론트/백 양쪽에서 import 가능한지 확인
□ tsc --noEmit 타입 에러 없음
```
