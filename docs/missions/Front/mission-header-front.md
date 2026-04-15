# MISSION: Header / Footer — Frontend

## 운영 원칙

- 중간에 CEO에게 질문하거나 확인을 구하지 않는다
- 모호한 부분은 합리적으로 판단하고 진행, 최종 보고서에 명시
- 완료 후 한 번만 보고

---

## 기술 스택 컨텍스트

- **Frontend**: Next.js 14 App Router / TypeScript / Tailwind CSS
- **아이콘**: lucide-react
- **상태관리**: Zustand (auth.store.ts — 로그인 상태)
- **다크모드**: globals.css CSS 변수 기반 (dark 클래스 토글 방식)
- **폰트**: Pretendard

---

## 1. 기능 개요

전체 레이아웃에 적용되는 Header와 Footer 구현.
로그인 상태에 따라 Header 우측 영역이 동적으로 변경됨.

---

## 2. 파일 구조

```
apps/web/src/
├── components/
│   └── layout/
│       ├── Header.tsx           ← 신규
│       ├── Footer.tsx           ← 신규
│       ├── NavLinks.tsx         ← 신규 (뉴스, 커뮤니티 링크)
│       ├── UserMenu.tsx         ← 신규 (로그인 후 드롭다운)
│       └── DarkModeToggle.tsx   ← 신규 (다크모드 토글 버튼)
├── hooks/
│   └── useDarkMode.ts           ← 신규
└── app/
    └── layout.tsx               ← 기존 수정 (Header, Footer 연결)
```

---

## 3. Header 명세

### 레이아웃

```
┌─────────────────────────────────────────────────────┐
│  Game Magazine   │  뉴스  커뮤니티  │  🌙  로그인  │
└─────────────────────────────────────────────────────┘
좌측: 텍스트 로고   중앙: 네비         우측: 다크모드 + 인증
```

### 로그아웃 상태

```
우측: [다크모드 토글] [로그인] [회원가입]
```

### 로그인 상태

```
우측: [다크모드 토글] [닉네임 ▼]
                         └─ 드롭다운
                              ├─ 마이페이지
                              └─ 로그아웃
```

### 세부 스펙

```
- 높이: h-16 (64px)
- 배경: bg-[var(--color-background)] / 다크: 동일
- 하단 border: border-b border-[var(--color-border)]
- position: sticky top-0 z-50 (스크롤해도 상단 고정)
- 최대 너비: container-main (globals.css 정의된 클래스)
- 로고: font-bold text-xl, primary 색상, href="/"
- 네비 링크: 현재 경로 활성화 시 primary 색상 + font-medium
- 모바일: 햄버거 메뉴 (☰) → 슬라이드 드로어로 네비 표시
```

### UserMenu 드롭다운

```
- 닉네임 + ChevronDown 아이콘
- 클릭 시 드롭다운 토글
- 외부 클릭 시 닫힘 (useOutsideClick 훅)
- 드롭다운 항목:
  ├─ 마이페이지 → /mypage (추후 구현 예정 — 링크만)
  └─ 로그아웃 → auth.store clearAuth() + "/" 이동
```

---

## 4. Footer 명세

### 레이아웃

```
┌─────────────────────────────────────────────────────┐
│  Game Magazine                                      │
│  게임 문화를 함께 만들어가는 공간                    │
│                                                     │
│  서비스      │  고객지원        │  법적 고지         │
│  뉴스        │  공지사항        │  이용약관          │
│  커뮤니티    │  문의하기        │  개인정보처리방침   │
│                                                     │
│  ─────────────────────────────────────────────────  │
│  © 2026 Game Magazine. All rights reserved.        │
└─────────────────────────────────────────────────────┘
```

### 세부 스펙

```
- 배경: bg-[var(--color-surface)]
- 상단 border: border-t border-[var(--color-border)]
- padding: py-12
- 3단 컬럼 그리드 (서비스 / 고객지원 / 법적 고지)
- 링크 hover: text-[var(--color-primary)]
- 모바일: 1단 세로 배열
- 공지사항, 문의하기, 이용약관, 개인정보처리방침:
  → 추후 구현 예정 페이지 — href="#" 처리
```

---

## 5. DarkModeToggle 명세

```typescript
// useDarkMode.ts
// localStorage에 'theme' 키로 저장
// 초기값: 시스템 설정 따름 (prefers-color-scheme)
// html 태그에 dark 클래스 토글

const { isDark, toggle } = useDarkMode();
```

```typescript
// DarkModeToggle.tsx
import { Sun, Moon } from "lucide-react";

// 다크모드: Sun 아이콘 (밝게 전환)
// 라이트모드: Moon 아이콘 (어둡게 전환)
// 버튼 크기: 40px x 40px, 아이콘 size={18}
// 호버: bg-[var(--color-surface-hover)] 배경
```

---

## 6. 모바일 처리

```
breakpoint: md (768px) 기준

md 이상:
- 네비 링크 가로 배열
- 인증 영역 가로 배열

md 미만:
- 네비 링크 숨김
- 햄버거 메뉴(Menu 아이콘) 표시
- 클릭 시 전체 너비 드로어 (상단에서 슬라이드)
  └─ 뉴스, 커뮤니티, 로그인/닉네임 세로 배열
```

---

## 7. 다크모드 처리

```
- CSS 변수 기반 (globals.css의 .dark 클래스)
- 모든 색상은 var(--color-*) 사용 (하드코딩 금지)
- DarkModeToggle로 수동 전환
- 시스템 설정 초기값 반영
- localStorage 저장으로 새로고침 후에도 유지
- 깜빡임 방지: layout.tsx script 태그로 초기 테마 즉시 적용
```

---

## 8. layout.tsx 수정 사항

```typescript
// 깜빡임 방지 스크립트 추가 (다크모드)
<head>
  <script dangerouslySetInnerHTML={{
    __html: `
      const theme = localStorage.getItem('theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (theme === 'dark' || (!theme && prefersDark)) {
        document.documentElement.classList.add('dark')
      }
    `
  }} />
</head>
```

---

## 9. 작업 순서 (Frontend Agent 지침)

```
1. useDarkMode.ts 훅 구현
2. DarkModeToggle.tsx 구현
3. NavLinks.tsx 구현 (현재 경로 활성화 포함)
4. UserMenu.tsx 구현 (드롭다운 + 외부 클릭 닫힘)
5. Header.tsx 구현 (모바일 햄버거 포함)
6. Footer.tsx 구현
7. layout.tsx 수정 (Header, Footer 연결 + 다크모드 깜빡임 방지)
```

---

## 10. 완료 기준 (Done Criteria)

```
□ Header sticky 상단 고정 확인
□ 로고 클릭 시 "/" 이동
□ 뉴스, 커뮤니티 링크 현재 경로 활성화 표시
□ 비로그인: [로그인] [회원가입] 버튼 표시
□ 로그인 후: 닉네임 + 드롭다운 표시
□ 드롭다운 외부 클릭 시 닫힘
□ 로그아웃 클릭 시 상태 초기화 + "/" 이동
□ 다크모드 토글 동작 (Sun ↔ Moon 아이콘)
□ 새로고침 후 다크모드 유지
□ 다크모드 깜빡임 없음
□ 모바일 햄버거 메뉴 동작
□ Footer 3단 그리드 → 모바일 1단 확인
□ 라이트/다크 모드 둘 다 UI 정상 확인
□ tsc --noEmit 타입 에러 없음
□ pnpm lint 통과
```
