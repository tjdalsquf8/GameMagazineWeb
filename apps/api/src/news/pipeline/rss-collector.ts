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

// 지정된 피드 소스에서 RSS를 파싱하여 RawArticle 배열로 반환
export async function collectFeed(source: FeedSource): Promise<RawArticle[]> {
  const parser = new Parser({
    customFields: {
      item: ['content:encoded', 'description'],
    },
    timeout: 10000,
  })

  const feed = await parser.parseURL(source.url)

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
