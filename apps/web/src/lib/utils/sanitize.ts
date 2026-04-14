// HTML 콘텐츠 XSS 방지 유틸 — DOMPurify 래퍼
// SSR 환경(서버)에서는 DOMPurify를 사용할 수 없으므로 typeof window 체크 필수

import DOMPurify from 'dompurify'

const ALLOWED_TAGS = ['p', 'br', 'img', 'strong', 'em', 'u', 'div', 'span']
const ALLOWED_ATTR = ['src', 'alt', 'style', 'class']

// HTML 문자열을 sanitize하여 XSS 공격 방지
export function sanitizeHTML(dirty: string): string {
  if (typeof window === 'undefined') return dirty
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    FORCE_BODY: true,
  })
}
