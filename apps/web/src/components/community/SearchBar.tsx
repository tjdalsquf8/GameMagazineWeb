'use client'

// SearchBar.tsx
// 커뮤니티 게시글 목록 검색 인풋 컴포넌트
// Enter 또는 검색 버튼 클릭 시 onSearch 콜백 호출
// 2자 미만이면 검색 버튼 비활성화, 검색어가 있을 때 X 버튼으로 초기화

import { useState, useRef, KeyboardEvent } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  /** 검색 실행 시 호출되는 콜백 — 빈 문자열이면 검색 초기화 */
  onSearch: (keyword: string) => void
  /** 초기 검색어 */
  defaultValue?: string
  /** 외부 로딩 상태 — true 이면 입력 및 버튼 비활성화 */
  isLoading?: boolean
}

const MIN_SEARCH_LENGTH = 2

/** 게시글 목록 상단 검색 인풋 — Enter 또는 버튼 클릭으로 검색 실행 */
export default function SearchBar({
  onSearch,
  defaultValue = '',
  isLoading = false,
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue)
  const inputRef = useRef<HTMLInputElement>(null)

  const canSearch = value.trim().length >= MIN_SEARCH_LENGTH
  const hasValue = value.length > 0

  /** Enter 키 입력 시 검색 실행 */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && canSearch && !isLoading) {
      onSearch(value.trim())
    }
  }

  /** 검색 버튼 클릭 */
  const handleSearchClick = () => {
    if (canSearch && !isLoading) {
      onSearch(value.trim())
    }
  }

  /** X 버튼 클릭 — 검색어 초기화 및 전체 목록 복원 */
  const handleClear = () => {
    setValue('')
    onSearch('')
    inputRef.current?.focus()
  }

  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <div className="relative flex-1 sm:w-64">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="제목 검색 (2자 이상)"
          aria-label="게시글 제목 검색"
          className="w-full pl-3 pr-8 py-1.5 text-sm border border-border rounded bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="검색어 초기화"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={handleSearchClick}
        disabled={!canSearch || isLoading}
        aria-label="검색"
        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary-hover transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Search size={14} />
        <span>검색</span>
      </button>
    </div>
  )
}
