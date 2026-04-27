커뮤니티 페이지
후속 작업

- API 연동 시 useSearchParams로  
  CategorySidebar 활성 카테고리 동적 연결
- WriteForm 등록 버튼 POST 요청 로직 추가
  (현재 의도적 비활성화)
- middleware JWT 만료 검증 강화

커뮤니티 crud
경고 사항:

- eslint@8.57.1 deprecated — ESLint  
  v8은 지원 종료됨. 현재는 동작하지만  
  추후 v9로 마이그레이션 필요.

로그인 토큰 후속 작업
토큰 만료(1시간) 후 silent refresh 시 새 accessToken으로 쿠키도  
 갱신하는 로직이 필요합니다. refresh 구현 시
setAccessTokenCookie(newToken) 함께 호출하면 됩니다.

## 해야할 것

[x] 뉴스 상세 페이지 디자인
[x] 뉴스 조회수, 추천수 연결

[x] 모바일에서 레이아웃 수정

- [x] 뉴스 메인 페이지
- [x] 뉴스 상세 페이지
- [x] 커뮤니티

[x] 마이페이지 구현

3. 관리자 대시보드 생성

- 뉴스수집 자동화 결과 시각화(adminpageexanple.png 참고)
- api 비용 시각화
- 카테고리 관리 (수정/삭제/추가 가능해야함. 수정 시 즉각 db 변경, 뉴스 수집 로직 변경)
- 사용자괸리 및 커뮤글, 댓글 등 관리해야할듯

## 고민사항

[x] 뉴스 더보기 클릭 시 반응 고민 -> 페이징 처리

1. 뉴스 DB 분리?

## 회의 안건

1. 메인 커뮤니티 HOT, 상세 커뮤니티 인기들 통일할지 분리할지 고민
2. 뉴스 썸네일 어떻게 가져올지

- 대분류 카테고리별 이미지 미리 지정해놓고 통일하기
- OG Image로 이미지 만들기 HTML으로 썸네일 실시간 생성

3. 뉴스상세페이지에서 이미지 어떻게 넣을지(이게 진짜 큰 장벽)
4. 카드 뉴스 템플릿 디자인 정하기

QA 점검 결과

빌드/타입체크/린트 모두 ✅ 통과. 발견된 이슈 목록입니다.

---

🔴 Critical (즉시 수정 필요)

#1 회원 탈퇴 시 DB 외래 키 에러

- Post, Comment, PostLike → User 관계에 onDelete:  
  Cascade 누락
- 게시글/댓글/좋아요가 있는 유저 탈퇴 시 P2003 Foreign  
  key constraint failed 에러
- schema.prisma 수정 + 마이그레이션 필요  


---

🟡 Warning

#2 accessToken 쿠키 갱신 누락 (client.ts:82)

- 401 후 토큰 리프레시 시 zustand store만 업데이트,  
  쿠키는 갱신 안 됨
- 다음 라우터 이동 시 미들웨어가 만료 쿠키 보고 /login
  리다이렉트

#3 window.location.reload() 불필요
(AccountSettings.tsx:100)

- 이미 updateNickname(authStore) + onNicknameChange →
  refetch()로 상태 갱신됨
- 전체 새로고침은 스크롤/데이터 초기화로 UX 저하

#4 최근 읽은 뉴스 항상 빈 배열 (users.service.ts:250)

- getNewsHistory가 stub 상태 — 항상 빈 목록 반환
- UI에 "준비 중" 안내 없이 빈 상태만 표시됨

---

🟢 Minor

#5 인라인 스타일 2건 (ProfileCard.tsx:68,
NewsHistoryList.tsx:68)

- CLAUDE.md 규칙 위반 (style={} 사용)

#6 TODO 주석 3건

- auth.controller.ts — 배포 시 sameSite: 'lax' 변경 필요
  (2건)
- PostDetail.tsx — Redis TTL 방식 교체 (1건)

---

수정 우선순위

┌──────┬─────────────────────────────────────────┐
│ 순위 │ 항목 │
├──────┼─────────────────────────────────────────┤
│ 1 │ 🔴 Prisma cascade 누락 → 회원 탈퇴 에러 │
├──────┼─────────────────────────────────────────┤
│ 2 │ 🟡 accessToken 쿠키 갱신 누락 │
├──────┼─────────────────────────────────────────┤
│ 3 │ 🟡 window.location.reload() 제거 │
├──────┼─────────────────────────────────────────┤
│ 4 │ 🟡 최근 읽은 뉴스 stub 처리 │
└──────┴──────────────────────────────────
