import { IsEnum, IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator'
import { Transform, Type } from 'class-transformer'

export enum PostSortOption {
  LATEST = 'latest',
  POPULAR = 'popular',
  COMMENTS = 'comments',
}

export class PostQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number

  @IsOptional()
  @IsEnum(PostSortOption)
  sort?: PostSortOption = PostSortOption.LATEST

  @IsOptional()
  @IsString()
  @MinLength(2, { message: '검색어는 2자 이상이어야 합니다' })
  @Transform(({ value }: { value: string }) => value?.trim())
  search?: string
}
