'use client'

// Google OAuth 콜백 페이지 — 백엔드 redirect 후 /auth/me 호출로 authStore 세팅
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { env } from '@/lib/env'
import type { User } from '@/lib/api/auth'

export default function GoogleCallbackPage() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)

  useEffect(() => {
    // 쿠키에 세팅된 accessToken으로 유저 정보 조회
    async function fetchMe() {
      try {
        const res = await fetch(`${env.apiUrl}/api/auth/me`, {
          method: 'GET',
          credentials: 'include',
        })
        if (!res.ok) {
          router.replace('/login?error=oauth')
          return
        }
        const json = (await res.json()) as { success: boolean; data: User & { accessToken?: string } }
        if (!json.success) {
          router.replace('/login?error=oauth')
          return
        }

        // refresh로 accessToken 발급 후 authStore 세팅
        const refreshRes = await fetch(`${env.apiUrl}/api/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        })
        const refreshJson = (await refreshRes.json()) as { success: boolean; data: { accessToken: string } }
        if (!refreshJson.success) {
          router.replace('/login?error=oauth')
          return
        }

        setAuth(json.data, refreshJson.data.accessToken)
        router.replace('/')
      } catch {
        router.replace('/login?error=oauth')
      }
    }

    fetchMe()
  }, [router, setAuth])

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <p className='text-gray-400'>로그인 처리 중...</p>
    </div>
  )
}
