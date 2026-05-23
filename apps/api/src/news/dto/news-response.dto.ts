// apps/api/src/news/dto/news-response.dto.ts
// 뉴스 목록 아이템 및 상세 응답 DTO

// 뉴스 목록 조회 시 반환되는 아이템 형태
export class NewsListItemDto {
  id!: string
  mainCategory!: string
  subCategory!: string
  title!: string       // rewrittenTitle
  summary!: string     // rewrittenSummary
  tags!: string[]
  viewCount!: number
  createdAt!: Date
}

// 뉴스 상세 조회 시 반환되는 형태
export class NewsDetailDto {
  id!: string
  mainCategory!: string
  subCategory!: string
  title!: string
  summary!: string
  body!: string        // rewrittenBody
  tags!: string[]
  viewCount!: number
  createdAt!: Date
}

// 사이드바용 인기 뉴스 아이템 형태
export class PopularNewsItemDto {
  id!: string
  title!: string
  viewCount!: number
}

// Hero 섹션용 카테고리별 조회수 1위 뉴스 아이템 형태
export class CategoryTopNewsItemDto {
  id!: string
  title!: string       // rewrittenTitle
  summary!: string     // rewrittenSummary
  thumbnail!: string   // thumbnailUrl (null이면 빈 문자열)
  mainCategory!: string
  subCategory!: string
  viewCount!: number
  publishedAt!: string // createdAt ISO string
}
