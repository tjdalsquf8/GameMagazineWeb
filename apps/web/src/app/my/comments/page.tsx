// 내가 쓴 댓글 전체 목록 페이지 — 페이지네이션 포함
'use client'

import Link from 'next/link'
import { ArrowLeft, MessageCircle, Heart } from 'lucide-react'
import { useMyComments } from '@/hooks/useMyComments'
import Pagination from '@/components/ui/Pagination'
import type { MyComment } from '@/types/my.types'

const PAGE_LIMIT = 10

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

/** 스켈레톤 행 */
function SkeletonRow() {
  return <div className="h-16 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
}

/** 댓글 행 */
function CommentRow({ comment }: { comment: MyComment }) {
  return (
    <div className="px-4 py-3.5 rounded-lg border border-[var(--color-border)] hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
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

/** 내가 쓴 댓글 전체 목록 페이지 */
export default function MyCommentsPage() {
  const { data, isLoading, error, page, setPage } = useMyComments(PAGE_LIMIT)

  return (
    <div className="max-w-[960px] mx-auto px-6 py-8">
      {/* 뒤로가기 */}
      <Link
        href="/my"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft size={15} />
        마이페이지로 돌아가기
      </Link>

      <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">내가 쓴 댓글</h1>
          {data && (
            <span className="text-sm text-[var(--color-text-muted)]">총 {data.total}건</span>
          )}
        </div>

        {/* 로딩 */}
        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: PAGE_LIMIT }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        )}

        {/* 에러 */}
        {error && (
          <p className="py-8 text-sm text-center text-red-500">
            불러오지 못했습니다. 새로고침해 주세요.
          </p>
        )}

        {/* 빈 상태 */}
        {!isLoading && !error && data?.items.length === 0 && (
          <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">
            <p>작성한 댓글이 없습니다.</p>
            <Link
              href="/community"
              className="mt-2 inline-block text-primary hover:underline font-medium"
            >
              커뮤니티 바로가기
            </Link>
          </div>
        )}

        {/* 목록 */}
        {!isLoading && !error && data && data.items.length > 0 && (
          <>
            <div className="space-y-2">
              {data.items.map((comment) => (
                <CommentRow key={comment.id} comment={comment} />
              ))}
            </div>
            <Pagination currentPage={page} totalPages={data.totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
