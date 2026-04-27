// 내가 쓴 댓글 목록 훅 — 페이지네이션 포함
'use client'

import { useState, useEffect } from 'react'
import { fetchMyComments } from '@/lib/api/my.api'
import type { MyComment, PaginatedResponse } from '@/types/my.types'

interface UseMyCommentsReturn {
  data: PaginatedResponse<MyComment> | null
  isLoading: boolean
  error: string | null
  page: number
  setPage: (page: number) => void
}

/** 내가 쓴 댓글 목록 조회 훅 */
export function useMyComments(limit = 10): UseMyCommentsReturn {
  const [data, setData] = useState<PaginatedResponse<MyComment> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetchMyComments(page, limit)
        if (cancelled) return
        if (res.success) {
          setData(res.data)
        } else {
          setError(res.error.message)
        }
      } catch {
        if (!cancelled) setError('댓글을 불러오지 못했습니다.')
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
