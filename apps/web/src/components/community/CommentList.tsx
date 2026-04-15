'use client'

import { useState, useEffect, useCallback } from 'react'
import { getComments, createComment } from '@/lib/api/posts'
import { useAuth } from '@/hooks/useAuth'
import { useToastStore } from '@/store/toastStore'
import CommentItem from '@/components/community/CommentItem'
import type { Comment } from '@/types/community'

interface CommentListProps {
  postId: number
}

export default function CommentList({ postId }: CommentListProps) {
  const { user, accessToken, isAuthenticated } = useAuth()
  const { showToast } = useToastStore()

  const [comments, setComments] = useState<Comment[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchComments = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getComments(postId)
      setComments(res.items ?? [])
      setTotal(res.total ?? 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : '댓글을 불러오는데 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }, [postId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handleSubmit = async () => {
    if (!accessToken || !commentText.trim()) return
    setIsSubmitting(true)
    try {
      await createComment(postId, { content: commentText.trim() }, accessToken)
      setCommentText('')
      await fetchComments()
      showToast('댓글이 등록되었습니다', 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : '댓글 등록에 실패했습니다', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mt-8">
      <h2 className="text-base font-semibold text-text-primary mb-4">댓글 {total}개</h2>

      {/* 댓글 목록 */}
      {isLoading ? (
        <div className="py-6 text-center text-sm text-text-muted">댓글을 불러오는 중...</div>
      ) : error ? (
        <div className="py-6 text-center text-sm text-red-500">{error}</div>
      ) : (
        <div className="border border-border rounded-md overflow-hidden mb-6">
          {comments.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-text-muted">
              첫 댓글을 작성해보세요
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="px-4">
                <CommentItem
                  comment={comment}
                  postId={postId}
                  currentUserId={user?.id ?? null}
                  onDeleted={fetchComments}
                />
              </div>
            ))
          )}
        </div>
      )}

      {/* 댓글 작성 */}
      {isAuthenticated ? (
        <div className="border border-border rounded-md overflow-hidden">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full px-4 py-3 text-sm text-text-primary placeholder:text-text-muted bg-background resize-none focus:outline-none"
            rows={4}
            placeholder="댓글을 작성해주세요"
          />
          <div className="flex justify-end px-3 py-2 border-t border-border bg-surface">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !commentText.trim()}
              className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary-hover transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '등록 중...' : '등록'}
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
