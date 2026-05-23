// 뉴스 메인 페이지 — 게임 매거진 스타일 뉴스 목록
// SSR: 초기 뉴스 데이터 + 카테고리 상위 뉴스를 서버에서 병렬 fetch
// 카테고리 상태는 Client Component(NewsMainClient)에서 관리
import { NewsMainClient } from '@/components/news/NewsMainClient'
import type { NewsListResponse, CategoryTopNewsItem } from '@/types/news'
import { env } from '@/lib/env'

// 초기 뉴스 데이터 서버 fetch 함수 — API 실패 시 빈 목록 반환
async function fetchInitialNews(): Promise<NewsListResponse> {
  try {
    const res = await fetch(`${env.apiUrl}/api/news?limit=20`, { next: { revalidate: 300 } })
    if (!res.ok) return { data: [], meta: { total: 0, page: 1, limit: 20 } }
    const json = await res.json()
    if (json.success && json.data) {
      return json.data as NewsListResponse
    }
    return { data: [], meta: { total: 0, page: 1, limit: 20 } }
  } catch {
    return { data: [], meta: { total: 0, page: 1, limit: 20 } }
  }
}

// 카테고리별 최상위 뉴스 fetch 함수 — Hero 섹션 사이드카드용, API 실패 시 빈 배열 반환
async function fetchCategoryTops(): Promise<CategoryTopNewsItem[]> {
  try {
    const res = await fetch(`${env.apiUrl}/api/news/category-tops`, { cache: 'no-store' })
    if (!res.ok) return []
    const json = await res.json()
    return json.success ? (json.data as CategoryTopNewsItem[]) : []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [initialNews, categoryTops] = await Promise.all([fetchInitialNews(), fetchCategoryTops()])

  return <NewsMainClient initialNews={initialNews} categoryTops={categoryTops} />
}
