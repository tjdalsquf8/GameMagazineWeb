// 마이페이지 사이드바 프로필 카드 — 아바타(이미지 업로드 포함), 닉네임/이메일, 메뉴 네비게이션
'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LogOut, Camera, Loader2, Shield } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'
import { getPresignedUrl, updateProfileImage } from '@/lib/api/my.api'
import type { MyProfile } from '@/types/my.types'

/** 프로필 이미지 최대 허용 크기 (10MB) */
const MAX_FILE_SIZE = 10 * 1024 * 1024

interface ProfileCardProps {
  profile: MyProfile | null
  isLoading: boolean
  activeSection: string
  onSectionClick: (section: string) => void
}

/** 메뉴 항목 정의 */
const MENU_ITEMS = [
  { id: 'posts', label: '내 게시글', countKey: 'posts' as const, href: '/my/posts' },
  { id: 'comments', label: '내가 쓴 댓글', countKey: 'comments' as const, href: '/my/comments' },
  { id: 'likes', label: '좋아요한 글', countKey: 'likes' as const, href: '/my/likes' },
  { id: 'newsHistory', label: '최근 읽은 뉴스', countKey: null, href: null },
] as const

const SETTINGS_ITEMS = [
  { id: 'notifications', label: '알림 설정', href: null },
  { id: 'account', label: '계정 설정', href: null },
] as const

/** 프로필 스켈레톤 — 로딩 상태에서 사용 */
export function ProfileCardSkeleton() {
  return (
    <div className="bg-[var(--color-surface)] rounded-2xl p-5 animate-pulse">
      <div className="flex flex-col items-center gap-3 pb-5 border-b border-[var(--color-border)]">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-32 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="mt-4 space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 rounded-lg bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>
    </div>
  )
}

/** 마이페이지 사이드바 프로필 카드 컴포넌트 */
export default function ProfileCard({
  profile,
  isLoading,
  activeSection,
  onSectionClick,
}: ProfileCardProps) {
  const { logout } = useAuth()
  const updateProfileImageStore = useAuthStore((s) => s.updateProfileImage)
  const storeProfileImage = useAuthStore((s) => s.user?.profileImage ?? null)
  const userRole = useAuthStore((s) => s.user?.role ?? null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  if (isLoading) return <ProfileCardSkeleton />

  const avatarChar = profile?.nickname?.charAt(0)?.toUpperCase() ?? '?'
  // store의 값이 최신이므로 store 우선, 없으면 서버 프로필 값 사용
  const profileImage = storeProfileImage ?? profile?.profileImage ?? null

  /** 파일 선택 시 presigned URL 발급 → R2 PUT 업로드 → 서버 저장 → 전역 상태 반영 */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 파일 크기 초과 시 조용히 무시 (추후 토스트로 개선 예정)
    if (file.size > MAX_FILE_SIZE) return

    setIsUploading(true)
    try {
      // 1. Presigned URL 발급
      const presignedRes = await getPresignedUrl(file.type, file.size, 'profiles')
      if (!presignedRes.success) return

      const { uploadUrl, publicUrl } = presignedRes.data

      // 2. R2에 직접 PUT 업로드
      const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      })
      if (!putRes.ok) return

      // 3. 서버에 publicUrl 저장
      const saveRes = await updateProfileImage(publicUrl)
      if (!saveRes.success) return

      // 4. 전역 상태(authStore) 업데이트 → ProfileCard 즉시 반영
      updateProfileImageStore(publicUrl)
    } catch {
      // 에러 발생 시 조용히 무시 (추후 토스트로 개선 예정)
    } finally {
      setIsUploading(false)
      // input value 초기화 — 같은 파일 재선택 가능하도록
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl overflow-hidden shadow-sm">
      {/* 아바타 + 기본 정보 */}
      <div className="p-5 pb-4">
        <div className="flex flex-col items-center gap-2 pb-4 border-b border-[var(--color-border)]">
          {/* 클릭 가능한 아바타 — 카메라 오버레이 포함 */}
          <div
            className="relative group cursor-pointer"
            onClick={() => !isUploading && fileInputRef.current?.click()}
            role="button"
            aria-label="프로필 이미지 변경"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                if (!isUploading) fileInputRef.current?.click()
              }
            }}
          >
            {/* 실제 이미지 또는 그라디언트 아바타 */}
            {profileImage ? (
              <Image
                src={profileImage}
                alt={`${profile?.nickname ?? '사용자'} 프로필 이미지`}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white select-none bg-gradient-to-br from-violet-600 to-blue-600"
                aria-label={`${profile?.nickname ?? '사용자'} 아바타`}
              >
                {avatarChar}
              </div>
            )}

            {/* 카메라 오버레이 — hover 시 표시, 업로드 중에는 스피너 */}
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {isUploading ? (
                <Loader2 size={18} className="text-white animate-spin" />
              ) : (
                <Camera size={18} className="text-white" />
              )}
            </div>

            {/* 숨겨진 파일 input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="text-center">
            <p className="font-semibold text-[var(--color-text-primary)] text-sm">
              {profile?.nickname ?? '-'}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{profile?.email ?? '-'}</p>
          </div>
        </div>

        {/* 주요 메뉴 */}
        <nav className="mt-3 space-y-0.5" aria-label="마이페이지 메뉴">
          {MENU_ITEMS.map((item) => {
            const isActive = activeSection === item.id
            const count = item.countKey ? profile?._count[item.countKey] : null

            const content = (
              <span className="flex items-center justify-between w-full">
                <span>{item.label}</span>
                {count !== null && count !== undefined && (
                  <span
                    className={[
                      'text-xs font-medium px-1.5 py-0.5 rounded-full',
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[var(--color-border)] text-[var(--color-text-muted)]',
                    ].join(' ')}
                  >
                    {count}
                  </span>
                )}
              </span>
            )

            const className = [
              'w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors duration-150',
              isActive
                ? 'bg-primary text-primary-foreground font-medium'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]/40',
            ].join(' ')

            if (item.href) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={className}
                  onClick={() => onSectionClick(item.id)}
                >
                  {content}
                </Link>
              )
            }

            return (
              <button
                key={item.id}
                type="button"
                className={className}
                onClick={() => onSectionClick(item.id)}
              >
                {content}
              </button>
            )
          })}
        </nav>

        {/* 구분선 */}
        <div className="my-3 border-t border-[var(--color-border)]" />

        {/* 설정 메뉴 */}
        <nav className="space-y-0.5" aria-label="설정 메뉴">
          {SETTINGS_ITEMS.map((item) => {
            const isActive = activeSection === item.id
            const className = [
              'w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors duration-150',
              isActive
                ? 'bg-primary text-primary-foreground font-medium'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]/40',
            ].join(' ')

            return (
              <button
                key={item.id}
                type="button"
                className={className}
                onClick={() => onSectionClick(item.id)}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* 구분선 */}
        <div className="my-3 border-t border-[var(--color-border)]" />

        {/* 관리자 페이지 링크 — ADMIN 역할인 경우에만 표시 */}
        {userRole === 'ADMIN' && (
          <>
            <Link
              href="/admin"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]/40 transition-colors duration-150"
            >
              <Shield size={14} />
              관리자 페이지
            </Link>
            <div className="my-3 border-t border-[var(--color-border)]" />
          </>
        )}

        {/* 로그아웃 */}
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-150"
        >
          <LogOut size={14} />
          로그아웃
        </button>
      </div>
    </div>
  )
}
