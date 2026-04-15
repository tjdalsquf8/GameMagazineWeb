'use client'

// PopularPostsWidget.tsx
// 커뮤니티 우측 사이드바 — 실시간 인기글 위젯
// 마운트 시 GET /posts?sort=popular&limit=5 를 직접 호출하여 데이터를 표시

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getPosts } from '@/lib/api/posts'
import type { Post } from '@/types/community'

export default function PopularPostsWidget() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  /** 인기글 목록 fetch — sort=popular, limit=5 */
  useEffect(() => {
    let cancelled = false

    getPosts({ sort: 'popular', limit: 5 })
      .then((res) => {
        if (!cancelled) {
          setPosts(res.items)
        }
      })
      .catch(() => {
        // 위젯 로드 실패는 조용히 처리 — 빈 목록 유지
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // 로딩 중이거나 데이터가 없으면 위젯 자체를 숨김
  if (isLoading || posts.length === 0) return null

  return (
    <aside className="w-[240px] shrink-0">
      <div className="border border-[var(--color-border)] rounded-md overflow-hidden bg-[var(--color-background)]">
        <div className="px-3 py-2 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
          <span className="text-sm font-semibold text-text-primary">🔥 실시간 인기글</span>
        </div>
        <ol className="py-1">
          {posts.map((post, index) => (
            <li key={post.id}>
              <Link
                href={`/community/${post.id}`}
                className="flex items-start gap-2 px-3 py-2 hover:bg-[var(--color-surface-hover)] transition-colors duration-150"
              >
                <span
                  className={[
                    'shrink-0 w-5 text-center text-sm font-bold mt-0.5',
                    index === 0
                      ? 'text-red-500'
                      : index === 1
                        ? 'text-orange-400'
                        : index === 2
                          ? 'text-yellow-500'
                          : 'text-text-muted',
                  ].join(' ')}
                >
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary truncate leading-snug">{post.title}</p>
                  <span className="text-xs text-text-muted">
                    조회 {post.viewCount.toLocaleString()}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  )
}
