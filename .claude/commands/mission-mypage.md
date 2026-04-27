# MISSION: 마이페이지 — Frontend

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
- **연동할 API**:
  - `GET /users/me` — 내 프로필 조회
  - `PATCH /users/me` — 닉네임 변경
  - `PATCH /users/me/password` — 비밀번호 변경
  - `GET /users/me/posts?page=&limit=` — 내 게시글 목록
  - `GET /users/me/comments?page=&limit=` — 내가 쓴 댓글 목록
  - `GET /users/me/likes?page=&limit=` — 좋아요한 글 목록
  - `GET /users/me/news-history?page=&limit=` — 최근 읽은 뉴스
  - `PATCH /users/me/notifications` — 알림 설정 변경
  - `DELETE /users/me` — 회원 탈퇴
  - `POST /auth/logout` — 로그아웃

---

## 1. 기능 개요

로그인한 유저가 자신의 활동 내역(게시글, 댓글, 좋아요)과 최근 읽은 뉴스를 확인하고,
알림 설정 및 계정 정보(닉네임, 비밀번호)를 관리하는 페이지.
사이드바 메뉴로 섹션 간 이동하며, 각 섹션은 최근 항목만 미리보기로 보여주고 전체 보기 링크를 제공한다.

---

## 2. 핵심 플로우

```
유저가 /my 접속
↓
middleware.ts에서 인증 확인 → 비로그인 시 /login?redirect=/my 리다이렉트
↓
GET /users/me 호출 → 프로필 정보 (닉네임, 이메일, 게시글/댓글/좋아요 수) 로드
↓
사이드바에 각 카운트 표시
↓
메인 영역: 내 게시글 / 내가 쓴 댓글 / 좋아요한 글 / 최근 읽은 뉴스 순으로 섹션 렌더링
↓
각 섹션은 최근 3~4건 미리보기 + "전체 보기" 링크
↓
사이드 메뉴 클릭 → 해당 섹션으로 스크롤 이동
↓
알림 설정 토글 클릭 → PATCH /users/me/notifications 즉시 호출
↓
닉네임/비밀번호 변경 클릭 → 모달 오픈 → 수정 후 PATCH 호출
↓
로그아웃 클릭 → POST /auth/logout → 토큰 삭제 → / 리다이렉트
↓
회원 탈퇴 클릭 → 확인 모달 → DELETE /users/me → 토큰 삭제 → / 리다이렉트
```

---

## 3. 파일 구조

```
apps/web/src/
├── app/
│   └── my/
│       ├── layout.tsx              # 인증 확인, 사이드바 + 메인 2열 레이아웃
│       └── page.tsx                # 메인 페이지 (섹션 조합)
├── components/
│   └── my/
│       ├── ProfileCard.tsx         # 왼쪽 프로필 카드 + 사이드 네비
│       ├── MyPostList.tsx          # 내 게시글 섹션
│       ├── MyCommentList.tsx       # 내가 쓴 댓글 섹션
│       ├── MyLikeList.tsx          # 좋아요한 글 섹션
│       ├── NewsHistoryList.tsx     # 최근 읽은 뉴스 섹션
│       ├── NotificationSettings.tsx # 알림 설정 섹션
│       ├── AccountSettings.tsx     # 계정 설정 섹션
│       ├── EditNicknameModal.tsx   # 닉네임 변경 모달
│       ├── EditPasswordModal.tsx   # 비밀번호 변경 모달
│       └── DeleteAccountModal.tsx  # 회원 탈퇴 확인 모달
├── hooks/
│   ├── useMyProfile.ts             # GET /users/me React Query
│   ├── useMyPosts.ts               # GET /users/me/posts
│   ├── useMyComments.ts            # GET /users/me/comments
│   ├── useMyLikes.ts               # GET /users/me/likes
│   ├── useNewsHistory.ts           # GET /users/me/news-history
│   └── useMyMutations.ts           # PATCH/DELETE 관련 mutation 모음
```

---

## 4. UI/UX 명세

### 레이아웃

- 전체: `max-width: 960px` 센터 정렬, 좌우 패딩 24px
- 2열 그리드: 왼쪽 사이드바 220px 고정 / 오른쪽 메인 flex-1
- 사이드바: `position: sticky; top: 68px` (네브바 높이 기준)
- 모바일 (< 768px): 사이드바 숨김, 상단에 탭 형태로 대체
- 섹션 순서 (메인 오른쪽): 내 게시글 → 내가 쓴 댓글 → 좋아요한 글 → 최근 읽은 뉴스 → 알림 설정 → 계정 설정

### 컴포넌트별 요구사항

```
ProfileCard:
- 역할: 아바타(닉네임 첫 글자), 닉네임, 이메일, 사이드 네비 메뉴
- 사이드 메뉴 항목: 내 게시글(count) / 내가 쓴 댓글(count) / 좋아요한 글(count) / 최근 읽은 뉴스 / [구분선] / 알림 설정 / 계정 설정 / [구분선] / 로그아웃
- 클릭 시 해당 섹션으로 스크롤 이동 (id 앵커)
- 현재 뷰포트에 보이는 섹션 기준으로 active 상태 자동 변경 (IntersectionObserver)
- count는 GET /users/me 응답의 _count 필드 사용

MyPostList:
- 역할: 내 게시글 최근 3건 미리보기
- Props: posts[], totalCount
- 각 항목: 게임 카테고리(소분류) / 제목 / 좋아요 수 / 댓글 수
- "전체 보기" 클릭 → /my/posts 이동
- 항목 클릭 → 해당 게시글로 이동

MyCommentList:
- 역할: 내가 쓴 댓글 최근 3건 미리보기
- Props: comments[], totalCount
- 각 항목: 원글 제목(클릭 시 해당 글로 이동) / 댓글 내용(1줄 말줄임) / 작성 시간 / 좋아요 수
- 원글이 뉴스인 경우와 커뮤니티 게시글인 경우 모두 처리

MyLikeList:
- 역할: 좋아요한 글 최근 3건 미리보기
- Props: likes[], totalCount
- 각 항목: 게임 카테고리 / 제목 / 좋아요 수 / 댓글 수

NewsHistoryList:
- 역할: 최근 읽은 뉴스 최근 4건
- Props: newsHistory[]
- 각 항목: 카테고리 썸네일(대분류 색상) / 뉴스 제목 / 카테고리(대분류·소분류) / 읽은 시간
- 카테고리 썸네일 색상: PC(#050814/텍스트 #00c8ff) / Mobile(#fdf6ee/텍스트 #e8820c) / Console(#0d0d0d/텍스트 #c9a84c) / Esports(#09090f/텍스트 #e84545)

NotificationSettings:
- 역할: 알림 수신 설정 토글 목록
- 항목: 내 게시글 댓글 알림 / LCK 경기 결과 알림 / 마케팅 수신
- 토글 클릭 즉시 PATCH /users/me/notifications 호출
- 낙관적 업데이트 적용 (토글 먼저 바꾸고 실패 시 롤백)

AccountSettings:
- 역할: 계정 관련 액션 목록
- 항목: 닉네임 변경 / 비밀번호 변경 / 회원 탈퇴
- 각 항목 클릭 → 해당 모달 오픈

EditNicknameModal:
- 역할: 닉네임 변경 폼 모달
- 필드: 새 닉네임 (2~12자, 한글/영문/숫자)
- 현재 닉네임 input에 기본값으로 표시
- 저장 버튼 클릭 → PATCH /users/me → 성공 시 모달 닫기 + 프로필 갱신 + 토스트

EditPasswordModal:
- 역할: 비밀번호 변경 폼 모달
- 필드: 현재 비밀번호 / 새 비밀번호 / 새 비밀번호 확인
- 저장 버튼 클릭 → PATCH /users/me/password → 성공 시 모달 닫기 + 토스트

DeleteAccountModal:
- 역할: 회원 탈퇴 확인 모달
- "정말 탈퇴하시겠습니까?" 문구 + 탈퇴 버튼(danger 스타일)
- 확인 클릭 → DELETE /users/me → 토큰 삭제 → / 리다이렉트
```

### 공통 UX 처리 (필수 적용)

```
로딩 상태:
- ProfileCard: 아바타/닉네임/이메일 Skeleton
- 각 섹션 리스트: 항목 3개 Skeleton (높이 동일하게 유지)

에러 상태:
- API 실패 시 섹션별 인라인 에러 메시지 ("불러오지 못했습니다. 새로고침해 주세요.")
- mutation 실패 시 토스트 에러 메시지

빈 상태:
- 각 섹션 데이터 없을 때 Empty State UI
  예) "아직 작성한 게시글이 없어요" + 커뮤니티 바로가기 링크

버튼 클릭 중:
- disabled + 스피너 (저장/탈퇴/로그아웃 버튼)

토글 낙관적 업데이트:
- 알림 설정 토글은 클릭 즉시 UI 반영, 실패 시 롤백 + 토스트
```

---

## 5. 유효성 검사

```
프론트 실시간 검사 + 백엔드 이중 적용 원칙
packages/shared/src/validators의 규칙 import해서 사용

닉네임:
- 필수 입력
- 2~12자
- 한글/영문/숫자만 허용 (특수문자 불가)
- 실시간 검사 (onChange)

현재 비밀번호:
- 필수 입력

새 비밀번호:
- 필수 입력
- 8자 이상
- 영문 + 숫자 조합 필수
- 현재 비밀번호와 동일하면 에러

새 비밀번호 확인:
- 새 비밀번호와 일치 여부 실시간 검사
```

---

## 6. 렌더링 전략

```
/my 페이지: CSR (Client Side Rendering)
이유:
- 로그인한 유저의 개인 데이터 → SSR/SSG 캐싱 불필요
- 인증 필요 페이지 → middleware에서 리다이렉트 처리
- React Query로 클라이언트에서 데이터 페칭 및 캐싱 관리
- 각 섹션 독립적으로 로딩되어 사용자 경험 향상
```

---

## 7. 보안 처리

```
- 인증 필요 페이지: middleware.ts에서 /my 경로 인증 확인
  비로그인 → /login?redirect=/my 리다이렉트
- 민감 정보 localStorage 저장 금지
- NEXT_PUBLIC_ 환경변수에 시크릿 포함 금지
- dangerouslySetInnerHTML 사용 금지
- 회원 탈퇴/로그아웃 후 React Query 캐시 전체 초기화 (queryClient.clear())
- 닉네임/비밀번호 변경 모달: 다른 유저의 정보 수정 불가 (JWT 기반 본인 확인은 백엔드에서 처리)
```

---

## 8. 완료 기준 (Done Criteria)

```
□ 비로그인 상태로 /my 접근 시 /login?redirect=/my 리다이렉트 확인
□ 프로필 카드에 닉네임 / 이메일 / 각 카운트 정상 표시
□ 사이드 메뉴 클릭 시 해당 섹션으로 스크롤 이동 확인
□ 스크롤 위치에 따라 사이드 메뉴 active 상태 자동 변경 확인
□ 내 게시글 / 내가 쓴 댓글 / 좋아요한 글 / 최근 읽은 뉴스 정상 노출
□ 각 섹션 "전체 보기" 링크 동작 확인
□ 각 항목 클릭 시 해당 게시글/뉴스 이동 확인
□ 알림 설정 토글 클릭 시 즉시 반영 + API 호출 확인
□ 알림 설정 API 실패 시 롤백 + 토스트 확인
□ 닉네임 변경 모달 오픈 → 유효성 검사 → 저장 → 프로필 갱신 확인
□ 비밀번호 변경 모달 오픈 → 유효성 검사 → 저장 확인
□ 로그아웃 → 토큰 삭제 → / 리다이렉트 확인
□ 회원 탈퇴 확인 모달 → 탈퇴 → / 리다이렉트 확인
□ 각 섹션 로딩 Skeleton UI 확인
□ 각 섹션 빈 상태 Empty State UI 확인
□ 각 섹션 API 에러 시 인라인 에러 메시지 확인
□ 모바일 (< 768px) 레이아웃 정상 동작 확인
□ tsc --noEmit 타입 에러 없음
□ pnpm lint 통과
```

---

## 참고: 디자인 시안

미리보기 파일: `outputs/mypage-preview.html`

**레이아웃 요약**

- 왼쪽 사이드바: 아바타(닉네임 첫 글자, 그라디언트 배경) + 닉네임/이메일 + 메뉴(항목 우측에 카운트)
- 오른쪽 메인: 섹션 카드 세로 나열, 각 카드 `border-radius: 16px`

**카테고리 썸네일 색상 (NewsHistoryList)**

- PC: 배경 `#050814` / 텍스트 `#00c8ff`
- Mobile: 배경 `#fdf6ee` / 텍스트 `#e8820c`
- Console: 배경 `#0d0d0d` / 텍스트 `#c9a84c`
- Esports: 배경 `#09090f` / 텍스트 `#e84545`

**댓글 섹션 항목 구조**

- 상단: 원글 제목 (회색 작은 텍스트 + 말풍선 아이콘)
- 중단: 댓글 내용 (1줄 말줄임)
- 하단: 작성 시간(좌) / 좋아요 수(우)
