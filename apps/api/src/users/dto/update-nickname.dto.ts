// users/dto/update-nickname.dto.ts
// 닉네임 변경 요청 DTO

import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator'

export class UpdateNicknameDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  nickname!: string
}
