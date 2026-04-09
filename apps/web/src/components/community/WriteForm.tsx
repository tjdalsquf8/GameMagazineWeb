'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { mockCategories } from '@/lib/mock/community'

// 하위 카테고리만 필터 (parentId가 null이 아닌 것)
const leafCategories = mockCategories.filter((c) => c.parentId !== null)

export default function WriteForm() {
  const router = useRouter()
  const [categoryId, setCategoryId] = useState<string>('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const isSubmitEnabled = categoryId !== '' && title.trim() !== ''

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
            {leafCategories.map((cat) => (
              <option key={cat.id} value={String(cat.id)}>
                {cat.name}
              </option>
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

        {/* 본문 */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">본문</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력해주세요"
            className="w-full border border-border rounded px-3 py-2 text-sm bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
            style={{ minHeight: '400px' }}
          />
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
            disabled={!isSubmitEnabled}
            className={[
              'px-5 py-2 text-sm rounded transition-colors duration-150',
              isSubmitEnabled
                ? 'bg-primary text-primary-foreground hover:bg-primary-hover'
                : 'bg-surface text-text-muted cursor-not-allowed',
            ].join(' ')}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  )
}
