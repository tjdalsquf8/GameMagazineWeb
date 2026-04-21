// Hero 섹션 우측 사이드카드 단건 컴포넌트
// 클릭 시 Hero 메인에 해당 뉴스를 표시하도록 상위 컴포넌트에 알림
import Image from 'next/image'
import type { SideNews } from '@/lib/mock/news'
import { CategoryBadge } from './CategoryBadge'

interface HeroSideCardProps {
  news: SideNews
  // 현재 Hero 메인에 표시 중인 뉴스 slug
  activeSlug: string
  // 사이드카드 클릭 핸들러
  onClick: (news: SideNews) => void
  // 순위 번호 — 전체 탭은 항상 1, 특정 카테고리 탭은 2~4
  rank: number
  // 전체 탭 여부 — true면 "카테고리 1위" 배지, false면 순위 번호 표시
  isAllCategory: boolean
}

// 발행일 포맷 함수 — ISO 문자열을 MM.DD 형태로 변환
function formatDate(iso: string): string {
  const d = new Date(iso)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${month}.${day}`
}

// 순위 배지 컴포넌트
function RankBadge({ rank, isAllCategory }: { rank: number; isAllCategory: boolean }) {
  if (isAllCategory) {
    // 전체 탭: "🔥 카테고리 1위" 스타일
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-orange-500 dark:text-orange-400">
        🔥 카테고리 1위
      </span>
    )
  }

  // 특정 카테고리 탭: 순위 숫자 배지
  const rankColors: Record<number, string> = {
    2: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
    3: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300',
    4: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400',
  }
  const colorClass =
    rankColors[rank] ?? 'bg-zinc-100 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400'

  return (
    <span
      className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold flex-shrink-0 ${colorClass}`}
    >
      {rank}
    </span>
  )
}

// Hero 사이드카드 컴포넌트
export function HeroSideCard({
  news,
  activeSlug,
  onClick,
  rank,
  isAllCategory,
}: HeroSideCardProps) {
  const isActive = news.slug === activeSlug

  return (
    <button
      type="button"
      onClick={() => onClick(news)}
      className={`w-full flex gap-3 p-2 rounded-lg border transition-colors text-left cursor-pointer ${
        isActive
          ? 'border-[var(--color-primary)] border-2 bg-[var(--color-surface)]'
          : 'border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]'
      }`}
    >
      {/* 썸네일 */}
      <div className="relative w-20 h-16 flex-shrink-0 rounded overflow-hidden">
        <Image src={news.thumbnail} alt={news.title} fill className="object-cover" sizes="80px" />
      </div>

      {/* 뉴스 정보 */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          {/* 카테고리 뱃지 + 순위 배지 */}
          <div className="flex items-center gap-1.5 mb-1">
            <CategoryBadge category={news.category} />
            <RankBadge rank={rank} isAllCategory={isAllCategory} />
          </div>
          <p className="text-xs font-medium text-[var(--color-text-primary)] line-clamp-2 leading-snug">
            {news.title}
          </p>
        </div>
        <span className="text-xs text-[var(--color-text-muted)] mt-1">
          {formatDate(news.publishedAt)}
        </span>
      </div>
    </button>
  )
}
