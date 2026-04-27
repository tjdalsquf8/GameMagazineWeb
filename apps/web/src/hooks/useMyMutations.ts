// 마이페이지 뮤테이션 훅 — 닉네임 변경, 비밀번호 변경, 알림 설정, 회원 탈퇴
'use client'

import { useState } from 'react'
import {
  updateNickname,
  updatePassword,
  updateNotificationSettings,
  deleteAccount,
} from '@/lib/api/my.api'
import { useToastStore } from '@/store/toastStore'
import type { NotificationSettings } from '@/types/my.types'

/** 닉네임 변경 뮤테이션 */
export function useUpdateNickname(onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false)
  const showToast = useToastStore((s) => s.showToast)

  /** 닉네임 변경 요청 실행 */
  const mutate = async (nickname: string) => {
    setIsLoading(true)
    try {
      const res = await updateNickname(nickname)
      if (res.success) {
        showToast('닉네임이 변경되었습니다.', 'success')
        onSuccess?.()
      } else {
        showToast(res.error.message, 'error')
      }
    } catch {
      showToast('닉네임 변경에 실패했습니다.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return { mutate, isLoading }
}

/** 비밀번호 변경 뮤테이션 */
export function useUpdatePassword(onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false)
  const showToast = useToastStore((s) => s.showToast)

  /** 비밀번호 변경 요청 실행 */
  const mutate = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true)
    try {
      const res = await updatePassword(currentPassword, newPassword)
      if (res.success) {
        showToast('비밀번호가 변경되었습니다.', 'success')
        onSuccess?.()
      } else {
        showToast(res.error.message, 'error')
      }
    } catch {
      showToast('비밀번호 변경에 실패했습니다.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return { mutate, isLoading }
}

/** 알림 설정 변경 뮤테이션 — 낙관적 업데이트 지원 */
export function useUpdateNotifications() {
  const [isLoading, setIsLoading] = useState(false)
  const showToast = useToastStore((s) => s.showToast)

  /** 알림 설정 변경 요청 실행 */
  const mutate = async (
    settings: Partial<NotificationSettings>,
    onOptimisticRollback?: () => void
  ): Promise<boolean> => {
    setIsLoading(true)
    try {
      const res = await updateNotificationSettings(settings)
      if (res.success) {
        return true
      } else {
        showToast(res.error.message, 'error')
        onOptimisticRollback?.()
        return false
      }
    } catch {
      showToast('알림 설정 변경에 실패했습니다.', 'error')
      onOptimisticRollback?.()
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { mutate, isLoading }
}

/** 회원 탈퇴 뮤테이션 */
export function useDeleteAccount(onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false)
  const showToast = useToastStore((s) => s.showToast)

  /** 회원 탈퇴 요청 실행 */
  const mutate = async () => {
    setIsLoading(true)
    try {
      const res = await deleteAccount()
      if (res.success) {
        showToast('탈퇴가 완료되었습니다.', 'success')
        onSuccess?.()
      } else {
        showToast(res.error.message, 'error')
      }
    } catch {
      showToast('탈퇴 처리에 실패했습니다.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return { mutate, isLoading }
}
