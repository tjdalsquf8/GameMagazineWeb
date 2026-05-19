// 뉴스 상세 본문 컴포넌트
// RSS 자동 수집 및 관리자 작성 콘텐츠 모두 렌더링 — sanitizeHTML로 XSS 방지

import { sanitizeHTML } from '@/lib/utils/sanitize'

interface ArticleBodyProps {
  body: string
}

// \n\n 단락 구분을 <p> 태그로 변환 — RSS 재작성 결과(plain text)와 HTML 본문 모두 대응
function normalizeBody(body: string): string {
  const trimmed = body.trim()
  // 이미 HTML 태그가 있으면 그대로 sanitize만 적용
  if (/<[a-z][\s\S]*>/i.test(trimmed)) return sanitizeHTML(trimmed)
  // plain text(\n\n 구분)는 <p> 태그로 변환 후 sanitize
  const html = trimmed
    .split(/\n\n+/)
    .map((p) => `<p>${p.replace(/\n/g, '<br />')}</p>`)
    .join('')
  return sanitizeHTML(html)
}

// 뉴스 본문 컴포넌트 — HTML 본문 렌더링
// prose 클래스로 타이포그래피 스타일 적용, max-w-full로 이미지 오버플로우 방지
export function ArticleBody({ body }: ArticleBodyProps) {
  return (
    <article
      className="py-6 border-t border-b border-[var(--color-border)] prose prose-invert max-w-none [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-md [&_p]:text-base [&_p]:text-[var(--color-text-primary)] [&_p]:leading-relaxed [&_p]:mb-4"
      dangerouslySetInnerHTML={{ __html: normalizeBody(body) }}
    />
  )
}
