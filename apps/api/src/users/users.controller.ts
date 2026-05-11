// users/users.controller.ts
// 마이페이지 HTTP 엔드포인트 — /users/me 하위 모든 라우트 정의

import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { UpdateNicknameDto } from './dto/update-nickname.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { UpdateProfileImageDto } from './dto/update-profile-image.dto'
import { PaginationQueryDto } from './dto/pagination-query.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Role } from '@prisma/client'
import { Request } from 'express'

interface AuthenticatedUser {
  id: string
  role: Role
}

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser
}

@Controller('users/me')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** GET /users/me — 내 프로필 조회 */
  @Get()
  async getMyProfile(@Req() req: AuthenticatedRequest) {
    const data = await this.usersService.getMyProfile(req.user.id)
    return { success: true, data }
  }

  /** PATCH /users/me — 닉네임 변경 */
  @Patch()
  async updateNickname(
    @Body() dto: UpdateNicknameDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const data = await this.usersService.updateNickname(req.user.id, dto)
    return { success: true, data, message: '닉네임이 변경되었습니다.' }
  }

  /** PATCH /users/me/profile-image — 프로필 이미지 변경 */
  @Patch('profile-image')
  async updateProfileImage(
    @Body() dto: UpdateProfileImageDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const data = await this.usersService.updateProfileImage(req.user.id, dto)
    return { success: true, data, message: '프로필 이미지가 변경되었습니다.' }
  }

  /** PATCH /users/me/password — 비밀번호 변경 */
  @Patch('password')
  async updatePassword(
    @Body() dto: UpdatePasswordDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const data = await this.usersService.updatePassword(req.user.id, dto)
    return { success: true, data }
  }

  /** GET /users/me/posts — 내 게시글 목록 조회 */
  @Get('posts')
  async getMyPosts(
    @Query() query: PaginationQueryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const data = await this.usersService.getMyPosts(req.user.id, query)
    return { success: true, data }
  }

  /** GET /users/me/comments — 내가 쓴 댓글 목록 조회 */
  @Get('comments')
  async getMyComments(
    @Query() query: PaginationQueryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const data = await this.usersService.getMyComments(req.user.id, query)
    return { success: true, data }
  }

  /** GET /users/me/likes — 좋아요한 게시글 목록 조회 */
  @Get('likes')
  async getMyLikes(
    @Query() query: PaginationQueryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const data = await this.usersService.getMyLikes(req.user.id, query)
    return { success: true, data }
  }

  /** GET /users/me/news-history — 최근 읽은 뉴스 목록 조회 */
  @Get('news-history')
  async getNewsHistory(
    @Query() query: PaginationQueryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const data = await this.usersService.getNewsHistory(req.user.id, query)
    return { success: true, data }
  }

  /** PATCH /users/me/notifications — 알림 설정 변경 */
  @Patch('notifications')
  async updateNotificationSettings(
    @Body() settings: { postComment?: boolean; lckResult?: boolean; marketing?: boolean },
    @Req() req: AuthenticatedRequest,
  ) {
    const data = await this.usersService.updateNotificationSettings(req.user.id, settings)
    return { success: true, data }
  }

  /** DELETE /users/me — 회원 탈퇴 */
  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteAccount(@Req() req: AuthenticatedRequest) {
    const data = await this.usersService.deleteAccount(req.user.id)
    return { success: true, data }
  }
}
