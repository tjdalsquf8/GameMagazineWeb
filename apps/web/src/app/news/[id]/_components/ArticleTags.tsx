// 뉴스 상세 태그 목록 컴포넌트
// tags 배열을 SummaryBox와 동일한 박스 스타일로 표시

interface ArticleTagsProps {
  tags: string[]
}

// 태그 목록 컴포넌트 — 태그가 없으면 렌더링하지 않음
export function ArticleTags({ tags }: ArticleTagsProps) {
  if (tags.length === 0) return null

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-x-3 gap-y-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-block px-3 py-1 text-sm font-semibold text-[var(--color-text-primary)] bg-[var(--color-surface)] rounded cursor-pointer hover:opacity-70 transition-opacity"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
