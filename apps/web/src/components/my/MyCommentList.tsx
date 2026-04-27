// 내가 쓴 댓글 목록 컴포넌트 — 최근 3건 미리보기, 전체 보기 링크 포함
'use client'

import Link from 'next/link'
import { MessageCircle, Heart, ChevronRight } from 'lucide-react'
import { useMyComments } from '@/hooks/useMyComments'
import type { MyComment } from '@/types/my.types'

/** 날짜 포맷 */
function formatDate(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours < 1) {
    const diffMins = Math.floor(diffMs / (1000 * 60))
    return `${diffMins}분 전`
  }
  if (diffHours < 24) return `${diffHours}시간 전`
  return `${date.getMonth() + 1}.${date.getDate()}`
}

/** 스켈레톤 */
function CommentListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-16 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
      ))}
    </div>
  )
}

/** 빈 상태 UI */
function EmptyState() {
  return (
    <div className="py-10 text-center text-sm text-[var(--color-text-muted)]">
      <p>작성한 댓글이 없습니다.</p>
      <Link
        href="/community"
        className="mt-2 inline-block text-primary hover:underline font-medium"
      >
        커뮤니티 바로가기
      </Link>
    </div>
  )
}

/** 댓글 단일 항목 */
function CommentItem({ comment }: { comment: MyComment }) {
  return (
    <div className="px-3 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      {/* 원글 제목 */}
      <Link
        href={`/community/${comment.post.id}`}
        className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-primary transition-colors mb-1.5"
      >
        <MessageCircle size={11} />
        <span className="line-clamp-1">{comment.post.title}</span>
      </Link>

      {/* 댓글 내용 + 메타 */}
      <div className="flex items-center gap-3">
        <p className="flex-1 text-sm text-[var(--color-text-primary)] line-clamp-1">
          {comment.content}
        </p>
        <span className="shrink-0 flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
          <span className="flex items-center gap-1">
            <Heart size={12} />
            {comment.recommendCount}
          </span>
          <span>{formatDate(comment.createdAt)}</span>
        </span>
      </div>
    </div>
  )
}

/** 내가 쓴 댓글 섹션 컴포넌트 */
export default function MyCommentList() {
  const { data, isLoading, error } = useMyComments(3)

  return (
    <section id="section-comments" aria-labelledby="section-comments-title">
      <div className="flex items-center justify-between mb-3">
        <h2
          id="section-comments-title"
          className="text-base font-semibold text-[var(--color-text-primary)]"
        >
          내가 쓴 댓글
        </h2>
        <Link
          href="/my/comments"
          className="flex items-center gap-0.5 text-xs text-[var(--color-text-muted)] hover:text-primary transition-colors"
        >
          전체 보기 <ChevronRight size={14} />
        </Link>
      </div>

      {isLoading && <CommentListSkeleton />}
      {error && (
        <p className="py-4 text-sm text-center text-red-500">
          불러오지 못했습니다. 새로고침해 주세요.
        </p>
      )}
      {!isLoading && !error && data?.items.length === 0 && <EmptyState />}
      {!isLoading && !error && data && data.items.length > 0 && (
        <div className="space-y-0.5">
          {data.items.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </section>
  )
}
