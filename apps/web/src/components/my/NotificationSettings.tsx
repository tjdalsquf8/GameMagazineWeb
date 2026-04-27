// 알림 설정 컴포넌트 — 토글 UI, 낙관적 업데이트 + 실패 시 롤백
'use client'

import { useState } from 'react'
import { useUpdateNotifications } from '@/hooks/useMyMutations'
import type { NotificationSettings as NotificationSettingsType } from '@/types/my.types'

/** 알림 설정 초기값 */
const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettingsType = {
  postComment: false,
  lckResult: false,
  marketing: false,
}

/** 토글 스위치 컴포넌트 */
function Toggle({
  checked,
  onChange,
  disabled,
  id,
}: {
  checked: boolean
  onChange: (val: boolean) => void
  disabled?: boolean
  id: string
}) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={[
        'relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        checked ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      <span
        className={[
          'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 mt-0.5',
          checked ? 'translate-x-4' : 'translate-x-0.5',
        ].join(' ')}
      />
    </button>
  )
}

/** 알림 설정 토글 항목 정의 */
const NOTIFICATION_ITEMS: {
  key: keyof NotificationSettingsType
  label: string
  description: string
}[] = [
  {
    key: 'postComment',
    label: '내 게시글 댓글 알림',
    description: '내가 작성한 게시글에 댓글이 달리면 알려드립니다.',
  },
  {
    key: 'lckResult',
    label: 'LCK 경기 결과 알림',
    description: 'LCK 경기가 끝나면 결과를 알려드립니다.',
  },
  {
    key: 'marketing',
    label: '마케팅 수신',
    description: '이벤트 및 프로모션 정보를 받아보실 수 있습니다.',
  },
]

/** 알림 설정 섹션 컴포넌트 */
export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettingsType>(DEFAULT_NOTIFICATION_SETTINGS)
  const { mutate } = useUpdateNotifications()

  /** 토글 변경 — 낙관적 업데이트 후 실패 시 롤백 */
  const handleToggle = async (key: keyof NotificationSettingsType, value: boolean) => {
    const prev = settings[key]
    // 낙관적 업데이트
    setSettings((s) => ({ ...s, [key]: value }))

    const success = await mutate({ [key]: value }, () => {
      // 롤백
      setSettings((s) => ({ ...s, [key]: prev }))
    })

    if (success) {
      setSettings((s) => ({ ...s, [key]: value }))
    }
  }

  return (
    <section id="section-notifications" aria-labelledby="section-notifications-title">
      <div className="mb-4">
        <h2
          id="section-notifications-title"
          className="text-base font-semibold text-[var(--color-text-primary)]"
        >
          알림 설정
        </h2>
      </div>

      <div className="space-y-4">
        {NOTIFICATION_ITEMS.map((item) => (
          <div key={item.key} className="flex items-center justify-between gap-4">
            <div>
              <label
                htmlFor={`toggle-${item.key}`}
                className="text-sm font-medium text-[var(--color-text-primary)] cursor-pointer"
              >
                {item.label}
              </label>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{item.description}</p>
            </div>
            <Toggle
              id={`toggle-${item.key}`}
              checked={settings[item.key]}
              onChange={(val) => handleToggle(item.key, val)}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
