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

- 뉴스 썸네일 어떻게 가져올지 (후순위)
  [x] 뉴스 상세 페이지 디자인
  [x] 뉴스 조회수, 추천수 연결
- 관리자 대시보드 생성
- 모바일에서 레이아웃 수정

* 관리자 대시보드 생성

- 뉴스수집 자동화 결과 시각화(adminpageexanple.png 참고)
- api 비용 시각화
- 카테고리 관리 (수정/삭제/추가 가능해야함. 수정 시 즉각 db 변경, 뉴스 수집 로직 변경)
- 사용자괸리 및 커뮤글, 댓글 등 관리해야할듯

## 고민사항

[x]뉴스 더보기 클릭 시 반응 고민 -> 페이징 처리
메인 커뮤니티 HOT, 상세 커뮤니티 인기들 통일할지 분리할지 고민
뉴스 DB 분리?
