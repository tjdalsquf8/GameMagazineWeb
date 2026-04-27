import type { ReactNode } from 'react'
import CategorySidebarConnected from '@/components/community/CategorySidebarConnected'
import PopularPostsWidget from '@/components/community/PopularPostsWidget'

interface CommunityLayoutProps {
  children: ReactNode
}

export default function CommunityLayout({ children }: CommunityLayoutProps) {
  return (
    <div className="bg-background">
      {/* 본문 */}
      <div className="max-w-[1280px] mx-auto px-4 py-6">
        <div className="flex gap-5">
          {/* 좌측 사이드바 — 데스크톱(lg 이상)에서만 노출 */}
          <div className="hidden lg:block">
            <CategorySidebarConnected />
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
