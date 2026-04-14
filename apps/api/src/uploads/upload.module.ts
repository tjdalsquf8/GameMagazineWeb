// 이미지 업로드 모듈 - Cloudflare R2 presigned URL 발급 담당
import { Module } from '@nestjs/common'
import { UploadController } from './upload.controller'
import { UploadService } from './upload.service'

@Module({
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
