// 사이트 헤더 컴포넌트
// sticky top-0 고정, 로고/네비/인증 영역, 모바일 햄버거 드로어 포함
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { NavLinks } from './NavLinks'
import { UserMenu } from './UserMenu'
import { DarkModeToggle } from './DarkModeToggle'

// 사이트 헤더 컴포넌트 (sticky 고정, 모바일 드로어 메뉴 포함)
export function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-background)] border-b border-[var(--color-border)]">
      <div className="container-main h-16 flex items-center justify-between">
        {/* 좌측: 텍스트 로고 */}
        <Link href="/" className="font-bold text-xl text-[var(--color-primary)]">
          Game Magazine
        </Link>

        {/* 중앙: 데스크탑 네비게이션 */}
        <div className="hidden md:flex">
          <NavLinks variant="desktop" />
        </div>

        {/* 우측: 데스크탑 다크모드 + 유저 메뉴 */}
        <div className="hidden md:flex items-center gap-2">
          <DarkModeToggle />
          <UserMenu variant="desktop" />
        </div>

        {/* 우측: 모바일 햄버거 버튼 */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
          onClick={() => setIsDrawerOpen((prev) => !prev)}
          aria-label={isDrawerOpen ? '메뉴 닫기' : '메뉴 열기'}
        >
          {isDrawerOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* 모바일 드로어 메뉴 */}
      {isDrawerOpen && (
        <div className="md:hidden bg-[var(--color-background)] border-b border-[var(--color-border)] px-4 py-4 flex flex-col gap-4">
          <NavLinks variant="mobile" />
          <DarkModeToggle />
          <UserMenu variant="mobile" />
        </div>
      )}
    </header>
  )
}
