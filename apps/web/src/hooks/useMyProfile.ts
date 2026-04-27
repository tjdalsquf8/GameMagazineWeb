// 내 프로필 데이터 훅 — /users/me 조회 및 캐싱
'use client'

import { useState, useEffect } from 'react'
import { fetchMyProfile } from '@/lib/api/my.api'
import type { MyProfile } from '@/types/my.types'

interface UseMyProfileReturn {
  profile: MyProfile | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

/** 내 프로필 조회 훅 */
export function useMyProfile(): UseMyProfileReturn {
  const [profile, setProfile] = useState<MyProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [trigger, setTrigger] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetchMyProfile()
        if (cancelled) return
        if (res.success) {
          setProfile(res.data)
        } else {
          setError(res.error.message)
        }
      } catch {
        if (!cancelled) setError('프로필을 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [trigger])

  /** 수동 재조회 트리거 */
  const refetch = () => setTrigger((n) => n + 1)

  return { profile, isLoading, error, refetch }
}
