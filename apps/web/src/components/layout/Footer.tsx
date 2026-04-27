// 사이트 푸터 컴포넌트 (서버 컴포넌트)
// 3단 그리드 링크 목록, 모바일 1단 배열, 저작권 표시
import Link from 'next/link'

const SERVICE_LINKS = [
  { label: '뉴스', href: '/' },
  { label: '커뮤니티', href: '/community' },
]

const SUPPORT_LINKS = [
  { label: '공지사항', href: '#' },
  { label: '문의하기', href: '#' },
]

const LEGAL_LINKS = [
  { label: '이용약관', href: '#' },
  { label: '개인정보처리방침', href: '#' },
]

// 푸터 링크 컬럼 컴포넌트 — 제목과 링크 목록 렌더링
function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">{title}</h3>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors block mb-2"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

// 사이트 푸터 컴포넌트 — 서비스 링크, 고객지원, 법적 고지, 저작권
export function Footer() {
  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] py-12">
      <div className="container-main">
        {/* 상단: 로고 및 서비스 설명 */}
        <div>
          <Link href="/" className="font-bold text-xl text-[var(--color-primary)]">
            Game Magazine
          </Link>
          <p className="text-sm text-[var(--color-text-secondary)] mt-2">
            게임 문화를 함께 만들어가는 공간
          </p>
        </div>

        {/* 중단: 3단 링크 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <FooterColumn title="서비스" links={SERVICE_LINKS} />
          <FooterColumn title="고객지원" links={SUPPORT_LINKS} />
          <FooterColumn title="법적 고지" links={LEGAL_LINKS} />
        </div>

        {/* 하단: 저작권 표시 */}
        <div className="border-t border-[var(--color-border)] mt-8 pt-8">
          <p className="text-sm text-[var(--color-text-secondary)]">
            © 2026 Game Magazine. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
