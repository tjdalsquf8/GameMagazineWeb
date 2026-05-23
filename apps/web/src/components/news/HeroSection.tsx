// Hero 섹션 묶음 컴포넌트 — HeroMain + HeroSideCard를 조합
// 자동 순환 상태 관리 및 사이드카드 클릭 처리 담당 (Client Component)
// categoryTops가 비어있으면 mock 데이터로 fallback (안전장치)
'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import type { CategorySlug, SideNews, HeroNews } from '@/lib/mock/news'
import { mockHeroNewsByCategory } from '@/lib/mock/news'
import type { CategoryTopNewsItem } from '@/types/news'
import { HeroMain } from './HeroMain'
import { HeroSideCard } from './HeroSideCard'

// 자동 순환 카테고리 순서 (API mainCategory 값 기준)
const AUTO_SLIDE_ORDER: string[] = ['PC', 'Mobile', 'Console', 'Esports']

// AUTO_SLIDE_ORDER 인덱스 → CategorySlug 매핑 (인디케이터용)
const SLIDE_TO_SLUG: Record<string, CategorySlug> = {
  PC: 'pc',
  Mobile: 'mobile',
  Console: 'console',
  Esports: 'esports',
}

interface HeroSectionProps {
  activeCategory: CategorySlug
  // SSR에서 받은 카테고리별 최상위 뉴스 목록
  categoryTops: CategoryTopNewsItem[]
}

/** CategoryTopNewsItem → HeroNews 변환 함수 — HeroMain 컴포넌트 타입에 맞춤 */
function toHeroNews(item: CategoryTopNewsItem): HeroNews {
  return {
    id: 0, // HeroMain 내부에서 미사용
    slug: item.id, // cuid — /news/:id 링크용
    title: item.title,
    summary: item.summary,
    thumbnail: item.thumbnail || '/images/news-placeholder.png',
    category: {
      id: 0,
      name: item.mainCategory,
      slug: item.mainCategory.toLowerCase() as CategorySlug,
    },
    viewCount: item.viewCount,
    readTime: 3, // 기본값
    publishedAt: item.publishedAt,
  }
}

/** CategoryTopNewsItem → SideNews 변환 함수 — HeroSideCard 컴포넌트 타입에 맞춤 */
function toSideNews(item: CategoryTopNewsItem): SideNews {
  return {
    id: 0, // SideNews 내부에서 미사용
    slug: item.id, // cuid — active 판별 및 링크용
    title: item.title,
    thumbnail: item.thumbnail || '/images/news-placeholder.png',
    category: {
      id: 0,
      name: item.mainCategory,
      slug: item.mainCategory.toLowerCase() as CategorySlug,
    },
    viewCount: item.viewCount,
    readTime: 3, // 기본값
    publishedAt: item.publishedAt,
  }
}

// Hero 섹션 컴포넌트 — 자동 순환 및 수동 선택 처리
export function HeroSection({ activeCategory, categoryTops }: HeroSectionProps) {
  // 전체 탭 자동 순환 인덱스 (0~3, AUTO_SLIDE_ORDER 기준)
  const [currentAutoIndex, setCurrentAutoIndex] = useState(0)
  // 사이드카드 수동 클릭 후 오버라이드 상태
  const [manualOverride, setManualOverride] = useState(false)
  // 수동 선택된 뉴스 slug (null이면 자동 순환 기준 사용)
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  // 페이드 전환 트리거
  const [isFading, setIsFading] = useState(false)
  // 수동 오버라이드 복귀 타이머 ref (중복 타이머 방지)
  const manualTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // API 데이터 유효 여부 — 비어있으면 mock fallback 사용
  const hasApiData = categoryTops.length > 0

  // 사이드카드에 표시할 뉴스 목록 결정
  // - 전체 탭: 각 카테고리 1위 뉴스 4개 (AUTO_SLIDE_ORDER 순서)
  // - 특정 카테고리 탭: 사이드카드 없음 (hero main만 표시)
  const sideItems: SideNews[] = (() => {
    if (activeCategory !== 'all') return []
    if (!hasApiData) {
      return mockHeroNewsByCategory['all'].sides
    }
    return AUTO_SLIDE_ORDER.map((cat) => categoryTops.find((item) => item.mainCategory === cat))
      .filter((item): item is CategoryTopNewsItem => item !== undefined)
      .map(toSideNews)
  })()

  // 현재 Hero 메인에 표시할 뉴스 결정
  const currentHeroNews: HeroNews = (() => {
    // 특정 카테고리 탭: 해당 카테고리 1위 뉴스 표시
    if (activeCategory !== 'all') {
      if (!hasApiData) {
        return mockHeroNewsByCategory[activeCategory].top1
      }
      const mainCat = activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)
      // 'esports' → 'Esports' 특수 처리
      const normalizedCat = activeCategory === 'esports' ? 'Esports' : mainCat
      const found = categoryTops.find((item) => item.mainCategory === normalizedCat)
      return found ? toHeroNews(found) : mockHeroNewsByCategory[activeCategory].top1
    }

    // 전체 탭 + 수동 선택: 선택된 slug의 뉴스 표시
    if (manualOverride && selectedSlug !== null) {
      if (!hasApiData) {
        // mock fallback에서 slug 매칭 시도
        const allSides = mockHeroNewsByCategory['all'].sides
        const matched = allSides.find((s) => s.slug === selectedSlug)
        if (matched) {
          const catData = mockHeroNewsByCategory[matched.category.slug as CategorySlug]
          return catData ? catData.top1 : { ...matched, summary: '' }
        }
        return mockHeroNewsByCategory['all'].top1
      }
      const found = categoryTops.find((item) => item.id === selectedSlug)
      return found ? toHeroNews(found) : toHeroNews(categoryTops[0])
    }

    // 전체 탭 + 자동 순환: AUTO_SLIDE_ORDER[currentAutoIndex] 카테고리 1위
    if (!hasApiData) {
      const mockSlug = SLIDE_TO_SLUG[AUTO_SLIDE_ORDER[currentAutoIndex]]
      return mockHeroNewsByCategory[mockSlug ?? 'pc'].top1
    }
    const autoCat = AUTO_SLIDE_ORDER[currentAutoIndex]
    const found = categoryTops.find((item) => item.mainCategory === autoCat)
    return found ? toHeroNews(found) : toHeroNews(categoryTops[0])
  })()

  // 현재 Hero에 표시 중인 뉴스의 slug (사이드카드 active 판별용)
  const activeHeroSlug = currentHeroNews.slug

  // 페이드 전환 헬퍼 — 300ms 페이드 아웃 후 콜백 실행, 다시 페이드 인
  const fadeTransition = useCallback((callback: () => void) => {
    setIsFading(true)
    setTimeout(() => {
      callback()
      setIsFading(false)
    }, 300)
  }, [])

  // 수동 조작 후 10초 뒤 자동 순환 복귀 — 기존 타이머 취소 후 재설정
  const startManualTimer = useCallback(() => {
    if (manualTimerRef.current) clearTimeout(manualTimerRef.current)
    manualTimerRef.current = setTimeout(() => {
      setManualOverride(false)
      setSelectedSlug(null)
    }, 10000)
  }, [])

  // 자동 순환 타이머 — 전체 탭 + manualOverride false일 때만 동작
  useEffect(() => {
    if (activeCategory !== 'all' || manualOverride) return
    const timer = setInterval(() => {
      fadeTransition(() => {
        setCurrentAutoIndex((prev) => (prev + 1) % AUTO_SLIDE_ORDER.length)
      })
    }, 3000)
    return () => clearInterval(timer)
  }, [activeCategory, manualOverride, fadeTransition])

  // 카테고리 탭 변경 시 자동 순환 인덱스 및 수동 선택 초기화
  useEffect(() => {
    setCurrentAutoIndex(0)
    setManualOverride(false)
    setSelectedSlug(null)
  }, [activeCategory])

  // 사이드카드 클릭 핸들러 — 10초 후 자동 순환 복귀
  const handleSideCardClick = useCallback(
    (news: SideNews) => {
      fadeTransition(() => {
        setSelectedSlug(news.slug)
        setManualOverride(true)
        // 전체 탭에서 사이드카드 클릭 시 인디케이터 동기화
        if (activeCategory === 'all') {
          const idx = AUTO_SLIDE_ORDER.findIndex(
            (cat) => cat.toLowerCase() === news.category.slug.toLowerCase()
          )
          if (idx !== -1) setCurrentAutoIndex(idx)
        }
      })
      startManualTimer()
    },
    [activeCategory, fadeTransition, startManualTimer]
  )

  // 이전 슬라이드 — 전체 탭에서만 동작
  const handlePrev = useCallback(() => {
    fadeTransition(() => {
      setCurrentAutoIndex((prev) => (prev - 1 + AUTO_SLIDE_ORDER.length) % AUTO_SLIDE_ORDER.length)
      setManualOverride(true)
      setSelectedSlug(null)
    })
    startManualTimer()
  }, [fadeTransition, startManualTimer])

  // 다음 슬라이드 — 전체 탭에서만 동작
  const handleNext = useCallback(() => {
    fadeTransition(() => {
      setCurrentAutoIndex((prev) => (prev + 1) % AUTO_SLIDE_ORDER.length)
      setManualOverride(true)
      setSelectedSlug(null)
    })
    startManualTimer()
  }, [fadeTransition, startManualTimer])

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4">
      {/* 좌측 Hero 메인 */}
      <HeroMain
        news={currentHeroNews}
        activeCategory={activeCategory}
        autoIndex={currentAutoIndex}
        isFading={isFading}
        onPrev={activeCategory === 'all' ? handlePrev : undefined}
        onNext={activeCategory === 'all' ? handleNext : undefined}
      />

      {/* 우측 사이드카드 목록 — 전체 탭에서만 표시, 모바일 숨김 */}
      {sideItems.length > 0 && (
        <div className="hidden md:flex flex-col gap-2">
          {sideItems.map((sideNews) => (
            <HeroSideCard
              key={sideNews.slug}
              news={sideNews}
              activeSlug={activeHeroSlug}
              onClick={handleSideCardClick}
              rank={1}
              isAllCategory={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}
