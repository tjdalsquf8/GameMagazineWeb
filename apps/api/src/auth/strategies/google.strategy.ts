/**
 * Google OAuth 2.0 전략
 * passport-google-oauth20을 사용하여 Google 로그인을 처리한다.
 * validate()에서 Google 프로필 정보를 추출해 AuthService.findOrCreateGoogleUser()를 호출한다.
 */
import { Injectable, Logger } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20'
import { ConfigService } from '@nestjs/config'
import { AuthService } from '../auth.service'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name)

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    })
  }

  /**
   * Google 인증 성공 후 호출되는 콜백
   * profile에서 email, name, picture를 추출해 유저를 조회 또는 생성한다.
   */
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      const email = profile.emails?.[0]?.value
      const nickname = profile.displayName ?? profile.name?.givenName ?? 'User'
      const profileImage = profile.photos?.[0]?.value ?? null

      if (!email) {
        this.logger.warn(`Google 로그인 실패: 이메일 없음 (profileId=${profile.id})`)
        return done(new Error('Google 계정에 이메일 정보가 없습니다'), undefined)
      }

      const user = await this.authService.findOrCreateGoogleUser({
        email,
        nickname,
        profileImage,
      })

      this.logger.log(`Google 로그인 validate 완료: userId=${user.id}`)
      done(null, user)
    } catch (e) {
      this.logger.error('Google validate 실패', e instanceof Error ? e.stack : e)
      done(e as Error, undefined)
    }
  }
}
