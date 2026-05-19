// users/dto/update-password.dto.ts
// 비밀번호 변경 요청 DTO

import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator'

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword!: string

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/, {
    message: '비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다',
  })
  newPassword!: string
}
