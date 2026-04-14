import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: '댓글 내용을 입력해주세요' })
  content!: string

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '부모 댓글 ID는 정수여야 합니다' })
  parentId?: number
}
