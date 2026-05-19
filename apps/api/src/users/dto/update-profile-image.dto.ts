// 프로필 이미지 변경 요청 DTO - R2에 업로드된 이미지 URL 유효성 검증 담당
import { IsString, IsUrl, IsOptional } from 'class-validator'

export class UpdateProfileImageDto {
  // R2에 업로드된 프로필 이미지 공개 URL 필드 — null/undefined 허용 (이미지 제거 시)
  @IsOptional()
  @IsString()
  @IsUrl()
  profileImage?: string | null
}
