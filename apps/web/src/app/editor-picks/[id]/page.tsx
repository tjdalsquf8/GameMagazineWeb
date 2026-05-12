// 에디터 픽 상세 페이지 — 뉴스 상세와 동일한 레이아웃, 에디터픽 데이터 사용
// SSR, revalidate: 3600
// LikeButton, NewsViewCounter, SummaryBox, ArticleTags, Sidebar 미사용 (에디터픽 전용 데이터 없음)

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArticleHeader } from '@/app/news/[id]/_components/ArticleHeader'
import { ArticleBody } from '@/app/news/[id]/_components/ArticleBody'
import type { EditorPickItem } from '@/lib/api/editor-picks.api'

// 동적 파라미터 허용 — 빌드 시 알 수 없는 id에도 접근 가능
export const dynamicParams = true

// ISR — 1시간마다 재검증
export const revalidate = 3600

interface PageProps {
  params: Promise<{ id: string }>
}

// 에디터 픽 단건 서버 사이드 fetch — 404 또는 오류 시 null 반환
async function fetchArticle(id: string): Promise<EditorPickItem | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
  const res = await fetch(`${baseUrl}/api/editor-picks/${id}`, { next: { revalidate: 3600 } })
  if (!res.ok) return null
  const json = await res.json()
  if (!json.success) return null
  return json.data as EditorPickItem
}

// 동적 메타데이터 생성 — 제목 기반 SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const article = await fetchArticle(id)

  if (!article) {
    return { title: '에디터 픽을 찾을 수 없습니다' }
  }

  return {
    title: article.title,
    description: `${article.mainCategory} · ${article.authorNickname}`,
  }
}

// 에디터 픽 상세 페이지 컴포넌트
export default async function EditorPickDetailPage({ params }: PageProps) {
  const { id } = await params
  const article = await fetchArticle(id)

  // 에디터 픽 없으면 404 처리
  if (!article) {
    notFound()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex gap-8 items-start">
        <main className="flex-1 min-w-0">
          <ArticleHeader
            mainCategory={article.mainCategory}
            subCategory=""
            title={article.title}
            viewCount={0}
            createdAt={article.createdAt}
          />
          <ArticleBody body={article.content} />
        </main>
      </div>
    </div>
  )
}
