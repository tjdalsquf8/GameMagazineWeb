// apps/api/src/news/news.service.ts
// 뉴스 서비스 — RSS 수집·분류·재작성 파이프라인 실행 및 뉴스 CRUD 처리

import { Injectable, NotFoundException, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Anthropic from '@anthropic-ai/sdk'
import { PrismaService } from '../prisma/prisma.service'
import { FEED_SOURCES } from './constants/feed-sources'
import { collectFeed } from './pipeline/rss-collector'
import {
  classifyByKeyword,
  classifyWithClaude,
} from './pipeline/category-classifier'
import { rewriteArticle, rewriteConsoleArticle, rewriteEsportsArticle } from './pipeline/article-rewriter'
import {
  fetchCompletedLckMatches,
  buildMatchContext,
} from './pipeline/esports-collector'
import { NewsListQueryDto } from './dto/news-list-query.dto'
import { NewsListItemDto, NewsDetailDto, PopularNewsItemDto } from './dto/news-response.dto'

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

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    // Anthropic 클라이언트 초기화
    this.anthropic = new Anthropic({
      apiKey: this.configService.getOrThrow<string>('ANTHROPIC_API_KEY'),
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

          let rewritten
          let classifyMethod: string
          let mainCategory: string
          let subCategory: string

          if (source.platform) {
            // Console 소스 — 카테고리 분류 생략, 플랫폼으로 고정, 영문 → 한국어 재작성
            mainCategory = 'Console'
            subCategory = source.platform
            classifyMethod = 'fixed'
            rewritten = await rewriteConsoleArticle(
              article.title,
              article.content,
              source.platform,
              this.anthropic,
            )
          } else {
            // 일반 소스 — 1단계: 키워드 분류
            let classification = classifyByKeyword(article.title)

            // 2단계: 키워드 분류 실패 시 Claude 분류
            if (!classification) {
              const claudeResults = await classifyWithClaude(
                [article.title],
                this.anthropic,
              )
              classification = claudeResults[0]
            }

            mainCategory = classification.mainCategory
            subCategory = classification.subCategory
            classifyMethod = classification.method

            rewritten = await rewriteArticle(
              article.title,
              article.content,
              classification.mainCategory,
              classification.subCategory,
              this.anthropic,
            )
          }

          // DB 저장
          await this.prisma.news.create({
            data: {
              originalTitle: article.title,
              originalLink: article.link,
              originalPubDate: article.pubDate,
              sourceName: article.sourceName,
              mainCategory,
              subCategory,
              classifyMethod,
              rewrittenTitle: rewritten.title,
              rewrittenSummary: rewritten.summary,
              rewrittenBody: rewritten.body,
              tags: rewritten.tags,
              status: 'PUBLISHED',
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

    // 이스포츠 파이프라인 연속 실행
    await this.runEsportsPipeline()

    return result
  }

  // LCK 이스포츠 파이프라인 실행 — 완료된 경기 수집 → 중복 체크 → 기사 재작성 → 저장
  async runEsportsPipeline(): Promise<void> {
    this.logger.log('[Esports] LCK 파이프라인 시작')

    let matches
    try {
      const lolesportsApiKey = this.configService.getOrThrow<string>('LOLESPORTS_API_KEY')
      matches = await fetchCompletedLckMatches(lolesportsApiKey)
      this.logger.log(`[Esports] ${matches.length}개 완료 경기 수집`)
    } catch (err) {
      this.logger.error(
        '[Esports] 경기 수집 실패',
        err instanceof Error ? err.stack : String(err),
      )
      return
    }

    for (const match of matches) {
      const originalLink = `lck-match-${match.matchId}`
      try {
        // 중복 체크 — originalLink 기준
        const existing = await this.prisma.news.findUnique({
          where: { originalLink },
        })

        if (existing) {
          continue
        }

        // 경기 컨텍스트 생성 → 기사 재작성
        const matchContext = buildMatchContext(match)
        const rewritten = await rewriteEsportsArticle(matchContext, this.anthropic)

        // DB 저장
        await this.prisma.news.create({
          data: {
            originalTitle: rewritten.title,
            originalLink,
            originalPubDate: new Date(match.startTime),
            sourceName: 'lolesports',
            mainCategory: 'Esports',
            subCategory: 'LCK',
            classifyMethod: 'fixed',
            rewrittenTitle: rewritten.title,
            rewrittenSummary: rewritten.summary,
            rewrittenBody: rewritten.body,
            tags: rewritten.tags,
            status: 'PUBLISHED',
          },
        })

        this.logger.log(`[Esports] 저장 완료: ${rewritten.title}`)

        // API 레이트 리밋 방지용 딜레이
        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch (err) {
        this.logger.error(
          `[Esports] 경기 처리 실패: matchId=${match.matchId}`,
          err instanceof Error ? err.stack : String(err),
        )
      }
    }

    this.logger.log('[Esports] LCK 파이프라인 완료')
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
          viewCount: true,
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
      viewCount: item.viewCount,
      createdAt: item.createdAt,
    }))

    return {
      data,
      meta: { total, page, limit },
    }
  }

  // 좋아요 수 및 내 좋아요 여부 조회 — userId 없으면 liked: false 반환
  async getRecommend(
    newsId: string,
    userId: string | null,
  ): Promise<{ liked: boolean; count: number }> {
    const count = await this.prisma.newsRecommend.count({ where: { newsId } })
    if (!userId) return { liked: false, count }
    const existing = await this.prisma.newsRecommend.findUnique({
      where: { userId_newsId: { userId, newsId } },
    })
    return { liked: !!existing, count }
  }

  // 좋아요 토글 — 레코드가 있으면 삭제(취소), 없으면 생성(추천)
  async toggleRecommend(
    newsId: string,
    userId: string,
  ): Promise<{ liked: boolean; count: number }> {
    const existing = await this.prisma.newsRecommend.findUnique({
      where: { userId_newsId: { userId, newsId } },
    })

    if (existing) {
      await this.prisma.newsRecommend.delete({
        where: { userId_newsId: { userId, newsId } },
      })
    } else {
      await this.prisma.newsRecommend.create({
        data: { userId, newsId },
      })
    }

    const count = await this.prisma.newsRecommend.count({ where: { newsId } })
    return { liked: !existing, count }
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
        viewCount: true,
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
      viewCount: news.viewCount,
      createdAt: news.createdAt,
    }
  }

  // 카테고리별 조회수 상위 뉴스 조회 — 사이드바 인기 뉴스 표시용
  async getPopularNews(mainCategory: string, limit: number): Promise<PopularNewsItemDto[]> {
    const items = await this.prisma.news.findMany({
      where: {
        status: 'PUBLISHED',
        ...(mainCategory ? { mainCategory } : {}),
      },
      orderBy: { viewCount: 'desc' },
      take: limit,
      select: { id: true, rewrittenTitle: true, viewCount: true },
    })
    return items.map((item) => ({
      id: item.id,
      title: item.rewrittenTitle,
      viewCount: item.viewCount,
    }))
  }

  // 뉴스 조회수 증가 — 클라이언트 localStorage 하루 1회 제한과 연동
  async incrementView(id: string): Promise<void> {
    await this.prisma.news.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    })
  }
}
