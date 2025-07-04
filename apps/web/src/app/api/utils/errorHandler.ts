import { VercelResponse } from '@vercel/node';
import { ErrorCode } from '../types/api';
import { sendError } from './apiResponse';

/**
 * 커스텀 API 에러 클래스
 */
export class ApiError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * 에러를 처리하고 적절한 응답을 보냅니다
 * @param error 발생한 에러
 * @param res Vercel Response 객체
 */
export function handleError(error: unknown, res: VercelResponse): void {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    sendError(res, error.code, error.message, error.statusCode, error.details);
    return;
  }

  if (error instanceof Error) {
    sendError(
      res,
      ErrorCode.SERVER_ERROR,
      '서버 오류가 발생했습니다.',
      500,
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
    return;
  }

  sendError(
    res,
    ErrorCode.SERVER_ERROR,
    '알 수 없는 오류가 발생했습니다.',
    500
  );
}

/**
 * 인증되지 않은 요청에 대한 에러를 던집니다
 */
export function throwUnauthorized(message: string = '인증이 필요합니다.'): never {
  throw new ApiError(ErrorCode.UNAUTHORIZED, message, 401);
}

/**
 * 권한이 없는 요청에 대한 에러를 던집니다
 */
export function throwForbidden(message: string = '권한이 없습니다.'): never {
  throw new ApiError(ErrorCode.FORBIDDEN, message, 403);
}

/**
 * 리소스를 찾을 수 없는 경우 에러를 던집니다
 */
export function throwNotFound(message: string = '리소스를 찾을 수 없습니다.'): never {
  throw new ApiError(ErrorCode.NOT_FOUND, message, 404);
}

/**
 * 유효성 검사 에러를 던집니다
 */
export function throwValidationError(message: string, details?: unknown): never {
  throw new ApiError(ErrorCode.VALIDATION_ERROR, message, 400, details);
}