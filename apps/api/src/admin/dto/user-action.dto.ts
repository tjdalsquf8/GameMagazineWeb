// apps/api/src/admin/dto/user-action.dto.ts
// 유저 정지 및 역할 변경 DTO

import { IsString, IsIn, IsNotEmpty, MaxLength } from 'class-validator'

// 유저 정지 DTO — duration은 "7d" | "30d" | "permanent" 문자열
export class BanUserDto {
  @IsString()
  @IsIn(['7d', '30d', 'permanent'])
  duration!: '7d' | '30d' | 'permanent'

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  reason!: string
}

// 역할 변경 DTO
export class UpdateRoleDto {
  @IsString()
  @IsIn(['USER', 'ADMIN'])
  role!: string
}
