import { VercelRequest, VercelResponse } from '@vercel/node';
import { sendSuccess } from '../utils/apiResponse';
import { handleError, throwUnauthorized } from '../utils/errorHandler';
import { validateMethod } from '../utils/validation';
import { Session, User } from '../types/api';

/**
 * 세션 확인 API
 * 현재 사용자의 세션 정보를 반환합니다
 * @param req Vercel Request 객체
 * @param res Vercel Response 객체
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  try {
    // GET 메서드만 허용
    validateMethod(req.method || '', ['GET']);

    // TODO: 실제 인증 로직 구현 필요
    // 현재는 모키 데이터로 응답
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throwUnauthorized('인증 토큰이 필요합니다.');
    }

    // 임시 사용자 데이터 (실제로는 JWT 토큰 검증 필요)
    const mockUser: User = {
      id: 'user_1',
      email: 'test@example.com',
      name: '테스트 사용자',
      plan: 'FREE',
      credits: 10,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };

    const session: Session = {
      user: mockUser,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24시간 후
    };

    sendSuccess(res, session);
  } catch (error) {
    handleError(error, res);
  }
}