// 다크모드 토글 버튼 컴포넌트
// 다크모드: Sun 아이콘 (클릭 시 라이트모드 전환)
// 라이트모드: Moon 아이콘 (클릭 시 다크모드 전환)
'use client'

import { Sun, Moon } from 'lucide-react'
import { useDarkMode } from '@/hooks/useDarkMode'

// 다크모드/라이트모드 전환 버튼 컴포넌트
export function DarkModeToggle() {
  const { isDark, toggle } = useDarkMode()

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
