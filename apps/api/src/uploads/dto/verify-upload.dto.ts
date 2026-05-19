// 업로드 검증 요청 DTO - publicUrl 유효성 검증 담당
import { IsString, IsUrl } from 'class-validator'

export class VerifyUploadDto {
  // 검증할 R2 업로드 파일의 public URL
  @IsString()
  @IsUrl()
  publicUrl!: string
}
