import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: '댓글 내용을 입력해주세요' })
  @MaxLength(1000, { message: '댓글은 1,000자 이하여야 합니다' })
  content!: string

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '부모 댓글 ID는 정수여야 합니다' })
  parentId?: number
}
