import { IsEmail, Matches, MinLength } from 'class-validator'

export class RegisterDto {
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다' })
  email!: string

  @Matches(/^[가-힣a-zA-Z0-9]{2,20}$/, {
    message: '닉네임은 한글, 영문, 숫자 조합으로 2~20자여야 합니다',
  })
  nickname!: string

  @MinLength(8, { message: '비밀번호는 8자 이상이어야 합니다' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: '비밀번호는 영문과 숫자를 포함해야 합니다',
  })
  password!: string
}
