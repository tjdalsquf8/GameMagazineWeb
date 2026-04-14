'use client'

import Link from 'next/link'
import type { Post } from '@/types/community' // Post 타입 임포트

interface PopularPostsWidgetProps {
  posts?: Post[] // 외부(페이지)에서 인기글 데이터를 받아옴
}

export default function PopularPostsWidget({ posts = [] }: PopularPostsWidgetProps) {
  // 만약 데이터가 없으면 위젯 자체를 숨기거나 빈 상태 메시지를 보여줍니다.
  if (posts.length === 0) return null

  return (
    <aside className="w-[240px] shrink-0">
      <div className="border border-border rounded-md overflow-hidden bg-white">
        <div className="px-3 py-2 bg-slate-50 border-b border-border">
          <span className="text-sm font-semibold text-text-primary">🔥 실시간 인기글</span>
        </div>
        <ol className="py-1">
          {posts.map((post, index) => (
            <li key={post.id}>
              <Link
                href={`/community/${post.id}`}
                className="flex items-start gap-2 px-3 py-2 hover:bg-slate-50 transition-colors duration-150"
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
