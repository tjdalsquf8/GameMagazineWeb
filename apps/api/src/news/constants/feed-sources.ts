// apps/api/src/news/constants/feed-sources.ts
// RSS 피드 소스 목록 — 뉴스 자동 수집 파이프라인에서 사용

// 피드 소스 타입 정의
export interface FeedSource {
  name: string
  url: string
  language: 'ko' | 'en'
}

// 실제 수집 대상 RSS 피드 목록
export const FEED_SOURCES: FeedSource[] = [
  { name: '게임메카', url: 'https://www.gamemeca.com/rss.php', language: 'ko' },
  // 추후 추가 예정 (Console, Esports 소스)
]
