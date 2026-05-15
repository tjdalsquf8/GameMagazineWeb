// 카드뉴스 생성 모달 — idle·loading·done·error 4단계 UI, 슬라이드 뷰어 + PNG 다운로드
'use client'

import { useState, useRef, useCallback } from 'react'
import html2canvas from 'html2canvas'
import { X, ChevronLeft, ChevronRight, Download, RefreshCw, Loader2 } from 'lucide-react'
import { generateCardNews } from '@/lib/api/admin.api'
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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageUrl, setImageUrl] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])

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
          {/* idle: 이미지 URL 입력 + 생성 버튼 */}
          {status === 'idle' && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="card-image-url"
                  className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5"
                >
                  뉴스 이미지 URL
                  <span className="ml-1 text-[var(--color-text-muted)] font-normal">(선택)</span>
                </label>
                <input
                  id="card-image-url"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="뉴스 이미지 URL (선택)"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white dark:bg-gray-800 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <button
                type="button"
                onClick={handleGenerate}
                className="w-full py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
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
