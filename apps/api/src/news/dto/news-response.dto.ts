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
  createdAt!: Date
}
