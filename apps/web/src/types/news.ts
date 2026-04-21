// 뉴스 도메인 타입 정의 — API 연동 기반 실제 데이터 타입
// mock/news.ts의 LatestNews와 구분되는 서버 응답 기반 타입

// 뉴스 단건 아이템 — API /news 응답의 data 배열 요소
export interface NewsArticle {
  id: string
  mainCategory: string
  subCategory: string
  title: string
  createdAt: string
}

// 뉴스 목록 페이지네이션 메타 정보
export interface NewsMeta {
  total: number
  page: number
  limit: number
}

// GET /news 응답의 data 필드 (success.data)
export interface NewsListResponse {
  data: NewsArticle[]
  meta: NewsMeta
}
