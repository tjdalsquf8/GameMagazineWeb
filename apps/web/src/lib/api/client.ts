// API 클라이언트 — 모든 HTTP 요청의 단일 진입점. 401 인터셉터 포함.
import type { ApiResponse } from '@/types'
import { useAuthStore } from '@/store/authStore'
import { useToastStore } from '@/store/toastStore'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
  headers?: Record<string, string>
  token?: string
}

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options?.headers,
  }

  // 명시적 token 우선, 없으면 authStore에서 자동으로 읽음
  const token = options?.token ?? useAuthStore.getState().accessToken
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: 'include', // HttpOnly 쿠키 전송을 위해 필요
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  // 401 인터셉터 — 인증 만료 시 토스트 알림 후 로그인 페이지로 redirect
  if (res.status === 401) {
    useToastStore.getState().showToast('로그인이 만료되었습니다. 다시 로그인해주세요.', 'error')
    useAuthStore.getState().clearAuth()
    window.location.href = '/login'
    throw new Error('UNAUTHORIZED')
  }

  const json = await res.json()
  return json as ApiResponse<T>
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, undefined, options),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', path, body, options),

  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PUT', path, body, options),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PATCH', path, body, options),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>('DELETE', path, undefined, options),
}
