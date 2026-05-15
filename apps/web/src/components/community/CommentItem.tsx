'use client'

// CommentItem.tsx
// 댓글 및 대댓글 아이템 컴포넌트 — 삭제/수정(인라인 편집) + 추천 기능 포함
// isDeleted: true 인 댓글/대댓글에는 추천 버튼 미표시
// 추천 버튼은 Optimistic Update 적용 — API 실패 시 롤백

import { useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { useToastStore } from '@/store/toastStore'
import { deleteComment, updateComment, toggleCommentRecommend } from '@/lib/api/posts'
import RecommendButton from '@/components/community/RecommendButton'
import type { Comment, Reply } from '@/types/community'

/** ISO 날짜 문자열을 'YYYY.MM.DD HH:mm' 형식으로 변환 */
function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

interface ReplyItemProps {
  reply: Reply
  postId: number
  currentUserId: string | null
  accessToken: string | null
  onDeleted: () => void
}

/** 대댓글 단일 아이템 — 삭제 및 인라인 수정 기능, 추천 버튼 포함 */
function ReplyItem({ reply, postId, currentUserId, accessToken, onDeleted }: ReplyItemProps) {
  const { showToast } = useToastStore()
  const isDeleted = reply.isDeleted || reply.deletedAt !== null
  const isOwn = !isDeleted && reply.author?.id === currentUserId

  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // 추천 Optimistic Update 상태
  const [recommended, setRecommended] = useState(reply.isRecommended ?? false)
  const [recommendCount, setRecommendCount] = useState(reply.recommendCount ?? 0)
  const [isRecommending, setIsRecommending] = useState(false)

  /** 수정 버튼 클릭 — 편집 모드 진입 */
  const handleEditStart = () => {
    setEditText(reply.content)
    setIsEditing(true)
  }

  /** 취소 버튼 클릭 — 편집 모드 종료 및 내용 원복 */
  const handleEditCancel = () => {
    setIsEditing(false)
    setEditText('')
  }

  /** 저장 버튼 클릭 — updateComment 호출 후 목록 새로고침 */
  const handleEditSave = async () => {
    if (!accessToken) return
    const trimmed = editText.trim()
    if (!trimmed) {
      showToast('내용을 입력해주세요', 'error')
      return
    }
    setIsSaving(true)
    try {
      await updateComment(postId, reply.id, { content: trimmed }, accessToken)
      showToast('댓글이 수정되었습니다', 'success')
      setIsEditing(false)
      setEditText('')
      onDeleted()
    } catch (err) {
      showToast(err instanceof Error ? err.message : '수정에 실패했습니다', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  /** 삭제 버튼 클릭 — deleteComment 호출 후 목록 새로고침 */
  const handleDelete = async () => {
    if (!accessToken) return
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return
    try {
      await deleteComment(postId, reply.id, accessToken)
      onDeleted()
    } catch (err) {
      showToast(err instanceof Error ? err.message : '삭제에 실패했습니다', 'error')
    }
  }

  /** 대댓글 추천 토글 — Optimistic Update 적용, 실패 시 롤백 */
  const handleRecommend = async () => {
    if (!accessToken) {
      showToast('추천은 로그인 후 이용할 수 있습니다', 'info')
      return
    }
    if (isRecommending) return

    const prevRecommended = recommended
    const prevCount = recommendCount
    setRecommended(!recommended)
    setRecommendCount(recommended ? recommendCount - 1 : recommendCount + 1)
    setIsRecommending(true)

    try {
      const result = await toggleCommentRecommend(postId, reply.id, accessToken)
      setRecommended(result.recommended)
      setRecommendCount(result.recommendCount)
    } catch {
      setRecommended(prevRecommended)
      setRecommendCount(prevCount)
      showToast('추천 처리에 실패했습니다', 'error')
    } finally {
      setIsRecommending(false)
    }
  }

  return (
    <div className="pl-6 border-l-2 border-border mt-3">
      <div className="flex items-center gap-2 mb-1">
        {!isDeleted && reply.author && (
          <>
            {reply.author.profileImage ? (
              <div className="relative w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={reply.author.profileImage}
                  alt={reply.author.nickname}
                  fill
                  className="object-cover"
                  sizes="20px"
                />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-[var(--color-surface-hover)] flex items-center justify-center flex-shrink-0">
                <span className="text-[9px] font-medium text-[var(--color-text-muted)]">
                  {reply.author.nickname[0]?.toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-sm font-medium text-text-primary">{reply.author.nickname}</span>
          </>
        )}
        <span className="text-xs text-text-muted">{formatDate(reply.createdAt)}</span>
        {isOwn && !isEditing && (
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleEditStart}
              className="text-xs text-text-muted hover:text-text-primary transition-colors"
            >
              수정
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              삭제
            </button>
          </div>
        )}
      </div>
      {isDeleted ? (
        <p className="text-sm text-text-muted italic">삭제된 댓글입니다</p>
      ) : isEditing ? (
        <div className="mt-1">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={3}
            className="w-full text-sm text-text-primary bg-surface border border-border rounded px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={handleEditSave}
              disabled={isSaving}
              className="text-xs px-3 py-1 bg-primary text-white rounded hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {isSaving ? '저장 중...' : '저장'}
            </button>
            <button
              type="button"
              onClick={handleEditCancel}
              disabled={isSaving}
              className="text-xs px-3 py-1 border border-border text-text-muted rounded hover:text-text-primary transition-colors disabled:opacity-50"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-text-secondary leading-relaxed">{reply.content}</p>
          {/* 삭제되지 않은 대댓글에만 추천 버튼 표시 */}
          <div className="flex justify-end mt-2">
            <RecommendButton
              recommended={recommended}
              recommendCount={recommendCount}
              onRecommend={handleRecommend}
              isLoading={isRecommending}
              size="sm"
            />
          </div>
        </>
      )}
    </div>
  )
}

interface CommentItemProps {
  comment: Comment
  postId: number
  currentUserId: string | null
  onDeleted: () => void
}

/** 댓글 단일 아이템 — 삭제 및 인라인 수정 기능, 대댓글 목록 렌더링, 추천 버튼 포함 */
export default function CommentItem({
  comment,
  postId,
  currentUserId,
  onDeleted,
}: CommentItemProps) {
  const { accessToken } = useAuth()
  const { showToast } = useToastStore()
  const isDeleted = comment.isDeleted || comment.deletedAt !== null
  const isOwn = !isDeleted && comment.author?.id === currentUserId

  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // 추천 Optimistic Update 상태
  const [recommended, setRecommended] = useState(comment.isRecommended ?? false)
  const [recommendCount, setRecommendCount] = useState(comment.recommendCount ?? 0)
  const [isRecommending, setIsRecommending] = useState(false)

  /** 수정 버튼 클릭 — 편집 모드 진입 */
  const handleEditStart = () => {
    setEditText(comment.content)
    setIsEditing(true)
  }

  /** 취소 버튼 클릭 — 편집 모드 종료 및 내용 원복 */
  const handleEditCancel = () => {
    setIsEditing(false)
    setEditText('')
  }

  /** 저장 버튼 클릭 — updateComment 호출 후 목록 새로고침 */
  const handleEditSave = async () => {
    if (!accessToken) return
    const trimmed = editText.trim()
    if (!trimmed) {
      showToast('내용을 입력해주세요', 'error')
      return
    }
    setIsSaving(true)
    try {
      await updateComment(postId, comment.id, { content: trimmed }, accessToken)
      showToast('댓글이 수정되었습니다', 'success')
      setIsEditing(false)
      setEditText('')
      onDeleted()
    } catch (err) {
      showToast(err instanceof Error ? err.message : '수정에 실패했습니다', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  /** 삭제 버튼 클릭 — deleteComment 호출 후 목록 새로고침 */
  const handleDelete = async () => {
    if (!accessToken) return
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return
    try {
      await deleteComment(postId, comment.id, accessToken)
      onDeleted()
    } catch (err) {
      showToast(err instanceof Error ? err.message : '삭제에 실패했습니다', 'error')
    }
  }

  /** 댓글 추천 토글 — Optimistic Update 적용, 실패 시 롤백 */
  const handleRecommend = async () => {
    if (!accessToken) {
      showToast('추천은 로그인 후 이용할 수 있습니다', 'info')
      return
    }
    if (isRecommending) return

    const prevRecommended = recommended
    const prevCount = recommendCount
    setRecommended(!recommended)
    setRecommendCount(recommended ? recommendCount - 1 : recommendCount + 1)
    setIsRecommending(true)

    try {
      const result = await toggleCommentRecommend(postId, comment.id, accessToken)
      setRecommended(result.recommended)
      setRecommendCount(result.recommendCount)
    } catch {
      setRecommended(prevRecommended)
      setRecommendCount(prevCount)
      showToast('추천 처리에 실패했습니다', 'error')
    } finally {
      setIsRecommending(false)
    }
  }

  return (
    <div className="py-4 border-b border-border last:border-b-0">
      <div className="flex items-center gap-2 mb-1">
        {!isDeleted && comment.author && (
          <>
            {comment.author.profileImage ? (
              <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={comment.author.profileImage}
                  alt={comment.author.nickname}
                  fill
                  className="object-cover"
                  sizes="24px"
                />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-[var(--color-surface-hover)] flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-medium text-[var(--color-text-muted)]">
                  {comment.author.nickname[0]?.toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-sm font-medium text-text-primary">{comment.author.nickname}</span>
          </>
        )}
        <span className="text-xs text-text-muted">{formatDate(comment.createdAt)}</span>
        {isOwn && !isEditing && (
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleEditStart}
              className="text-xs text-text-muted hover:text-text-primary transition-colors"
            >
              수정
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              삭제
            </button>
          </div>
        )}
      </div>
      {isDeleted ? (
        <p className="text-sm text-text-muted italic">삭제된 댓글입니다</p>
      ) : isEditing ? (
        <div className="mt-1">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={3}
            className="w-full text-sm text-text-primary bg-surface border border-border rounded px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={handleEditSave}
              disabled={isSaving}
              className="text-xs px-3 py-1 bg-primary text-white rounded hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {isSaving ? '저장 중...' : '저장'}
            </button>
            <button
              type="button"
              onClick={handleEditCancel}
              disabled={isSaving}
              className="text-xs px-3 py-1 border border-border text-text-muted rounded hover:text-text-primary transition-colors disabled:opacity-50"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-text-secondary leading-relaxed">{comment.content}</p>
          {/* 삭제되지 않은 댓글에만 추천 버튼 표시 — 우측 하단 배치 */}
          <div className="flex justify-end mt-2">
            <RecommendButton
              recommended={recommended}
              recommendCount={recommendCount}
              onRecommend={handleRecommend}
              isLoading={isRecommending}
              size="sm"
            />
          </div>
        </>
      )}
      {comment.replies.map((reply) => (
        <ReplyItem
          key={reply.id}
          reply={reply}
          postId={postId}
          currentUserId={currentUserId}
          accessToken={accessToken}
          onDeleted={onDeleted}
        />
      ))}
    </div>
  )
}
