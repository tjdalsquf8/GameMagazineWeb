// apps/api/src/news/news.controller.ts
// 뉴스 API 컨트롤러 — 목록 조회, 상세 조회, 추천(좋아요), 파이프라인 수동 실행

import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common'
import { NewsService } from './news.service'
import { NewsListQueryDto } from './dto/news-list-query.dto'
import { NewsListItemDto, NewsDetailDto, PopularNewsItemDto } from './dto/news-response.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { AdminGuard } from '../admin/guards/admin.guard'

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  // GET /news?mainCategory=PC&subCategory=리그오브레전드&page=1&limit=20
  // 뉴스 목록 조회 (카테고리 필터 + 페이지네이션)
  @Get()
  async getNewsList(
    @Query() query: NewsListQueryDto,
  ): Promise<{
    success: true
    data: { data: NewsListItemDto[]; meta: { total: number; page: number; limit: number } }
  }> {
    const result = await this.newsService.getNewsList(query)
    return { success: true, data: result }
  }

  // POST /news/pipeline/run
  // 뉴스 파이프라인 수동 실행 (어드민 전용 — AdminGuard로 JWT + ADMIN 역할 검증)
  @Post('pipeline/run')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  async runPipeline(): Promise<{
    success: true
    data: { saved: number; skipped: number; failed: number }
    message: string
  }> {
    const result = await this.newsService.runNewsPipeline()
    return {
      success: true,
      data: result,
      message: `파이프라인 완료 — 저장: ${result.saved}, 스킵: ${result.skipped}, 실패: ${result.failed}`,
    }
  }

  // GET /news/popular — 카테고리별 조회수 상위 뉴스 (사이드바용)
  // :id 라우트보다 반드시 앞에 선언해야 NestJS 라우팅 충돌 방지
  @Get('popular')
  async getPopularNews(
    @Query('mainCategory') mainCategory: string,
    @Query('limit') limit = 5,
  ): Promise<{ success: true; data: PopularNewsItemDto[] }> {
    const data = await this.newsService.getPopularNews(mainCategory, Number(limit))
    return { success: true, data }
  }

  // GET /news/:id/recommend — 좋아요 수 및 내 좋아요 여부 조회 (비로그인 시 liked: false)
  @Get(':id/recommend')
  async getRecommend(
    @Param('id') id: string,
    @Request() req: { user?: { id: string } },
  ): Promise<{ success: true; data: { liked: boolean; count: number } }> {
    const userId = req.user?.id ?? null
    const data = await this.newsService.getRecommend(id, userId)
    return { success: true, data }
  }

  // POST /news/:id/recommend — 좋아요 토글 (로그인 필수)
  @Post(':id/recommend')
  @UseGuards(JwtAuthGuard)
  async toggleRecommend(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ): Promise<{ success: true; data: { liked: boolean; count: number } }> {
    const data = await this.newsService.toggleRecommend(id, req.user.id)
    return { success: true, data }
  }

  // POST /news/:id/view — 조회수 증가 (인증 불필요, 클라이언트 localStorage 하루 1회 제한)
  @Post(':id/view')
  @HttpCode(HttpStatus.OK)
  async incrementView(
    @Param('id') id: string,
  ): Promise<{ success: true }> {
    await this.newsService.incrementView(id)
    return { success: true }
  }

  // GET /news/:id
  // 뉴스 상세 조회
  @Get(':id')
  async getNewsDetail(
    @Param('id') id: string,
  ): Promise<{ success: true; data: NewsDetailDto }> {
    const news = await this.newsService.getNewsDetail(id)
    return { success: true, data: news }
  }
}
