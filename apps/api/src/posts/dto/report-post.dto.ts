// report-post.dto.ts
// 게시글 및 댓글 신고 요청 시 사용하는 DTO

import { IsString, IsNotEmpty, MaxLength } from 'class-validator'

export class ReportDto {
  /** 신고 사유 (1~200자) */
  @IsString()
  @IsNotEmpty({ message: '신고 사유를 입력해주세요' })
  @MaxLength(200, { message: '신고 사유는 200자 이내로 입력해주세요' })
  reason!: string
}
