// 사용자 메뉴 컴포넌트
// 비로그인: 로그인/회원가입 링크 버튼
// 로그인 데스크탑: 닉네임 드롭다운 (마이페이지, 로그아웃)
// 로그인 모바일: 닉네임 표시 + 마이페이지/로그아웃 인라인 노출 (absolute 드롭다운 없음)
'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface UserMenuProps {
  variant: 'desktop' | 'mobile'
  // 모바일 드로어에서 항목 클릭 시 드로어를 닫기 위한 콜백
  onClose?: () => void
}

// 사용자 메뉴 컴포넌트 (인증 상태 및 variant에 따라 다른 UI 렌더링)
export function UserMenu({ variant, onClose }: UserMenuProps) {
  const { user, isAuthenticated, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 데스크탑 드롭다운 외부 클릭 감지하여 닫기
  useEffect(() => {
    if (variant !== 'desktop') return
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [variant])

  // 비로그인 상태: 로그인/회원가입 버튼
  if (!isAuthenticated) {
    if (variant === 'mobile') {
      return (
        <div className="flex flex-col gap-2 pt-1">
          <Link
            href="/login"
            onClick={onClose}
            className="flex items-center justify-center min-h-[48px] px-4 text-sm rounded-lg border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors"
          >
            로그인
          </Link>
          <Link
            href="/register"
            onClick={onClose}
            className="flex items-center justify-center min-h-[48px] px-4 text-sm rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            회원가입
          </Link>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="px-4 py-2 text-sm rounded-lg border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors flex items-center"
        >
          로그인
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 text-sm rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] transition-colors flex items-center"
        >
          회원가입
        </Link>
      </div>
    )
  }

  // 로그인 상태 — 모바일: 인라인 메뉴 (absolute 드롭다운 없음)
  if (variant === 'mobile') {
    return (
      <div className="flex flex-col">
        {/* 닉네임 표시 행 */}
        <div className="flex items-center gap-2 min-h-[48px] px-2 text-sm text-[var(--color-text-primary)] font-medium">
          {user?.profileImage ? (
            <Image
              src={user.profileImage}
              alt={user.nickname}
              width={24}
              height={24}
              className="rounded-full object-cover w-6 h-6"
            />
          ) : (
            <User size={16} className="text-[var(--color-text-secondary)]" />
          )}
          <span>{user?.nickname}</span>
        </div>
        {/* 마이페이지 링크 */}
        <Link
          href="/my"
          onClick={onClose}
          className="flex items-center min-h-[48px] px-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
        >
          마이페이지
        </Link>
        {/* 로그아웃 버튼 */}
        <button
          onClick={() => {
            onClose?.()
            logout()
          }}
          className="flex items-center min-h-[48px] px-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors text-left"
        >
          로그아웃
        </button>
      </div>
    )
  }

  // 로그인 상태 — 데스크탑: 닉네임 드롭다운
  return (
    <div className="relative" ref={dropdownRef}>
      {/* 닉네임 + 드롭다운 토글 버튼 */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors text-sm"
      >
        {user?.profileImage ? (
          <Image
            src={user.profileImage}
            alt={user.nickname}
            width={28}
            height={28}
            className="rounded-full object-cover w-7 h-7"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center">
            <User size={14} className="text-[var(--color-text-secondary)]" />
          </div>
        )}
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
            href="/my"
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
