'use client'

// NewsViewCounter.tsx
// 뉴스 조회수 증가 처리 컴포넌트 — localStorage 기반 하루 1회 제한
// StrictMode 이중 실행 방지를 위해 ref로 최초 1회만 실행

import { useEffect, useRef } from 'react'
import { apiClient } from '@/lib/api/client'

interface NewsViewCounterProps {
  newsId: string
}

// 조회수 증가 요청 — 실패해도 UX에 영향 없도록 무시
async function incrementNewsView(newsId: string): Promise<void> {
  await apiClient.post(`/api/news/${newsId}/view`).catch(() => {})
}

// 뉴스 상세 진입 시 조회수를 하루 1회만 증가시키는 컴포넌트
export function NewsViewCounter({ newsId }: NewsViewCounterProps) {
  const calledRef = useRef(false)

  useEffect(() => {
    if (calledRef.current) return
    calledRef.current = true

    const storageKey = `viewedNews:${newsId}`
    const today = new Date().toISOString().slice(0, 10) // 'YYYY-MM-DD'
    const lastViewed = localStorage.getItem(storageKey)

    if (lastViewed !== today) {
      localStorage.setItem(storageKey, today)
      incrementNewsView(newsId)
    }
  }, [newsId])

  return null
}
