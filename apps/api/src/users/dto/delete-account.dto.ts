// users/dto/delete-account.dto.ts
// 회원 탈퇴 요청 DTO — 비밀번호 재확인용

import { IsString, IsNotEmpty } from 'class-validator'

export class DeleteAccountDto {
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
  password!: string
}
