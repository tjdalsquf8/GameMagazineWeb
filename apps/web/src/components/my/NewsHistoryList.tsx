// 최근 읽은 뉴스 목록 컴포넌트 — 카테고리별 썸네일 색상 적용, 최근 4건
'use client'

import Link from 'next/link'
import { useNewsHistory } from '@/hooks/useNewsHistory'
import type { NewsHistory } from '@/types/my.types'

/** 카테고리별 썸네일 색상 토큰 */
const CATEGORY_COLORS: Record<string, { className: string; label: string }> = {
  PC: { className: 'bg-[#050814] text-[#00c8ff]', label: 'PC' },
  Mobile: { className: 'bg-[#fdf6ee] text-[#e8820c]', label: 'Mobile' },
  Console: { className: 'bg-[#0d0d0d] text-[#c9a84c]', label: 'Console' },
  Esports: { className: 'bg-[#09090f] text-[#e84545]', label: 'e스포츠' },
}

/** 날짜 포맷 */
function formatReadAt(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours < 1) {
    const diffMins = Math.floor(diffMs / (1000 * 60))
    return `${diffMins}분 전`
  }
  if (diffHours < 24) return `${diffHours}시간 전`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}일 전`
  return `${date.getMonth() + 1}.${date.getDate()}`
}

/** 스켈레톤 */
function NewsHistorySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
      ))}
    </div>
  )
}

/** 빈 상태 UI */
function EmptyState() {
  return (
    <div className="py-10 text-center text-sm text-[var(--color-text-muted)]">
      <p>곧 지원될 예정인 기능입니다.</p>
    </div>
  )
}

/** 뉴스 히스토리 단일 카드 */
function NewsHistoryCard({ news }: { news: NewsHistory }) {
  const colorToken = CATEGORY_COLORS[news.category] ?? CATEGORY_COLORS['PC']

  return (
    <Link
      href={`/news/${news.id}`}
      className="flex flex-col gap-2 p-3 rounded-lg border border-[var(--color-border)] hover:border-primary/40 transition-colors group"
    >
      {/* 카테고리 썸네일 */}
      <div
        className={`w-full h-8 rounded-md flex items-center justify-center text-xs font-bold tracking-wide ${colorToken.className}`}
      >
        {colorToken.label}
      </div>

      {/* 제목 + 날짜 */}
      <p className="text-xs text-[var(--color-text-primary)] line-clamp-2 group-hover:text-primary transition-colors leading-relaxed">
        {news.title}
      </p>
      <span className="text-[10px] text-[var(--color-text-muted)]">
        {formatReadAt(news.readAt)}
      </span>
    </Link>
  )
}

/** 최근 읽은 뉴스 섹션 컴포넌트 */
export default function NewsHistoryList() {
  const { data, isLoading, error } = useNewsHistory(4)

  return (
    <section id="section-newsHistory" aria-labelledby="section-newsHistory-title">
      <div className="mb-3">
        <h2
          id="section-newsHistory-title"
          className="text-base font-semibold text-[var(--color-text-primary)]"
        >
          최근 읽은 뉴스
        </h2>
      </div>

      {isLoading && <NewsHistorySkeleton />}
      {error && (
        <p className="py-4 text-sm text-center text-red-500">
          불러오지 못했습니다. 새로고침해 주세요.
        </p>
      )}
      {!isLoading && !error && data?.items.length === 0 && <EmptyState />}
      {!isLoading && !error && data && data.items.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {data.items.map((news) => (
            <NewsHistoryCard key={news.id} news={news} />
          ))}
        </div>
      )}
    </section>
  )
}
