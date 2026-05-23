'use client'

// NewsViewCounter.tsx
// 뉴스 조회수 증가 처리 컴포넌트 — localStorage 기반 하루 1회 제한
// StrictMode 이중 실행 방지를 위해 ref로 최초 1회만 실행
// 증가 성공 후 router.refresh()로 서버 컴포넌트 재렌더링해 최신 조회수 반영

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api/client'

interface NewsViewCounterProps {
  newsId: string
}

// 뉴스 상세 진입 시 조회수를 하루 1회만 증가시키는 컴포넌트
export function NewsViewCounter({ newsId }: NewsViewCounterProps) {
  const calledRef = useRef(false)
  const router = useRouter()

  useEffect(() => {
    if (calledRef.current) return
    calledRef.current = true

    const storageKey = `viewedNews:${newsId}`
    const today = new Date().toISOString().slice(0, 10) // 'YYYY-MM-DD'
    const lastViewed = localStorage.getItem(storageKey)

    if (lastViewed !== today) {
      localStorage.setItem(storageKey, today)
      apiClient
        .post(`/api/news/${newsId}/view`)
        .then(() => router.refresh())
        .catch(() => {})
    }
  }, [newsId, router])

  return null
}
