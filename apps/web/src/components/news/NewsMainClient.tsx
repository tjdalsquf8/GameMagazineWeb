// 뉴스 메인 클라이언트 컴포넌트 — 카테고리 필터 상태를 관리하고
// HeroSection, NewsGrid, 광고, CommunityHotWidget을 조합하는 최상위 래퍼
'use client'
import { useState } from 'react'
import type { CategorySlug, LatestNews, CommunityHot } from '@/lib/mock/news'
import { HeroSection } from './HeroSection'
import { CategoryFilter } from './CategoryFilter'
import { NewsGrid } from './NewsGrid'
import { CommunityHotWidget } from './CommunityHotWidget'

interface NewsMainClientProps {
  latestNews: LatestNews[]
  communityHot: CommunityHot[]
}

// 뉴스 메인 전체 레이아웃 컴포넌트
export function NewsMainClient({ latestNews, communityHot }: NewsMainClientProps) {
  // 카테고리 필터 상태 — 기본값 전체
  const [activeCategory, setActiveCategory] = useState<CategorySlug>('all')

  return (
    <div className="container-main py-6 md:py-10">
      {/* Hero 섹션 */}
      <section className="mb-10 md:mb-14">
        <HeroSection activeCategory={activeCategory} />
      </section>

      {/* 카테고리 필터 탭 */}
      <div className="mb-6">
        <CategoryFilter activeCategory={activeCategory} onChange={setActiveCategory} />
      </div>

      {/* 최신 뉴스 그리드 */}
      <section className="mb-10 md:mb-14">
        <NewsGrid news={latestNews} activeCategory={activeCategory} />
      </section>

      {/* 광고 + 커뮤니티 HOT */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 광고 영역 (336x280) */}
          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] min-h-[280px]">
            {/*
              실제 광고 코드 삽입 위치
              예: Google AdSense, 자체 광고 배너 등
            */}
            <div className="text-center text-[var(--color-text-muted)]">
              <p className="text-sm">광고 영역 (336&times;280)</p>
            </div>
          </div>

          {/* 커뮤니티 HOT */}
          <CommunityHotWidget posts={communityHot} />
        </div>
      </section>
    </div>
  )
}
