// 뉴스 메인 페이지 — 게임 매거진 스타일 뉴스 목록
// ISR (revalidate: 600) 전환 예정 — 현재 Mock 데이터 사용
// 카테고리 상태는 Client Component(NewsMainClient)에서 관리
import { NewsMainClient } from '@/components/news/NewsMainClient'
import { mockLatestNews, mockCommunityHot } from '@/lib/mock/news'

export default function HomePage() {
  return <NewsMainClient latestNews={mockLatestNews} communityHot={mockCommunityHot} />
}
