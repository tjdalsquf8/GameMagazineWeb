// users/dto/update-password.dto.ts
// 비밀번호 변경 요청 DTO

import { IsString, IsNotEmpty, MinLength } from 'class-validator'

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword!: string

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword!: string
}
