'use client'

import { mockComments } from '@/lib/mock/community'
import CommentItem from '@/components/community/CommentItem'

// Mock에서는 비로그인 상태로 처리
const IS_LOGGED_IN = false

export default function CommentList() {
  const totalCount = mockComments.length

  return (
    <section className="mt-8">
      <h2 className="text-base font-semibold text-text-primary mb-4">댓글 {totalCount}개</h2>

      {/* 댓글 목록 */}
      <div className="border border-border rounded-md overflow-hidden mb-6">
        {mockComments.map((comment) => (
          <div key={comment.id} className="px-4">
            <CommentItem comment={comment} />
          </div>
        ))}
      </div>

      {/* 댓글 작성 */}
      {IS_LOGGED_IN ? (
        <div className="border border-border rounded-md overflow-hidden">
          <textarea
            className="w-full px-4 py-3 text-sm text-text-primary placeholder:text-text-muted bg-background resize-none focus:outline-none"
            rows={4}
            placeholder="댓글을 작성해주세요"
          />
          <div className="flex justify-end px-3 py-2 border-t border-border bg-surface">
            <button className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary-hover transition-colors duration-150">
              등록
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-border rounded-md px-4 py-6 text-center text-sm text-text-muted">
          <span>
            <a href="/login" className="text-text-primary font-medium hover:underline">
              로그인
            </a>{' '}
            후 댓글을 작성할 수 있습니다
          </span>
        </div>
      )}
    </section>
  )
}
