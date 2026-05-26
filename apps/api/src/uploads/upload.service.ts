// 이미지 업로드 서비스 - Cloudflare R2 presigned URL 생성 및 Magic Number 검증 로직 담당
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
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

// JPEG Magic Number: FF D8 FF
const MAGIC_JPEG = [0xff, 0xd8, 0xff]

// PNG Magic Number: 89 50 4E 47
const MAGIC_PNG = [0x89, 0x50, 0x4e, 0x47]

// WEBP Magic Number: RIFF(4바이트) + ??(4바이트) + WEBP(4바이트)
const MAGIC_WEBP_RIFF = [0x52, 0x49, 0x46, 0x46]
const MAGIC_WEBP_WEBP = [0x57, 0x45, 0x42, 0x50]

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
      // R2는 AWS SDK v3의 자동 CRC32 체크섬을 지원하지 않아 403 반환 — 필요 시에만 계산
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
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

  // 업로드된 파일의 Magic Number를 검증하는 메서드 - 검증 실패 시 R2에서 즉시 삭제
  async verifyUpload(publicUrl: string): Promise<void> {
    const r2PublicUrl = this.config.getOrThrow<string>('R2_PUBLIC_URL')

    // publicUrl이 허용된 R2 도메인으로 시작하는지 확인
    if (!publicUrl.startsWith(`${r2PublicUrl}/`)) {
      throw new BadRequestException('유효하지 않은 파일 URL입니다.')
    }

    // publicUrl에서 R2 키 추출
    const key = publicUrl.slice(`${r2PublicUrl}/`.length)

    let bytes: Uint8Array
    try {
      // Range 헤더로 첫 12바이트만 가져오기
      const response = await fetch(publicUrl, { headers: { Range: 'bytes=0-11' } })
      if (!response.ok) {
        throw new Error(`R2 파일 fetch 실패: status=${response.status}`)
      }
      const buffer = await response.arrayBuffer()
      bytes = new Uint8Array(buffer)
    } catch (e) {
      this.logger.error(`verifyUpload fetch 실패: key=${key}`, e instanceof Error ? e.stack : e)
      throw new InternalServerErrorException('파일 검증 중 오류가 발생했습니다.')
    }

    // Magic Number 검증 실패 시 R2에서 파일 삭제 후 예외 발생
    if (!this.checkMagicNumber(bytes)) {
      this.logger.warn(`Magic Number 검증 실패 - 파일 삭제: key=${key}`)
      await this.deleteFromR2(key)
      throw new BadRequestException('허용되지 않는 파일 형식입니다. 실제 파일 내용이 이미지가 아닙니다.')
    }

    this.logger.log(`Magic Number 검증 성공: key=${key}`)
  }

  // 파일 첫 12바이트로 JPEG/PNG/WEBP Magic Number를 검사하는 private 메서드
  private checkMagicNumber(bytes: Uint8Array): boolean {
    if (bytes.length < 12) {
      return false
    }

    // JPEG 검증: FF D8 FF
    const isJpeg = MAGIC_JPEG.every((byte, i) => bytes[i] === byte)
    if (isJpeg) return true

    // PNG 검증: 89 50 4E 47
    const isPng = MAGIC_PNG.every((byte, i) => bytes[i] === byte)
    if (isPng) return true

    // WEBP 검증: bytes[0-3] = RIFF AND bytes[8-11] = WEBP
    const isRiff = MAGIC_WEBP_RIFF.every((byte, i) => bytes[i] === byte)
    const isWebpSignature = MAGIC_WEBP_WEBP.every((byte, i) => bytes[8 + i] === byte)
    if (isRiff && isWebpSignature) return true

    return false
  }

  // R2에서 파일을 삭제하는 private 메서드 - 검증 실패한 악성 파일 제거용
  private async deleteFromR2(key: string): Promise<void> {
    try {
      const bucket = this.config.getOrThrow<string>('R2_BUCKET_NAME')
      const command = new DeleteObjectCommand({ Bucket: bucket, Key: key })
      await this.s3Client.send(command)
      this.logger.log(`R2 파일 삭제 완료: key=${key}`)
    } catch (e) {
      this.logger.error(`R2 파일 삭제 실패: key=${key}`, e instanceof Error ? e.stack : e)
    }
  }
}
