'use client'

// 이미지 업로드 모달 컴포넌트
// 드래그&드롭 + 클릭 파일 선택, 최대 5장, 진행률 표시, 썸네일 미리보기 제공

import { useState, useRef, useCallback, DragEvent, ChangeEvent } from 'react'
import { X, ImagePlus, Upload } from 'lucide-react'
import { useImageUpload, type UploadFolder } from '@/hooks/useImageUpload'
import { useToastStore } from '@/store/toastStore'

// 업로드된 개별 이미지 상태 타입
interface UploadedImage {
  id: string
  url: string
  preview: string // Object URL — 썸네일용
  progress: number
  status: 'uploading' | 'done' | 'error'
}

interface ImageUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (urls: string[]) => void
  currentCount: number
  maxCount?: number
  folder?: UploadFolder
}

// 이미지 업로드 모달 — 드래그&드롭 및 클릭으로 파일 선택 후 R2에 업로드
export default function ImageUploadModal({
  isOpen,
  onClose,
  onUpload,
  currentCount,
  maxCount = 5,
  folder,
}: ImageUploadModalProps) {
  const { upload, validate } = useImageUpload()
  const { showToast } = useToastStore()

  const [images, setImages] = useState<UploadedImage[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 남은 업로드 가능 슬롯 수
  const remainingSlots = maxCount - currentCount - images.length
  const canAddMore = remainingSlots > 0

  // Object URL 정리 — 메모리 누수 방지
  const revokePreview = (preview: string) => {
    URL.revokeObjectURL(preview)
  }

  // 파일 목록을 받아 업로드 처리
  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files)
      const available = maxCount - currentCount - images.length

      if (fileArray.length > available) {
        showToast(
          `최대 ${maxCount}장까지 업로드할 수 있습니다. (${available}장 더 추가 가능)`,
          'warning'
        )
      }

      const toProcess = fileArray.slice(0, available)

      for (const file of toProcess) {
        const error = validate(file)
        if (error) {
          showToast(error, 'error')
          continue
        }

        const id = crypto.randomUUID()
        const preview = URL.createObjectURL(file)

        // 업로드 항목 초기 상태 등록
        setImages((prev) => [...prev, { id, url: '', preview, progress: 0, status: 'uploading' }])

        try {
          const publicUrl = await upload(
            file,
            (p) => {
              setImages((prev) =>
                prev.map((img) => (img.id === id ? { ...img, progress: p } : img))
              )
            },
            folder
          )

          // 업로드 완료 상태 갱신
          setImages((prev) =>
            prev.map((img) =>
              img.id === id ? { ...img, url: publicUrl, progress: 100, status: 'done' } : img
            )
          )
        } catch {
          showToast(`${file.name} 업로드에 실패했습니다`, 'error')
          setImages((prev) =>
            prev.map((img) => (img.id === id ? { ...img, status: 'error' } : img))
          )
        }
      }
    },
    [images.length, currentCount, maxCount, upload, validate, showToast, folder]
  )

  // 파일 input change 핸들러
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files)
      e.target.value = '' // 같은 파일 재선택 허용
    }
  }

  // 드래그 이벤트 핸들러
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files)
    }
  }

  // 개별 이미지 제거
  const handleRemove = (id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id)
      if (target) revokePreview(target.preview)
      return prev.filter((img) => img.id !== id)
    })
  }

  // 적용 버튼 — 업로드 완료된 이미지 URL만 전달
  const handleApply = () => {
    const doneUrls = images.filter((img) => img.status === 'done').map((img) => img.url)
    if (doneUrls.length === 0) {
      showToast('업로드 완료된 이미지가 없습니다', 'warning')
      return
    }
    onUpload(doneUrls)
    // Object URL 정리
    images.forEach((img) => revokePreview(img.preview))
    setImages([])
    onClose()
  }

  // 취소 버튼
  const handleClose = () => {
    images.forEach((img) => revokePreview(img.preview))
    setImages([])
    onClose()
  }

  if (!isOpen) return null

  const hasUploading = images.some((img) => img.status === 'uploading')

  return (
    // 모달 오버레이
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-text-primary">이미지 업로드</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-text-muted hover:text-text-primary transition-colors"
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* 드래그&드롭 영역 */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => canAddMore && fileInputRef.current?.click()}
            className={[
              'border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 py-8 transition-colors',
              canAddMore ? 'cursor-pointer' : 'cursor-not-allowed opacity-50',
              isDragOver
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary hover:bg-surface',
            ].join(' ')}
          >
            <Upload size={28} className="text-text-muted" />
            <p className="text-sm text-text-secondary font-medium">
              클릭하거나 파일을 드래그하여 업로드
            </p>
            <p className="text-xs text-text-muted">
              PNG, JPG, WEBP · 최대 10MB · 최대 {maxCount}장
            </p>
            <p className="text-xs text-text-muted">
              ({currentCount + images.length}/{maxCount}장 사용 중)
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          {/* 썸네일 목록 */}
          {images.length > 0 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square rounded overflow-hidden bg-surface border border-border"
                >
                  {/* 썸네일 이미지 */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.preview}
                    alt="업로드 미리보기"
                    className="w-full h-full object-cover"
                  />

                  {/* 업로드 중 오버레이 */}
                  {img.status === 'uploading' && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1">
                      <span className="text-white text-xs font-medium">{img.progress}%</span>
                      {/* 프로그레스 바 */}
                      <div className="w-3/4 h-1 bg-white/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full transition-all duration-200"
                          style={{ width: `${img.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* 에러 오버레이 */}
                  {img.status === 'error' && (
                    <div className="absolute inset-0 bg-red-500/70 flex items-center justify-center">
                      <span className="text-white text-xs text-center px-1">실패</span>
                    </div>
                  )}

                  {/* 제거 버튼 */}
                  {img.status !== 'uploading' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemove(img.id)
                      }}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                      aria-label="이미지 제거"
                    >
                      <X size={10} className="text-white" />
                    </button>
                  )}
                </div>
              ))}

              {/* 추가 버튼 슬롯 */}
              {canAddMore && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded border-2 border-dashed border-border flex items-center justify-center hover:border-primary hover:bg-surface transition-colors"
                  aria-label="이미지 추가"
                >
                  <ImagePlus size={20} className="text-text-muted" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* 모달 푸터 */}
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-border">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm border border-border rounded hover:bg-surface transition-colors duration-150 text-text-secondary"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={hasUploading || images.filter((img) => img.status === 'done').length === 0}
            className={[
              'px-4 py-2 text-sm rounded transition-colors duration-150',
              !hasUploading && images.filter((img) => img.status === 'done').length > 0
                ? 'bg-primary text-primary-foreground hover:bg-primary-hover'
                : 'bg-surface text-text-muted cursor-not-allowed',
            ].join(' ')}
          >
            {hasUploading ? '업로드 중...' : '적용'}
          </button>
        </div>
      </div>
    </div>
  )
}
