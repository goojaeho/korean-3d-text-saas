import { NextRequest, NextResponse } from 'next/server';
import { getProject, updateProject, deleteProject, logUserActivity } from '@/lib/database';
import type { UpdateProjectData } from '@korean-3d-text/types';

/**
 * 개별 프로젝트 API
 * GET: 프로젝트 상세 조회
 * PUT: 프로젝트 수정
 * DELETE: 프로젝트 삭제
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = 'user_1'; // TODO: 실제 인증에서 가져오기

    const project = await getProject(id, userId);

    if (!project) {
      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: 'NOT_FOUND',
            message: '프로젝트를 찾을 수 없습니다.'
          }
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Project fetch error:', error);
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = 'user_1'; // TODO: 실제 인증에서 가져오기
    const body = await request.json();
    const { title, description, textConfig, isPublic, thumbnailUrl } = body;

    // 프로젝트 업데이트 데이터 준비
    const updateData: UpdateProjectData = {
      title,
      description,
      textConfig,
      isPublic,
      thumbnailUrl
    };

    // 데이터베이스에서 프로젝트 업데이트
    const updatedProject = await updateProject(id, userId, updateData);

    // 사용자 활동 로그 기록
    await logUserActivity(userId, 'update_project', {
      projectId: id,
      title
    });

    return NextResponse.json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    console.error('Project update error:', error);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = 'user_1'; // TODO: 실제 인증에서 가져오기

    // 데이터베이스에서 프로젝트 삭제
    await deleteProject(id, userId);

    // 사용자 활동 로그 기록
    await logUserActivity(userId, 'delete_project', {
      projectId: id
    });

    return NextResponse.json({
      success: true,
      data: {
        message: '프로젝트가 성공적으로 삭제되었습니다.',
        deletedId: id
      }
    });
  } catch (error) {
    console.error('Project delete error:', error);
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