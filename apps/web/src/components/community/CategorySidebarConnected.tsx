'use client'

// CategorySidebarConnected — useSearchParams로 현재 카테고리 슬러그를 읽어 CategorySidebar에 전달
import { useSearchParams } from 'next/navigation'
import CategorySidebar from './CategorySidebar'

interface Props {
  onClose?: () => void
}

export default function CategorySidebarConnected({ onClose }: Props) {
  const searchParams = useSearchParams()
  const currentSlug = searchParams.get('category') ?? 'all'

  return <CategorySidebar currentSlug={currentSlug} onClose={onClose} />
}
