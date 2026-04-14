'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react' // Lucide 아이콘 임포트
import CategorySidebar from './CategorySidebar'

export default function CommunityDrawer() {
  const [isOpen, setIsOpen] = useState(false)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return (
    <>
      {/* 햄버거 버튼 — lg 미만에서만 노출 */}
      <button
        type="button"
        onClick={open}
        aria-label="카테고리 메뉴 열기"
        className="lg:hidden ml-auto flex items-center justify-center w-11 h-11 text-gray-600 hover:text-gray-900 transition-colors"
      >
        {/* 기존 SVG 대신 Menu 아이콘 사용 */}
        <Menu size={22} />
      </button>

      {/* 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* 드로어 */}
      <div
        className={[
          'fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-xl',
          'transition-transform duration-300 lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label="카테고리 메뉴"
      >
        {/* 드로어 헤더 */}
        <div className="flex items-center justify-between px-4 h-12 border-b border-border">
          <span className="text-sm font-semibold text-text-primary">메뉴</span>
          <button
            type="button"
            onClick={close}
            aria-label="카테고리 메뉴 닫기"
            className="flex items-center justify-center w-11 h-11 text-gray-600 hover:text-gray-900 transition-colors"
          >
            {/* 기존 SVG 대신 X 아이콘 사용 */}
            <X size={20} />
          </button>
        </div>

        {/* 카테고리 사이드바 */}
        <div className="p-4">
          <CategorySidebar onClose={close} />
        </div>
      </div>
    </>
  )
}
