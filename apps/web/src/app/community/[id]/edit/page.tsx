import type { Metadata } from 'next'
import EditForm from '@/components/community/EditForm'

export const metadata: Metadata = {
  title: '게시글 수정 | Game Magazine',
}

interface EditPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPage({ params }: EditPageProps) {
  const { id } = await params
  const postId = Number(id)
  return <EditForm postId={postId} />
}
