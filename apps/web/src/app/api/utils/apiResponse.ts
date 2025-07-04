import { VercelResponse } from '@vercel/node';
import { ApiResponse, ErrorCode } from '../types/api';

/**
 * 성공 응답을 생성합니다
 * @param res Vercel Response 객체
 * @param data 응답 데이터
 * @param statusCode HTTP 상태 코드 (기본값: 200)
 */
export function sendSuccess<T>(
  res: VercelResponse,
  data: T,
  statusCode: number = 200
): void {
  const response: ApiResponse<T> = {
    success: true,
    data
  };
  
  res.status(statusCode).json(response);
}

/**
 * 에러 응답을 생성합니다
 * @param res Vercel Response 객체
 * @param code 에러 코드
 * @param message 에러 메시지
 * @param statusCode HTTP 상태 코드
 * @param details 추가 에러 정보
 */
export function sendError(
  res: VercelResponse,
  code: ErrorCode,
  message: string,
  statusCode: number = 500,
  details?: unknown
): void {
  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      details
    }
  };
  
  res.status(statusCode).json(response);
}

/**
 * 페이지네이션이 포함된 성공 응답을 생성합니다
 * @param res Vercel Response 객체
 * @param data 응답 데이터
 * @param meta 페이지네이션 정보
 */
export function sendPaginatedSuccess<T>(
  res: VercelResponse,
  data: T[],
  meta: { page: number; limit: number; total: number }
): void {
  const response: ApiResponse<T[]> = {
    success: true,
    data,
    meta
  };
  
  res.status(200).json(response);
}