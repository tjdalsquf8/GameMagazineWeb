// auth/dto/verify-password.dto.ts
// 어드민 페이지 접근 전 비밀번호 재확인 요청 DTO

import { IsString, IsNotEmpty } from 'class-validator'

export class VerifyPasswordDto {
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
  password!: string
}
