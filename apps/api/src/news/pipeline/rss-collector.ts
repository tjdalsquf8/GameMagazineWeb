// apps/api/src/news/pipeline/rss-collector.ts
// RSS 피드를 수집하고 HTML을 제거한 RawArticle 목록을 반환하는 수집기

import Parser from 'rss-parser'
import { FeedSource } from '../constants/feed-sources'

// 수집된 원문 기사 인터페이스
export interface RawArticle {
  title: string
  link: string
  pubDate: Date | null
  content: string  // HTML 제거된 본문 (최대 1000자)
  sourceName: string
}

// HTML 태그와 HTML 엔티티를 제거하는 유틸 함수
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'")   // &#39; 및 &#039; 모두 처리
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, '')     // 나머지 숫자 엔티티 제거
    .replace(/\s{2,}/g, ' ')
    .trim()
}

// HTML 엔티티만 디코딩하는 유틸 함수 (태그 제거 없이)
function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, '')
    .trim()
}

// RSS 피드 최대 허용 크기 — 5MB 초과 시 거부
const MAX_FEED_SIZE_BYTES = 5 * 1024 * 1024

// 지정된 피드 소스에서 RSS를 파싱하여 RawArticle 배열로 반환
// maxRedirects: 3 — 무한 리다이렉트 방어, 파싱된 피드 5MB 초과 시 오류 처리
export async function collectFeed(source: FeedSource): Promise<RawArticle[]> {
  const parser = new Parser({
    customFields: {
      item: ['content:encoded', 'description'],
    },
    timeout: 10000,
    maxRedirects: 3,
  })

  const feed = await parser.parseURL(source.url)

  // 대용량 응답 방어 — 파싱된 피드 직렬화 크기가 5MB를 초과하면 처리 거부
  const feedSize = Buffer.byteLength(JSON.stringify(feed), 'utf8')
  if (feedSize > MAX_FEED_SIZE_BYTES) {
    throw new Error(
      `[${source.name}] 피드 크기 초과: ${(feedSize / 1024 / 1024).toFixed(2)}MB (최대 5MB)`,
    )
  }

  return feed.items.map((item) => {
    const rawContent =
      (item['content:encoded'] as string | undefined) ??
      item.content ??
      item.summary ??
      item.contentSnippet ??
      ''

    const cleanContent = stripHtml(rawContent).slice(0, 1000)

    return {
      title: decodeEntities(item.title ?? ''),
      link: item.link ?? '',
      pubDate: item.pubDate ? new Date(item.pubDate) : null,
      content: cleanContent,
      sourceName: source.name,
    }
  })
}
