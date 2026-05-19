import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreatePostDto {
  @IsString()
  @IsNotEmpty({ message: '제목을 입력해주세요' })
  @MaxLength(100, { message: '제목은 100자 이하여야 합니다' })
  title!: string

  @IsString()
  @IsNotEmpty({ message: '내용을 입력해주세요' })
  @MaxLength(50000, { message: '본문은 50,000자 이하여야 합니다' })
  content!: string

  @IsInt({ message: '카테고리 ID는 정수여야 합니다' })
  categoryId!: number
}
