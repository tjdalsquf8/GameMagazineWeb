'use client'

// RecommendButton.tsx
// 추천(좋아요) 버튼 공통 컴포넌트 — 추천 상태에 따라 아이콘 fill 스타일 변경

import { ThumbsUp } from 'lucide-react'

interface RecommendButtonProps {
  /** 현재 추천 여부 */
  recommended: boolean
  /** 추천 수 */
  recommendCount: number
  /** 추천 토글 핸들러 */
  onRecommend: () => void
  /** API 요청 진행 중 여부 — true 이면 버튼 disabled */
  isLoading?: boolean
  /** 추가 disabled 조건 (삭제된 댓글 등) */
  disabled?: boolean
  /** 버튼 크기 */
  size?: 'sm' | 'md' | 'lg'
}

/** 사이즈별 아이콘/텍스트 스타일 매핑 */
const SIZE_MAP = {
  sm: { icon: 14, text: 'text-xs', gap: 'gap-1', padding: 'px-2 py-1' },
  md: { icon: 16, text: 'text-sm', gap: 'gap-1.5', padding: 'px-3 py-1.5' },
  lg: { icon: 20, text: 'text-base', gap: 'gap-2', padding: 'px-5 py-2.5' },
} as const

/** 게시글 및 댓글의 추천 버튼 — Optimistic Update는 호출하는 쪽에서 처리 */
export default function RecommendButton({
  recommended,
  recommendCount,
  onRecommend,
  isLoading = false,
  disabled = false,
  size = 'md',
}: RecommendButtonProps) {
  const { icon, text, gap, padding } = SIZE_MAP[size]
  const isDisabled = isLoading || disabled

  return (
    <button
      type="button"
      onClick={onRecommend}
      disabled={isDisabled}
      aria-label={recommended ? '추천 취소' : '추천하기'}
      aria-pressed={recommended}
      className={[
        'inline-flex items-center rounded-full border transition-colors duration-150',
        padding,
        gap,
        isDisabled
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-pointer hover:border-primary hover:text-primary',
        recommended
          ? 'border-primary text-primary bg-primary/5'
          : 'border-border text-text-muted bg-transparent',
      ].join(' ')}
    >
      <ThumbsUp
        size={icon}
        className={recommended ? 'fill-primary text-primary' : 'text-gray-400'}
        strokeWidth={1.8}
      />
      <span
        className={[text, recommended ? 'text-primary font-medium' : 'text-text-muted'].join(' ')}
      >
        {recommendCount}
      </span>
    </button>
  )
}
