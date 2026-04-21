// 뉴스 상세 페이지 헤더 컴포넌트
// 브레드크럼, 제목(h1), 날짜/조회수를 표시
// 카테고리 뱃지와 summary는 각각 ArticleTags, SummaryBox로 분리됨

import Link from 'next/link'

interface ArticleHeaderProps {
  mainCategory: string
  subCategory: string
  title: string
  viewCount: number
  createdAt: string
}

// 날짜 포맷 함수 — ISO 문자열을 YYYY.MM.DD (ko-KR) 형태로 변환
function formatDate(iso: string): string {
  const d = new Date(iso)
  return d
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\. /g, '.')
    .replace(/\.$/, '')
}

// 조회수 포맷 함수 — 1000 미만은 그대로, 1만 이상은 'N.N만' 형태로 변환
function formatViewCount(count: number): string {
  if (count >= 10000) {
    const man = count / 10000
    return `${Math.floor(man * 10) / 10}만 조회`
  }
  if (count >= 1000) {
    const chun = count / 1000
    return `${Math.floor(chun * 10) / 10}천 조회`
  }
  return `${count} 조회`
}

// 뉴스 상세 헤더 컴포넌트 — 브레드크럼, 제목, 날짜/조회수 표시
export function ArticleHeader({
  mainCategory,
  subCategory,
  title,
  viewCount,
  createdAt,
}: ArticleHeaderProps) {
  return (
    <header className="mb-4">
      {/* 브레드크럼 */}
      <nav
        aria-label="브레드크럼"
        className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] mb-4"
      >
        <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">
          뉴스
        </Link>
        <span aria-hidden="true">›</span>
        <span>{mainCategory}</span>
        <span aria-hidden="true">›</span>
        <span>{subCategory}</span>
      </nav>

      {/* 제목 */}
      <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] leading-snug mb-3">
        {title}
      </h1>

      {/* 날짜 및 조회수 */}
      <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
        <time dateTime={createdAt}>{formatDate(createdAt)}</time>
        <span aria-hidden="true">·</span>
        <span>{formatViewCount(viewCount)}</span>
      </div>
    </header>
  )
}
