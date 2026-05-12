// apps/api/src/editor-picks/editor-picks.controller.ts
// 에디터 픽 아티클 컨트롤러 — 생성·목록조회·단건조회·숨김토글·소프트삭제 엔드포인트를 제공한다

import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { Req } from '@nestjs/common'
import { Request } from 'express'
import { EditorPicksService } from './editor-picks.service'
import { CreateEditorPickDto } from './dto/create-editor-pick.dto'
import { EditorPickResponseDto } from './dto/editor-pick-response.dto'
import { AdminGuard } from '../admin/guards/admin.guard'

// AdminGuard가 request.user에 세팅하는 JWT 페이로드 타입
interface AdminRequest extends Request {
  user: {
    sub: string
    email: string
    role: string
  }
}

@Controller('editor-picks')
export class EditorPicksController {
  private readonly logger = new Logger(EditorPicksController.name)

  constructor(private readonly editorPicksService: EditorPicksService) {}

  // POST /editor-picks — 에디터 픽 아티클 생성 (AdminGuard 필요, Rate Limit 10/분)
  @Post()
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async create(
    @Body() dto: CreateEditorPickDto,
    @Req() req: AdminRequest,
  ): Promise<{ success: true; data: EditorPickResponseDto }> {
    this.logger.log(`에디터 픽 생성 요청: authorId=${req.user.sub}`)
    const data = await this.editorPicksService.create(dto, req.user.sub)
    return { success: true, data }
  }

  // GET /editor-picks — 에디터 픽 목록 조회 (public, isHidden=false 필터 포함, limit 쿼리 파라미터 지원)
  @Get()
  async findAll(
    @Query('limit') limitStr?: string,
  ): Promise<{ success: true; data: EditorPickResponseDto[] }> {
    const limit = limitStr !== undefined ? parseInt(limitStr, 10) : undefined
    const data = await this.editorPicksService.findAll(Number.isNaN(limit) ? undefined : limit)
    return { success: true, data }
  }

  // GET /editor-picks/admin — 에디터 픽 전체 목록 조회 (AdminGuard 필요, isHidden 필터 없음, limit 최대 100)
  // 주의: `:id` 라우트보다 먼저 선언해야 라우트 충돌이 발생하지 않는다
  @Get('admin')
  @UseGuards(AdminGuard)
  async findAllAdmin(
    @Query('limit') limitStr?: string,
  ): Promise<{ success: true; data: EditorPickResponseDto[] }> {
    const limit = limitStr !== undefined ? parseInt(limitStr, 10) : undefined
    const data = await this.editorPicksService.findAllForAdmin(Number.isNaN(limit) ? undefined : limit)
    return { success: true, data }
  }

  // GET /editor-picks/:id — 에디터 픽 단건 조회 (public, isHidden=false 필터 포함)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<{ success: true; data: EditorPickResponseDto }> {
    const data = await this.editorPicksService.findOne(id)
    return { success: true, data }
  }

  // PATCH /editor-picks/:id/hidden — 에디터 픽 숨김 토글 (AdminGuard 필요)
  @Patch(':id/hidden')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  async toggleHidden(
    @Param('id') id: string,
  ): Promise<{ success: true; data: EditorPickResponseDto }> {
    this.logger.log(`에디터 픽 숨김 토글 요청: id=${id}`)
    const data = await this.editorPicksService.toggleHidden(id)
    return { success: true, data }
  }

  // DELETE /editor-picks/:id — 에디터 픽 소프트 삭제 (AdminGuard 필요)
  @Delete(':id')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
  ): Promise<{ success: true; data: null }> {
    this.logger.log(`에디터 픽 삭제 요청: id=${id}`)
    await this.editorPicksService.softDelete(id)
    return { success: true, data: null }
  }
}
