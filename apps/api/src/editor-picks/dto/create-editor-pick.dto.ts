// apps/api/src/editor-picks/dto/create-editor-pick.dto.ts
// 에디터 픽 아티클 생성 요청 DTO — 입력값 유효성 검증을 담당한다

import { IsString, IsNotEmpty, IsOptional, MaxLength, IsIn, IsUrl } from 'class-validator'

// 허용 카테고리 목록
export const ALLOWED_CATEGORIES = ['PC', 'Mobile', 'Console', 'Esports', '기타'] as const
export type AllowedCategory = (typeof ALLOWED_CATEGORIES)[number]

export class CreateEditorPickDto {
  // 기사 제목 — 최대 100자
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title!: string

  // 기사 본문 HTML — 생략 시 빈 문자열로 처리
  @IsString()
  @IsOptional()
  content?: string

  // 메인 카테고리 — 허용 목록 중 하나여야 한다
  @IsString()
  @IsNotEmpty()
  @IsIn(ALLOWED_CATEGORIES)
  mainCategory!: AllowedCategory

  // 썸네일 URL — 유효한 URL이어야 하며 필수
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  thumbnailUrl!: string
}
