// 카테고리 탭 필터 컴포넌트 — 전체/PC/콘솔/모바일/e스포츠 탭 전환
// 모바일에서는 가로 스크롤 처리
'use client'
import type { CategorySlug } from '@/lib/mock/news'
import { mockCategories } from '@/lib/mock/news'

interface CategoryFilterProps {
  activeCategory: CategorySlug
  // 카테고리 변경 핸들러
  onChange: (slug: CategorySlug) => void
}

// 카테고리 필터 탭 컴포넌트
export function CategoryFilter({ activeCategory, onChange }: CategoryFilterProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-1 min-w-max">
        {mockCategories.map((category) => {
          const isActive = category.slug === activeCategory
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onChange(category.slug as CategorySlug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {category.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
