import {
  Injectable,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  Logger,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import { MailService } from "../mail/mail.service";
import { SendCodeDto } from "./dto/send-code.dto";
import { VerifyCodeDto } from "./dto/verify-code.dto";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { VerifyResetTokenDto } from "./dto/verify-reset-token.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";

interface ResetTokenPayload {
  sub: string;
  purpose: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async sendVerificationCode(dto: SendCodeDto): Promise<{ message: string }> {
    const { email } = dto;

    // 이미 가입된 이메일 확인
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existingUser) {
      throw new ConflictException("이미 가입된 이메일입니다");
    }

    // 5분 내 동일 이메일 3회 초과 발송 확인
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentCount = await this.prisma.emailVerification.count({
      where: {
        email,
        createdAt: { gte: fiveMinutesAgo },
      },
    });
    if (recentCount >= 3) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: "TOO_MANY_REQUESTS",
            message: "잠시 후 다시 시도해주세요",
          },
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // 6자리 랜덤 코드 생성 (crypto 모듈 사용)
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // upsert: 기존 미인증 레코드 있으면 업데이트, 없으면 생성
    await this.prisma.emailVerification.upsert({
      where: { email },
      update: {
        code,
        expiresAt,
        isVerified: false,
        createdAt: new Date(),
      },
      create: {
        email,
        code,
        expiresAt,
        isVerified: false,
      },
    });

    // 메일 발송
    await this.mailService.sendVerificationCode(email, code);

    this.logger.log(`인증 코드 발송: ${email}`);
    return { message: "인증 코드가 발송되었습니다" };
  }

  async verifyCode(dto: VerifyCodeDto): Promise<{ verified: boolean }> {
    const { email, code } = dto;

    const verification = await this.prisma.emailVerification.findUnique({
      where: { email },
    });

    if (!verification) {
      throw new BadRequestException("인증 요청을 찾을 수 없습니다");
    }

    if (verification.code !== code) {
      throw new BadRequestException("인증 코드가 올바르지 않습니다");
    }

    if (verification.expiresAt < new Date()) {
      throw new BadRequestException("인증 코드가 만료되었습니다");
    }

    await this.prisma.emailVerification.update({
      where: { email },
      data: { isVerified: true },
    });

    this.logger.log(`이메일 인증 완료: ${email}`);
    return { verified: true };
  }

  async register(dto: RegisterDto) {
    const { email, nickname, password } = dto;

    // 이메일 인증 확인
    const verification = await this.prisma.emailVerification.findUnique({
      where: { email },
    });
    if (!verification || !verification.isVerified) {
      throw new BadRequestException("이메일 인증이 필요합니다");
    }

    // 이메일 중복 확인
    const existingEmail = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existingEmail) {
      throw new ConflictException("이미 사용 중인 이메일입니다");
    }

    // 닉네임 중복 확인
    const existingNickname = await this.prisma.user.findUnique({
      where: { nickname },
      select: { id: true },
    });
    if (existingNickname) {
      throw new ConflictException("이미 사용 중인 닉네임입니다");
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 12);

    // 유저 생성
    const user = await this.prisma.user.create({
      data: {
        email,
        nickname,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        role: true,
        provider: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // 인증 레코드 삭제
    await this.prisma.emailVerification.delete({
      where: { email },
    });

    this.logger.log(`회원가입 완료: ${email}`);
    return { user };
  }

  async login(
    dto: LoginDto,
  ): Promise<{ user: object; accessToken: string; refreshToken: string }> {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // 이메일 존재 여부를 외부에 노출하지 않음 (계정 열거 공격 방지)
    if (!user || !user.password) {
      throw new UnauthorizedException(
        "이메일 또는 비밀번호가 올바르지 않습니다",
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        "이메일 또는 비밀번호가 올바르지 않습니다",
      );
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: "24h",
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>("JWT_REFRESH_SECRET"),
      expiresIn: "30d",
    });

    this.logger.log(`로그인 완료: ${email}`);

    return {
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
        provider: user.provider,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify<{ sub: string; email: string }>(
        refreshToken,
        {
          secret: this.configService.getOrThrow<string>("JWT_REFRESH_SECRET"),
        },
      );

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true },
      });

      if (!user) {
        throw new UnauthorizedException("유효하지 않은 토큰입니다");
      }

      const newPayload = { sub: user.id, email: user.email };
      const accessToken = this.jwtService.sign(newPayload, {
        expiresIn: "24h",
      });

      return { accessToken };
    } catch {
      throw new UnauthorizedException("유효하지 않은 토큰입니다");
    }
  }

  // ============================
  // 비밀번호 찾기
  // ============================

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const { name, email } = dto;

    const user = await this.prisma.user.findFirst({
      where: { nickname: name, email },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new NotFoundException({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "해당 이름과 이메일로 가입된 계정을 찾을 수 없습니다",
        },
      });
    }

    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.passwordResetToken.upsert({
      where: { email },
      update: {
        code,
        expiresAt,
        createdAt: new Date(),
      },
      create: {
        email,
        code,
        expiresAt,
      },
    });

    await this.mailService.sendPasswordResetCode(email, code);

    this.logger.log(`비밀번호 재설정 코드 발송: ${email}`);
    return { message: "인증 이메일을 발송했습니다." };
  }

  async verifyResetToken(
    dto: VerifyResetTokenDto,
  ): Promise<{ resetToken: string }> {
    const { email, token } = dto;

    const record = await this.prisma.passwordResetToken.findUnique({
      where: { email },
    });

    if (!record) {
      throw new BadRequestException({
        success: false,
        error: {
          code: "RESET_TOKEN_NOT_FOUND",
          message: "비밀번호 재설정 요청을 찾을 수 없습니다",
        },
      });
    }

    if (record.code !== token) {
      throw new BadRequestException({
        success: false,
        error: {
          code: "INVALID_RESET_CODE",
          message: "인증 코드가 올바르지 않습니다",
        },
      });
    }

    if (record.expiresAt < new Date()) {
      throw new BadRequestException({
        success: false,
        error: {
          code: "RESET_CODE_EXPIRED",
          message: "인증 코드가 만료되었습니다",
        },
      });
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      throw new BadRequestException({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "유저를 찾을 수 없습니다",
        },
      });
    }

    // 검증 성공 시 토큰 삭제
    await this.prisma.passwordResetToken.delete({
      where: { email },
    });

    const resetToken = this.jwtService.sign(
      { sub: user.id, purpose: "reset" },
      { expiresIn: "10m" },
    );

    this.logger.log(`비밀번호 재설정 코드 검증 완료: ${email}`);
    return { resetToken };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const { resetToken, newPassword } = dto;

    let payload: ResetTokenPayload;
    try {
      payload = this.jwtService.verify<ResetTokenPayload>(resetToken);
    } catch {
      throw new UnauthorizedException({
        success: false,
        error: {
          code: "INVALID_RESET_TOKEN",
          message: "유효하지 않거나 만료된 토큰입니다",
        },
      });
    }

    if (payload.purpose !== "reset") {
      throw new UnauthorizedException({
        success: false,
        error: {
          code: "INVALID_RESET_TOKEN",
          message: "유효하지 않은 토큰입니다",
        },
      });
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true },
    });

    if (!user) {
      throw new UnauthorizedException({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "유저를 찾을 수 없습니다",
        },
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    this.logger.log(`비밀번호 변경 완료: userId=${user.id}`);
    return { message: "비밀번호가 변경되었습니다." };
  }
}
