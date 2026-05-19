// 카드뉴스 생성 모달 — idle·loading·done·error 4단계 UI, 슬라이드 뷰어 + PNG 다운로드
'use client'

import { useState, useRef, useCallback } from 'react'
import html2canvas from 'html2canvas'
import { X, ChevronLeft, ChevronRight, Download, RefreshCw, Loader2, Upload, Link } from 'lucide-react'
import { generateCardNews } from '@/lib/api/admin.api'
import { useImageUpload } from '@/hooks/useImageUpload'
import CardNewsSlide from './CardNewsSlide'

interface Props {
  articleId: string
  articleTitle: string
  onClose: () => void
}

type Status = 'idle' | 'loading' | 'done' | 'error'
type InputMode = 'url' | 'file'

/** 카드뉴스 생성 모달 컴포넌트 */
export default function CardNewsModal({ articleId, articleTitle, onClose }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [slides, setSlides] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageUrl, setImageUrl] = useState('')
  const [inputMode, setInputMode] = useState<InputMode>('url')
  const [uploadError, setUploadError] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { upload, validate, isLoading: isUploading, progress } = useImageUpload()

  /** 파일 선택 또는 드롭 시 R2 업로드 처리 */
  const handleFileChange = useCallback(async (file: File) => {
    setUploadError('')
    const err = validate(file)
    if (err) {
      setUploadError(err)
      return
    }
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    try {
      const publicUrl = await upload(file, undefined, 'editornews')
      setImageUrl(publicUrl)
      URL.revokeObjectURL(objectUrl)
      setPreviewUrl(publicUrl)
    } catch {
      setUploadError('업로드에 실패했습니다. 다시 시도해 주세요.')
      setPreviewUrl('')
    }
  }, [upload, validate])

  /** 드래그 오버 기본 이벤트 차단 */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  /** 드롭 시 첫 번째 이미지 파일 처리 */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileChange(file)
  }

  /** 탭 전환 시 이미지 상태 초기화 */
  const handleModeChange = (mode: InputMode) => {
    setInputMode(mode)
    setImageUrl('')
    setPreviewUrl('')
    setUploadError('')
  }

  /** 슬라이드 생성 요청 — API 호출 후 상태 전환 */
  const handleGenerate = useCallback(async () => {
    setStatus('loading')
    try {
      const res = await generateCardNews(articleId, imageUrl || undefined)
      if (res.success && res.data?.slides) {
        setSlides(res.data.slides)
        setCurrentIndex(0)
        setStatus('done')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }, [articleId, imageUrl])

  /** 단일 슬라이드 PNG 다운로드 — html2canvas로 캡처 후 링크 클릭 트리거 */
  const downloadSlide = useCallback(async (index: number) => {
    const el = slideRefs.current[index]
    if (!el) return
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, logging: false })
    const link = document.createElement('a')
    link.download = `cardnews_${index + 1}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [])

  /** 전체 슬라이드 순차 다운로드 */
  const downloadAll = useCallback(async () => {
    setIsDownloading(true)
    try {
      for (let i = 0; i < slides.length; i++) {
        await downloadSlide(i)
      }
    } finally {
      setIsDownloading(false)
    }
  }, [slides.length, downloadSlide])

  /** 이전 슬라이드로 이동 */
  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  /** 다음 슬라이드로 이동 */
  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(slides.length - 1, prev + 1))
  }

  /** 재생성 — idle 상태로 초기화 */
  const handleReset = () => {
    setStatus('idle')
    setSlides([])
    setCurrentIndex(0)
    setImageUrl('')
    setPreviewUrl('')
    setUploadError('')
  }

  /** 모달 오버레이 클릭 시 닫기 */
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* 모달 헤더 */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <div className="flex-1 min-w-0 pr-3">
            <p className="text-xs text-[var(--color-text-muted)] mb-0.5">카드뉴스 만들기</p>
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
              {articleTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-colors flex-shrink-0"
            aria-label="모달 닫기"
          >
            <X size={18} />
          </button>
        </div>

        {/* 모달 바디 */}
        <div className="px-5 py-5">
          {/* idle: 배경 이미지 입력 + 생성 버튼 */}
          {status === 'idle' && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">
                  배경 이미지
                  <span className="ml-1 text-[var(--color-text-muted)] font-normal">(선택)</span>
                </p>

                {/* URL / 파일 탭 */}
                <div className="flex rounded-lg border border-[var(--color-border)] overflow-hidden mb-3">
                  <button
                    type="button"
                    onClick={() => handleModeChange('url')}
                    className={[
                      'flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors',
                      inputMode === 'url'
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]',
                    ].join(' ')}
                  >
                    <Link size={12} />
                    URL 입력
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeChange('file')}
                    className={[
                      'flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors',
                      inputMode === 'file'
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]',
                    ].join(' ')}
                  >
                    <Upload size={12} />
                    파일 업로드
                  </button>
                </div>

                {/* URL 입력 */}
                {inputMode === 'url' && (
                  <input
                    id="card-image-url"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white dark:bg-gray-800 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                )}

                {/* 파일 업로드 */}
                {inputMode === 'file' && (
                  <div>
                    {/* 업로드 전: 드롭존 */}
                    {!previewUrl && !isUploading && (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className="flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-lg border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface)] cursor-pointer transition-colors"
                      >
                        <Upload size={20} className="text-[var(--color-text-muted)]" />
                        <p className="text-xs text-[var(--color-text-secondary)] text-center">
                          클릭하거나 파일을 드래그해 주세요
                          <br />
                          <span className="text-[var(--color-text-muted)]">PNG, JPG, WEBP · 최대 10MB</span>
                        </p>
                      </div>
                    )}

                    {/* 업로드 중: 진행률 바 */}
                    {isUploading && (
                      <div className="flex flex-col items-center justify-center gap-3 py-6">
                        <Loader2 size={20} className="animate-spin text-[var(--color-primary)]" />
                        <div className="w-full bg-[var(--color-border)] rounded-full h-1.5">
                          <div
                            className="bg-[var(--color-primary)] h-1.5 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-[var(--color-text-muted)]">{progress}%</p>
                      </div>
                    )}

                    {/* 업로드 완료: 미리보기 + 재선택 */}
                    {previewUrl && !isUploading && (
                      <div className="relative rounded-lg overflow-hidden border border-[var(--color-border)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewUrl}
                          alt="배경 이미지 미리보기"
                          className="w-full h-32 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewUrl('')
                            setImageUrl('')
                            fileInputRef.current?.click()
                          }}
                          className="absolute top-2 right-2 p-1 rounded-md bg-black/50 text-white hover:bg-black/70 transition-colors"
                          aria-label="이미지 재선택"
                        >
                          <RefreshCw size={12} />
                        </button>
                      </div>
                    )}

                    {/* 에러 메시지 */}
                    {uploadError && (
                      <p className="mt-1.5 text-xs text-red-500">{uploadError}</p>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileChange(file)
                        e.target.value = ''
                      }}
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isUploading}
                className="w-full py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                카드뉴스 생성하기
              </button>
            </div>
          )}

          {/* loading: 스피너 + 안내 문구 */}
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
              <p className="text-sm text-[var(--color-text-secondary)] text-center">
                Claude가 카드뉴스를 작성 중입니다...
                <br />
                <span className="text-xs text-[var(--color-text-muted)]">
                  잠시만 기다려 주세요.
                </span>
              </p>
            </div>
          )}

          {/* error: 에러 메시지 + 재시도 버튼 */}
          {status === 'error' && (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <p className="text-sm text-red-500 text-center">
                카드뉴스 생성에 실패했습니다.
                <br />
                <span className="text-xs text-[var(--color-text-muted)]">
                  잠시 후 다시 시도해 주세요.
                </span>
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] transition-colors"
              >
                <RefreshCw size={14} />
                재시도
              </button>
            </div>
          )}

          {/* done: 슬라이드 뷰어 */}
          {status === 'done' && slides.length > 0 && (
            <div className="space-y-4">
              {/* 슬라이드 뷰어 영역 — 1080×1350을 0.35 scale로 축소 표시 */}
              <div className="flex items-center justify-center gap-3">
                {/* 이전 버튼 */}
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="p-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                  aria-label="이전 슬라이드"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* 슬라이드 렌더링 영역 */}
                <div
                  style={{
                    width: 378,
                    height: 473,
                    overflow: 'hidden',
                    position: 'relative',
                    flexShrink: 0,
                  }}
                  className="rounded-lg border border-[var(--color-border)] bg-gray-50 dark:bg-gray-800"
                >
                  {slides.map((slide, i) => (
                    <div key={i} style={{ display: i === currentIndex ? 'block' : 'none' }}>
                      <div
                        style={{
                          transform: 'scale(0.35)',
                          transformOrigin: 'top left',
                          width: 1080,
                          height: 1350,
                        }}
                      >
                        <CardNewsSlide
                          ref={(el) => {
                            slideRefs.current[i] = el
                          }}
                          html={slide}
                          slideNo={i + 1}
                          total={slides.length}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* 다음 버튼 */}
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentIndex === slides.length - 1}
                  className="p-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                  aria-label="다음 슬라이드"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* 슬라이드 인디케이터 */}
              <div className="flex items-center justify-center gap-1">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentIndex(i)}
                    className={[
                      'rounded-full transition-all',
                      i === currentIndex
                        ? 'w-4 h-2 bg-[var(--color-primary)]'
                        : 'w-2 h-2 bg-[var(--color-border)] hover:bg-[var(--color-text-muted)]',
                    ].join(' ')}
                    aria-label={`${i + 1}번 슬라이드`}
                  />
                ))}
              </div>

              {/* 슬라이드 번호 */}
              <p className="text-center text-xs text-[var(--color-text-muted)]">
                {currentIndex + 1} / {slides.length}
              </p>

              {/* 액션 버튼 영역 */}
              <div className="flex gap-2">
                {/* 현재 슬라이드 다운로드 */}
                <button
                  type="button"
                  onClick={() => downloadSlide(currentIndex)}
                  disabled={isDownloading}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg border border-[var(--color-border)] text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Download size={13} />
                  현재 슬라이드
                </button>

                {/* 전체 다운로드 */}
                <button
                  type="button"
                  onClick={downloadAll}
                  disabled={isDownloading}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[var(--color-primary)] text-white text-xs font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  {isDownloading ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Download size={13} />
                  )}
                  전체 다운로드
                </button>

                {/* 재생성 */}
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isDownloading}
                  className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-[var(--color-border)] text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="재생성"
                  aria-label="재생성"
                >
                  <RefreshCw size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
