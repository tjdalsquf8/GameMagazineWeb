// 사이트 헤더 컴포넌트
// sticky top-0 고정, 로고/네비/인증 영역, 모바일 햄버거 드로어 포함
// 모바일 드로어: 반투명 오버레이 클릭 시 닫힘, 슬라이드 애니메이션
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

  // 드로어를 닫는 함수 (자식 컴포넌트에 전달)
  const closeDrawer = () => setIsDrawerOpen(false)

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
          <DarkModeToggle variant="desktop" />
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

      {/* 모바일 드로어 오버레이 — 클릭 시 드로어 닫힘 */}
      {isDrawerOpen && (
        <div
          className="md:hidden fixed inset-0 top-16 bg-black/40 z-40"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* 모바일 드로어 메뉴 */}
      <div
        className={`md:hidden fixed left-0 right-0 top-16 z-50 bg-[var(--color-background)] border-b border-[var(--color-border)] px-4 py-2 flex flex-col transition-all duration-200 ease-in-out overflow-hidden ${
          isDrawerOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        {/* 네비게이션 링크 */}
        <NavLinks variant="mobile" onClose={closeDrawer} />

        {/* 구분선 */}
        <div className="border-t border-[var(--color-border)] my-1" />

        {/* 다크모드 토글 — 라벨 + 아이콘 한 행 */}
        <DarkModeToggle variant="mobile" />

        {/* 구분선 */}
        <div className="border-t border-[var(--color-border)] my-1" />

        {/* 유저 메뉴 — 인라인 노출 (absolute 드롭다운 없음) */}
        <UserMenu variant="mobile" onClose={closeDrawer} />
      </div>
    </header>
  )
}
