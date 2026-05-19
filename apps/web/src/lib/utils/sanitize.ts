// HTML 콘텐츠 XSS 방지 유틸 — isomorphic-dompurify 래퍼 (SSR/CSR 모두 동작)

import DOMPurify from 'isomorphic-dompurify'

const ALLOWED_TAGS = ['p', 'br', 'img', 'strong', 'em', 'u', 'div', 'span']
const ALLOWED_ATTR = ['src', 'alt', 'class']

// HTML 문자열을 sanitize하여 XSS 공격 방지
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    FORCE_BODY: true,
  })
}
