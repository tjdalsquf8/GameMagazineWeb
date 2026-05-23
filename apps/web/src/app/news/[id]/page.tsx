// 뉴스 상세 페이지 — 서버 컴포넌트 (SSR, revalidate: 3600)
// GET /news/:id 로 단일 뉴스 데이터를 받아 렌더링

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { NewsDetail } from '@/types/news'
import { ArticleHeader } from './_components/ArticleHeader'
import { ArticleBody } from './_components/ArticleBody'
import { ArticleTags } from './_components/ArticleTags'
import { LikeButton } from './_components/LikeButton'
import { NewsViewCounter } from './_components/NewsViewCounter'
import { SummaryBox } from './_components/SummaryBox'
import { AdBanner } from './_components/AdBanner'
import { Sidebar } from './_components/Sidebar'
import { env } from '@/lib/env'

// 동적 파라미터 허용 — 빌드 시 알 수 없는 id에도 접근 가능
export const dynamicParams = true

// ISR — 1시간마다 재검증
export const revalidate = 3600

interface PageProps {
  params: Promise<{ id: string }>
}

// API 응답 래퍼 타입
interface ApiResponse<T> {
  success: boolean
  data: T
}

// 뉴스 상세 데이터 fetch 함수 — 404 시 null 반환
async function fetchArticle(id: string): Promise<NewsDetail | null> {
  const res = await fetch(`${env.apiUrl}/api/news/${id}`, {
    cache: 'no-store',
  })

  if (res.status === 404) return null
  if (!res.ok) return null

  const json: ApiResponse<NewsDetail> = await res.json()
  if (!json.success) return null

  return json.data
}

// 동적 메타데이터 생성 — 제목/요약 기반 SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const article = await fetchArticle(id)

  if (!article) {
    return { title: '뉴스를 찾을 수 없습니다' }
  }

  return {
    title: article.title,
    description: article.summary,
  }
}

// 뉴스 상세 페이지 컴포넌트
export default async function NewsDetailPage({ params }: PageProps) {
  const { id } = await params
  const article = await fetchArticle(id)

  // 뉴스 없으면 404 처리
  if (!article) {
    notFound()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex gap-8 items-start">
        <main className="flex-1 min-w-0">
          <NewsViewCounter newsId={article.id} />
          <ArticleHeader
            mainCategory={article.mainCategory}
            subCategory={article.subCategory}
            title={article.title}
            viewCount={article.viewCount}
            createdAt={article.createdAt}
          />
          <ArticleTags tags={article.tags} />
          <SummaryBox summary={article.summary} />
          <AdBanner />
          <ArticleBody body={article.body} />
          <LikeButton newsId={article.id} />
        </main>
        <aside className="w-72 shrink-0 hidden lg:block sticky top-6">
          <Sidebar mainCategory={article.mainCategory} />
        </aside>
      </div>
    </div>
  )
}
