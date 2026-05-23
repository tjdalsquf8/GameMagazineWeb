// 공통 페이지네이션 컴포넌트 — 번호 기반 페이지 이동 UI
// 이전/다음 버튼 및 페이지 번호 버튼을 제공하며, 커뮤니티/뉴스 공통으로 사용
// 모바일(< 768px): 최대 10개 페이지 번호 슬라이딩 윈도우로 표시
'use client'

import { useEffect, useState } from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

// currentPage 기준으로 maxVisible 개수만큼 슬라이딩 윈도우 페이지 목록 계산
function getVisiblePages(currentPage: number, totalPages: number, maxVisible: number): number[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  const half = Math.floor(maxVisible / 2)
  let start = currentPage - half
  let end = currentPage + (maxVisible - half - 1)

  if (start < 1) {
    start = 1
    end = maxVisible
  }
  if (end > totalPages) {
    end = totalPages
    start = totalPages - maxVisible + 1
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

// 페이지네이션 UI — totalPages가 1 이하면 렌더링하지 않음
export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  if (totalPages <= 1) return null

  const pages = isMobile
    ? getVisiblePages(currentPage, totalPages, 10)
    : Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-center gap-1 py-4">
      {/* 이전 페이지 버튼 */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        onMouseDown={(e) => e.preventDefault()}
        disabled={currentPage === 1}
        className="px-2 py-1 text-sm text-text-muted hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="이전 페이지"
      >
        &lt;
      </button>

      {/* 페이지 번호 버튼 목록 */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          onMouseDown={(e) => e.preventDefault()}
          className={[
            'w-8 h-8 text-sm rounded transition-colors duration-150',
            page === currentPage
              ? 'bg-primary text-primary-foreground font-semibold'
              : 'text-text-secondary hover:bg-surface',
          ].join(' ')}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {/* 다음 페이지 버튼 */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        onMouseDown={(e) => e.preventDefault()}
        disabled={currentPage === totalPages}
        className="px-2 py-1 text-sm text-text-muted hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="다음 페이지"
      >
        &gt;
      </button>
    </div>
  )
}
