// packages/shared/src/validators/index.ts

// ============================
// 정규식
// ============================

// 닉네임: 한글/영문/숫자 2~20자
export const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9]{2,20}$/;

// 비밀번호: 영문+숫자 조합 8자 이상
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

// 인증 코드: 6자리 숫자
export const AUTH_CODE_REGEX = /^\d{6}$/;

// 슬러그: 소문자 영문/숫자/하이픈
export const SLUG_REGEX = /^[a-z0-9-]+$/;

// ============================
// 길이 제한
// ============================

export const NICKNAME_MIN_LENGTH = 2;
export const NICKNAME_MAX_LENGTH = 20;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 100;

export const POST_TITLE_MAX_LENGTH = 100;
export const POST_CONTENT_MIN_LENGTH = 10;

export const COMMENT_MAX_LENGTH = 1000;

export const NEWS_TITLE_MAX_LENGTH = 255;

// ============================
// 에러 메시지 (프론트/백 통일)
// ============================

export const VALIDATION_MESSAGES = {
  NICKNAME_FORMAT: "닉네임은 한글/영문/숫자 2~20자여야 합니다",
  PASSWORD_FORMAT: "비밀번호는 영문+숫자 조합 8자 이상이어야 합니다",
  PASSWORD_CONFIRM: "비밀번호가 일치하지 않습니다",
  AUTH_CODE_FORMAT: "인증 코드는 6자리 숫자여야 합니다",
  EMAIL_FORMAT: "올바른 이메일 형식이 아닙니다",
  POST_TITLE_MAX: `제목은 ${POST_TITLE_MAX_LENGTH}자 이하여야 합니다`,
  POST_CONTENT_MIN: `내용은 ${POST_CONTENT_MIN_LENGTH}자 이상이어야 합니다`,
  COMMENT_MAX: `댓글은 ${COMMENT_MAX_LENGTH}자 이하여야 합니다`,
} as const;
