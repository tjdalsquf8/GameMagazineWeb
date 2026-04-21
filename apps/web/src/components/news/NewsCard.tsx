// 최신 뉴스 그리드 단건 카드 컴포넌트
// 호버 시 이미지 확대 및 제목 색상 전환 애니메이션 포함
import Image from 'next/image'
import Link from 'next/link'
import type { NewsArticle } from '@/types/news'
import { CategoryBadge } from './CategoryBadge'

interface NewsCardProps {
  news: NewsArticle
}

// 발행일 포맷 함수 — ISO 문자열을 MM.DD 형태로 변환
function formatDate(iso: string): string {
  const d = new Date(iso)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${month}.${day}`
}

// mainCategory 문자열을 CategoryBadge용 slug로 변환
// API 값('PC', 'Console', 'Mobile', 'Esports') → mock slug('pc', 'console', 'mobile', 'esports')
function mainCategoryToSlug(mainCategory: string): string {
  return mainCategory.toLowerCase()
}

// 뉴스 카드 컴포넌트
export function NewsCard({ news }: NewsCardProps) {
  // CategoryBadge가 요구하는 Category 객체 형태로 변환
  const category = {
    id: 0,
    name: news.mainCategory,
    slug: mainCategoryToSlug(news.mainCategory),
  }

  return (
    <Link
      href={`/news/${news.id}`}
      className="group block rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] transition-colors"
    >
      {/* 썸네일 — 실제 이미지 없는 1차 단계: placeholder 사용 */}
      <div className="relative w-full aspect-video overflow-hidden bg-[var(--color-surface-hover)]">
        <Image
          src="/images/news-placeholder.png"
          alt={news.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          onError={(e) => {
            // placeholder 이미지 로드 실패 시 빈 배경 유지
            ;(e.currentTarget as HTMLImageElement).style.display = 'none'
          }}
        />
      </div>

      {/* 카드 본문 */}
      <div className="p-3">
        {/* 카테고리 뱃지 */}
        <div className="mb-2">
          <CategoryBadge category={category} />
        </div>

        {/* 제목 */}
        <h3 className="text-sm font-medium text-[var(--color-text-primary)] line-clamp-2 leading-snug group-hover:text-[var(--color-primary)] transition-colors">
          {news.title}
        </h3>

        {/* 메타 정보 — 소분류 + 발행일 + 조회수 */}
        <div className="flex items-center gap-2 mt-2 text-xs text-[var(--color-text-muted)]">
          {news.subCategory && (
            <>
              <span>{news.subCategory}</span>
              <span>·</span>
            </>
          )}
          <span>{formatDate(news.createdAt)}</span>
          <span>·</span>
          <span>조회 {news.viewCount.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  )
}
