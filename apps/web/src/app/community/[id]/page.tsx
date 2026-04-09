import type { Metadata } from 'next'
import PostDetail from '@/components/community/PostDetail'
import CommentList from '@/components/community/CommentList'

export const metadata: Metadata = {
  title: '게시글 | Game Magazine',
}

interface PostPageProps {
  params: { id: string }
}

export default function PostPage({ params: _ }: PostPageProps) {
  // 추후 API 연동 시 params.id로 특정 게시글 조회
  return (
    <div className="max-w-[800px]">
      <PostDetail />
      <CommentList />
    </div>
  )
}
