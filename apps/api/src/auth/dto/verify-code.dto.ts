import { IsEmail, Matches } from 'class-validator'
import { Transform } from 'class-transformer'

export class VerifyCodeDto {
  @Transform(({ value }) => value?.toLowerCase?.())
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다' })
  email!: string

  @Matches(/^\d{6}$/, { message: '인증 코드는 6자리 숫자여야 합니다' })
  code!: string
}
