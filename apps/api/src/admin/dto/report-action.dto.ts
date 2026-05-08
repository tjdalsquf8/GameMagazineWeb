// apps/api/src/admin/dto/report-action.dto.ts
// 신고 처리 DTO

import { IsIn } from 'class-validator'

// 신고 처리 DTO — resolve(승인) 또는 reject(거부)
export class HandleReportDto {
  @IsIn(['resolve', 'reject'])
  action!: 'resolve' | 'reject'
}
