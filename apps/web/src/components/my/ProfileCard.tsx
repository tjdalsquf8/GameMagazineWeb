// 마이페이지 사이드바 프로필 카드 — 아바타, 닉네임/이메일, 메뉴 네비게이션
'use client'

import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import type { MyProfile } from '@/types/my.types'

interface ProfileCardProps {
  profile: MyProfile | null
  isLoading: boolean
  activeSection: string
  onSectionClick: (section: string) => void
}

/** 메뉴 항목 정의 */
const MENU_ITEMS = [
  { id: 'posts', label: '내 게시글', countKey: 'posts' as const, href: '/my/posts' },
  { id: 'comments', label: '내가 쓴 댓글', countKey: 'comments' as const, href: '/my/comments' },
  { id: 'likes', label: '좋아요한 글', countKey: 'likes' as const, href: '/my/likes' },
  { id: 'newsHistory', label: '최근 읽은 뉴스', countKey: null, href: null },
] as const

const SETTINGS_ITEMS = [
  { id: 'notifications', label: '알림 설정', href: null },
  { id: 'account', label: '계정 설정', href: null },
] as const

/** 프로필 스켈레톤 — 로딩 상태에서 사용 */
export function ProfileCardSkeleton() {
  return (
    <div className="bg-[var(--color-surface)] rounded-2xl p-5 animate-pulse">
      <div className="flex flex-col items-center gap-3 pb-5 border-b border-[var(--color-border)]">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-32 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="mt-4 space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 rounded-lg bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>
    </div>
  )
}

/** 마이페이지 사이드바 프로필 카드 컴포넌트 */
export default function ProfileCard({
  profile,
  isLoading,
  activeSection,
  onSectionClick,
}: ProfileCardProps) {
  const { logout } = useAuth()

  if (isLoading) return <ProfileCardSkeleton />

  const avatarChar = profile?.nickname?.charAt(0)?.toUpperCase() ?? '?'

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl overflow-hidden shadow-sm">
      {/* 아바타 + 기본 정보 */}
      <div className="p-5 pb-4">
        <div className="flex flex-col items-center gap-2 pb-4 border-b border-[var(--color-border)]">
          {/* 그라디언트 아바타 원 */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white select-none bg-gradient-to-br from-violet-600 to-blue-600"
            aria-label={`${profile?.nickname ?? '사용자'} 아바타`}
          >
            {avatarChar}
          </div>
          <div className="text-center">
            <p className="font-semibold text-[var(--color-text-primary)] text-sm">
              {profile?.nickname ?? '-'}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{profile?.email ?? '-'}</p>
          </div>
        </div>

        {/* 주요 메뉴 */}
        <nav className="mt-3 space-y-0.5" aria-label="마이페이지 메뉴">
          {MENU_ITEMS.map((item) => {
            const isActive = activeSection === item.id
            const count = item.countKey ? profile?._count[item.countKey] : null

            const content = (
              <span className="flex items-center justify-between w-full">
                <span>{item.label}</span>
                {count !== null && count !== undefined && (
                  <span
                    className={[
                      'text-xs font-medium px-1.5 py-0.5 rounded-full',
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[var(--color-border)] text-[var(--color-text-muted)]',
                    ].join(' ')}
                  >
                    {count}
                  </span>
                )}
              </span>
            )

            const className = [
              'w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors duration-150',
              isActive
                ? 'bg-primary text-primary-foreground font-medium'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]/40',
            ].join(' ')

            if (item.href) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={className}
                  onClick={() => onSectionClick(item.id)}
                >
                  {content}
                </Link>
              )
            }

            return (
              <button
                key={item.id}
                type="button"
                className={className}
                onClick={() => onSectionClick(item.id)}
              >
                {content}
              </button>
            )
          })}
        </nav>

        {/* 구분선 */}
        <div className="my-3 border-t border-[var(--color-border)]" />

        {/* 설정 메뉴 */}
        <nav className="space-y-0.5" aria-label="설정 메뉴">
          {SETTINGS_ITEMS.map((item) => {
            const isActive = activeSection === item.id
            const className = [
              'w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors duration-150',
              isActive
                ? 'bg-primary text-primary-foreground font-medium'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]/40',
            ].join(' ')

            return (
              <button
                key={item.id}
                type="button"
                className={className}
                onClick={() => onSectionClick(item.id)}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* 구분선 */}
        <div className="my-3 border-t border-[var(--color-border)]" />

        {/* 로그아웃 */}
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-150"
        >
          <LogOut size={14} />
          로그아웃
        </button>
      </div>
    </div>
  )
}
