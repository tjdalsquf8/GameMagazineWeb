import Link from 'next/link'
import { mockPopularPosts } from '@/lib/mock/community'

export default function PopularPostsWidget() {
  return (
    <aside className="w-[240px] shrink-0">
      <div className="border border-border rounded-md overflow-hidden">
        <div className="px-3 py-2 bg-surface border-b border-border">
          <span className="text-sm font-semibold text-text-primary">🔥 실시간 인기글</span>
        </div>
        <ol className="py-1">
          {mockPopularPosts.map((post, index) => (
            <li key={post.id}>
              <Link
                href={`/community/${post.id}`}
                className="flex items-start gap-2 px-3 py-2 hover:bg-surface transition-colors duration-150"
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
