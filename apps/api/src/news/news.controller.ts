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
  ParseIntPipe,
  DefaultValuePipe,
  BadRequestException,
} from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { NewsService } from './news.service'
import { NewsListQueryDto } from './dto/news-list-query.dto'
import { NewsListItemDto, NewsDetailDto, PopularNewsItemDto, CategoryTopNewsItemDto } from './dto/news-response.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { AdminGuard } from '../admin/guards/admin.guard'
import { ParseCuidPipe } from '../common/pipes/parse-cuid.pipe'

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
  // limit: DefaultValuePipe(5)로 기본값 5 설정, ParseIntPipe로 정수 변환, 1~50 범위 강제
  @Get('popular')
  async getPopularNews(
    @Query('mainCategory') mainCategory: string,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ): Promise<{ success: true; data: PopularNewsItemDto[] }> {
    if (limit < 1) {
      throw new BadRequestException({ code: 'VAL_001', message: 'limit은 1 이상이어야 합니다' })
    }
    // DB 과부하 방지 — limit 상한 50 강제
    const safeLimit = Math.min(limit, 50)
    const data = await this.newsService.getPopularNews(mainCategory, safeLimit)
    return { success: true, data }
  }

  // GET /news/category-tops — Hero 섹션용 카테고리별 조회수 1위 뉴스 (최근 7일 내, 카테고리당 1개)
  // :id 라우트보다 반드시 앞에 선언해야 NestJS 라우팅 충돌 방지
  @Get('category-tops')
  async getCategoryTopNews(): Promise<{ success: true; data: CategoryTopNewsItemDto[] }> {
    const data = await this.newsService.getCategoryTopNews()
    return { success: true, data }
  }

  // GET /news/:id/recommend — 좋아요 수 및 내 좋아요 여부 조회 (비로그인 시 liked: false)
  @Get(':id/recommend')
  async getRecommend(
    @Param('id', ParseCuidPipe) id: string,
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
    @Param('id', ParseCuidPipe) id: string,
    @Request() req: { user: { id: string } },
  ): Promise<{ success: true; data: { liked: boolean; count: number } }> {
    const data = await this.newsService.toggleRecommend(id, req.user.id)
    return { success: true, data }
  }

  // POST /news/:id/view — 조회수 증가 (인증 불필요)
  // IP당 하루 1회 rate limit 적용 — ttl: 86400000ms(24시간), limit: 1
  @Post(':id/view')
  @Throttle({ default: { limit: 1, ttl: 86400000 } })
  @HttpCode(HttpStatus.OK)
  async incrementView(
    @Param('id', ParseCuidPipe) id: string,
  ): Promise<{ success: true }> {
    await this.newsService.incrementView(id)
    return { success: true }
  }

  // GET /news/:id — 뉴스 상세 조회 (cuid 형식 검증 적용)
  @Get(':id')
  async getNewsDetail(
    @Param('id', ParseCuidPipe) id: string,
  ): Promise<{ success: true; data: NewsDetailDto }> {
    const news = await this.newsService.getNewsDetail(id)
    return { success: true, data: news }
  }
}
