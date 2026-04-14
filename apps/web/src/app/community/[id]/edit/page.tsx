import type { Metadata } from 'next'
import EditForm from '@/components/community/EditForm'

export const metadata: Metadata = {
  title: '게시글 수정 | Game Magazine',
}

interface EditPageProps {
  params: { id: string }
}

export default function EditPage({ params }: EditPageProps) {
  const postId = Number(params.id)
  return <EditForm postId={postId} />
}
