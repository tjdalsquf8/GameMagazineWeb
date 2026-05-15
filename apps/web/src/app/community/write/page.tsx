import { Suspense } from 'react'
import type { Metadata } from 'next'
import WriteForm from '@/components/community/WriteForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '게시글 작성 | Game Magazine',
}

export default function WritePage() {
  return (
    <Suspense>
      <WriteForm />
    </Suspense>
  )
}
