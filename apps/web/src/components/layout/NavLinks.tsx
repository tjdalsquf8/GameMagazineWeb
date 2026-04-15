// 네비게이션 링크 컴포넌트
// 뉴스, 커뮤니티 링크 목록, 현재 경로에 따라 활성화 스타일 적용
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLinksProps {
  variant: 'desktop' | 'mobile'
}

const NAV_ITEMS = [
  { label: '뉴스', href: '/news' },
  { label: '커뮤니티', href: '/community' },
]

// 네비게이션 링크 목록 컴포넌트 (데스크탑/모바일 레이아웃 분기)
export function NavLinks({ variant }: NavLinksProps) {
  const pathname = usePathname()
  const containerClass = variant === 'desktop' ? 'flex items-center gap-6' : 'flex flex-col gap-4'

  return (
    <nav className={containerClass}>
      {NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm transition-colors hover:text-[var(--color-primary)] ${
              isActive
                ? 'text-[var(--color-primary)] font-medium'
                : 'text-[var(--color-text-secondary)]'
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
