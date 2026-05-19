import { IsEmail } from 'class-validator'
import { Transform } from 'class-transformer'

export class SendCodeDto {
  @Transform(({ value }) => value?.toLowerCase?.())
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다' })
  email!: string
}
