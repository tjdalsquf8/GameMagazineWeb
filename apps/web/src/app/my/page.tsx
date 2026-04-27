// 마이페이지 메인 — 섹션 카드 세로 나열
// CSR 전용 (인증 필요)
'use client'

import { useState } from 'react'
import { useMyProfile } from '@/hooks/useMyProfile'
import MyPostList from '@/components/my/MyPostList'
import MyCommentList from '@/components/my/MyCommentList'
import MyLikeList from '@/components/my/MyLikeList'
import NewsHistoryList from '@/components/my/NewsHistoryList'
import NotificationSettings from '@/components/my/NotificationSettings'
import AccountSettings from '@/components/my/AccountSettings'

/** 섹션 카드 래퍼 컴포넌트 */
function SectionCard({ children }: { children: React.ReactNode }) {
  return <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm p-5">{children}</div>
}

/** 마이페이지 메인 페이지 컴포넌트 */
export default function MyPage() {
  const { profile, refetch } = useMyProfile()
  const [nickname, setNickname] = useState<string | null>(null)

  const currentNickname = nickname ?? profile?.nickname ?? ''
  const currentProvider = profile?.provider ?? 'email'

  /** 닉네임 변경 성공 시 로컬 상태 갱신 */
  const handleNicknameChange = (newNickname: string) => {
    setNickname(newNickname)
    refetch()
  }

  return (
    <div className="space-y-4">
      {/* 내 게시글 */}
      <SectionCard>
        <MyPostList />
      </SectionCard>

      {/* 내가 쓴 댓글 */}
      <SectionCard>
        <MyCommentList />
      </SectionCard>

      {/* 좋아요한 글 */}
      <SectionCard>
        <MyLikeList />
      </SectionCard>

      {/* 최근 읽은 뉴스 */}
      <SectionCard>
        <NewsHistoryList />
      </SectionCard>

      {/* 알림 설정 */}
      <SectionCard>
        <NotificationSettings />
      </SectionCard>

      {/* 계정 설정 */}
      <SectionCard>
        <AccountSettings
          nickname={currentNickname}
          provider={currentProvider}
          onNicknameChange={handleNicknameChange}
        />
      </SectionCard>
    </div>
  )
}
