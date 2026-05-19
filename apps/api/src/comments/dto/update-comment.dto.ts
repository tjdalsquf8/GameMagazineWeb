import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty({ message: '댓글 내용을 입력해주세요' })
  @MaxLength(1000, { message: '댓글은 1000자 이하여야 합니다' })
  content!: string
}
