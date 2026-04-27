// 내 게시글 전체 목록 페이지 — 페이지네이션 포함
'use client'

import Link from 'next/link'
import { ArrowLeft, Heart, MessageSquare } from 'lucide-react'
import { useMyPosts } from '@/hooks/useMyPosts'
import Pagination from '@/components/ui/Pagination'
import type { MyPost } from '@/types/my.types'

const PAGE_LIMIT = 10

/** 날짜 포맷 */
function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

/** 스켈레톤 행 */
function SkeletonRow() {
  return <div className="h-14 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
}

/** 게시글 행 */
function PostRow({ post }: { post: MyPost }) {
  return (
    <Link
      href={`/community/${post.id}`}
      className="flex items-center gap-3 px-4 py-3.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group border border-[var(--color-border)]"
    >
      {/* 카테고리 */}
      <span className="shrink-0 px-2 py-0.5 text-xs rounded-full bg-[var(--color-border)] text-[var(--color-text-muted)]">
        {post.category.name}
      </span>

      {/* 제목 */}
      <span className="flex-1 text-sm text-[var(--color-text-primary)] line-clamp-1 group-hover:text-primary transition-colors">
        {post.title}
      </span>

      {/* 날짜 + 통계 */}
      <span className="shrink-0 flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
        <span className="hidden sm:inline">{formatDate(post.createdAt)}</span>
        <span className="flex items-center gap-1">
          <Heart size={12} />
          {post._count.postRecommends}
        </span>
        <span className="flex items-center gap-1">
          <MessageSquare size={12} />
          {post._count.comments}
        </span>
      </span>
    </Link>
  )
}

/** 내 게시글 전체 목록 페이지 */
export default function MyPostsPage() {
  const { data, isLoading, error, page, setPage } = useMyPosts(PAGE_LIMIT)

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
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">내 게시글</h1>
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
            <p>작성한 게시글이 없습니다.</p>
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
              {data.items.map((post) => (
                <PostRow key={post.id} post={post} />
              ))}
            </div>
            <Pagination currentPage={page} totalPages={data.totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
