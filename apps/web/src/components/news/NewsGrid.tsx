// 최신 뉴스 그리드 컴포넌트 — 카테고리 필터링된 뉴스를 4열 그리드로 표시
import Link from 'next/link'
import type { CategorySlug, LatestNews } from '@/lib/mock/news'
import { NewsCard } from './NewsCard'

interface NewsGridProps {
  news: LatestNews[]
  activeCategory: CategorySlug
}

// 최신 뉴스 그리드 컴포넌트
export function NewsGrid({ news, activeCategory }: NewsGridProps) {
  // 카테고리 필터링 후 발행일 최신순 정렬
  const filtered = news
    .filter((item) => activeCategory === 'all' || item.category.slug === activeCategory)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

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
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      ) : (
        <p className="text-center py-12 text-[var(--color-text-muted)]">
          해당 카테고리의 뉴스가 없습니다.
        </p>
      )}
    </section>
  )
}
