// 내 게시글 목록 컴포넌트 — 최근 3건 미리보기, 전체 보기 링크 포함
'use client'

import Link from 'next/link'
import { Heart, MessageSquare, ChevronRight } from 'lucide-react'
import { useMyPosts } from '@/hooks/useMyPosts'
import type { MyPost } from '@/types/my.types'

/** 날짜 포맷 — 오늘/어제는 상대시간, 이전은 날짜 */
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

/** 게시글 목록 스켈레톤 */
function PostListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-14 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
      ))}
    </div>
  )
}

/** 빈 상태 UI */
function EmptyState() {
  return (
    <div className="py-10 text-center text-sm text-[var(--color-text-muted)]">
      <p>작성한 게시글이 없습니다.</p>
      <Link
        href="/community"
        className="mt-2 inline-block text-primary hover:underline font-medium"
      >
        커뮤니티 바로가기
      </Link>
    </div>
  )
}

/** 게시글 단일 항목 */
function PostItem({ post }: { post: MyPost }) {
  return (
    <Link
      href={`/community/${post.id}`}
      className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
    >
      {/* 카테고리 뱃지 */}
      <span className="shrink-0 px-2 py-0.5 text-xs rounded-full bg-[var(--color-border)] text-[var(--color-text-muted)]">
        {post.category.name}
      </span>

      {/* 제목 */}
      <span className="flex-1 text-sm text-[var(--color-text-primary)] line-clamp-1 group-hover:text-primary transition-colors">
        {post.title}
      </span>

      {/* 통계 */}
      <span className="shrink-0 flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
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

/** 내 게시글 섹션 컴포넌트 */
export default function MyPostList() {
  const { data, isLoading, error } = useMyPosts(3)

  return (
    <section id="section-posts" aria-labelledby="section-posts-title">
      <div className="flex items-center justify-between mb-3">
        <h2
          id="section-posts-title"
          className="text-base font-semibold text-[var(--color-text-primary)]"
        >
          내 게시글
        </h2>
        <Link
          href="/my/posts"
          className="flex items-center gap-0.5 text-xs text-[var(--color-text-muted)] hover:text-primary transition-colors"
        >
          전체 보기 <ChevronRight size={14} />
        </Link>
      </div>

      {isLoading && <PostListSkeleton />}
      {error && (
        <p className="py-4 text-sm text-center text-red-500">
          불러오지 못했습니다. 새로고침해 주세요.
        </p>
      )}
      {!isLoading && !error && data?.items.length === 0 && <EmptyState />}
      {!isLoading && !error && data && data.items.length > 0 && (
        <div className="space-y-0.5">
          {data.items.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  )
}
