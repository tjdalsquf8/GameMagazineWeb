import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator'
import { Transform } from 'class-transformer'

export class LoginDto {
  @Transform(({ value }) => value?.toLowerCase?.())
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다' })
  email!: string

  @IsString()
  @MinLength(1, { message: '비밀번호를 입력해주세요' })
  password!: string

  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean
}
