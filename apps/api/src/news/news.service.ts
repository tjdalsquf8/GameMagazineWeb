// apps/api/src/news/news.service.ts
// 뉴스 서비스 — RSS 수집·분류·재작성 파이프라인 실행 및 뉴스 CRUD 처리

import { Injectable, NotFoundException, Logger } from '@nestjs/common'
import Anthropic from '@anthropic-ai/sdk'
import { PrismaService } from '../prisma/prisma.service'
import { FEED_SOURCES } from './constants/feed-sources'
import { collectFeed } from './pipeline/rss-collector'
import {
  classifyByKeyword,
  classifyWithClaude,
} from './pipeline/category-classifier'
import { rewriteArticle } from './pipeline/article-rewriter'
import { NewsListQueryDto } from './dto/news-list-query.dto'
import { NewsListItemDto, NewsDetailDto } from './dto/news-response.dto'

// 파이프라인 실행 결과 통계 타입
interface PipelineResult {
  saved: number
  skipped: number
  failed: number
}

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name)
  private readonly anthropic: Anthropic

  constructor(private readonly prisma: PrismaService) {
    // Anthropic 클라이언트 초기화
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }

  // 뉴스 파이프라인 실행 — RSS 수집 → 중복 체크 → 카테고리 분류 → 재작성 → 저장
  async runNewsPipeline(): Promise<PipelineResult> {
    const result: PipelineResult = { saved: 0, skipped: 0, failed: 0 }

    for (const source of FEED_SOURCES) {
      this.logger.log(`[${source.name}] RSS 수집 시작`)

      let articles
      try {
        articles = await collectFeed(source)
        this.logger.log(`[${source.name}] ${articles.length}개 기사 수집 완료`)
      } catch (err) {
        this.logger.error(
          `[${source.name}] RSS 수집 실패`,
          err instanceof Error ? err.stack : String(err),
        )
        result.failed++
        continue
      }

      for (const article of articles) {
        try {
          // 제목 또는 링크가 없는 기사 스킵
          if (!article.title || !article.link) {
            result.skipped++
            continue
          }

          // 중복 체크 — originalLink 기준
          const existing = await this.prisma.news.findUnique({
            where: { originalLink: article.link },
          })

          if (existing) {
            result.skipped++
            continue
          }

          // 1단계: 키워드 분류
          let classification = classifyByKeyword(article.title)

          // 2단계: 키워드 분류 실패 시 Claude 분류
          if (!classification) {
            const claudeResults = await classifyWithClaude(
              [article.title],
              this.anthropic,
            )
            classification = claudeResults[0]
          }

          // 재작성
          const rewritten = await rewriteArticle(
            article.title,
            article.content,
            classification.mainCategory,
            classification.subCategory,
            this.anthropic,
          )

          // DB 저장
          await this.prisma.news.create({
            data: {
              originalTitle: article.title,
              originalLink: article.link,
              originalPubDate: article.pubDate,
              sourceName: article.sourceName,
              mainCategory: classification.mainCategory,
              subCategory: classification.subCategory,
              classifyMethod: classification.method,
              rewrittenTitle: rewritten.title,
              rewrittenSummary: rewritten.summary,
              rewrittenBody: rewritten.body,
              tags: rewritten.tags,
            },
          })

          result.saved++
          this.logger.log(`저장 완료: ${article.title}`)

          // API 레이트 리밋 방지용 딜레이
          await new Promise((resolve) => setTimeout(resolve, 500))
        } catch (err) {
          this.logger.error(
            `기사 처리 실패: ${article.title}`,
            err instanceof Error ? err.stack : String(err),
          )
          result.failed++
        }
      }
    }

    this.logger.log(
      `파이프라인 완료 — saved: ${result.saved}, skipped: ${result.skipped}, failed: ${result.failed}`,
    )

    return result
  }

  // 뉴스 목록 조회 — 카테고리 필터 및 페이지네이션 지원
  async getNewsList(query: NewsListQueryDto): Promise<{
    data: NewsListItemDto[]
    meta: { total: number; page: number; limit: number }
  }> {
    const page = query.page ?? 1
    const limit = query.limit ?? 20
    const skip = (page - 1) * limit

    const where = {
      status: 'PUBLISHED' as const,
      ...(query.mainCategory && { mainCategory: query.mainCategory }),
      ...(query.subCategory && { subCategory: query.subCategory }),
    }

    const [total, items] = await Promise.all([
      this.prisma.news.count({ where }),
      this.prisma.news.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          mainCategory: true,
          subCategory: true,
          rewrittenTitle: true,
          rewrittenSummary: true,
          tags: true,
          createdAt: true,
        },
      }),
    ])

    const data: NewsListItemDto[] = items.map((item) => ({
      id: item.id,
      mainCategory: item.mainCategory,
      subCategory: item.subCategory,
      title: item.rewrittenTitle,
      summary: item.rewrittenSummary,
      tags: item.tags,
      createdAt: item.createdAt,
    }))

    return {
      data,
      meta: { total, page, limit },
    }
  }

  // 뉴스 상세 조회 — id로 단일 뉴스 조회
  async getNewsDetail(id: string): Promise<NewsDetailDto> {
    const news = await this.prisma.news.findUnique({
      where: { id },
      select: {
        id: true,
        mainCategory: true,
        subCategory: true,
        rewrittenTitle: true,
        rewrittenSummary: true,
        rewrittenBody: true,
        tags: true,
        createdAt: true,
      },
    })

    if (!news) {
      throw new NotFoundException('뉴스를 찾을 수 없습니다.')
    }

    return {
      id: news.id,
      mainCategory: news.mainCategory,
      subCategory: news.subCategory,
      title: news.rewrittenTitle,
      summary: news.rewrittenSummary,
      body: news.rewrittenBody,
      tags: news.tags,
      createdAt: news.createdAt,
    }
  }
}
