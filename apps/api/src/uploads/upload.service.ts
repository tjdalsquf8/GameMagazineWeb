// 이미지 업로드 서비스 - Cloudflare R2 presigned URL 생성 로직 담당
import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'
import { PresignedUrlDto } from './dto/presigned-url.dto'

// 허용된 이미지 MIME 타입 목록
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']

// 최대 파일 크기 (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024

// MIME 타입과 파일 확장자 매핑
const MIME_TO_EXT: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
}

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name)
  private readonly s3Client: S3Client

  // ConfigService를 통해 R2 자격증명을 주입받아 S3 클라이언트 초기화
  constructor(private readonly config: ConfigService) {
    const accountId = this.config.getOrThrow<string>('R2_ACCOUNT_ID')
    // R2 S3 호환 클라이언트 초기화
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.config.getOrThrow<string>('R2_ACCESS_KEY_ID'),
        secretAccessKey: this.config.getOrThrow<string>('R2_SECRET_ACCESS_KEY'),
      },
    })
  }

  // presigned URL 생성 메서드 - R2에 직접 업로드할 수 있는 서명된 URL 발급
  async generatePresignedUrl(dto: PresignedUrlDto, userId: string): Promise<{ uploadUrl: string; publicUrl: string }> {
    // MIME 타입 검증
    if (!ALLOWED_MIME_TYPES.includes(dto.contentType)) {
      throw new BadRequestException('허용되지 않는 파일 형식입니다.')
    }

    // 파일 크기 검증
    if (dto.fileSize > MAX_FILE_SIZE) {
      throw new BadRequestException('파일 크기가 10MB를 초과합니다.')
    }

    const ext = MIME_TO_EXT[dto.contentType]
    const folder = dto.folder ?? 'posts'
    const key = `${folder}/${userId}/${randomUUID()}.${ext}`
    const bucket = this.config.getOrThrow<string>('R2_BUCKET_NAME')
    const publicUrl = `${this.config.getOrThrow<string>('R2_PUBLIC_URL')}/${key}`

    // PutObject 커맨드로 presigned URL 생성 (유효시간 5분)
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: dto.contentType,
    })

    const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 300 })

    this.logger.log(`Presigned URL 생성 완료: userId=${userId}, key=${key}`)

    return { uploadUrl, publicUrl }
  }
}
