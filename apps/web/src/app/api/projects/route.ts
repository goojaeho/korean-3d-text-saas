import { NextRequest, NextResponse } from 'next/server';
import { getUserProjects, createProject, logUserActivity } from '@/lib/database';
import type { CreateProjectData } from '@korean-3d-text/types';

/**
 * 프로젝트 목록 조회 및 생성 API
 * GET: 프로젝트 목록 조회
 * POST: 새 프로젝트 생성
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
            message: '인증이 필요합니다.'
          }
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const userId = searchParams.get('userId') || 'user_1'; // TODO: 실제 인증에서 가져오기

    const result = await getUserProjects(userId, page, limit);

    return NextResponse.json({
      success: true,
      data: result.projects,
      meta: { 
        page: result.page, 
        limit, 
        total: result.total,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    console.error('Projects GET error:', error);
    
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

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '인증이 필요합니다.'
          }
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, textConfig, isPublic = false } = body;
    const userId = 'user_1'; // TODO: 실제 인증에서 가져오기

    // 유효성 검사
    if (!title || title.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '제목은 필수 입력값입니다.'
          }
        },
        { status: 400 }
      );
    }

    if (!textConfig || !textConfig.text) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '텍스트 설정은 필수입니다.'
          }
        },
        { status: 400 }
      );
    }

    // 프로젝트 데이터 준비
    const projectData: CreateProjectData = {
      title,
      description,
      textConfig,
      isPublic
    };

    // 데이터베이스에 프로젝트 생성
    const newProject = await createProject(userId, projectData);

    // 사용자 활동 로그 기록
    await logUserActivity(userId, 'create_project', {
      projectId: newProject.id,
      title
    });

    return NextResponse.json(
      {
        success: true,
        data: newProject
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Projects POST error:', error);
    
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