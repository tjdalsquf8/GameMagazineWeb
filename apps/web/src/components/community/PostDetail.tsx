import Link from 'next/link'
import { mockCategories, mockPostDetail } from '@/lib/mock/community'

function formatFullDate(isoString: string): string {
  const date = new Date(isoString)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// Mock에서는 본인 글로 처리 (수정/삭제 버튼 항상 표시)
const IS_OWN_POST = true

export default function PostDetail() {
  const post = mockPostDetail
  const currentCategory = mockCategories.find((c) => c.id === post.category.id)
  const parentCategory =
    currentCategory?.parentId != null
      ? mockCategories.find((c) => c.id === currentCategory.parentId)
      : null

  return (
    <article>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-text-muted mb-4">
        <Link href="/community" className="hover:text-text-secondary transition-colors">
          커뮤니티
        </Link>
        {parentCategory && (
          <>
            <span>&gt;</span>
            <Link
              href={`/community?category=${parentCategory.slug}`}
              className="hover:text-text-secondary transition-colors"
            >
              {parentCategory.name}
            </Link>
          </>
        )}
        <span>&gt;</span>
        <Link
          href={`/community?category=${currentCategory?.slug ?? ''}`}
          className="hover:text-text-secondary transition-colors"
        >
          {post.category.name}
        </Link>
      </nav>

      {/* 제목 */}
      <h1 className="text-2xl font-bold text-text-primary leading-tight mb-3">{post.title}</h1>

      {/* 메타 정보 */}
      <div className="flex items-center gap-3 text-sm text-text-muted mb-4">
        <span className="text-text-secondary font-medium">{post.author.nickname}</span>
        <span>{formatFullDate(post.createdAt)}</span>
        <span>조회 {post.viewCount.toLocaleString()}</span>
      </div>

      <hr className="border-border mb-6" />

      {/* 본문 */}
      <div className="min-h-[300px] text-base text-text-secondary leading-[1.8] whitespace-pre-wrap mb-6">
        {post.content}
      </div>

      <hr className="border-border mb-4" />

      {/* 버튼 영역 */}
      <div className="flex items-center justify-between">
        <Link
          href="/community"
          className="px-4 py-2 text-sm border border-border rounded hover:bg-surface transition-colors duration-150 text-text-secondary"
        >
          목록으로
        </Link>
        {IS_OWN_POST && (
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm border border-border rounded hover:bg-surface transition-colors duration-150 text-text-secondary">
              수정
            </button>
            <button className="px-4 py-2 text-sm border border-red-200 rounded hover:bg-red-50 transition-colors duration-150 text-red-500">
              삭제
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
