// 최신 뉴스 그리드 컴포넌트 — API에서 받은 뉴스 목록을 4열 그리드로 표시
// 필터링은 API 파라미터로 서버에서 처리되므로 클라이언트 필터링 없음
import Link from 'next/link'
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
        {/* 더보기 버튼 (추후 구현 예정) */}
        <Link
          href="/news"
          className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
        >
          더보기 &rarr;
        </Link>
      </div>

      {/* 뉴스 그리드 */}
      {news.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
