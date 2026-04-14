import type { Metadata } from 'next'
import PostDetail from '@/components/community/PostDetail'
import CommentList from '@/components/community/CommentList'

export const metadata: Metadata = {
  title: '게시글 | Game Magazine',
}

interface PostPageProps {
  params: { id: string }
}

export default function PostPage({ params }: PostPageProps) {
  const postId = Number(params.id)

  return (
    <div className="max-w-[800px]">
      <PostDetail postId={postId} />
      <CommentList postId={postId} />
    </div>
  )
}
