// API 클라이언트 — 모든 HTTP 요청의 단일 진입점. 401 인터셉터 + refresh 자동 재발급 포함.
import type { ApiResponse } from '@/types'
import { useAuthStore } from '@/store/authStore'
import { useToastStore } from '@/store/toastStore'
import { env } from '@/lib/env'

const BASE_URL = env.apiUrl

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
  headers?: Record<string, string>
  token?: string
}

// refresh 토큰으로 새 accessToken 발급 — apiClient를 거치지 않아 순환 호출 방지
async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
    if (!res.ok) return null
    const json = (await res.json()) as ApiResponse<{ accessToken: string }>
    if (!json.success) return null
    return json.data.accessToken ?? null
  } catch {
    return null
  }
}

// 인증 만료 처리 — 토스트 + 스토어 초기화 + 로그인 페이지 이동
function handleAuthExpired(): void {
  useToastStore.getState().showToast('로그인이 만료되었습니다. 다시 로그인해주세요.', 'error')
  useAuthStore.getState().clearAuth()
  window.location.href = '/login'
}

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  const buildHeaders = (token: string | null): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options?.headers,
    }
    if (token) headers['Authorization'] = `Bearer ${token}`
    return headers
  }

  const serializedBody = body !== undefined ? JSON.stringify(body) : undefined

  // 명시적 token 우선, 없으면 authStore에서 자동으로 읽음
  const token = options?.token ?? useAuthStore.getState().accessToken

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: buildHeaders(token),
    credentials: 'include', // HttpOnly 쿠키 전송을 위해 필요
    body: serializedBody,
  })

  // 401 인터셉터 — refresh 시도 후 재요청, 실패 시 로그아웃
  if (res.status === 401) {
    // 인증 관련 엔드포인트(로그인/refresh)는 401을 그대로 반환 — 세션 만료 처리 불필요
    const AUTH_PASSTHROUGH_PATHS = ['/api/auth/refresh', '/api/auth/login']
    if (AUTH_PASSTHROUGH_PATHS.includes(path)) {
      const json = await res.json()
      return json as ApiResponse<T>
    }

    const newToken = await refreshAccessToken()

    if (!newToken) {
      handleAuthExpired()
      throw new Error('UNAUTHORIZED')
    }

    // 새 accessToken을 스토어에 저장 (쿠키는 서버가 HttpOnly로 자동 설정)
    useAuthStore.setState({ accessToken: newToken })

    // 원래 요청 재시도
    const retryRes = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: buildHeaders(newToken),
      credentials: 'include',
      body: serializedBody,
    })

    const retryJson = await retryRes.json()
    return retryJson as ApiResponse<T>
  }

  // 403 인터셉터 — 정지 계정: 메시지 표시 후 로그아웃
  if (res.status === 403) {
    const json = (await res.json()) as ApiResponse<T>
    const message =
      !json.success && json.error?.message ? json.error.message : '계정이 정지되었습니다'
    useToastStore.getState().showToast(message, 'error')
    useAuthStore.getState().clearAuth()
    window.location.href = '/login'
    throw new Error('FORBIDDEN')
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

  delete: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('DELETE', path, body, options),
}
