// 뉴스 메인 클라이언트 컴포넌트 — 대분류/소분류 카테고리 필터 및 페이지네이션 상태를 관리하고
// HeroSection, NewsGrid, Pagination, 광고 배너를 조합하는 최상위 래퍼
'use client'
import { useState, useCallback, useRef } from 'react'
import { env } from '@/lib/env'
import type { CategorySlug } from '@/lib/mock/news'
import type { MainCategoryValue } from '@/constants/categories'
import type { NewsArticle, NewsListResponse, CategoryTopNewsItem } from '@/types/news'
import { HeroSection } from './HeroSection'
import { EditorPickSection } from './EditorPickSection'
import { CategoryFilter } from './CategoryFilter'
import { NewsGrid } from './NewsGrid'
import Pagination from '@/components/ui/Pagination'

interface NewsMainClientProps {
  // SSR로 받은 초기 뉴스 데이터
  initialNews: NewsListResponse
  // SSR로 받은 카테고리별 최상위 뉴스 — Hero 사이드카드용
  categoryTops: CategoryTopNewsItem[]
}

// 페이지당 뉴스 표시 개수
const PAGE_SIZE = 20

// API mainCategory 값 → HeroSection이 사용하는 mock CategorySlug 매핑
const API_TO_HERO_SLUG: Record<string, CategorySlug> = {
  '': 'all',
  PC: 'pc',
  Console: 'console',
  Mobile: 'mobile',
  Esports: 'esports',
}

// 뉴스 메인 전체 레이아웃 컴포넌트
export function NewsMainClient({ initialNews, categoryTops }: NewsMainClientProps) {
  // 대분류 카테고리 필터 상태 — API 파라미터 값 기준 ('' = 전체)
  const [activeCategory, setActiveCategory] = useState<MainCategoryValue>('')
  // 소분류 카테고리 필터 상태 — null = 소분류 전체
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null)
  // 표시할 뉴스 목록
  const [news, setNews] = useState<NewsArticle[]>(initialNews.data)
  // 현재 페이지 번호
  const [currentPage, setCurrentPage] = useState(1)
  // 전체 페이지 수
  const [totalPages, setTotalPages] = useState(
    Math.ceil((initialNews.meta.total || 0) / PAGE_SIZE) || 1
  )
  // API 로딩 상태
  const [isLoading, setIsLoading] = useState(false)

  /** 카테고리·페이지 조건으로 뉴스 fetch — 조건 변경 시 호출 */
  const fetchNews = useCallback(
    async (mainCategory: MainCategoryValue, subCategory: string | null, page: number) => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({ limit: String(PAGE_SIZE), page: String(page) })
        if (mainCategory !== '') params.set('mainCategory', mainCategory)
        if (subCategory !== null) params.set('subCategory', subCategory)

        const res = await fetch(`${env.apiUrl}/api/news?${params.toString()}`)
        if (!res.ok) {
          setNews([])
          return
        }
        const json = await res.json()
        if (json.success && json.data) {
          const listResponse = json.data as NewsListResponse
          setNews(listResponse.data)
          setTotalPages(Math.ceil((listResponse.meta.total || 0) / PAGE_SIZE) || 1)
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

  /** 대분류 변경 시 소분류·페이지 초기화 후 API 재조회 */
  const handleCategoryChange = (value: MainCategoryValue) => {
    setActiveCategory(value)
    setActiveSubCategory(null)
    setCurrentPage(1)
    fetchNews(value, null, 1)
  }

  /** 소분류 변경 시 현재 대분류 유지하고 페이지 초기화 후 API 재조회 */
  const handleSubCategoryChange = (value: string | null) => {
    setActiveSubCategory(value)
    setCurrentPage(1)
    fetchNews(activeCategory, value, 1)
  }

  /** 페이지 변경 시 현재 카테고리 유지하고 API 재조회 */
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchNews(activeCategory, activeSubCategory, page)
  }

  const gridRef = useRef<HTMLElement>(null)
  const paginationRef = useRef<HTMLDivElement>(null)

  // HeroSection에 전달할 mock CategorySlug (Hero는 mock 데이터 사용 유지)
  const heroSlug: CategorySlug = API_TO_HERO_SLUG[activeCategory] ?? 'all'

  return (
    <div className="container-main py-6 md:py-10 [overflow-anchor:none]">
      {/* Hero 섹션 — 카테고리별 최상위 뉴스 사이드카드 표시 */}
      <section className="mb-10 md:mb-14">
        <HeroSection activeCategory={heroSlug} categoryTops={categoryTops} />
      </section>

      {/* 에디터 픽 섹션 — 관리자 선정 뉴스/스폰서드 콘텐츠 노출 영역 */}
      <section className="mb-10 md:mb-14">
        <EditorPickSection />
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
      <section ref={gridRef} className="relative mb-4 md:mb-6">
        {/* 로딩 중 반투명 오버레이 — 기존 뉴스 카드 유지한 채로 스피너 표시 */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-[var(--color-background)]/60 backdrop-blur-[2px]">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-primary)]" />
          </div>
        )}
        <NewsGrid news={news} subCategory={activeSubCategory} />
      </section>

      {/* 가로 광고 배너 — 페이지네이션 위 */}
      <div className="mb-6">
        <div className="flex items-center justify-center w-full rounded-lg border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] h-[180px]">
          {/* 실제 광고 코드 삽입 위치 (728×180) */}
          <p className="text-sm text-[var(--color-text-muted)]">광고 (728&times;180)</p>
        </div>
      </div>

      {/* 페이지네이션 */}
      <div ref={paginationRef} className="mb-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}
