// 카테고리 탭 필터 컴포넌트
// 대분류 탭 + 소분류 탭(대분류 선택 시 하단에 표시) 2단 구조
// 모바일에서는 가로 스크롤 처리
'use client'
import { MAIN_CATEGORIES, SUB_CATEGORIES } from '@/constants/categories'
import type { MainCategoryValue } from '@/constants/categories'

interface CategoryFilterProps {
  activeCategory: MainCategoryValue
  // 대분류 변경 핸들러
  onChange: (value: MainCategoryValue) => void
  activeSubCategory: string | null
  // 소분류 변경 핸들러 (null = 전체)
  onSubChange: (value: string | null) => void
}

// 카테고리 필터 컴포넌트 — 대분류/소분류 2단 탭
export function CategoryFilter({
  activeCategory,
  onChange,
  activeSubCategory,
  onSubChange,
}: CategoryFilterProps) {
  // 현재 대분류에 해당하는 소분류 목록 (전체 탭은 소분류 없음)
  const subCategories = activeCategory !== '' ? (SUB_CATEGORIES[activeCategory] ?? null) : null

  return (
    <div className="flex flex-col gap-2">
      {/* 대분류 탭 */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-1 min-w-max">
          {MAIN_CATEGORIES.map((category) => {
            const isActive = category.apiValue === activeCategory
            return (
              <button
                key={category.apiValue}
                type="button"
                onClick={() => onChange(category.apiValue)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {category.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* 소분류 탭 — 대분류가 전체가 아닐 때만 표시 */}
      {subCategories && (
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-1 min-w-max">
            {/* 전체 버튼 */}
            <button
              type="button"
              onClick={() => onSubChange(null)}
              className={`px-3 py-1.5 text-sm transition-colors whitespace-nowrap ${
                activeSubCategory === null
                  ? 'font-bold text-blue-600'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              }`}
            >
              전체
            </button>

            {subCategories.map((sub) => {
              const isActive = sub === activeSubCategory
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => onSubChange(sub)}
                  className={`px-3 py-1.5 text-sm transition-colors whitespace-nowrap ${
                    isActive
                      ? 'font-bold text-blue-600'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                  }`}
                >
                  {sub}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
