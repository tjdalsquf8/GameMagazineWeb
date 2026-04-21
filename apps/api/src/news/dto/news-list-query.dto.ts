// apps/api/src/news/dto/news-list-query.dto.ts
// 뉴스 목록 조회 쿼리 파라미터 DTO — 카테고리 필터 및 페이지네이션

import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator'
import { Type } from 'class-transformer'

export class NewsListQueryDto {
  // 대분류 필터 (PC / Mobile / Console / Esports / 기타)
  @IsOptional()
  @IsString()
  mainCategory?: string

  // 소분류 필터
  @IsOptional()
  @IsString()
  subCategory?: string

  // 페이지 번호 (기본값: 1)
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  // 페이지당 항목 수 (기본값: 20, 최대: 100)
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20
}
