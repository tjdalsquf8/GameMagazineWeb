import { apiClient } from './client'

export interface User {
  id: string
  email: string
  nickname: string
  role: string
  provider: string
  profileImage: string | null
  createdAt: string
  updatedAt: string
}

export async function sendVerificationCode(email: string) {
  return apiClient.post<{ message: string }>('/api/auth/email/send-code', { email })
}

export async function verifyCode(email: string, code: string) {
  return apiClient.post<{ verified: boolean }>('/api/auth/email/verify-code', { email, code })
}

export async function register(email: string, nickname: string, password: string) {
  return apiClient.post<{ user: User }>('/api/auth/register', { email, nickname, password })
}

export async function login(email: string, password: string, rememberMe = false) {
  return apiClient.post<{ user: User; accessToken: string }>('/api/auth/login', {
    email,
    password,
    rememberMe,
  })
}

export async function forgotPassword(name: string, email: string) {
  return apiClient.post<{ message: string }>('/api/auth/forgot-password', { name, email })
}

export async function verifyResetToken(email: string, token: string) {
  return apiClient.post<{ resetToken: string }>('/api/auth/verify-reset-token', { email, token })
}

export async function resetPassword(resetToken: string, newPassword: string) {
  return apiClient.post<{ message: string }>('/api/auth/reset-password', {
    resetToken,
    newPassword,
  })
}

export function setAccessTokenCookie(token: string): void {
  document.cookie = `accessToken=${token}; path=/; max-age=86400` // 1일
}

export function clearAccessTokenCookie(): void {
  document.cookie = 'accessToken=; path=/; max-age=0'
}
