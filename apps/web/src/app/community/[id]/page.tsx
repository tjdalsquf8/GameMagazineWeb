import type { Metadata } from 'next'
import PostDetail from '@/components/community/PostDetail'
import CommentList from '@/components/community/CommentList'

export const metadata: Metadata = {
  title: '게시글 | Game Magazine',
}

interface PostPageProps {
  params: Promise<{ id: string }>
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params
  const postId = Number(id)

  return (
    <div className="max-w-[800px]">
      <PostDetail postId={postId} />
      <CommentList postId={postId} />
    </div>
  )
}
