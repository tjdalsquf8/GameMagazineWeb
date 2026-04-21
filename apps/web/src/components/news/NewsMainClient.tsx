// 뉴스 메인 클라이언트 컴포넌트 — 대분류/소분류 카테고리 필터 상태를 관리하고
// HeroSection, NewsGrid, 광고, CommunityHotWidget을 조합하는 최상위 래퍼
'use client'
import { useState, useEffect, useCallback } from 'react'
import type { CategorySlug, CommunityHot } from '@/lib/mock/news'
import type { MainCategoryValue } from '@/constants/categories'
import type { NewsArticle, NewsListResponse } from '@/types/news'
import { HeroSection } from './HeroSection'
import { CategoryFilter } from './CategoryFilter'
import { NewsGrid } from './NewsGrid'
import { CommunityHotWidget } from './CommunityHotWidget'

interface NewsMainClientProps {
  // SSR로 받은 초기 뉴스 데이터
  initialNews: NewsListResponse
  // 커뮤니티 HOT — mock 유지
  communityHot: CommunityHot[]
}

// API mainCategory 값 → HeroSection이 사용하는 mock CategorySlug 매핑
const API_TO_HERO_SLUG: Record<string, CategorySlug> = {
  '': 'all',
  PC: 'pc',
  Console: 'console',
  Mobile: 'mobile',
  Esports: 'esports',
}

// 뉴스 메인 전체 레이아웃 컴포넌트
export function NewsMainClient({ initialNews, communityHot }: NewsMainClientProps) {
  // 대분류 카테고리 필터 상태 — API 파라미터 값 기준 ('' = 전체)
  const [activeCategory, setActiveCategory] = useState<MainCategoryValue>('')
  // 소분류 카테고리 필터 상태 — null = 소분류 전체
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null)
  // 표시할 뉴스 목록
  const [news, setNews] = useState<NewsArticle[]>(initialNews.data)
  // API 로딩 상태
  const [isLoading, setIsLoading] = useState(false)

  // 카테고리 조건으로 뉴스 fetch — 카테고리 변경 시 호출
  const fetchNews = useCallback(
    async (mainCategory: MainCategoryValue, subCategory: string | null) => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({ limit: '20' })
        if (mainCategory !== '') params.set('mainCategory', mainCategory)
        if (subCategory !== null) params.set('subCategory', subCategory)

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/news?${params.toString()}`
        )
        if (!res.ok) {
          setNews([])
          return
        }
        const json = await res.json()
        if (json.success && json.data) {
          setNews((json.data as NewsListResponse).data)
        } else {
          setNews([])
        }
      } catch {
        setNews([])
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  // 대분류 변경 시 소분류 초기화 후 API 재조회
  const handleCategoryChange = (value: MainCategoryValue) => {
    setActiveCategory(value)
    setActiveSubCategory(null)
    fetchNews(value, null)
  }

  // 소분류 변경 시 현재 대분류 유지하고 API 재조회
  const handleSubCategoryChange = (value: string | null) => {
    setActiveSubCategory(value)
    fetchNews(activeCategory, value)
  }

  // HeroSection에 전달할 mock CategorySlug (Hero는 mock 데이터 사용 유지)
  const heroSlug: CategorySlug = API_TO_HERO_SLUG[activeCategory] ?? 'all'

  return (
    <div className="container-main py-6 md:py-10">
      {/* Hero 섹션 — mock 데이터 유지 */}
      <section className="mb-10 md:mb-14">
        <HeroSection activeCategory={heroSlug} />
      </section>

      {/* 대분류 + 소분류 카테고리 필터 탭 */}
      <div className="mb-6">
        <CategoryFilter
          activeCategory={activeCategory}
          onChange={handleCategoryChange}
          activeSubCategory={activeSubCategory}
          onSubChange={handleSubCategoryChange}
        />
      </div>

      {/* 최신 뉴스 그리드 */}
      <section className="mb-10 md:mb-14">
        {isLoading ? (
          <div className="text-center py-12 text-[var(--color-text-muted)]">
            뉴스를 불러오는 중...
          </div>
        ) : (
          <NewsGrid news={news} />
        )}
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
