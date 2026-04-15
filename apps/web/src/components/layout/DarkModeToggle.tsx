// 다크모드 토글 버튼 컴포넌트
// 다크모드: Sun 아이콘 (클릭 시 라이트모드 전환)
// 라이트모드: Moon 아이콘 (클릭 시 다크모드 전환)
// mobile variant: 라벨 텍스트 + 아이콘을 한 행으로 표시
'use client'

import { Sun, Moon } from 'lucide-react'
import { useDarkMode } from '@/hooks/useDarkMode'

interface DarkModeToggleProps {
  // mobile일 때 "다크 모드" 라벨을 함께 표시
  variant?: 'desktop' | 'mobile'
}

// 다크모드/라이트모드 전환 버튼 컴포넌트
export function DarkModeToggle({ variant = 'desktop' }: DarkModeToggleProps) {
  const { isDark, toggle } = useDarkMode()

  if (variant === 'mobile') {
    return (
      <button
        onClick={toggle}
        aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
        className="flex items-center justify-between min-h-[48px] px-2 w-full text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
      >
        <span>다크 모드</span>
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    )
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-[var(--color-surface-hover)] transition-colors"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
