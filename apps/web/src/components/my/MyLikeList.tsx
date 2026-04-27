// 좋아요한 글 목록 컴포넌트 — 최근 3건 미리보기, 전체 보기 링크 포함
'use client'

import Link from 'next/link'
import { Heart, MessageSquare, ChevronRight } from 'lucide-react'
import { useMyLikes } from '@/hooks/useMyLikes'
import type { MyLike } from '@/types/my.types'

/** 스켈레톤 */
function LikeListSkeleton() {
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
      <p>좋아요한 게시글이 없습니다.</p>
      <Link
        href="/community"
        className="mt-2 inline-block text-primary hover:underline font-medium"
      >
        커뮤니티 바로가기
      </Link>
    </div>
  )
}

/** 좋아요 항목 */
function LikeItem({ like }: { like: MyLike }) {
  const { post } = like

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

/** 좋아요한 글 섹션 컴포넌트 */
export default function MyLikeList() {
  const { data, isLoading, error } = useMyLikes(3)

  return (
    <section id="section-likes" aria-labelledby="section-likes-title">
      <div className="flex items-center justify-between mb-3">
        <h2
          id="section-likes-title"
          className="text-base font-semibold text-[var(--color-text-primary)]"
        >
          좋아요한 글
        </h2>
        <Link
          href="/my/likes"
          className="flex items-center gap-0.5 text-xs text-[var(--color-text-muted)] hover:text-primary transition-colors"
        >
          전체 보기 <ChevronRight size={14} />
        </Link>
      </div>

      {isLoading && <LikeListSkeleton />}
      {error && (
        <p className="py-4 text-sm text-center text-red-500">
          불러오지 못했습니다. 새로고침해 주세요.
        </p>
      )}
      {!isLoading && !error && data?.items.length === 0 && <EmptyState />}
      {!isLoading && !error && data && data.items.length > 0 && (
        <div className="space-y-0.5">
          {data.items.map((like) => (
            <LikeItem key={like.id} like={like} />
          ))}
        </div>
      )}
    </section>
  )
}
