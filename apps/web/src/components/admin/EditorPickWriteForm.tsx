'use client'

// 에디터 픽 작성 폼 컴포넌트
// 어드민 전용 — 카테고리 / 제목 / 썸네일 / 본문을 입력하고 POST /api/editor-picks 호출
// WriteForm.tsx 패턴을 참고하여 ContentEditor + ImageUploadModal 조합으로 구성

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { useToastStore } from '@/store/toastStore'
import { sanitizeHTML } from '@/lib/utils/sanitize'
import { createEditorPick } from '@/lib/api/editor-picks.api'
import ContentEditor, { type ContentEditorHandle } from '@/components/ui/ContentEditor'
import ImageUploadModal from '@/components/ui/ImageUploadModal'

// 에디터 픽 카테고리 옵션
const EDITOR_PICK_CATEGORIES = ['PC', 'Mobile', 'Console', 'Esports', '기타'] as const

// 본문 이미지 최대 수
const MAX_CONTENT_IMAGE_COUNT = 5

interface EditorPickWriteFormProps {
  /** 제출 성공 후 호출되는 콜백 — 목록 화면으로 복귀 등에 사용 */
  onSuccess?: () => void
}

/** 에디터 픽 작성 폼 — 어드민 패널에서 에디터 픽 뉴스를 등록하는 폼 */
export default function EditorPickWriteForm({ onSuccess }: EditorPickWriteFormProps) {
  const { accessToken } = useAuth()
  const { showToast } = useToastStore()

  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 썸네일 업로드 모달 상태
  const [isThumbnailModalOpen, setIsThumbnailModalOpen] = useState(false)
  // 본문 이미지 업로드 모달 상태
  const [isContentImageModalOpen, setIsContentImageModalOpen] = useState(false)
  // 본문 이미지 삽입 수 추적
  const [contentImageCount, setContentImageCount] = useState(0)

  // ContentEditor ref — insertImages 호출에 사용
  const editorRef = useRef<ContentEditorHandle>(null)

  // content 변경 시 삽입된 이미지 수 동기화
  useEffect(() => {
    if (typeof window === 'undefined') return
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    setContentImageCount(doc.querySelectorAll('img').length)
  }, [content])

  // 필수 필드 충족 여부 — 카테고리 + 제목 + 썸네일 모두 있어야 제출 가능
  const isSubmitEnabled =
    category !== '' && title.trim() !== '' && thumbnailUrl !== '' && !isSubmitting

  /** 폼 전체 초기화 */
  const handleReset = () => {
    setCategory('')
    setTitle('')
    setThumbnailUrl('')
    setContent('')
    setContentImageCount(0)
  }

  /** 썸네일 업로드 완료 — ImageUploadModal onUpload 콜백 */
  const handleThumbnailUploaded = (urls: string[]) => {
    if (urls.length > 0) {
      setThumbnailUrl(urls[0])
    }
  }

  /** 본문 이미지 업로드 완료 — 에디터 커서 위치에 삽입 */
  const handleContentImagesUploaded = (urls: string[]) => {
    editorRef.current?.insertImages(urls)
  }

  /** 에디터 픽 등록 제출 */
  const handleSubmit = async () => {
    if (!accessToken) {
      showToast('로그인이 필요합니다', 'error')
      return
    }

    if (category === '' || title.trim() === '' || thumbnailUrl === '') return

    setIsSubmitting(true)
    try {
      const sanitizedContent = sanitizeHTML(content)
      await createEditorPick(
        {
          title: title.trim(),
          content: sanitizedContent,
          mainCategory: category,
          thumbnailUrl,
        },
        accessToken
      )
      showToast('에디터 픽이 등록되었습니다', 'success')
      handleReset()
      onSuccess?.()
    } catch (err) {
      showToast(err instanceof Error ? err.message : '에디터 픽 등록에 실패했습니다', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-[800px] mx-auto">
      <h1 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">에디터 픽 작성</h1>

      <div className="flex flex-col gap-5">
        {/* 카테고리 선택 */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
            카테고리
            <span className="text-red-400 ml-0.5">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-[var(--color-border)] rounded px-3 py-2 text-sm bg-[var(--color-background,#fff)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors dark:bg-gray-900"
          >
            <option value="">카테고리를 선택해주세요</option>
            {EDITOR_PICK_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* 제목 입력 */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
            제목
            <span className="text-red-400 ml-0.5">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            placeholder="제목을 입력해주세요 (최대 100자)"
            className="w-full border border-[var(--color-border)] rounded px-3 py-2 text-sm bg-[var(--color-background,#fff)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors dark:bg-gray-900"
          />
          <div className="flex justify-end mt-1">
            <span className="text-xs text-[var(--color-text-muted)]">{title.length} / 100</span>
          </div>
        </div>

        {/* 썸네일 이미지 업로드 */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
            썸네일 이미지
            <span className="text-red-400 ml-0.5">*</span>
          </label>

          {thumbnailUrl ? (
            // 업로드 완료 — 미리보기 + 재업로드 버튼
            <div className="flex flex-col gap-2">
              {/* 16:9 비율 고정 컨테이너로 미리보기 비율 깨짐 방지 */}
              <div className="relative w-full aspect-video overflow-hidden rounded border border-[var(--color-border)] bg-[var(--color-surface)]">
                <Image
                  src={thumbnailUrl}
                  alt="썸네일 미리보기"
                  fill
                  className="object-cover"
                  sizes="(max-width: 800px) 100vw, 800px"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  // 썸네일 재업로드 시 currentCount를 0으로 넘기기 위해 URL 초기화 후 모달 오픈
                  setThumbnailUrl('')
                  setIsThumbnailModalOpen(true)
                }}
                className="self-start px-3 py-1.5 text-xs border border-[var(--color-border)] rounded hover:bg-[var(--color-surface)] transition-colors text-[var(--color-text-secondary)]"
              >
                썸네일 변경
              </button>
            </div>
          ) : (
            // 미업로드 — 업로드 버튼 + 권장 비율 안내
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => setIsThumbnailModalOpen(true)}
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-[var(--color-border)] rounded hover:border-[var(--color-primary)] hover:bg-[var(--color-surface)] transition-colors text-sm text-[var(--color-text-muted)]"
              >
                + 썸네일 업로드
              </button>
              {/* 권장 비율 안내 */}
              <p className="text-xs text-[var(--color-text-muted)]">
                권장 비율: 16:9 (예: 1280×720, 1920×1080)
              </p>
            </div>
          )}
        </div>

        {/* 본문 — ContentEditor */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
            본문
          </label>
          <ContentEditor
            ref={editorRef}
            value={content}
            onChange={setContent}
            onImageButtonClick={() => setIsContentImageModalOpen(true)}
            placeholder="내용을 입력해주세요"
          />
          <div className="flex justify-end mt-1">
            <span className="text-xs text-[var(--color-text-muted)]">
              이미지 {contentImageCount} / {MAX_CONTENT_IMAGE_COUNT}
            </span>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="px-5 py-2 text-sm border border-[var(--color-border)] rounded hover:bg-[var(--color-surface)] transition-colors duration-150 text-[var(--color-text-secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            초기화
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isSubmitEnabled}
            className={[
              'px-5 py-2 text-sm rounded transition-colors duration-150',
              isSubmitEnabled
                ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)]'
                : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] cursor-not-allowed',
            ].join(' ')}
          >
            {isSubmitting ? '업로드 중...' : '뉴스 업로드'}
          </button>
        </div>
      </div>

      {/* 썸네일 업로드 모달 — maxCount: 1 */}
      <ImageUploadModal
        isOpen={isThumbnailModalOpen}
        onClose={() => setIsThumbnailModalOpen(false)}
        onUpload={handleThumbnailUploaded}
        currentCount={thumbnailUrl ? 1 : 0}
        maxCount={1}
        folder="editornews"
      />

      {/* 본문 이미지 업로드 모달 — maxCount: 5, 썸네일과 별도 인스턴스 */}
      <ImageUploadModal
        isOpen={isContentImageModalOpen}
        onClose={() => setIsContentImageModalOpen(false)}
        onUpload={handleContentImagesUploaded}
        currentCount={contentImageCount}
        maxCount={MAX_CONTENT_IMAGE_COUNT}
        folder="editornews"
      />
    </div>
  )
}
