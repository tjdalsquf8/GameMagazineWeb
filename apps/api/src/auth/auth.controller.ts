import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
  Logger,
} from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { Response, Request } from 'express'
import { Role } from '@prisma/client'
import { AuthService } from './auth.service'
import { SendCodeDto } from './dto/send-code.dto'
import { VerifyCodeDto } from './dto/verify-code.dto'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { VerifyResetTokenDto } from './dto/verify-reset-token.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { VerifyPasswordDto } from './dto/verify-password.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { GoogleAuthGuard } from './guards/google-auth.guard'
import { ConfigService } from '@nestjs/config'

interface AuthenticatedRequest extends Request {
  user: {
    id: string
    role: Role
  }
}

interface GoogleAuthenticatedRequest extends Request {
  user: {
    id: string
    email: string
    nickname: string
    role: string
    provider: string
    profileImage: string | null
    createdAt: Date
    updatedAt: Date
    isBanned: boolean
    bannedUntil: Date | null
  }
}

@Throttle({ default: { limit: 10, ttl: 60000 } })
// setGlobalPrefix('api')로 /api prefix가 자동 적용되므로 'auth'만 선언
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name)

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('email/send-code')
  @Throttle({ default: { limit: 3, ttl: 300000 } })
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() dto: SendCodeDto) {
    const result = await this.authService.sendVerificationCode(dto)
    return { success: true, data: result }
  }

  @Post('email/verify-code')
  @HttpCode(HttpStatus.OK)
  async verifyCode(@Body() dto: VerifyCodeDto) {
    const result = await this.authService.verifyCode(dto)
    return { success: true, data: result }
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.register(dto)
    return { success: true, data: result }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto)
    const { refreshToken, rememberMe, ...responseData } = result

    const isProd = this.configService.get<string>('NODE_ENV') === 'production'

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'strict',
      // rememberMe: 30일 유지 / 미체크: 브라우저 닫으면 만료 (session cookie)
      ...(rememberMe ? { maxAge: 30 * 24 * 60 * 60 * 1000 } : {}),
      path: '/',
    })

    // accessToken을 HttpOnly 쿠키로 설정 — XSS로 인한 JS 접근 차단
    res.cookie('accessToken', responseData.accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'strict',
      maxAge: 3600000, // 1시간
      path: '/',
    })

    return { success: true, data: responseData }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.['refreshToken'] as string | undefined
    if (refreshToken) {
      await this.authService.logout(refreshToken)
    }
    const isProd = this.configService.get<string>('NODE_ENV') === 'production'
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'strict',
      path: '/',
    })
    // accessToken HttpOnly 쿠키도 함께 정리
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'strict',
      path: '/',
    })
    return { success: true, data: { message: '로그아웃 되었습니다' } }
  }

  @Post('refresh')
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.['refreshToken'] as string | undefined
    if (!refreshToken) {
      return {
        success: false,
        error: { code: 'UNAUTHORIZED', message: '토큰이 없습니다' },
      }
    }
    const result = await this.authService.refresh(refreshToken)

    // Rotation: 새 refresh token을 쿠키에 재설정
    const isProd = this.configService.get<string>('NODE_ENV') === 'production'
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
    })

    // accessToken을 HttpOnly 쿠키로 설정 — XSS로 인한 JS 접근 차단
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'strict',
      maxAge: 3600000, // 1시간
      path: '/',
    })

    return { success: true, data: { accessToken: result.accessToken } }
  }

  // ============================
  // 비밀번호 찾기
  // ============================

  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 300000 } })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const result = await this.authService.forgotPassword(dto)
    return { success: true, data: { message: result.message } }
  }

  @Post('verify-reset-token')
  @HttpCode(HttpStatus.OK)
  async verifyResetToken(@Body() dto: VerifyResetTokenDto) {
    const result = await this.authService.verifyResetToken(dto)
    return { success: true, data: result }
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const result = await this.authService.resetPassword(dto)
    return { success: true, data: { message: result.message } }
  }

  // ============================
  // 어드민 비밀번호 재확인
  // ============================

  /** POST /auth/verify-password — 어드민 페이지 접근 전 비밀번호 재확인 (로그인 유저 전용) */
  @Post('verify-password')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  async verifyPassword(
    @Body() dto: VerifyPasswordDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const result = await this.authService.verifyPassword(req.user.id, dto)

    if (!result.verified) {
      return {
        success: false,
        error: { code: 'AUTH_001', message: '비밀번호가 올바르지 않습니다' },
      }
    }

    return { success: true, data: { verified: true } }
  }

  // ============================
  // 내 정보 조회 (OAuth 콜백 후 사용)
  // ============================

  /** GET /auth/me — 쿠키의 accessToken으로 현재 유저 정보 반환 */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  getMe(@Req() req: AuthenticatedRequest & { user: Record<string, unknown> }) {
    return { success: true, data: req.user }
  }

  // ============================
  // Google OAuth
  // ============================

  /** GET /auth/google — Google 로그인 시작: Google 인증 페이지로 리다이렉트 */
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    // GoogleAuthGuard가 자동으로 Google 인증 페이지로 리다이렉트하므로 본문 불필요
  }

  /**
   * GET /auth/google/callback — Google OAuth 콜백 처리
   * 토큰을 HttpOnly 쿠키로 세팅 후 프론트엔드로 리다이렉트한다.
   * 실패 시 /login?error=oauth 로 리다이렉트한다.
   */
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(
    @Req() req: GoogleAuthenticatedRequest,
    @Res() res: Response,
  ) {
    const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL')
    const isProd = this.configService.get<string>('NODE_ENV') === 'production'

    try {
      const { accessToken, refreshToken } = await this.authService.loginWithGoogle(req.user)

      // refreshToken — HttpOnly, 30일 유지
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: '/',
      })

      // accessToken — HttpOnly, 1시간 유지
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'strict',
        maxAge: 3600000,
        path: '/',
      })

      this.logger.log(`Google 콜백 성공: userId=${req.user.id}`)
      return res.redirect(`${frontendUrl}/auth/google/callback`)
    } catch (e) {
      this.logger.error('Google 콜백 처리 실패', e instanceof Error ? e.stack : e)
      return res.redirect(`${frontendUrl}/login?error=oauth`)
    }
  }
}
