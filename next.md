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

1. 뉴스 썸네일 어떻게 가져올지 (후순위)
2. 뉴스 상세 페이지 디자인
3. 뉴스 조회수, 추천수 연결
4. 관리자 대시보드 생성
