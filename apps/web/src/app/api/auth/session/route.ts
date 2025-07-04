import { NextRequest, NextResponse } from 'next/server';

/**
 * 세션 확인 API
 * 현재 사용자의 세션 정보를 반환합니다
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '인증 토큰이 필요합니다.'
          }
        },
        { status: 401 }
      );
    }

    // 임시 사용자 데이터 (실제로는 JWT 토큰 검증 필요)
    const sessionData = {
      user: {
        id: 'user_1',
        email: 'test@example.com',
        name: '테스트 사용자',
        plan: 'FREE',
        credits: 10,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    return NextResponse.json({
      success: true,
      data: sessionData
    });
  } catch (error) {
    console.error('Session API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: '서버 오류가 발생했습니다.'
        }
      },
      { status: 500 }
    );
  }
}