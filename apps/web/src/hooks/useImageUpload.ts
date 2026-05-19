'use client'

// 이미지 R2 업로드 훅 — presigned URL 방식
// presigned URL 발급 후 XMLHttpRequest로 R2에 직접 PUT 업로드하여 진행률 추적

import { useState } from 'react'
import { apiClient } from '@/lib/api/client'

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

interface PresignedUrlResult {
  uploadUrl: string
  publicUrl: string
}

// 업로드 대상 폴더 타입
export type UploadFolder =
  | 'posts'
  | 'profiles'
  | 'editornews'
  | 'news/pc'
  | 'news/mobile'
  | 'news/console'
  | 'news/esports'

// 이미지 업로드 훅 반환 타입
interface UseImageUploadReturn {
  upload: (file: File, onProgress?: (p: number) => void, folder?: UploadFolder) => Promise<string>
  validate: (file: File) => string | null
  isLoading: boolean
  progress: number
}

// presigned URL 방식으로 단일 파일을 R2에 업로드하고 publicUrl 반환
export function useImageUpload(): UseImageUploadReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  // 파일 유효성 검사 — MIME 타입 및 용량 체크
  const validate = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type))
      return '허용되지 않는 파일 형식입니다. (PNG, JPG, WEBP만 가능)'
    if (file.size > MAX_SIZE) return '파일 크기가 10MB를 초과합니다.'
    return null
  }

  // presigned URL 발급 후 R2에 직접 PUT 업로드, publicUrl 반환
  const upload = async (
    file: File,
    onProgress?: (p: number) => void,
    folder?: UploadFolder
  ): Promise<string> => {
    setIsLoading(true)
    setProgress(0)
    try {
      const res = await apiClient.post<PresignedUrlResult>('/api/uploads/presigned-url', {
        contentType: file.type,
        fileSize: file.size,
        ...(folder && { folder }),
      })

      // ApiResponse 래퍼 처리 — success: true 확인 후 data 추출
      if (!res.success) {
        throw new Error('presigned URL 발급에 실패했습니다')
      }
      const { uploadUrl, publicUrl } = res.data

      // XMLHttpRequest로 R2에 직접 PUT 업로드 — fetch는 진행률 추적 불가
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('PUT', uploadUrl)
        xhr.setRequestHeader('Content-Type', file.type)

        // 업로드 진행률 콜백
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const p = Math.round((e.loaded / e.total) * 100)
            setProgress(p)
            onProgress?.(p)
          }
        }

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve()
          } else {
            reject(new Error('Upload failed'))
          }
        }

        xhr.onerror = () => reject(new Error('Network error'))
        xhr.send(file)
      })

      // R2 업로드 완료 후 Magic Number 검증 요청
      const verifyRes = await apiClient.post<{ verified: boolean }>('/api/uploads/verify', {
        publicUrl,
      })
      if (!verifyRes.success) {
        throw new Error('유효하지 않은 이미지 파일입니다.')
      }

      return publicUrl
    } finally {
      setIsLoading(false)
    }
  }

  return { upload, validate, isLoading, progress }
}
