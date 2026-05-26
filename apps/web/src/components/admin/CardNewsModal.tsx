// 카드뉴스 생성 모달 — idle·loading·done·error 4단계 UI, 슬라이드 뷰어 + PNG 다운로드
'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import html2canvas from 'html2canvas'
import { X, ChevronLeft, ChevronRight, Download, RefreshCw, Loader2, Upload } from 'lucide-react'
import { generateCardNews } from '@/lib/api/admin.api'
import { useImageUpload } from '@/hooks/useImageUpload'
import CardNewsSlide from './CardNewsSlide'

interface Props {
  articleId: string
  articleTitle: string
  onClose: () => void
}

type Status = 'idle' | 'loading' | 'done' | 'error'

/** 카드뉴스 생성 모달 컴포넌트 */
export default function CardNewsModal({ articleId, articleTitle, onClose }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [slides, setSlides] = useState<string[]>([])
  const [slideTitle, setSlideTitle] = useState('')
  const [editingTitle, setEditingTitle] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageUrl, setImageUrl] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const slideContainerRef = useRef<HTMLDivElement>(null)
  const [slideScale, setSlideScale] = useState(0.35)

  const { upload, validate, isLoading: isUploading, progress } = useImageUpload()

  /** flex row 전체 너비에서 버튼(~30px×2) + gap(12px×2) 제외 후 scale 계산
   *  모바일(640px 미만)은 ÷1440으로 슬라이드를 데스크탑 대비 75% 크기로 표시
   */
  useEffect(() => {
    const updateScale = () => {
      if (slideContainerRef.current) {
        const totalWidth = slideContainerRef.current.offsetWidth
        const available = Math.max(80, totalWidth - 84) // 버튼 2개 + gap 제외
        const isMobile = window.innerWidth < 640
        setSlideScale(available / (isMobile ? 1440 : 1080))
      }
    }
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [status])

  /** 파일 선택 또는 드롭 시 R2 업로드 처리 */
  const handleFileChange = useCallback(
    async (file: File) => {
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
    },
    [upload, validate]
  )

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

  /** 슬라이드 생성 요청 — API 호출 후 상태 전환 */
  const handleGenerate = useCallback(async () => {
    setStatus('loading')
    try {
      const res = await generateCardNews(articleId, imageUrl || undefined)
      if (res.success && res.data?.slides) {
        setSlides(res.data.slides)
        setSlideTitle(res.data.title ?? '')
        setEditingTitle(res.data.title ?? '')
        setCurrentIndex(0)
        setStatus('done')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }, [articleId, imageUrl])

  /** 외부 이미지 URL인지 판별 — 현재 오리진과 다른 도메인이면 true */
  const isExternalUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url)
      return parsed.origin !== window.location.origin
    } catch {
      return false
    }
  }

  /** 외부 이미지 URL을 /api/proxy-image 경유 URL로 변환 */
  const toProxyUrl = (url: string): string => `/api/proxy-image?url=${encodeURIComponent(url)}`

  /** clone 내부의 모든 외부 이미지를 프록시 URL로 교체 — CORS 우회를 위해 html2canvas 캡처 직전 호출
   *  처리 대상: img[src], [style*="background-image"] url(...)
   */
  const replaceExternalImages = (container: HTMLElement): void => {
    // img 태그 src 교체
    container.querySelectorAll<HTMLImageElement>('img').forEach((img) => {
      if (img.src && isExternalUrl(img.src)) {
        img.src = toProxyUrl(img.src)
      }
    })

    // 인라인 style background-image url() 교체
    container.querySelectorAll<HTMLElement>('[style]').forEach((el) => {
      const bg = el.style.backgroundImage
      if (!bg) return
      // url("...") 또는 url('...') 또는 url(...) 패턴 추출
      const replaced = bg.replace(/url\((['"]?)([^'")\s]+)\1\)/g, (_match, quote, rawUrl) => {
        if (isExternalUrl(rawUrl)) {
          return `url(${quote}${toProxyUrl(rawUrl)}${quote})`
        }
        return _match
      })
      if (replaced !== bg) {
        el.style.backgroundImage = replaced
      }
    })
  }

  /** 단일 슬라이드 PNG 다운로드 — el을 document.body에 clone 후 캡처
   *  overflow:hidden 부모에 의한 클리핑을 피하기 위해 clone을 body에 직접 추가
   *  외부 이미지는 프록시 URL로 교체하여 CORS 검정화면 방지
   */
  const downloadSlide = useCallback(async (index: number) => {
    const el = slideRefs.current[index]
    if (!el) return

    // 원본 el을 body에 복제 — overflow:hidden 부모 컨텍스트 탈출
    const clone = el.cloneNode(true) as HTMLDivElement
    clone.style.position = 'fixed'
    clone.style.top = '-9999px'
    clone.style.left = '-9999px'
    clone.style.width = '1080px'
    clone.style.height = '1350px'
    clone.style.zIndex = '-1'

    // 외부 이미지를 프록시 URL로 교체한 뒤 body에 추가
    replaceExternalImages(clone)
    document.body.appendChild(clone)

    try {
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: 1080,
        height: 1350,
      })
      const link = document.createElement('a')
      link.download = `cardnews_${index + 1}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      document.body.removeChild(clone)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

  /** 제목 적용 — \n을 <br>로 변환 후 slides[0] HTML 내 기존 제목 교체 */
  const applyTitleEdit = () => {
    if (!editingTitle.trim() || editingTitle === slideTitle) return
    const newTitle = editingTitle.trim().replace(/\n/g, '<br>')
    setSlides((prev) =>
      prev.map((html, i) => (i === 0 ? html.replaceAll(slideTitle, newTitle) : html))
    )
    setSlideTitle(editingTitle.trim())
  }

  /** 재생성 — idle 상태로 초기화 */
  const handleReset = () => {
    setStatus('idle')
    setSlides([])
    setSlideTitle('')
    setEditingTitle('')
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
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg mx-10 sm:mx-4 overflow-y-auto max-h-[67dvh] sm:max-h-[85dvh]">
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
        <div className="px-5 pt-5 pb-6">
          {/* idle: 배경 이미지 입력 + 생성 버튼 */}
          {status === 'idle' && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">
                  배경 이미지
                  <span className="ml-1 text-[var(--color-text-muted)] font-normal">(선택)</span>
                </p>

                {/* 파일 업로드 */}
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
                        <span className="text-[var(--color-text-muted)]">
                          PNG, JPG, WEBP · 최대 10MB
                        </span>
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
                      <div className="w-36 aspect-[4/5] mx-auto">
                        <img
                          src={previewUrl}
                          alt="배경 이미지 미리보기"
                          className="w-full h-full object-cover"
                        />
                      </div>
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

                  {/* 해상도 힌트 */}
                  {!previewUrl && !isUploading && (
                    <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
                      권장 해상도:{' '}
                      <span className="font-medium text-[var(--color-text-secondary)]">
                        1080 × 1350px (4:5 세로)
                      </span>{' '}
                      — 카드 전체를 꽉 채워 선명하게 출력됩니다.
                    </p>
                  )}

                  {/* 에러 메시지 */}
                  {uploadError && <p className="mt-1.5 text-xs text-red-500">{uploadError}</p>}

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
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isUploading}
                className="w-full py-2.5 rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-foreground)] text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
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
            <div className="space-y-4 pb-2">
              {/* 슬라이드 뷰어 영역 — flex row 전체 너비 기준으로 scale 계산, 슬라이드 컨테이너는 정확히 1080*scale 너비 */}
              <div ref={slideContainerRef} className="flex items-center justify-center gap-3">
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

                {/* 슬라이드 렌더링 영역 — 너비를 1080*scale로 고정해 빈 공간 없이 중앙 정렬 */}
                <div
                  style={{
                    width: Math.round(1080 * slideScale),
                    height: Math.round(1350 * slideScale),
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
                          transform: `scale(${slideScale})`,
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

              {/* 제목 편집 — 띄어쓰기 등 직접 수정 후 적용 */}
              <div className="flex gap-2 items-center">
                <textarea
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  placeholder="제목 수정 (Enter = 줄바꿈)"
                  rows={2}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-white dark:bg-gray-800 text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                />
                <button
                  type="button"
                  onClick={applyTitleEdit}
                  disabled={!editingTitle.trim() || editingTitle === slideTitle}
                  className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-foreground)] text-xs font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity whitespace-nowrap"
                >
                  적용
                </button>
              </div>

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
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-foreground)] text-xs font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
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
