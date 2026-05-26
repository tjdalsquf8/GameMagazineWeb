// 동적 sitemap 생성 — Next.js App Router가 /sitemap.xml로 자동 서빙
// 정적 페이지 + DB의 뉴스 기사·에디터픽 URL을 포함
import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://game-magazine-web-web-git-develop-cho-seong-mins-projects.vercel.app'
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

// 뉴스 기사 ID 목록 조회
async function fetchNewsIds(): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/api/news?limit=1000&page=1`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const json = await res.json()
    if (!json.success || !json.data?.data) return []
    return json.data.data.map((article: { id: string }) => article.id)
  } catch {
    return []
  }
}

// 에디터픽 ID 목록 조회
async function fetchEditorPickIds(): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/api/editor-picks?limit=100`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const json = await res.json()
    if (!json.success || !json.data?.data) return []
    return json.data.data.map((pick: { id: string }) => pick.id)
  } catch {
    return []
  }
}

// sitemap 생성 함수 — Next.js가 /sitemap.xml 요청 시 자동 호출
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [newsIds, editorPickIds] = await Promise.all([fetchNewsIds(), fetchEditorPickIds()])

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    { url: `${BASE_URL}/community`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.8 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  const newsPages: MetadataRoute.Sitemap = newsIds.map((id) => ({
    url: `${BASE_URL}/news/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const editorPickPages: MetadataRoute.Sitemap = editorPickIds.map((id) => ({
    url: `${BASE_URL}/editor-picks/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticPages, ...newsPages, ...editorPickPages]
}
