// 사이트 푸터 컴포넌트 (서버 컴포넌트)
// 좌: 브랜드+설명+SNS / 중: 빠른 링크 / 우: 법적 고지
import Link from 'next/link'

const QUICK_LINKS = [
  { label: '뉴스', href: '/' },
  { label: '커뮤니티', href: '/community' },
  { label: '문의하기', href: 'mailto:jscompany0407@gmail.com' },
]

const LEGAL_LINKS = [
  { label: '이용약관', href: '/terms' },
  { label: '개인정보처리방침', href: '/privacy' },
]

const INSTAGRAM_URL =
  'https://www.instagram.com/the_gamemag?igsh=Z2w1M2w2ZGZqdGV0&utm_source=qr'
const CONTACT_EMAIL = 'jscompany0407@gmail.com'

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

// 푸터 링크 컬럼 컴포넌트
function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{title}</h3>
      {links.map((link) =>
        link.href.startsWith('mailto:') ? (
          <a
            key={link.label}
            href={link.href}
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
          >
            {link.label}
          </a>
        ) : (
          <Link
            key={link.label}
            href={link.href}
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
          >
            {link.label}
          </Link>
        )
      )}
    </div>
  )
}

// 사이트 푸터 컴포넌트
export function Footer() {
  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] py-7">
      <div className="container-main">
        {/* 상단: 4열 레이아웃 */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-6">
          {/* 좌: 브랜드 + 설명 + SNS */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="font-bold text-xl text-[var(--color-primary)]">
              Game Magazine
            </Link>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-xs">
              게임 뉴스부터 커뮤니티까지,<br />
              게임 문화를 함께 만들어가는 공간입니다.
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">
              광고·제휴 문의:{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="hover:text-[var(--color-primary)] transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
            {/* SNS 아이콘 */}
            <div className="flex items-center gap-3 mt-1">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Game Magazine 인스타그램"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* 중: 빠른 링크 */}
          <FooterColumn title="빠른 링크" links={QUICK_LINKS} />

          {/* 우: 법적 고지 */}
          <FooterColumn title="법적 고지" links={LEGAL_LINKS} />
        </div>

        {/* 하단: 저작권 */}
        <div className="border-t border-[var(--color-border)] mt-6 pt-4">
          <p className="text-xs text-[var(--color-text-muted)]">
            © 2026 Game Magazine. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
