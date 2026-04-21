// apps/web/src/app/news/[id]/_components/Sidebar.tsx
// 뉴스 상세 페이지 사이드바 — 광고 배너, 많이 본 뉴스(top5), 커뮤니티 인기글(top5) 표시
// 서버 컴포넌트: mainCategory 기반으로 서버에서 직접 fetch

import Link from 'next/link'

// 뉴스 mainCategory → 커뮤니티 부모 categoryId 매핑
// (커뮤니티 카테고리: 모바일=1, 콘솔=2, PC=3, Esports는 커뮤니티에 없음)
const NEWS_TO_COMMUNITY_CATEGORY: Record<string, number> = {
  PC: 3,
  Console: 2,
  Mobile: 1,
}

// 인기 뉴스 아이템 타입
interface PopularNewsItem {
  id: string
  title: string
  viewCount: number
}

// 커뮤니티 게시글 아이템 타입
interface PopularPostItem {
  id: number
  title: string
  viewCount: number
  category: { name: string }
}

// 커뮤니티 posts API 응답 구조
interface PostsApiResponse {
  success: boolean
  data: {
    items: PopularPostItem[]
    total: number
    page: number
    limit: number
  }
}

// 인기 뉴스 API 응답 구조
interface PopularNewsApiResponse {
  success: boolean
  data: PopularNewsItem[]
}

// 조회수 포맷 함수 — 1만 이상은 "X만 조회", 1천 이상은 "X천 조회", 미만은 "N 조회"
function formatViewCount(count: number): string {
  if (count >= 10000) return `${Math.floor(count / 1000) / 10}만 조회`
  if (count >= 1000) return `${Math.floor(count / 100) / 10}천 조회`
  return `${count} 조회`
}

// 카테고리별 인기 뉴스 fetch — 실패 시 빈 배열 반환
async function fetchPopularNews(mainCategory: string): Promise<PopularNewsItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
  try {
    const res = await fetch(
      `${baseUrl}/news/popular?mainCategory=${mainCategory}&limit=5`,
      { next: { revalidate: 600 } },
    )
    if (!res.ok) return []
    const json: PopularNewsApiResponse = await res.json()
    if (!json.success) return []
    return json.data
  } catch {
    return []
  }
}

// 커뮤니티 인기글 fetch — 실패 시 빈 배열 반환
async function fetchPopularPosts(categoryId: number): Promise<PopularPostItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
  try {
    const res = await fetch(
      `${baseUrl}/posts?sort=popular&categoryId=${categoryId}&limit=5&page=1`,
      { next: { revalidate: 600 } },
    )
    if (!res.ok) return []
    const json: PostsApiResponse = await res.json()
    if (!json.success) return []
    return json.data.items ?? []
  } catch {
    return []
  }
}

interface SidebarProps {
  mainCategory: string
}

// 사이드바 서버 컴포넌트
export async function Sidebar({ mainCategory }: SidebarProps) {
  const communityCategoryId = NEWS_TO_COMMUNITY_CATEGORY[mainCategory]

  // 병렬 fetch
  const [popularNews, popularPosts] = await Promise.all([
    fetchPopularNews(mainCategory),
    communityCategoryId ? fetchPopularPosts(communityCategoryId) : Promise.resolve([]),
  ])

  return (
    <div className="flex flex-col gap-6">
      {/* 광고 배너 300×250 */}
      <div
        className="w-full border border-dashed border-[var(--color-border)] rounded-lg flex items-center justify-center text-[var(--color-text-muted)] text-sm"
        style={{ height: '250px' }}
      >
        광고 (300×250)
      </div>

      {/* 많이 본 뉴스 */}
      <section>
        <h2 className="text-base font-bold mb-3 text-[var(--color-text)]">
          많이 본 뉴스
        </h2>
        {popularNews.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">아직 데이터가 없습니다</p>
        ) : (
          <ol className="flex flex-col gap-3">
            {popularNews.map((item, index) => (
              <li key={item.id} className="flex gap-3 items-start">
                <span
                  className={`text-sm font-bold w-4 shrink-0 ${
                    index < 3
                      ? 'text-[var(--color-primary)]'
                      : 'text-[var(--color-text-muted)]'
                  }`}
                >
                  {index + 1}
                </span>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <Link
                    href={`/news/${item.id}`}
                    className="text-sm text-[var(--color-text)] hover:text-[var(--color-primary)] line-clamp-2 leading-snug transition-colors"
                  >
                    {item.title}
                  </Link>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {formatViewCount(item.viewCount)}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* 커뮤니티 인기글 */}
      <section>
        <h2 className="text-base font-bold mb-3 text-[var(--color-text)]">
          커뮤니티 인기글
        </h2>
        {popularPosts.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">아직 데이터가 없습니다</p>
        ) : (
          <ol className="flex flex-col gap-3">
            {popularPosts.map((post, index) => (
              <li key={post.id} className="flex gap-3 items-start">
                <span
                  className={`text-sm font-bold w-4 shrink-0 ${
                    index < 3
                      ? 'text-[var(--color-primary)]'
                      : 'text-[var(--color-text-muted)]'
                  }`}
                >
                  {index + 1}
                </span>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <Link
                    href={`/community/${post.id}`}
                    className="text-sm text-[var(--color-text)] hover:text-[var(--color-primary)] line-clamp-2 leading-snug transition-colors"
                  >
                    {post.title}
                  </Link>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {formatViewCount(post.viewCount)}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}
