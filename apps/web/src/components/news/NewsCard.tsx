// 최신 뉴스 그리드 단건 카드 컴포넌트
// 호버 시 이미지 확대 및 제목 색상 전환 애니메이션 포함
import Image from 'next/image'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import type { LatestNews } from '@/lib/mock/news'
import { CategoryBadge } from './CategoryBadge'

interface NewsCardProps {
  news: LatestNews
}

// 발행일 포맷 함수 — ISO 문자열을 MM.DD 형태로 변환
function formatDate(iso: string): string {
  const d = new Date(iso)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${month}.${day}`
}

// 조회수 포맷 함수 — 1만 이상이면 N만 형태로 변환
function formatViewCount(count: number): string {
  if (count >= 10000) {
    return `${Math.floor(count / 10000)}만`
  }
  return count.toLocaleString()
}

// 뉴스 카드 컴포넌트
export function NewsCard({ news }: NewsCardProps) {
  return (
    <Link
      href={`/news/${news.slug}`}
      className="group block rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] transition-colors"
    >
      {/* 썸네일 */}
      <div className="relative w-full aspect-video overflow-hidden">
        <Image
          src={news.thumbnail}
          alt={news.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      {/* 카드 본문 */}
      <div className="p-3">
        {/* 카테고리 뱃지 */}
        <div className="mb-2">
          <CategoryBadge category={news.category} />
        </div>

        {/* 제목 */}
        <h3 className="text-sm font-medium text-[var(--color-text-primary)] line-clamp-2 leading-snug group-hover:text-[var(--color-primary)] transition-colors">
          {news.title}
        </h3>

        {/* 메타 정보 */}
        <div className="flex items-center gap-2 mt-2 text-xs text-[var(--color-text-muted)]">
          <Clock size={12} />
          <span>{news.readTime}분</span>
          <span>·</span>
          <span>{formatViewCount(news.viewCount)} 조회</span>
          <span>·</span>
          <span>{formatDate(news.publishedAt)}</span>
        </div>
      </div>
    </Link>
  )
}
