// apps/api/src/admin/dto/category.dto.ts
// 뉴스 카테고리 생성/수정 DTO

import {
  IsString,
  IsArray,
  IsOptional,
  IsNumber,
  IsIn,
  MinLength,
} from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'

// 카테고리 생성 DTO
export class CreateCategoryDto {
  @IsString()
  @IsIn(['PC', 'Mobile', 'Console', 'Esports'])
  mainCategory!: string

  @IsString()
  @MinLength(1)
  name!: string

  @IsArray()
  @IsString({ each: true })
  keywords!: string[]

  @IsArray()
  @IsString({ each: true })
  excludes!: string[]

  @IsNumber()
  @IsOptional()
  order?: number
}

// 카테고리 수정 DTO — 모든 필드 선택적
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
