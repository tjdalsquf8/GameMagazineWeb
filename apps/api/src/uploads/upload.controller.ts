// 이미지 업로드 컨트롤러 - presigned URL 발급 엔드포인트 담당
import { Body, Controller, Post, UseGuards, Request, Logger } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { UploadService } from './upload.service'
import { PresignedUrlDto } from './dto/presigned-url.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

// JWT 인증된 요청 타입 정의
interface AuthenticatedRequest {
  user: {
    id: string
    email: string
    role: string
  }
}

@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadController {
  private readonly logger = new Logger(UploadController.name)

  constructor(private readonly uploadService: UploadService) {}

  // presigned URL 발급 엔드포인트 - 10회/분 rate limit 적용
  @Post('presigned-url')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async getPresignedUrl(
    @Body() dto: PresignedUrlDto,
    @Request() req: AuthenticatedRequest,
  ) {
    this.logger.log(`Presigned URL 요청: userId=${req.user.id}, contentType=${dto.contentType}`)
    const data = await this.uploadService.generatePresignedUrl(dto, req.user.id)
    return { success: true as const, data }
  }
}
