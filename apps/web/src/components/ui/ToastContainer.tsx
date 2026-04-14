'use client'

import { useToastStore } from '@/store/toastStore'

export default function ToastContainer() {
  const { toasts, dismissToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={[
            'flex items-center gap-3 px-4 py-3 rounded-md shadow-lg text-sm max-w-sm',
            toast.type === 'success' && 'bg-green-600 text-white',
            toast.type === 'error' && 'bg-red-600 text-white',
            toast.type === 'warning' && 'bg-yellow-500 text-white',
            toast.type === 'info' && 'bg-blue-600 text-white',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <span className="flex-1">{toast.message}</span>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label="알림 닫기"
            className="shrink-0 text-white/80 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
