// posts.controller.ts
// 게시글 관련 HTTP 엔드포인트를 정의하는 컨트롤러

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common'
import { PostsService } from './posts.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PostQueryDto } from './dto/post-query.dto'
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

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /** GET /posts — 게시글 목록 조회 */
  @Get()
  async findAll(@Query() query: PostQueryDto) {
    return this.postsService.findAll(query)
  }

  /** GET /posts/:postId — 게시글 단건 조회 (조회수 증가 없음, 로그인 시 isRecommended 포함) */
  @Get(':postId')
  @UseGuards(OptionalJwtAuthGuard)
  async findOne(
    @Param('postId', ParseIntPipe) postId: number,
    @Req() req: OptionalAuthRequest,
  ) {
    const data = await this.postsService.findOne(postId, req.user?.id)
    return { success: true, data }
  }

  /** POST /posts/:postId/view — 조회수 증가 전용 엔드포인트 (인증 불필요) */
  @Post(':postId/view')
  @HttpCode(HttpStatus.OK)
  async incrementView(@Param('postId', ParseIntPipe) postId: number) {
    return this.postsService.incrementView(postId)
  }

  /** POST /posts/:postId/recommend — 게시글 추천 토글 (인증 필요) */
  @Post(':postId/recommend')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async toggleRecommend(
    @Param('postId', ParseIntPipe) postId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const data = await this.postsService.togglePostRecommend(postId, req.user.id)
    return { success: true, data }
  }

  /** POST /posts — 게시글 생성 (인증 필요) */
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreatePostDto, @Req() req: AuthenticatedRequest) {
    const data = await this.postsService.create(dto, req.user)
    return { success: true, data }
  }

  /** PATCH /posts/:postId — 게시글 수정 (본인만 가능) */
  @Patch(':postId')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: UpdatePostDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const data = await this.postsService.update(postId, dto, req.user)
    return { success: true, data }
  }

  /** DELETE /posts/:postId — 게시글 삭제 (본인 또는 ADMIN) */
  @Delete(':postId')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('postId', ParseIntPipe) postId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.postsService.remove(postId, req.user)
  }
}
