// Hero 섹션 좌측 메인 뷰어 컴포넌트
// 현재 선택된 뉴스를 대형 이미지 + 오버레이 텍스트로 표시
// 전체 탭 자동 순환 인디케이터 포함
'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import type { HeroNews, CategorySlug } from '@/lib/mock/news'
import { CategoryBadge } from './CategoryBadge'

// 자동 순환 인디케이터용 카테고리 순서 및 레이블
const AUTO_SLIDE_LABELS: { slug: CategorySlug; label: string }[] = [
  { slug: 'pc', label: 'PC' },
  { slug: 'console', label: '콘솔' },
  { slug: 'mobile', label: '모바일' },
  { slug: 'esports', label: 'e스포츠' },
]

interface HeroMainProps {
  news: HeroNews
  activeCategory: CategorySlug
  // 전체 탭 자동 순환 시 현재 인덱스 (0~3)
  autoIndex: number
  // 페이드 전환 여부 (애니메이션 트리거)
  isFading: boolean
}

// 조회수 포맷 함수 — 1만 이상이면 N만 형태로 변환
function formatViewCount(count: number): string {
  if (count >= 10000) {
    return `${Math.floor(count / 10000)}만 조회`
  }
  return `${count.toLocaleString()} 조회`
}

// Hero 메인 뷰어 컴포넌트
export function HeroMain({ news, activeCategory, autoIndex, isFading }: HeroMainProps) {
  return (
    <div className="relative w-full">
      {/* 이미지 영역 */}
      <Link href={`/news/${news.slug}`} className="block relative w-full cursor-pointer">
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <Image
            src={news.thumbnail}
            alt={news.title}
            fill
            priority
            className={`object-cover transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}
            sizes="(max-width: 768px) 100vw, 66vw"
          />

          {/* 하단 그라데이션 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent rounded-lg" />

          {/* 텍스트 오버레이 */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}
          >
            <div className="mb-2">
              <CategoryBadge category={news.category} variant="overlay" />
            </div>
            <h2 className="text-2xl font-medium text-white leading-snug line-clamp-2">
              {news.title}
            </h2>
            {news.summary && (
              <p className="text-sm text-white/75 line-clamp-2 mt-2">{news.summary}</p>
            )}
            {/* 메타 정보 */}
            <div className="flex items-center gap-2 mt-3 text-xs text-white/60">
              <Clock size={12} />
              <span>{news.readTime}분 읽기</span>
              <span>·</span>
              <span>{formatViewCount(news.viewCount)}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* 지금 읽기 버튼 */}
      <div className="mt-3 flex items-center justify-between">
        {/* 전체 탭 자동 순환 인디케이터 */}
        {activeCategory === 'all' ? (
          <div className="flex items-center gap-2">
            {AUTO_SLIDE_LABELS.map((item, index) => (
              <div key={item.slug} className="flex items-center gap-1">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === autoIndex
                      ? 'w-6 bg-[var(--color-primary)]'
                      : 'w-1.5 bg-[var(--color-border)]'
                  }`}
                />
                <span
                  className={`text-xs transition-colors duration-300 ${
                    index === autoIndex
                      ? 'text-[var(--color-text-primary)] font-medium'
                      : 'text-[var(--color-text-muted)]'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div />
        )}

        <Link
          href={`/news/${news.slug}`}
          className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
        >
          지금 읽기 &rarr;
        </Link>
      </div>
    </div>
  )
}
