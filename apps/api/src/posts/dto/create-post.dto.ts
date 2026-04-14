import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreatePostDto {
  @IsString()
  @IsNotEmpty({ message: '제목을 입력해주세요' })
  @MaxLength(255, { message: '제목은 255자 이하여야 합니다' })
  title!: string

  @IsString()
  @IsNotEmpty({ message: '내용을 입력해주세요' })
  content!: string

  @IsInt({ message: '카테고리 ID는 정수여야 합니다' })
  categoryId!: number
}
