import { NextRequest, NextResponse } from 'next/server';

/**
 * 헬스체크 API
 * 서버 상태와 기본 정보를 반환합니다
 */
export async function GET(request: NextRequest) {
  try {
    const healthData = {
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        service: 'Korean 3D Text SaaS API',
        environment: process.env.NODE_ENV || 'development'
      }
    };

    return NextResponse.json(healthData);
  } catch (error) {
    console.error('Health check error:', error);
    
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