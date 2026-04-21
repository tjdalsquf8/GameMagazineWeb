// apps/api/src/news/news.controller.ts
// 뉴스 API 컨트롤러 — 목록 조회, 상세 조회, 파이프라인 수동 실행

import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { NewsService } from './news.service'
import { NewsListQueryDto } from './dto/news-list-query.dto'
import { NewsListItemDto, NewsDetailDto } from './dto/news-response.dto'

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
  // 뉴스 파이프라인 수동 실행 (개발 편의용)
  @Post('pipeline/run')
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
