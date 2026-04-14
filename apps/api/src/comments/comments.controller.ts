// comments.controller.ts
// 댓글 관련 HTTP 엔드포인트를 정의하는 컨트롤러

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common'
import { CommentsService } from './comments.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard'
import { Role } from '@prisma/client'
import { Request } from 'express'

interface AuthenticatedUser {
  id: string
  role: Role
}

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser
}

interface OptionalAuthRequest extends Request {
  user?: AuthenticatedUser
}

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /** GET /posts/:postId/comments — 댓글 목록 조회 (로그인 시 isRecommended 포함) */
  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async findAll(
    @Param('postId', ParseIntPipe) postId: number,
    @Req() req: OptionalAuthRequest,
  ) {
    return this.commentsService.findAllByPost(postId, req.user?.id)
  }

  /** POST /posts/:postId/comments — 댓글 생성 (인증 필요) */
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: CreateCommentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const data = await this.commentsService.create(postId, dto, req.user)
    return { success: true, data }
  }

  /** POST /posts/:postId/comments/:commentId/recommend — 댓글 추천 토글 (인증 필요) */
  @Post(':commentId/recommend')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async toggleRecommend(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const data = await this.commentsService.toggleCommentRecommend(postId, commentId, req.user.id)
    return { success: true, data }
  }

  /** PATCH /posts/:postId/comments/:commentId — 댓글 수정 (본인만 가능) */
  @Patch(':commentId')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() dto: UpdateCommentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const data = await this.commentsService.update(postId, commentId, dto, req.user)
    return { success: true, data }
  }

  /** DELETE /posts/:postId/comments/:commentId — 댓글 삭제 (본인 또는 ADMIN) */
  @Delete(':commentId')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.commentsService.remove(postId, commentId, req.user)
  }
}
