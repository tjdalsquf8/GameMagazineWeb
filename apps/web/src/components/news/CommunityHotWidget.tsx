// 커뮤니티 HOT 위젯 컴포넌트 — 인기 커뮤니티 글 TOP 5 표시
import Link from 'next/link'
import type { CommunityHot } from '@/lib/mock/news'

interface CommunityHotWidgetProps {
  posts: CommunityHot[]
}

// 조회수 포맷 함수 — 1000 이상이면 K 단위로 변환
function formatViewCount(count: number): string {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}만`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return count.toLocaleString()
}

// 커뮤니티 HOT 위젯 컴포넌트
export function CommunityHotWidget({ posts }: CommunityHotWidgetProps) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 h-full">
      {/* 섹션 타이틀 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-xl font-medium text-[var(--color-text-primary)]">
          <span className="w-[3px] h-5 bg-[var(--color-primary)] rounded-full inline-block" />
          커뮤니티 HOT
        </h2>
        <Link
          href="/community"
          className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
        >
          더보기 &rarr;
        </Link>
      </div>

      {/* HOT 게시글 목록 */}
      <ul className="flex flex-col gap-3">
        {posts.map((post, index) => (
          <li key={post.id}>
            <Link href="/community" className="flex items-start gap-3 group">
              {/* 순위 번호 */}
              <span
                className={`flex-shrink-0 w-5 text-center text-sm font-bold leading-none mt-0.5 ${
                  index < 3 ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'
                }`}
              >
                {index + 1}
              </span>

              {/* 제목 + 조회수 */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--color-text-primary)] line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors leading-snug">
                  {post.title}
                </p>
                <span className="text-xs text-[var(--color-text-muted)] mt-0.5 block">
                  {formatViewCount(post.viewCount)} 조회
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
