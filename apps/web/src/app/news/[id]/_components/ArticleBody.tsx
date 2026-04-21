// 뉴스 상세 본문 컴포넌트
// body를 \n\n 기준으로 문단 분리 후 각 문단을 <p> 태그로 렌더링

interface ArticleBodyProps {
  body: string
}

// 뉴스 본문 컴포넌트 — 문단별 렌더링
export function ArticleBody({ body }: ArticleBodyProps) {
  // \n\n 기준으로 문단 분리, 빈 문자열 제거
  const paragraphs = body.split('\n\n').filter((p) => p.trim().length > 0)

  return (
    <article className="py-6 border-t border-b border-[var(--color-border)]">
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className="text-base text-[var(--color-text-primary)] leading-relaxed mb-4 last:mb-0"
        >
          {paragraph.trim()}
        </p>
      ))}
    </article>
  )
}
