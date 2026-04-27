// 최근 읽은 뉴스 목록 훅
'use client'

import { useState, useEffect } from 'react'
import { fetchNewsHistory } from '@/lib/api/my.api'
import type { NewsHistory, PaginatedResponse } from '@/types/my.types'

interface UseNewsHistoryReturn {
  data: PaginatedResponse<NewsHistory> | null
  isLoading: boolean
  error: string | null
}

/** 최근 읽은 뉴스 목록 조회 훅 */
export function useNewsHistory(limit = 4): UseNewsHistoryReturn {
  const [data, setData] = useState<PaginatedResponse<NewsHistory> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetchNewsHistory(1, limit)
        if (cancelled) return
        if (res.success) {
          setData(res.data)
        } else {
          setError(res.error.message)
        }
      } catch {
        if (!cancelled) setError('최근 뉴스 기록을 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [limit])

  return { data, isLoading, error }
}
