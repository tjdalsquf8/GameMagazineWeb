'use client'

// PostDetail.tsx
// 게시글 상세 내용을 렌더링하는 컴포넌트.
// 상세 진입 시 조회수 증가 API를 최초 1회만 호출하여 StrictMode 2중 증가를 방지한다.
// 게시글 추천 버튼 — Optimistic Update 적용, 실패 시 롤백

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getPost, deletePost, incrementPostView, togglePostRecommend } from '@/lib/api/posts'
import { useAuth } from '@/hooks/useAuth'
import { useToastStore } from '@/store/toastStore'
import { COMMUNITY_CATEGORIES } from '@/constants/gamecategory'
import RecommendButton from '@/components/community/RecommendButton'
import { sanitizeHTML } from '@/lib/utils/sanitize'
import type { Post } from '@/types/community'

interface PostDetailProps {
  postId: number
}

/** ISO 날짜 문자열을 'YYYY.MM.DD HH:mm' 형식으로 변환 */
function formatFullDate(isoString: string): string {
  const date = new Date(isoString)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

export default function PostDetail({ postId }: PostDetailProps) {
  const router = useRouter()
  const { user, accessToken } = useAuth()
  const { showToast } = useToastStore()

  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // 추천 상태 — Optimistic Update를 위한 독립 state
  const [recommended, setRecommended] = useState(false)
  const [recommendCount, setRecommendCount] = useState(0)
  const [isRecommending, setIsRecommending] = useState(false)

  // StrictMode에서 useEffect가 두 번 실행되더라도 조회수를 최초 1회만 증가시키기 위한 ref
  const viewedRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    getPost(postId)
      .then((data) => {
        if (!cancelled) {
          setPost(data)
          setRecommended(data.isRecommended ?? false)
          setRecommendCount(data.recommendCount ?? 0)
          // 조회수 증가 — 하루 1회 제한 (localStorage 기반)
          // TODO: 추후 Redis TTL 방식으로 교체 예정
          //       key: "view:{postId}:{userId or IP}", TTL: 24h
          if (!viewedRef.current) {
            viewedRef.current = true
            const storageKey = `viewedPost:${postId}`
            const today = new Date().toISOString().slice(0, 10) // 'YYYY-MM-DD'
            const lastViewed = localStorage.getItem(storageKey)
            if (lastViewed !== today) {
              localStorage.setItem(storageKey, today)
              incrementPostView(postId).catch(() => {}) // 실패해도 UX에 영향 없도록 무시
            }
          }
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '게시글을 불러오는데 실패했습니다')
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [postId])

  // --- Breadcrumb를 위한 카테고리 매칭 로직 ---
  // 1. 현재 게시글의 소분류 데이터 찾기
  const currentSubCategory = post
    ? COMMUNITY_CATEGORIES.flatMap((parent) => parent.children || []).find(
        (child) => child.id === post.category.id
      )
    : null

  // 2. 해당 소분류를 가진 대분류(부모) 찾기
  const parentCategory =
    post && currentSubCategory
      ? COMMUNITY_CATEGORIES.find((parent) =>
          parent.children?.some((child) => child.id === currentSubCategory.id)
        )
      : null
  // ---------------------------------------

  const isOwnPost = user !== null && post !== null && post.author !== null && user.id === post.author.id

  /** 게시글 삭제 처리 */
  const handleDelete = async () => {
    if (!accessToken) return
    if (!window.confirm('게시글을 삭제하시겠습니까?')) return

    setIsDeleting(true)
    try {
      await deletePost(postId, accessToken)
      showToast('게시글이 삭제되었습니다', 'success')
      router.push('/community')
    } catch (err) {
      showToast(err instanceof Error ? err.message : '삭제에 실패했습니다', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  /** 게시글 추천 토글 — Optimistic Update 적용, 실패 시 이전 상태로 롤백 */
  const handleRecommend = async () => {
    if (!accessToken) {
      showToast('추천은 로그인 후 이용할 수 있습니다', 'info')
      return
    }
    if (isRecommending) return

    // Optimistic Update: 클릭 즉시 UI 반영
    const prevRecommended = recommended
    const prevCount = recommendCount
    setRecommended(!recommended)
    setRecommendCount(recommended ? recommendCount - 1 : recommendCount + 1)
    setIsRecommending(true)

    try {
      const result = await togglePostRecommend(postId, accessToken)
      // 서버 응답값으로 최종 동기화
      setRecommended(result.recommended)
      setRecommendCount(result.recommendCount)
    } catch {
      // API 실패 시 롤백
      setRecommended(prevRecommended)
      setRecommendCount(prevCount)
      showToast('추천 처리에 실패했습니다', 'error')
    } finally {
      setIsRecommending(false)
    }
  }

  if (isLoading) {
    return <div className="py-12 text-center text-sm text-text-muted">불러오는 중...</div>
  }

  if (error || !post) {
    return (
      <div className="py-12 text-center text-sm text-red-500">
        {error ?? '게시글을 찾을 수 없습니다'}
      </div>
    )
  }

  return (
    <article>
      {/* Breadcrumb: 커뮤니티 > 대분류 > 소분류 */}
      <nav className="flex items-center gap-1 text-xs sm:text-sm text-text-muted mb-4 overflow-x-auto whitespace-nowrap">
        <Link href="/community" className="hover:text-text-secondary transition-colors">
          커뮤니티
        </Link>

        {parentCategory && (
          <>
            <span className="text-gray-400">/</span>
            <Link
              href={`/community?category=${parentCategory.slug}`}
              className="hover:text-text-secondary transition-colors"
            >
              {parentCategory.name}
            </Link>
          </>
        )}

        <span className="text-gray-400">/</span>
        <Link
          href={`/community?category=${currentSubCategory?.slug || post.category.id}`}
          className="font-medium text-text-secondary"
        >
          {post.category.name}
        </Link>
      </nav>

      <h1 className="text-2xl font-bold text-text-primary leading-tight mb-3">{post.title}</h1>

      <div className="flex items-center gap-3 text-sm text-text-muted mb-4">
        <span className="text-text-secondary font-medium">{post.author?.nickname ?? '(탈퇴한 회원)'}</span>
        <span>{formatFullDate(post.createdAt)}</span>
        <span>조회 {post.viewCount.toLocaleString()}</span>
      </div>

      <hr className="border-border mb-6" />

      {/* HTML 콘텐츠 렌더링 — DOMPurify로 sanitize 후 삽입하여 XSS 방지 */}
      <div
        className="min-h-[300px] text-base text-text-secondary leading-[1.8] mb-6 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded [&_img]:my-2"
        dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content) }}
      />

      {/* 추천 버튼 — 본문 하단 중앙 배치 */}
      <div className="flex justify-center mb-6">
        <RecommendButton
          recommended={recommended}
          recommendCount={recommendCount}
          onRecommend={handleRecommend}
          isLoading={isRecommending}
          size="lg"
        />
      </div>

      <hr className="border-border mb-4" />

      <div className="flex items-center justify-between">
        <Link
          href="/community"
          className="px-4 py-2 text-sm border border-border rounded hover:bg-surface transition-colors duration-150 text-text-secondary"
        >
          목록으로
        </Link>
        {isOwnPost && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => router.push(`/community/${postId}/edit`)}
              className="px-4 py-2 text-sm border border-border rounded hover:bg-surface transition-colors duration-150 text-text-secondary"
            >
              수정
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 text-sm border border-red-200 rounded hover:bg-red-50 transition-colors duration-150 text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
