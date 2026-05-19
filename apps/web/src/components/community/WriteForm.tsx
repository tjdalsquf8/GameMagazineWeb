'use client'

// WriteForm.tsx
// 커뮤니티 게시글 작성 폼 컴포넌트
// ContentEditor(리치텍스트)와 ImageUploadModal을 조합하여 이미지 포함 글 작성 지원
// 제출 전 sanitizeHTML로 XSS 방지 처리

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { COMMUNITY_CATEGORIES } from '@/constants/gamecategory'
import { createPost } from '@/lib/api/posts'
import { useAuth } from '@/hooks/useAuth'
import { useToastStore } from '@/store/toastStore'
import { sanitizeHTML } from '@/lib/utils/sanitize'
import ContentEditor, { type ContentEditorHandle } from '@/components/ui/ContentEditor'
import ImageUploadModal from '@/components/ui/ImageUploadModal'

// 최대 이미지 업로드 수
const MAX_IMAGE_COUNT = 5
// 본문 최대 길이 (HTML 포함, 백엔드 @MaxLength와 동일)
const MAX_CONTENT_LENGTH = 50000

export default function WriteForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, accessToken } = useAuth()
  const { showToast } = useToastStore()

  const [categoryId, setCategoryId] = useState<string>('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('') // HTML 문자열
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [uploadedImageCount, setUploadedImageCount] = useState(0)

  // ContentEditor 메서드(insertImages) 호출을 위한 ref
  const editorRef = useRef<ContentEditorHandle>(null)

  // 초기 마운트 시 비로그인이면 즉시 /login 으로 리다이렉트
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  // URL의 category 파라미터를 감지하여 카테고리 초기값 설정
  useEffect(() => {
    const categorySlug = searchParams.get('category')

    if (categorySlug && categorySlug !== 'all') {
      const targetCategory = COMMUNITY_CATEGORIES.flatMap((parent) => parent.children || []).find(
        (child) => child.slug === categorySlug
      )

      if (targetCategory) {
        setCategoryId(String(targetCategory.id))
      }
    }
  }, [searchParams])

  // content가 변경될 때 삽입된 이미지 수 동기화
  useEffect(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const imgCount = doc.querySelectorAll('img').length
    setUploadedImageCount(imgCount)
  }, [content])

  const isContentOverLimit = content.length > MAX_CONTENT_LENGTH
  // 카운터 표시용 — HTML 태그 제거한 실제 텍스트 길이 (브라우저가 남기는 <br> 등 제외)
  const visibleContentLength = content.replace(/<[^>]*>/g, '').trim().length
  const isSubmitEnabled =
    categoryId !== '' && title.trim() !== '' && !isSubmitting && !isContentOverLimit

  /** 게시글 등록 처리 — content를 sanitize 후 전송 */
  const handleSubmit = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (!accessToken) {
      showToast('로그인이 필요합니다', 'error')
      return
    }

    if (categoryId === '' || title.trim() === '') return

    setIsSubmitting(true)
    try {
      const sanitizedContent = sanitizeHTML(content)
      const post = await createPost(
        {
          title: title.trim(),
          content: sanitizedContent,
          categoryId: Number(categoryId),
        },
        accessToken
      )
      showToast('게시글이 등록되었습니다', 'success')
      router.push(`/community/${post.id}`)
    } catch (err) {
      showToast(err instanceof Error ? err.message : '게시글 등록에 실패했습니다', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  /** 이미지 업로드 완료 — 에디터 커서 위치에 이미지 삽입 */
  const handleImagesUploaded = (urls: string[]) => {
    editorRef.current?.insertImages(urls)
  }

  return (
    <div className="w-full max-w-[800px] mx-auto py-8 px-4">
      <h1 className="text-xl font-bold text-text-primary mb-6">게시글 작성</h1>

      <div className="flex flex-col gap-4">
        {/* 카테고리 선택 */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            카테고리
            <span className="text-red-400 ml-0.5">*</span>
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border border-border rounded px-3 py-2 text-sm bg-background text-text-primary focus:outline-none focus:border-primary transition-colors"
          >
            <option value="">카테고리를 선택해주세요</option>
            {COMMUNITY_CATEGORIES.map((parent) => (
              <optgroup key={parent.id} label={parent.name}>
                {parent.children?.map((child) => (
                  <option key={child.id} value={String(child.id)}>
                    {child.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

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
          <div className="flex justify-between mt-1">
            <span className={`text-xs ${isContentOverLimit ? 'text-red-400' : 'text-text-muted'}`}>
              {isContentOverLimit
                ? `본문이 너무 깁니다 (${visibleContentLength.toLocaleString()} / ${MAX_CONTENT_LENGTH.toLocaleString()})`
                : `${visibleContentLength.toLocaleString()} / ${MAX_CONTENT_LENGTH.toLocaleString()}`}
            </span>
            <span className="text-xs text-text-muted">
              이미지 {uploadedImageCount} / {MAX_IMAGE_COUNT}
            </span>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => router.push('/community')}
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
            {isSubmitting ? '등록 중...' : '등록'}
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
