// 최신 뉴스 그리드 컴포넌트 — API에서 받은 뉴스 목록을 4열 그리드로 표시
// 필터링은 API 파라미터로 서버에서 처리되므로 클라이언트 필터링 없음
import type { NewsArticle } from '@/types/news'
import { NewsCard } from './NewsCard'

interface NewsGridProps {
  news: NewsArticle[]
}

// 최신 뉴스 그리드 컴포넌트
export function NewsGrid({ news }: NewsGridProps) {
  return (
    <section>
      {/* 섹션 타이틀 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-xl font-medium text-[var(--color-text-primary)]">
          <span className="w-[3px] h-5 bg-[var(--color-primary)] rounded-full inline-block" />
          최신 뉴스
        </h2>
      </div>

      {/* 뉴스 그리드 */}
      {news.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {news.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      ) : (
        <p className="text-center py-12 text-[var(--color-text-muted)]">아직 뉴스가 없습니다.</p>
      )}
    </section>
  )
}
