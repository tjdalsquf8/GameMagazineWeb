# Frontend (apps/web) — 세부 컨텍스트

## 공통 컴포넌트 위치
새 UI 요소 추가 전 `components/ui/` 먼저 확인할 것.
이미 있는 컴포넌트를 다시 만들지 않는다.

## 공통 CSS 토큰 (globals.css)
```css
/* 색상 */
--color-primary: #...      /* 브랜드 메인 */
--color-primary-hover: #...
--color-surface: #...      /* 카드 배경 */
--color-border: #...

/* 타이포그래피 */
--font-heading: 'Pretendard', sans-serif
--font-body: 'Pretendard', sans-serif

/* 간격 (Tailwind 기본 사용, 커스텀 없음) */
```
새 색상 추가 시 반드시 CSS 변수로 등록 후 사용.

## API 클라이언트 사용법
```typescript
// ✅ 올바른 방법
import { apiClient } from '@/lib/api/client'
const { data } = await apiClient.get<News[]>('/news')

// ❌ 금지
const res = await fetch('http://localhost:3001/news')
```

## 공통 훅
- `useAuth()` — 인증 상태 및 유저 정보
- `usePagination()` — 페이지네이션 로직
- `useToast()` — 토스트 알림

## 이미지 처리
- 항상 `next/image` 사용 (img 태그 금지)
- Cloudflare R2 URL은 `next.config.js`의 `images.remotePatterns`에 등록
