'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { COMMUNITY_CATEGORIES } from '@/constants/gamecategory'

interface CategorySidebarProps {
  currentSlug?: string
  onClose?: () => void
}

export default function CategorySidebar({ currentSlug = 'all', onClose }: CategorySidebarProps) {
  // 열려있는 카테고리의 ID를 관리하는 state (초기값으로 대분류 ID들을 넣어 모두 열어둠)
  const [openIds, setOpenIds] = useState<number[]>(COMMUNITY_CATEGORIES.map((c) => c.id))

  const toggleCategory = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((openId) => openId !== id) : [...prev, id]
    )
  }

  return (
    <aside className="w-[200px] shrink-0">
      <div className="border border-[var(--color-border)] rounded-md overflow-hidden bg-[var(--color-background)]">
        <div className="px-3 py-2 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
          <span className="text-sm font-semibold text-text-primary">카테고리</span>
        </div>

        <nav className="py-1">
          {/* 전체 보기 메뉴 */}
          <Link
            href="/community?category=all"
            onClick={onClose}
            className={`flex items-center px-3 py-2 text-sm transition-colors ${
              currentSlug === 'all'
                ? 'font-bold bg-[var(--color-surface)]'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
            }`}
          >
            전체
          </Link>

          {COMMUNITY_CATEGORIES.map((parent) => {
            const isOpen = openIds.includes(parent.id)
            const hasChildren = parent.children && parent.children.length > 0

            return (
              <div key={parent.id} className="flex flex-col">
                {/* 대분류 클릭 영역 */}
                <div
                  className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-[var(--color-surface-hover)] group"
                  onClick={() => toggleCategory(parent.id)}
                >
                  <Link
                    href={`/community?category=${parent.slug}`}
                    onClick={(e) => {
                      e.stopPropagation() // 토글(열고 닫기) 기능과 링크 이동 분리
                      onClose?.()
                    }}
                    className={`text-sm ${currentSlug === parent.slug ? 'font-bold' : 'text-text-primary'}`}
                  >
                    {parent.name}
                  </Link>
                  {/* 하위 요소가 있을 때만 화살표 표시 */}
                  {hasChildren && (
                    <button className="text-text-muted">
                      {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  )}
                </div>

                {/* 하위 카테고리 (아코디언 형태) */}
                {isOpen &&
                  parent.children?.map((child) => (
                    <Link
                      key={child.id}
                      href={`/community?category=${child.slug}`}
                      onClick={onClose}
                      className={`flex items-center pl-6 pr-3 py-1.5 text-sm transition-colors ${
                        currentSlug === child.slug
                          ? 'font-bold text-blue-600'
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
                      }`}
                    >
                      {child.name}
                    </Link>
                  ))}
              </div>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
