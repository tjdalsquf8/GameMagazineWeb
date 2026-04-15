// Hero 섹션 묶음 컴포넌트 — HeroMain + HeroSideCard를 조합
// 자동 순환 상태 관리 및 사이드카드 클릭 처리 담당 (Client Component)
'use client'
import { useState, useEffect, useCallback } from 'react'
import type { CategorySlug, SideNews } from '@/lib/mock/news'
import { mockHeroNewsByCategory } from '@/lib/mock/news'
import { HeroMain } from './HeroMain'
import { HeroSideCard } from './HeroSideCard'

// 자동 순환 카테고리 순서
const AUTO_SLIDE_ORDER: CategorySlug[] = ['pc', 'console', 'mobile', 'esports']

interface HeroSectionProps {
  activeCategory: CategorySlug
}

// Hero 섹션 컴포넌트 — 자동 순환 및 수동 선택 처리
export function HeroSection({ activeCategory }: HeroSectionProps) {
  // 전체 탭 자동 순환 인덱스 (0~3)
  const [currentAutoIndex, setCurrentAutoIndex] = useState(0)
  // 사이드카드 수동 클릭 후 오버라이드 상태
  const [manualOverride, setManualOverride] = useState(false)
  // 수동 선택된 뉴스 (null이면 자동 순환 기준 사용)
  const [selectedNews, setSelectedNews] = useState<SideNews | null>(null)
  // 페이드 전환 트리거
  const [isFading, setIsFading] = useState(false)

  const categoryData = mockHeroNewsByCategory[activeCategory]

  // 현재 Hero 메인에 표시할 뉴스 결정
  // - 전체 탭 + 자동 순환: AUTO_SLIDE_ORDER[currentAutoIndex] 카테고리의 top1
  // - 전체 탭 + 수동 선택: selectedNews를 HeroNews로 확장
  // - 특정 카테고리 탭: 해당 카테고리 top1 고정
  const currentHeroNews = (() => {
    if (activeCategory !== 'all') {
      return categoryData.top1
    }
    if (manualOverride && selectedNews) {
      // 사이드카드에서 선택된 뉴스를 Hero용으로 변환 (summary는 빈 문자열 처리)
      const heroSlug = selectedNews.slug
      // all sides에서 매칭되는 카테고리의 top1에서 summary 찾기
      const matchedCategory = selectedNews.category.slug as CategorySlug
      const matchedData = mockHeroNewsByCategory[matchedCategory]
      if (matchedData && matchedData.top1.slug === heroSlug) {
        return matchedData.top1
      }
      return { ...selectedNews, summary: '' }
    }
    // 자동 순환: 해당 카테고리 slug의 top1 데이터 사용
    const autoSlug = AUTO_SLIDE_ORDER[currentAutoIndex]
    return mockHeroNewsByCategory[autoSlug].top1
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
    setSelectedNews(null)
  }, [activeCategory])

  // 사이드카드 클릭 핸들러 — 10초 후 자동 순환 복귀
  const handleSideCardClick = useCallback(
    (news: SideNews) => {
      fadeTransition(() => {
        setSelectedNews(news)
        setManualOverride(true)
        // 전체 탭에서 사이드카드 클릭 시 인디케이터 동기화
        if (activeCategory === 'all') {
          const idx = AUTO_SLIDE_ORDER.indexOf(news.category.slug as CategorySlug)
          if (idx !== -1) setCurrentAutoIndex(idx)
        }
      })
      setTimeout(() => {
        setManualOverride(false)
        setSelectedNews(null)
      }, 10000)
    },
    [activeCategory, fadeTransition]
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4">
      {/* 좌측 Hero 메인 */}
      <HeroMain
        news={currentHeroNews}
        activeCategory={activeCategory}
        autoIndex={currentAutoIndex}
        isFading={isFading}
      />

      {/* 우측 사이드카드 목록 (모바일에서는 숨김) */}
      {/* justify-between 제거 — 카테고리 탭(3개)일 때 간격이 과도하게 벌어지는 문제 방지 */}
      <div className="hidden md:flex flex-col gap-2">
        {categoryData.sides.map((sideNews, index) => (
          <HeroSideCard
            key={sideNews.id}
            news={sideNews}
            activeSlug={activeHeroSlug}
            onClick={handleSideCardClick}
            rank={activeCategory === 'all' ? 1 : index + 2}
            isAllCategory={activeCategory === 'all'}
          />
        ))}
      </div>
    </div>
  )
}
