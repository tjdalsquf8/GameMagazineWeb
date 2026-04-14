import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { ThrottlerException } from '@nestjs/throttler'
import { Response } from 'express'

interface ValidationErrorResponse {
  message: string | string[]
  error: string
  statusCode: number
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    if (exception instanceof ThrottlerException) {
      return response.status(HttpStatus.TOO_MANY_REQUESTS).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: '잠시 후 다시 시도해주세요. (5분에 3회 제한)',
        },
      })
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const exceptionResponse = exception.getResponse()

      // 이미 통일 포맷인 경우 그대로 전달
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'success' in exceptionResponse
      ) {
        return response.status(status).json(exceptionResponse)
      }

      // class-validator 검증 에러
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const validationResponse = exceptionResponse as ValidationErrorResponse
        const message = Array.isArray(validationResponse.message)
          ? validationResponse.message[0]
          : validationResponse.message

        return response.status(status).json({
          success: false,
          error: {
            code: this.getErrorCode(status),
            message,
          },
        })
      }

      // 일반 HttpException
      const message =
        typeof exceptionResponse === 'string' ? exceptionResponse : exception.message

      return response.status(status).json({
        success: false,
        error: {
          code: this.getErrorCode(status),
          message,
        },
      })
    }

    // 알 수 없는 에러
    this.logger.error('Unexpected error', exception instanceof Error ? exception.stack : String(exception))

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '서버 오류가 발생했습니다',
      },
    })
  }

  private getErrorCode(status: number): string {
    const codes: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_SERVER_ERROR',
    }
    return codes[status] ?? 'ERROR'
  }
}
