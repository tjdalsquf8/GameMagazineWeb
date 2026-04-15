// 네비게이션 링크 컴포넌트
// 뉴스, 커뮤니티 링크 목록, 현재 경로에 따라 활성화 스타일 적용
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLinksProps {
  variant: 'desktop' | 'mobile'
  // 모바일 드로어에서 항목 클릭 시 드로어를 닫기 위한 콜백
  onClose?: () => void
}

const NAV_ITEMS = [
  { label: '뉴스', href: '/news' },
  { label: '커뮤니티', href: '/community' },
]

// 네비게이션 링크 목록 컴포넌트 (데스크탑/모바일 레이아웃 분기)
export function NavLinks({ variant, onClose }: NavLinksProps) {
  const pathname = usePathname()

  if (variant === 'desktop') {
    return (
      <nav className="flex items-center gap-6">
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

  // 모바일: 전체 너비, 최소 48px 터치 타겟, 활성화 강조
  return (
    <nav className="flex flex-col">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`flex items-center min-h-[48px] px-2 text-sm font-medium transition-colors hover:text-[var(--color-primary)] ${
              isActive
                ? 'text-[var(--color-primary)]'
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
