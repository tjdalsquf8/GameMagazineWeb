import type { MockComment, MockReply } from '@/lib/mock/community'

function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

interface ReplyItemProps {
  reply: MockReply
}

function ReplyItem({ reply }: ReplyItemProps) {
  const isDeleted = reply.deletedAt !== null

  return (
    <div className="pl-6 border-l-2 border-border mt-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-medium text-text-primary">{reply.author.nickname}</span>
        <span className="text-xs text-text-muted">{formatDate(reply.createdAt)}</span>
      </div>
      {isDeleted ? (
        <p className="text-sm text-text-muted italic">삭제된 댓글입니다</p>
      ) : (
        <p className="text-sm text-text-secondary leading-relaxed">{reply.content}</p>
      )}
    </div>
  )
}

interface CommentItemProps {
  comment: MockComment
}

export default function CommentItem({ comment }: CommentItemProps) {
  const isDeleted = comment.deletedAt !== null

  return (
    <div className="py-4 border-b border-border last:border-b-0">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-medium text-text-primary">{comment.author.nickname}</span>
        <span className="text-xs text-text-muted">{formatDate(comment.createdAt)}</span>
      </div>
      {isDeleted ? (
        <p className="text-sm text-text-muted italic">삭제된 댓글입니다</p>
      ) : (
        <p className="text-sm text-text-secondary leading-relaxed">{comment.content}</p>
      )}
      {comment.replies.map((reply) => (
        <ReplyItem key={reply.id} reply={reply} />
      ))}
    </div>
  )
}
