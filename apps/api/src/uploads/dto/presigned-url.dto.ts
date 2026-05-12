// presigned URL 요청 DTO - 파일 정보 유효성 검증 담당
import { IsIn, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

export class PresignedUrlDto {
  // 허용된 이미지 MIME 타입 검증 필드
  @IsString()
  @IsIn(['image/png', 'image/jpeg', 'image/jpg', 'image/webp'])
  contentType!: string

  // 파일 크기 검증 필드 (최대 10MB)
  @IsNumber()
  @Min(1)
  @Max(10 * 1024 * 1024)
  fileSize!: number

  // 업로드 대상 폴더 — 'posts' | 'profiles', 기본값 'posts'
  @IsOptional()
  @IsString()
  @IsIn(['posts', 'profiles'])
  folder?: string
}
