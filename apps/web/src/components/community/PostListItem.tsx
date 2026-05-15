import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/types/community'

interface PostListItemProps {
  post: Post
  index: number
}

function formatDate(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours < 1) {
    const diffMins = Math.floor(diffMs / (1000 * 60))
    return `${diffMins}분 전`
  }
  if (diffHours < 24) {
    return `${diffHours}시간 전`
  }
  return `${date.getMonth() + 1}.${date.getDate()}`
}

export default function PostListItem({ post, index }: PostListItemProps) {
  const commentCount = post._count.comments

  return (
    <tr className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors duration-150">
      <td className="py-3 px-3 text-sm text-text-muted text-center w-12">{index + 1}</td>
      <td className="py-3 px-2 w-24">
        <span className="inline-block px-2 py-0.5 text-xs rounded bg-surface text-text-secondary">
          {post.category.name}
        </span>
      </td>
      <td className="py-3 px-2">
        <Link
          href={`/community/${post.id}`}
          className="text-sm text-text-primary hover:underline line-clamp-1"
        >
          {post.title}
          {commentCount > 0 && (
            <span className="ml-1.5 text-xs font-medium text-primary">[{commentCount}]</span>
          )}
        </Link>
      </td>
      <td className="py-3 px-2 text-sm text-text-secondary text-center w-24 hidden md:table-cell">
        <div className="flex items-center justify-center gap-1.5">
          {post.author?.profileImage ? (
            <div className="relative w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={post.author.profileImage}
                alt={post.author.nickname}
                fill
                className="object-cover"
                sizes="20px"
              />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-[var(--color-surface-hover)] flex items-center justify-center flex-shrink-0">
              <span className="text-[9px] font-medium text-[var(--color-text-muted)]">
                {post.author?.nickname?.[0]?.toUpperCase() ?? '?'}
              </span>
            </div>
          )}
          <span>{post.author?.nickname ?? '(탈퇴한 회원)'}</span>
        </div>
      </td>
      <td className="py-3 px-2 text-sm text-text-muted text-center w-20 hidden sm:table-cell">
        {formatDate(post.createdAt)}
      </td>
      <td className="py-3 px-3 text-sm text-text-muted text-center w-16 hidden sm:table-cell">
        {post.viewCount.toLocaleString()}
      </td>
      <td className="py-3 px-3 text-sm text-center w-16 hidden sm:table-cell">
        {(post._count.postRecommends ?? 0) > 0 ? (
          <span className="text-primary font-small">{post._count.postRecommends}</span>
        ) : (
          <span className="text-text-muted">-</span>
        )}
      </td>
    </tr>
  )
}
