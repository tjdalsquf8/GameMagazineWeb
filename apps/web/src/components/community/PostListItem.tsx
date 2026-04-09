import Link from 'next/link'
import type { MockPost } from '@/lib/mock/community'

interface PostListItemProps {
  post: MockPost
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
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
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
          {post.commentCount > 0 && (
            <span className="ml-1.5 text-xs font-medium text-primary">[{post.commentCount}]</span>
          )}
        </Link>
      </td>
      <td className="py-3 px-2 text-sm text-text-secondary text-center w-24 hidden md:table-cell">
        {post.author.nickname}
      </td>
      <td className="py-3 px-2 text-sm text-text-muted text-center w-20 hidden sm:table-cell">
        {formatDate(post.createdAt)}
      </td>
      <td className="py-3 px-3 text-sm text-text-muted text-center w-16 hidden sm:table-cell">
        {post.viewCount.toLocaleString()}
      </td>
    </tr>
  )
}
