// 어드민 공통 레이아웃 — 사이드바 + 메인 콘텐츠 2단 구조
// 루트 layout.tsx의 Header/Footer를 덮어쓰기 위해 별도 html/body 없이 구성
// CSR 전용 — 인증(ADMIN role) 확인 후 진입 허용
'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard,
  Workflow,
  FileText,
  Globe,
  Users,
  Flag,
  ChevronRight,
  Circle,
} from 'lucide-react'

/** 사이드바 메뉴 아이템 타입 */
interface NavItem {
  label: string
  href: string
  icon: ReactNode
}

/** 뉴스 시스템 섹션 메뉴 */
const NEWS_NAV_ITEMS: NavItem[] = [
  { label: '대시보드', href: '/admin/dashboard', icon: <LayoutDashboard size={16} /> },
  { label: '파이프라인', href: '/admin/pipeline', icon: <Workflow size={16} /> },
  { label: '기사 관리', href: '/admin/articles', icon: <FileText size={16} /> },
  { label: '소스 관리', href: '/admin/sources', icon: <Globe size={16} /> },
]

/** 커뮤니티 섹션 메뉴 */
const COMMUNITY_NAV_ITEMS: NavItem[] = [
  { label: '게시글', href: '/admin/community/posts', icon: <Users size={16} /> },
  { label: '신고 관리', href: '/admin/community/reports', icon: <Flag size={16} /> },
]

interface AdminLayoutProps {
  children: ReactNode
}

/** 어드민 레이아웃 컴포넌트 — 사이드바 포함 전체 구조 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  /** ADMIN role 미보유 시 홈으로 리다이렉트 */
  useEffect(() => {
    if (!isAuthLoading) {
      if (!isAuthenticated || user?.role !== 'ADMIN') {
        router.replace('/')
      }
    }
  }, [isAuthLoading, isAuthenticated, user, router])

  // hydration 완료 전 또는 ADMIN이 아닌 경우 빈 화면
  if (isAuthLoading || !isAuthenticated || user?.role !== 'ADMIN') return null

  return (
    // 루트 layout의 Header/Footer 위에 full-screen 레이어로 렌더링
    <div className="fixed inset-0 z-50 flex bg-[#f5f5f5] dark:bg-gray-950 overflow-hidden">
      {/* 모바일 오버레이 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={[
          'fixed lg:static inset-y-0 left-0 z-50 w-60 shrink-0 bg-white dark:bg-gray-900',
          'border-r border-[var(--color-border)] flex flex-col transition-transform duration-200',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        {/* 사이드바 헤더 */}
        <div className="px-5 py-5 border-b border-[var(--color-border)]">
          <Link href="/admin/dashboard" className="block">
            <p className="text-sm font-bold text-[var(--color-text-primary)]">Game Magazine</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">관리자 패널</p>
          </Link>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {/* 뉴스 시스템 */}
          <div>
            <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
              뉴스 시스템
            </p>
            <ul className="space-y-0.5">
              {NEWS_NAV_ITEMS.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} />
              ))}
            </ul>
          </div>

          {/* 커뮤니티 */}
          <div>
            <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
              커뮤니티
            </p>
            <ul className="space-y-0.5">
              {COMMUNITY_NAV_ITEMS.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} />
              ))}
            </ul>
          </div>
        </nav>

        {/* 사이드바 하단 — 홈으로 돌아가기 */}
        <div className="px-3 py-3 border-t border-[var(--color-border)]">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] transition-colors"
          >
            <ChevronRight size={14} className="rotate-180" />
            사이트로 돌아가기
          </Link>
        </div>
      </aside>

      {/* 메인 영역 */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* 모바일 상단 바 */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 border-b border-[var(--color-border)]">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-md hover:bg-[var(--color-surface)] transition-colors"
            aria-label="메뉴 열기"
          >
            <div className="space-y-1">
              <span className="block w-5 h-0.5 bg-[var(--color-text-primary)]" />
              <span className="block w-5 h-0.5 bg-[var(--color-text-primary)]" />
              <span className="block w-5 h-0.5 bg-[var(--color-text-primary)]" />
            </div>
          </button>
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            관리자 패널
          </span>
        </div>

        {/* 스크롤 가능한 콘텐츠 영역 */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}

/** 사이드바 네비게이션 링크 컴포넌트 */
function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const isActive = pathname === item.href

  return (
    <li>
      <Link
        href={item.href}
        className={[
          'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors',
          isActive
            ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] font-medium'
            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]',
        ].join(' ')}
      >
        {/* 활성 표시 초록 점 */}
        {isActive ? (
          <Circle size={6} className="fill-green-500 text-green-500 shrink-0" />
        ) : (
          <span className="w-1.5 shrink-0" />
        )}
        <span className="text-[var(--color-text-secondary)]">{item.icon}</span>
        {item.label}
      </Link>
    </li>
  )
}
