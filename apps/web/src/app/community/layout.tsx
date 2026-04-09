import type { ReactNode } from 'react'
import CategorySidebar from '@/components/community/CategorySidebar'
import PopularPostsWidget from '@/components/community/PopularPostsWidget'
import CommunityDrawer from '@/components/community/CommunityDrawer'

interface CommunityLayoutProps {
  children: ReactNode
}

export default function CommunityLayout({ children }: CommunityLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* 상단 GNB */}
      <header className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-[1280px] mx-auto px-4 h-12 flex items-center">
          <a href="/" className="text-base font-bold text-text-primary">
            Game Magazine
          </a>
          <nav className="ml-6 flex items-center gap-4">
            <a
              href="/community"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              커뮤니티
            </a>
          </nav>
          {/* 모바일 햄버거 버튼 + 드로어 (lg 미만에서만 노출) */}
          <CommunityDrawer />
        </div>
      </header>

      {/* 본문 */}
      <div className="max-w-[1280px] mx-auto px-4 py-6">
        <div className="flex gap-5">
          {/* 좌측 사이드바 — 데스크톱(lg 이상)에서만 노출 */}
          <div className="hidden lg:block">
            <CategorySidebar />
          </div>

          {/* 중앙 콘텐츠 */}
          <main className="flex-1 min-w-0">{children}</main>

          {/* 우측 위젯 */}
          <div className="hidden xl:block">
            <PopularPostsWidget />
          </div>
        </div>
      </div>
    </div>
  )
}
