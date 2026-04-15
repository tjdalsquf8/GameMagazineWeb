// 카테고리 뱃지 컴포넌트 — 뉴스 카드 및 Hero 섹션에서 카테고리 표시에 사용
import type { Category } from '@/lib/mock/news'

// 카테고리 슬러그별 Tailwind 색상 클래스 매핑
const categoryColorMap: Record<string, string> = {
  pc: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  console: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  mobile: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  esports: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
}

interface CategoryBadgeProps {
  category: Category
  // Hero 오버레이 위에서 사용 시 강제 어두운 버전 적용
  variant?: 'default' | 'overlay'
}

// 카테고리 뱃지 렌더링 함수
export function CategoryBadge({ category, variant = 'default' }: CategoryBadgeProps) {
  const colorClass =
    categoryColorMap[category.slug] ??
    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'

  if (variant === 'overlay') {
    // Hero 이미지 오버레이 위에서는 불투명 배경 강제 적용
    const overlayColorMap: Record<string, string> = {
      pc: 'bg-blue-600 text-white',
      console: 'bg-purple-600 text-white',
      mobile: 'bg-green-600 text-white',
      esports: 'bg-orange-600 text-white',
    }
    const overlayClass = overlayColorMap[category.slug] ?? 'bg-gray-600 text-white'
    return (
      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${overlayClass}`}>
        {category.name}
      </span>
    )
  }

  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
      {category.name}
    </span>
  )
}
