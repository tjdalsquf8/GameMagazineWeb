// apps/api/src/common/pipes/parse-cuid.pipe.ts
// cuid 형식 경로 파라미터 검증 파이프 — 형식 불일치 시 BadRequestException 반환

import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'

// cuid v1 형식: 'c' + 소문자/숫자 24자 = 총 25자
const CUID_REGEX = /^c[a-z0-9]{24}$/

@Injectable()
export class ParseCuidPipe implements PipeTransform<string, string> {
  // 입력값이 cuid 형식인지 검증하여 반환
  transform(value: string): string {
    if (!CUID_REGEX.test(value)) {
      throw new BadRequestException({
        code: 'VAL_001',
        message: '유효하지 않은 ID 형식입니다',
      })
    }
    return value
  }
}
