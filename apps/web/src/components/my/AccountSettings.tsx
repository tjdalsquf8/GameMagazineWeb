// 계정 설정 컴포넌트 — 닉네임 변경 / 비밀번호 변경 / 회원 탈퇴 모달 진입점
'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import EditNicknameModal from './EditNicknameModal'
import EditPasswordModal from './EditPasswordModal'
import DeleteAccountModal from './DeleteAccountModal'

interface AccountSettingsProps {
  nickname: string
  provider: string
  onNicknameChange?: (newNickname: string) => void
}

type ModalType = 'nickname' | 'password' | 'delete' | null

/** 계정 설정 섹션 컴포넌트 */
export default function AccountSettings({
  nickname,
  provider,
  onNicknameChange,
}: AccountSettingsProps) {
  const [openModal, setOpenModal] = useState<ModalType>(null)
  const updateNickname = useAuthStore((state) => state.updateNickname)

  const isEmailProvider = provider === 'email'

  return (
    <section id="section-account" aria-labelledby="section-account-title">
      <div className="mb-4">
        <h2
          id="section-account-title"
          className="text-base font-semibold text-[var(--color-text-primary)]"
        >
          계정 설정
        </h2>
      </div>

      <div className="space-y-1">
        {/* 닉네임 변경 */}
        <button
          type="button"
          onClick={() => setOpenModal('nickname')}
          className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <div className="text-left">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">닉네임 변경</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">현재: {nickname}</p>
          </div>
          <ChevronRight size={16} className="text-[var(--color-text-muted)]" />
        </button>

        {/* 비밀번호 변경 — 이메일 로그인만 노출 */}
        {isEmailProvider && (
          <button
            type="button"
            onClick={() => setOpenModal('password')}
            className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="text-left">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">비밀번호 변경</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                주기적으로 비밀번호를 변경하세요
              </p>
            </div>
            <ChevronRight size={16} className="text-[var(--color-text-muted)]" />
          </button>
        )}

        {/* 구분선 */}
        <div className="my-2 border-t border-[var(--color-border)]" />

        {/* 회원 탈퇴 */}
        <button
          type="button"
          onClick={() => setOpenModal('delete')}
          className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
        >
          <div className="text-left">
            <p className="text-sm font-medium text-red-500">회원 탈퇴</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              탈퇴 시 모든 데이터가 삭제됩니다
            </p>
          </div>
          <ChevronRight size={16} className="text-red-400" />
        </button>
      </div>

      {/* 모달 렌더링 */}
      <EditNicknameModal
        isOpen={openModal === 'nickname'}
        onClose={() => setOpenModal(null)}
        currentNickname={nickname}
        onSuccess={(newNickname) => {
          updateNickname(newNickname)
          onNicknameChange?.(newNickname)
          setOpenModal(null)
          window.location.reload()
        }}
      />
      <EditPasswordModal isOpen={openModal === 'password'} onClose={() => setOpenModal(null)} />
      <DeleteAccountModal isOpen={openModal === 'delete'} onClose={() => setOpenModal(null)} />
    </section>
  )
}
