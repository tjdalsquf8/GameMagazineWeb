import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator'
import { Transform } from 'class-transformer'

export class ForgotPasswordDto {
  @IsString({ message: '이름을 입력해주세요' })
  @IsNotEmpty({ message: '이름을 입력해주세요' })
  @MinLength(2, { message: '이름은 2자 이상이어야 합니다' })
  name!: string

  @Transform(({ value }) => value?.toLowerCase?.())
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다' })
  email!: string
}
