'use client'

// MobileCategoryBar.tsx
// 모바일 전용 커뮤니티 2단 카테고리 탭바 컴포넌트
// 1행: 전체 / 모바일 / 콘솔 / PC (대분류)
// 2행: 선택된 대분류의 소분류 게임 목록 (없으면 숨김)
// 대분류 클릭 시 소분류가 있으면 첫 번째 소분류로 자동 이동
// lg 이상 데스크탑에서는 숨겨지며, 사이드바 대신 모바일에서 카테고리 이동 수단으로 사용

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { COMMUNITY_CATEGORIES } from '@/constants/gamecategory'

interface MobileCategoryBarProps {
  currentSlug: string
}

/** currentSlug가 속한 대분류 slug 반환 — 소분류면 부모 slug, 대분류/전체면 그대로 */
function getParentSlug(currentSlug: string): string {
  if (currentSlug === 'all') return 'all'
  for (const parent of COMMUNITY_CATEGORIES) {
    if (parent.slug === currentSlug) return parent.slug
    if (parent.children?.some((c) => c.slug === currentSlug)) return parent.slug
  }
  return 'all'
}

/** 대분류의 이동 대상 slug 반환 — 소분류가 있으면 첫 번째 소분류, 없으면 대분류 자체 */
function getParentHref(slug: string): string {
  const parent = COMMUNITY_CATEGORIES.find((c) => c.slug === slug)
  const firstChild = parent?.children?.[0]
  return firstChild ? firstChild.slug : slug
}

/** 모바일 전용 2단 카테고리 탭바 */
export default function MobileCategoryBar({ currentSlug }: MobileCategoryBarProps) {
  const router = useRouter()

  // 현재 선택된 대분류 — 소분류가 선택되면 해당 부모로 자동 동기화
  const [activeParent, setActiveParent] = useState(() => getParentSlug(currentSlug))

  // URL 카테고리 변경 시 대분류 동기화
  useEffect(() => {
    setActiveParent(getParentSlug(currentSlug))
  }, [currentSlug])

  const selectedParent = COMMUNITY_CATEGORIES.find((c) => c.slug === activeParent)
  const children = selectedParent?.children ?? []

  /** 대분류 탭 클릭 핸들러 — 소분류가 있으면 첫 번째 소분류로 이동, 없으면 대분류로 이동 */
  const handleParentClick = (slug: string) => {
    const targetSlug = getParentHref(slug)
    setActiveParent(slug)
    router.push(`/community?category=${targetSlug}`)
  }

  const parentTabClass = (slug: string) => {
    const isActive = activeParent === slug
    return (
      'inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-150 ' +
      (isActive
        ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
        : 'bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)]')
    )
  }

  const childTabClass = (slug: string) => {
    const isActive = currentSlug === slug
    return (
      'inline-flex items-center px-2.5 py-1 rounded-full text-xs transition-colors duration-150 ' +
      (isActive
        ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
        : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)]')
    )
  }

  return (
    <div className="lg:hidden mb-3 flex flex-col gap-2">
      {/* 1행: 대분류 탭 */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 whitespace-nowrap pb-0.5">
          {/* 전체 탭 — 소분류 없으므로 Link 유지 */}
          <Link
            href="/community?category=all"
            onClick={() => setActiveParent('all')}
            className={parentTabClass('all')}
          >
            전체
          </Link>

          {/* 대분류 탭 — 소분류가 있으면 첫 번째 소분류로, 없으면 대분류로 이동 */}
          {COMMUNITY_CATEGORIES.map((parent) => (
            <button
              key={parent.slug}
              type="button"
              onClick={() => handleParentClick(parent.slug)}
              className={parentTabClass(parent.slug)}
            >
              {parent.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2행: 소분류 탭 (선택된 대분류에 자식이 있을 때만 표시) */}
      {children.length > 0 && (
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 whitespace-nowrap pb-0.5">
            {children.map((child) => (
              <Link
                key={child.slug}
                href={`/community?category=${child.slug}`}
                className={childTabClass(child.slug)}
              >
                {child.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
