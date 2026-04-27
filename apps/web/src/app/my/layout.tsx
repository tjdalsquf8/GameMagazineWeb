// 마이페이지 레이아웃 — 인증 확인, 사이드바(220px) + 메인 2열 구조
// CSR 전용 (인증 필요, SEO 불필요)
'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useMyProfile } from '@/hooks/useMyProfile'
import ProfileCard from '@/components/my/ProfileCard'

/** 사이드바 섹션 목록 (IntersectionObserver 추적용) */
const SECTION_IDS = [
  'section-posts',
  'section-comments',
  'section-likes',
  'section-newsHistory',
  'section-notifications',
  'section-account',
]

const SECTION_KEY_MAP: Record<string, string> = {
  'section-posts': 'posts',
  'section-comments': 'comments',
  'section-likes': 'likes',
  'section-newsHistory': 'newsHistory',
  'section-notifications': 'notifications',
  'section-account': 'account',
}

interface MyLayoutProps {
  children: ReactNode
}

/** 마이페이지 레이아웃 컴포넌트 */
export default function MyLayout({ children }: MyLayoutProps) {
  // useAuth의 isLoading은 zustand persist hydration 완료 여부를 나타냄
  // hydration 전에는 isAuthenticated가 항상 false이므로, isLoading 중에는 리다이렉트하지 않음
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const router = useRouter()
  const { profile, isLoading } = useMyProfile()
  const [activeSection, setActiveSection] = useState('posts')
  const observerRef = useRef<IntersectionObserver | null>(null)

  /** 미인증 시 로그인 페이지 리다이렉트 — hydration 완료 후에만 판단 */
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace('/login?redirect=/my')
    }
  }, [isAuthLoading, isAuthenticated, router])

  /** IntersectionObserver — 뷰포트 기준 활성 섹션 자동 변경 */
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
          const key = SECTION_KEY_MAP[top.target.id]
          if (key) setActiveSection(key)
        }
      },
      { threshold: 0.3, rootMargin: '-68px 0px 0px 0px' }
    )

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observerRef.current?.observe(el)
    })

    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  /** 사이드바 메뉴 클릭 시 해당 섹션으로 스크롤 */
  const handleSectionClick = (section: string) => {
    setActiveSection(section)
    const sectionId = `section-${section}`
    const el = document.getElementById(sectionId)
    if (el) {
      const offset = 80 // 헤더 높이 + 여유
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  // hydration 완료 전 또는 미인증 상태에서는 빈 화면 반환 — 깜빡임 방지
  if (isAuthLoading || !isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <div className="max-w-[960px] mx-auto px-6 py-8">
        {/* 모바일 탭 (md 미만) */}
        <div className="md:hidden mb-4">
          <MobileTabBar activeSection={activeSection} onTabClick={handleSectionClick} />
        </div>

        <div className="flex gap-6 items-start">
          {/* 사이드바 — md 이상에서만 노출 */}
          <aside className="hidden md:block w-[220px] shrink-0 sticky top-[68px]">
            <ProfileCard
              profile={profile}
              isLoading={isLoading}
              activeSection={activeSection}
              onSectionClick={handleSectionClick}
            />
          </aside>

          {/* 메인 콘텐츠 */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}

/** 모바일 탭 바 컴포넌트 */
function MobileTabBar({
  activeSection,
  onTabClick,
}: {
  activeSection: string
  onTabClick: (section: string) => void
}) {
  const TABS = [
    { key: 'posts', label: '게시글' },
    { key: 'comments', label: '댓글' },
    { key: 'likes', label: '좋아요' },
    { key: 'newsHistory', label: '뉴스' },
    { key: 'notifications', label: '알림' },
    { key: 'account', label: '계정' },
  ]

  return (
    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onTabClick(tab.key)}
          className={[
            'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap',
            activeSection === tab.key
              ? 'bg-primary text-primary-foreground'
              : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]',
          ].join(' ')}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
