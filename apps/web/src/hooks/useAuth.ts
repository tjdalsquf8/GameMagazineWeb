'use client'

import { useAuthStore } from '@/store/authStore'
import { apiClient } from '@/lib/api/client'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const { user, accessToken, isAuthenticated, setAuth, clearAuth } = useAuthStore()
  const router = useRouter()

  const logout = async () => {
    try {
      await apiClient.post('/api/auth/logout', undefined, {
        token: accessToken ?? undefined,
      })
    } catch {
      // 서버 에러가 발생해도 클라이언트 상태는 초기화
    } finally {
      clearAuth()
      router.push('/login')
    }
  }

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading: false,
    logout,
  }
}
