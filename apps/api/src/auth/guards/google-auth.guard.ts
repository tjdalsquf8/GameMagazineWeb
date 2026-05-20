/**
 * Google OAuth 인증 가드
 * passport-google-oauth20 전략을 사용하는 Passport 가드.
 * GET /auth/google 진입 시 Google 인증 페이지로 리다이렉트하고,
 * GET /auth/google/callback 진입 시 Google 콜백을 처리한다.
 */
import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {}
