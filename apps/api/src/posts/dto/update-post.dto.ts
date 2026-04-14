import { IsOptional, IsString, MaxLength } from 'class-validator'

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: '제목은 255자 이하여야 합니다' })
  title?: string

  @IsOptional()
  @IsString()
  content?: string
}
