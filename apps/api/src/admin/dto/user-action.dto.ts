// apps/api/src/admin/dto/user-action.dto.ts
// 유저 정지 및 역할 변경 DTO

import { IsString, IsIn } from 'class-validator'

// 유저 정지 DTO
export class BanUserDto {
  @IsString()
  reason!: string

  @IsIn([7, 30, 'permanent'])
  duration!: number | 'permanent'
}

// 역할 변경 DTO
export class UpdateRoleDto {
  @IsString()
  @IsIn(['USER', 'ADMIN'])
  role!: string
}
