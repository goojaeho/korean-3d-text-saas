import { throwValidationError } from './errorHandler';

/**
 * 이메일 형식을 검증합니다
 * @param email 검증할 이메일
 */
export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throwValidationError('올바른 이메일 형식이 아닙니다.');
  }
}

/**
 * 필수 필드를 검증합니다
 * @param value 검증할 값
 * @param fieldName 필드명
 */
export function validateRequired(value: unknown, fieldName: string): void {
  if (value === null || value === undefined || value === '') {
    throwValidationError(`${fieldName}은(는) 필수 입력값입니다.`);
  }
}

/**
 * 문자열 길이를 검증합니다
 * @param value 검증할 문자열
 * @param fieldName 필드명
 * @param minLength 최소 길이
 * @param maxLength 최대 길이
 */
export function validateStringLength(
  value: string,
  fieldName: string,
  minLength: number = 0,
  maxLength: number = 255
): void {
  if (value.length < minLength) {
    throwValidationError(`${fieldName}은(는) 최소 ${minLength}자 이상이어야 합니다.`);
  }
  if (value.length > maxLength) {
    throwValidationError(`${fieldName}은(는) 최대 ${maxLength}자 이하여야 합니다.`);
  }
}

/**
 * ID 형식을 검증합니다 (UUID 또는 cuid)
 * @param id 검증할 ID
 * @param fieldName 필드명
 */
export function validateId(id: string, fieldName: string = 'ID'): void {
  validateRequired(id, fieldName);
  
  // cuid 또는 UUID 형식 검증
  const cuidRegex = /^c[a-z0-9]{24}$/;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (!cuidRegex.test(id) && !uuidRegex.test(id)) {
    throwValidationError(`${fieldName} 형식이 올바르지 않습니다.`);
  }
}

/**
 * HTTP 메서드를 검증합니다
 * @param method 요청 메서드
 * @param allowedMethods 허용된 메서드들
 */
export function validateMethod(method: string, allowedMethods: string[]): void {
  if (!allowedMethods.includes(method)) {
    throwValidationError(
      `${method} 메서드는 지원되지 않습니다. 지원되는 메서드: ${allowedMethods.join(', ')}`
    );
  }
}

/**
 * 페이지네이션 파라미터를 검증하고 정규화합니다
 * @param page 페이지 번호
 * @param limit 페이지 크기
 */
export function validatePagination(
  page?: string | number,
  limit?: string | number
): { page: number; limit: number } {
  const parsedPage = Number(page) || 1;
  const parsedLimit = Number(limit) || 10;

  if (parsedPage < 1) {
    throwValidationError('페이지 번호는 1 이상이어야 합니다.');
  }

  if (parsedLimit < 1 || parsedLimit > 100) {
    throwValidationError('페이지 크기는 1-100 사이여야 합니다.');
  }

  return { page: parsedPage, limit: parsedLimit };
}