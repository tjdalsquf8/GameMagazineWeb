// 좋아요한 글 목록 훅 — 페이지네이션 포함
'use client'

import { useState, useEffect } from 'react'
import { fetchMyLikes } from '@/lib/api/my.api'
import type { MyLike, PaginatedResponse } from '@/types/my.types'

interface UseMyLikesReturn {
  data: PaginatedResponse<MyLike> | null
  isLoading: boolean
  error: string | null
  page: number
  setPage: (page: number) => void
}

/** 좋아요한 글 목록 조회 훅 */
export function useMyLikes(limit = 10): UseMyLikesReturn {
  const [data, setData] = useState<PaginatedResponse<MyLike> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetchMyLikes(page, limit)
        if (cancelled) return
        if (res.success) {
          setData(res.data)
        } else {
          setError(res.error.message)
        }
      } catch {
        if (!cancelled) setError('좋아요 목록을 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [page, limit])

  return { data, isLoading, error, page, setPage }
}
