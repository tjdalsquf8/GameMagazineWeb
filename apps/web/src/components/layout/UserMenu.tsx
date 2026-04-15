// 사용자 메뉴 컴포넌트
// 비로그인: 로그인/회원가입 링크 버튼
// 로그인: 닉네임 드롭다운 (마이페이지, 로그아웃)
'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface UserMenuProps {
  variant: 'desktop' | 'mobile'
}

// 사용자 메뉴 컴포넌트 (인증 상태에 따라 다른 UI 렌더링)
export function UserMenu({ variant }: UserMenuProps) {
  const { user, isAuthenticated, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 드롭다운 외부 클릭 감지하여 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 비로그인 상태: 로그인/회원가입 버튼
  if (!isAuthenticated) {
    const containerClass = variant === 'desktop' ? 'flex items-center gap-2' : 'flex flex-col gap-3'
    const buttonClass = variant === 'mobile' ? 'w-full justify-center' : ''

    return (
      <div className={containerClass}>
        <Link
          href="/login"
          className={`px-4 py-2 text-sm rounded-lg border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors flex items-center ${buttonClass}`}
        >
          로그인
        </Link>
        <Link
          href="/register"
          className={`px-4 py-2 text-sm rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] transition-colors flex items-center ${buttonClass}`}
        >
          회원가입
        </Link>
      </div>
    )
  }

  // 로그인 상태: 닉네임 드롭다운
  return (
    <div className="relative" ref={dropdownRef}>
      {/* 닉네임 + 드롭다운 토글 버튼 */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors text-sm"
      >
        <span className="text-[var(--color-text-primary)]">{user?.nickname}</span>
        <ChevronDown
          size={16}
          className={`text-[var(--color-text-secondary)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-lg py-1 z-50">
          <Link
            href="/mypage"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors"
          >
            마이페이지
          </Link>
          {/* 로그아웃 버튼 */}
          <button
            onClick={() => {
              setIsOpen(false)
              logout()
            }}
            className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  )
}
