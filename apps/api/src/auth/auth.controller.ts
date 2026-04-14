import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { Response, Request } from 'express'
import { AuthService } from './auth.service'
import { SendCodeDto } from './dto/send-code.dto'
import { VerifyCodeDto } from './dto/verify-code.dto'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { VerifyResetTokenDto } from './dto/verify-reset-token.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { ConfigService } from '@nestjs/config'

@Throttle({ default: { limit: 10, ttl: 60000 } })
@Controller('api/auth')
export class AuthController {
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
    const { refreshToken, ...responseData } = result as typeof result & { refreshToken: string }

    const isProd = this.configService.get<string>('NODE_ENV') === 'production'

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30일
      path: '/',
    })

    return { success: true, data: responseData }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
    })
    return { success: true, data: { message: '로그아웃 되었습니다' } }
  }

  @Post('refresh')
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request) {
    const refreshToken = req.cookies?.['refreshToken'] as string | undefined
    if (!refreshToken) {
      return {
        success: false,
        error: { code: 'UNAUTHORIZED', message: '토큰이 없습니다' },
      }
    }
    const result = await this.authService.refresh(refreshToken)
    return { success: true, data: result }
  }

  // ============================
  // 비밀번호 찾기
  // ============================

  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 300000 } })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const result = await this.authService.forgotPassword(dto)
    return { success: true, message: result.message }
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
    return { success: true, message: result.message }
  }
}
