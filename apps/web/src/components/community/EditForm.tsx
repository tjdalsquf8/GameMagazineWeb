'use client'

// EditForm.tsx
// 커뮤니티 게시글 수정 폼 컴포넌트
// ContentEditor(리치텍스트)와 ImageUploadModal을 조합하여 이미지 포함 글 수정 지원
// 제출 전 sanitizeHTML로 XSS 방지 처리

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getPost, updatePost } from '@/lib/api/posts'
import { useAuth } from '@/hooks/useAuth'
import { useToastStore } from '@/store/toastStore'
import { sanitizeHTML } from '@/lib/utils/sanitize'
import ContentEditor, { type ContentEditorHandle } from '@/components/ui/ContentEditor'
import ImageUploadModal from '@/components/ui/ImageUploadModal'

interface EditFormProps {
  postId: number
}

// 최대 이미지 업로드 수
const MAX_IMAGE_COUNT = 5

export default function EditForm({ postId }: EditFormProps) {
  const router = useRouter()
  const { user, accessToken, isAuthenticated } = useAuth()
  const { showToast } = useToastStore()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('') // HTML 문자열
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [uploadedImageCount, setUploadedImageCount] = useState(0)

  // ContentEditor 메서드(insertImages) 호출을 위한 ref
  const editorRef = useRef<ContentEditorHandle>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    let cancelled = false
    setIsLoading(true)

    getPost(postId)
      .then((post) => {
        if (cancelled) return
        // 본인 글이 아니면 상세 페이지로 redirect
        if (user && post.author.id !== user.id) {
          router.push(`/community/${postId}`)
          return
        }
        setTitle(post.title)
        setContent(post.content)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '게시글을 불러오는데 실패했습니다')
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [postId, isAuthenticated, user, router])

  // content가 변경될 때 삽입된 이미지 수 동기화
  useEffect(() => {
    if (typeof window === 'undefined') return
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const imgCount = doc.querySelectorAll('img').length
    setUploadedImageCount(imgCount)
  }, [content])

  const isSubmitEnabled = title.trim() !== '' && !isSubmitting

  /** 게시글 수정 처리 — content를 sanitize 후 전송 */
  const handleSubmit = async () => {
    if (!accessToken) return

    setIsSubmitting(true)
    try {
      const sanitizedContent = sanitizeHTML(content)
      await updatePost(postId, { title: title.trim(), content: sanitizedContent }, accessToken)
      showToast('게시글이 수정되었습니다', 'success')
      router.push(`/community/${postId}`)
    } catch (err) {
      showToast(err instanceof Error ? err.message : '수정에 실패했습니다', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  /** 이미지 업로드 완료 — 에디터 커서 위치에 이미지 삽입 */
  const handleImagesUploaded = (urls: string[]) => {
    editorRef.current?.insertImages(urls)
  }

  if (isLoading) {
    return <div className="py-12 text-center text-sm text-text-muted">불러오는 중...</div>
  }

  if (error) {
    return <div className="py-12 text-center text-sm text-red-500">{error}</div>
  }

  return (
    <div className="w-full max-w-[800px] mx-auto py-8 px-4">
      <h1 className="text-xl font-bold text-text-primary mb-6">게시글 수정</h1>

      <div className="flex flex-col gap-4">
        {/* 제목 */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            제목
            <span className="text-red-400 ml-0.5">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            placeholder="제목을 입력해주세요 (최대 100자)"
            className="w-full border border-border rounded px-3 py-2 text-sm bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
          <div className="flex justify-end mt-1">
            <span className="text-xs text-text-muted">{title.length} / 100</span>
          </div>
        </div>

        {/* 본문 — ContentEditor (리치텍스트) */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">본문</label>
          <ContentEditor
            ref={editorRef}
            value={content}
            onChange={setContent}
            onImageButtonClick={() => setIsImageModalOpen(true)}
            placeholder="내용을 입력해주세요"
          />
          <div className="flex justify-end mt-1">
            <span className="text-xs text-text-muted">
              이미지 {uploadedImageCount} / {MAX_IMAGE_COUNT}
            </span>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => router.push(`/community/${postId}`)}
            className="px-5 py-2 text-sm border border-border rounded hover:bg-surface transition-colors duration-150 text-text-secondary"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isSubmitEnabled}
            className={[
              'px-5 py-2 text-sm rounded transition-colors duration-150',
              isSubmitEnabled
                ? 'bg-primary text-primary-foreground hover:bg-primary-hover'
                : 'bg-surface text-text-muted cursor-not-allowed',
            ].join(' ')}
          >
            {isSubmitting ? '수정 중...' : '수정'}
          </button>
        </div>
      </div>

      {/* 이미지 업로드 모달 */}
      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onUpload={handleImagesUploaded}
        currentCount={uploadedImageCount}
        maxCount={MAX_IMAGE_COUNT}
      />
    </div>
  )
}
