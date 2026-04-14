import { IsString, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator'

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: '재설정 토큰이 없습니다' })
  resetToken!: string

  @IsString()
  @MinLength(8, { message: '비밀번호는 8자 이상이어야 합니다' })
  @MaxLength(50, { message: '비밀번호는 50자 이하여야 합니다' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)/, { message: '비밀번호는 영문과 숫자를 포함해야 합니다' })
  newPassword!: string
}
