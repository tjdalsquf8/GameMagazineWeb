// 뉴스 상세 본문 컴포넌트
// body에 포함된 HTML(이미지, 링크 등)을 그대로 렌더링
// 관리자가 직접 작성하는 신뢰 가능한 콘텐츠이므로 dangerouslySetInnerHTML 사용

interface ArticleBodyProps {
  body: string
}

// 뉴스 본문 컴포넌트 — HTML 본문 렌더링
// prose 클래스로 타이포그래피 스타일 적용, max-w-full로 이미지 오버플로우 방지
export function ArticleBody({ body }: ArticleBodyProps) {
  return (
    <article
      className="py-6 border-t border-b border-[var(--color-border)] prose prose-invert max-w-none [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-md [&_p]:text-base [&_p]:text-[var(--color-text-primary)] [&_p]:leading-relaxed [&_p]:mb-4"
      dangerouslySetInnerHTML={{ __html: body }}
    />
  )
}
