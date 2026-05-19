import { IsOptional, IsString, MaxLength } from 'class-validator'

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: '제목은 100자 이하여야 합니다' })
  title?: string

  @IsOptional()
  @IsString()
  @MaxLength(50000, { message: '본문은 50000자 이하여야 합니다' })
  content?: string
}
