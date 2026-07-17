// HTML 콘텐츠 XSS 방지 유틸 — 브라우저 전용 DOMPurify 래퍼 (클라이언트 컴포넌트에서만 호출)
// [SECURITY] XSS 방어 - DOMPurify로 사용자 입력 HTML sanitize
// sanitize-html 취약점(CVE: xmp 태그 XSS bypass) 대응으로 최신 버전 유지 필요
// dangerouslySetInnerHTML 사용 시 반드시 이 함수를 거쳐야 함

import DOMPurify from 'dompurify'

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

// 카드뉴스 전용 sanitize — 관리자 전용 AI 생성 콘텐츠이므로 인라인 style 허용
const CARD_ALLOWED_TAGS = [
  'p',
  'br',
  'img',
  'strong',
  'em',
  'u',
  'b',
  'i',
  'div',
  'span',
  'section',
  'article',
  'header',
  'footer',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'figure',
  'figcaption',
  'button',
]
const CARD_ALLOWED_ATTR = ['src', 'alt', 'class', 'style', 'width', 'height']

export function sanitizeCardNewsHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: CARD_ALLOWED_TAGS,
    ALLOWED_ATTR: CARD_ALLOWED_ATTR,
    FORCE_BODY: true,
  })
}
