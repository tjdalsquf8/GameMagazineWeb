// 뉴스 상세 페이지 좋아요(추천) 버튼 컴포넌트
// - 마운트 시 GET /news/:id/recommend 로 초기 상태(liked, count) 로드
// - 클릭 시 POST /news/:id/recommend 호출 (낙관적 업데이트 적용)
// - 미로그인 상태에서 클릭 시 토스트 알림 표시

'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { apiClient } from '@/lib/api/client'
import { useAuthStore } from '@/store/authStore'
import { useToastStore } from '@/store/toastStore'

interface LikeButtonProps {
  newsId: string
}

interface RecommendData {
  liked: boolean
  count: number
}

// 좋아요 상태 초기 로드 — GET /news/:id/recommend
async function fetchRecommendState(newsId: string): Promise<RecommendData> {
  const res = await apiClient.get<RecommendData>(`/api/news/${newsId}/recommend`)
  if (!res.success) return { liked: false, count: 0 }
  return res.data
}

// 좋아요 토글 요청 — POST /news/:id/recommend
async function postToggleRecommend(newsId: string): Promise<RecommendData> {
  const res = await apiClient.post<RecommendData>(`/api/news/${newsId}/recommend`)
  if (!res.success) throw new Error('추천 요청 실패')
  return res.data
}

export function LikeButton({ newsId }: LikeButtonProps) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const { isAuthenticated } = useAuthStore()
  const { showToast } = useToastStore()

  // 컴포넌트 마운트 시 초기 좋아요 상태 조회
  useEffect(() => {
    fetchRecommendState(newsId)
      .then((data) => {
        setLiked(data.liked)
        setCount(data.count)
      })
      .catch(() => {
        // 초기 조회 실패 시 기본값 유지
      })
  }, [newsId])

  // 좋아요 버튼 클릭 핸들러 — 낙관적 업데이트 후 실패 시 롤백
  async function handleClick() {
    if (!isAuthenticated) {
      showToast('로그인이 필요합니다', 'info')
      return
    }

    if (isLoading) return

    // 낙관적 업데이트
    const prevLiked = liked
    const prevCount = count
    setLiked(!liked)
    setCount(liked ? count - 1 : count + 1)
    setIsLoading(true)

    try {
      const data = await postToggleRecommend(newsId)
      // 서버 응답값으로 최종 동기화
      setLiked(data.liked)
      setCount(data.count)
    } catch {
      // 실패 시 롤백
      setLiked(prevLiked)
      setCount(prevCount)
      showToast('추천 처리 중 오류가 발생했습니다', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center mt-10 mb-4">
      <button
        onClick={handleClick}
        disabled={isLoading}
        aria-label={liked ? '추천 취소' : '추천하기'}
        aria-pressed={liked}
        className={[
          'flex items-center gap-2 py-2 px-6 rounded-full border transition-colors duration-150',
          'text-sm font-medium select-none',
          liked
            ? 'border-red-400 text-red-500 bg-red-50 dark:bg-red-950 dark:border-red-700 dark:text-red-400'
            : 'border-gray-300 text-gray-400 bg-white dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-400 hover:border-red-300 hover:text-red-400 dark:hover:border-red-700 dark:hover:text-red-400',
          isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
        ].join(' ')}
      >
        <Heart
          size={18}
          className={liked ? 'fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400' : ''}
          aria-hidden="true"
        />
        <span>{count}</span>
      </button>
    </div>
  )
}
