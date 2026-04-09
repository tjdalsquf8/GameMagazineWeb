import type { Metadata } from 'next'
import PostList from '@/components/community/PostList'

export const metadata: Metadata = {
  title: '커뮤니티 | Game Magazine',
  description: '게임 커뮤니티 — 자유롭게 이야기를 나눠보세요',
}

export default function CommunityPage() {
  return <PostList />
}
