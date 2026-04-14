import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)
  private transporter: nodemailer.Transporter

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST', 'smtp.naver.com'),
      port: this.configService.get<number>('MAIL_PORT', 465),
      secure: true,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    })
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    const from = this.configService.get<string>('MAIL_FROM', 'Game Magazine')

    await this.transporter.sendMail({
      from,
      to: email,
      subject: '[Game Magazine] 이메일 인증 코드',
      text: `인증 코드: ${code} (5분 이내 입력해주세요)`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #18181b;">[Game Magazine] 이메일 인증</h2>
          <p>아래 인증 코드를 5분 이내에 입력해주세요.</p>
          <div style="background: #f4f4f5; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #18181b;">${code}</span>
          </div>
          <p style="color: #71717a; font-size: 14px;">본인이 요청하지 않은 경우 이 이메일을 무시하세요.</p>
        </div>
      `,
    })

    this.logger.log(`인증 코드 발송 완료: ${email}`)
  }

  async sendPasswordResetCode(email: string, code: string): Promise<void> {
    const from = this.configService.get<string>('MAIL_FROM', 'Game Magazine')

    await this.transporter.sendMail({
      from,
      to: email,
      subject: '[Game Magazine] 비밀번호 재설정',
      text: `비밀번호 재설정 코드: ${code} (10분 이내 입력해주세요)`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #18181b;">[Game Magazine] 비밀번호 재설정</h2>
          <p>아래 인증 코드를 10분 이내에 입력해주세요.</p>
          <div style="background: #f4f4f5; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #18181b;">${code}</span>
          </div>
          <p style="color: #71717a; font-size: 14px;">본인이 요청하지 않은 경우 이 이메일을 무시하세요.</p>
        </div>
      `,
    })

    this.logger.log(`비밀번호 재설정 코드 발송 완료: ${email}`)
  }
}
