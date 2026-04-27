'use client'

// useAuth 훅 — 인증 상태 및 로그아웃 로직 제공
// zustand persist hydration 완료 전까지 isLoading: true를 반환하여
// 새로고침 시 hydration 전 isAuthenticated=false로 인한 오판 리다이렉트를 방지

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { apiClient } from '@/lib/api/client'
import { clearAccessTokenCookie } from '@/lib/api/auth'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const { user, accessToken, isAuthenticated, clearAuth } = useAuthStore()
  const router = useRouter()

  // hydration 완료 여부 추적 — 초기값 false, 마운트 후 true로 전환
  // zustand persist는 localStorage에서 클라이언트 마운트 시점에 복원되므로
  // useEffect 실행 전까지는 store 값을 신뢰할 수 없음
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // useEffect는 클라이언트 마운트 이후에만 실행되므로
    // 이 시점에 zustand persist 복원이 완료된 상태
    setIsHydrated(true)
  }, [])

  /** 로그아웃 — 서버 세션 종료 + 클라이언트 상태 초기화 + 쿠키 삭제 */
  const logout = async () => {
    try {
      await apiClient.post('/api/auth/logout', undefined, {
        token: accessToken ?? undefined,
      })
    } catch {
      // 서버 에러가 발생해도 클라이언트 상태는 초기화
    } finally {
      clearAccessTokenCookie()
      clearAuth()
      router.push('/login')
    }
  }

  return {
    user,
    accessToken,
    isAuthenticated,
    // hydration 완료 전에는 로딩 중으로 표시 — 불필요한 리다이렉트 방지
    isLoading: !isHydrated,
    logout,
  }
}
