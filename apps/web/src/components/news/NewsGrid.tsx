// 최신 뉴스 그리드 컴포넌트 — API에서 받은 뉴스 목록을 4열 그리드로 표시
// 필터링은 API 파라미터로 서버에서 처리되므로 클라이언트 필터링 없음
// 항상 PAGE_SIZE(20)개 슬롯을 렌더링하여 기사 수에 관계없이 그리드 높이 고정
import type { NewsArticle } from '@/types/news'
import { NewsCard } from './NewsCard'

const PAGE_SIZE = 20

interface NewsGridProps {
  news: NewsArticle[]
  subCategory?: string | null
}

// 최신 뉴스 그리드 컴포넌트
export function NewsGrid({ news, subCategory }: NewsGridProps) {
  const placeholderCount = Math.max(0, PAGE_SIZE - news.length)

  return (
    <section>
      {/* 섹션 타이틀 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-xl font-medium text-[var(--color-text-primary)]">
          <span className="w-[3px] h-5 bg-[var(--color-primary)] rounded-full inline-block" />
          최신 뉴스
        </h2>
      </div>

      {/* 뉴스 그리드 — 항상 20슬롯, 빈 자리는 invisible placeholder */}
      {news.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {news.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
          {Array.from({ length: placeholderCount }).map((_, i) => (
            <div
              key={`placeholder-${i}`}
              aria-hidden="true"
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] invisible"
            >
              <div className="w-full aspect-video bg-[var(--color-surface-hover)]" />
              <div className="p-2 sm:p-3">
                <div className="mb-1 sm:mb-2 h-5" />
                <div className="min-h-[3rem]" />
                <div className="mt-1 sm:mt-2 h-4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-12 text-[var(--color-text-muted)]">
          {subCategory === 'VCT' ? '추후 제공될 예정입니다.' : '아직 뉴스가 없습니다.'}
        </p>
      )}
    </section>
  )
}
