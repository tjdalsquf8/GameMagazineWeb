// 마이페이지 레이아웃 — 인증 확인, 사이드바(220px) + 메인 2열 구조
// CSR 전용 (인증 필요, SEO 불필요)
'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'
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
  // authStore에서 profileImage를 직접 구독 — 업로드 후 즉시 모바일 헤더 반영
  const storeProfileImage = useAuthStore((s) => s.user?.profileImage ?? null)
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

  const avatarChar = profile?.nickname?.charAt(0)?.toUpperCase() ?? '?'
  // store 값이 최신이므로 store 우선, 없으면 서버 프로필 값 사용
  const profileImage = storeProfileImage ?? profile?.profileImage ?? null

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <div className="max-w-[960px] mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* 모바일 전용 프로필 헤더 */}
        <div className="md:hidden mb-4">
          {isLoading ? (
            <div className="flex items-center gap-3 animate-pulse mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-32 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-4">
              {/* 프로필 이미지 있으면 next/image, 없으면 그라디언트 아바타 */}
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt={`${profile?.nickname ?? '사용자'} 프로필 이미지`}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white bg-gradient-to-br from-violet-600 to-blue-600 shrink-0 select-none">
                  {avatarChar}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                  {profile?.nickname ?? '-'}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] truncate">
                  {profile?.email ?? '-'}
                </p>
              </div>
            </div>
          )}
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
