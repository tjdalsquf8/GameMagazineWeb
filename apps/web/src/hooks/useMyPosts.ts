// 내 게시글 목록 훅 — 페이지네이션 포함
'use client'

import { useState, useEffect } from 'react'
import { fetchMyPosts } from '@/lib/api/my.api'
import type { MyPost, PaginatedResponse } from '@/types/my.types'

interface UseMyPostsReturn {
  data: PaginatedResponse<MyPost> | null
  isLoading: boolean
  error: string | null
  page: number
  setPage: (page: number) => void
}

/** 내 게시글 목록 조회 훅 */
export function useMyPosts(limit = 10): UseMyPostsReturn {
  const [data, setData] = useState<PaginatedResponse<MyPost> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetchMyPosts(page, limit)
        if (cancelled) return
        if (res.success) {
          setData(res.data)
        } else {
          setError(res.error.message)
        }
      } catch {
        if (!cancelled) setError('게시글을 불러오지 못했습니다.')
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
