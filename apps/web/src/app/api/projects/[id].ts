import { VercelRequest, VercelResponse } from '@vercel/node';
import { sendSuccess } from '../utils/apiResponse';
import { handleError, throwUnauthorized, throwNotFound, throwForbidden } from '../utils/errorHandler';
import { validateMethod, validateId, validateRequired, validateStringLength } from '../utils/validation';
import { Project, TextConfig } from '../types/api';

/**
 * 특정 프로젝트 조회, 수정, 삭제 API
 * GET: 프로젝트 상세 조회
 * PUT: 프로젝트 수정
 * DELETE: 프로젝트 삭제
 * @param req Vercel Request 객체
 * @param res Vercel Response 객체
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  try {
    validateMethod(req.method || '', ['GET', 'PUT', 'DELETE']);

    // 인증 확인 (임시)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throwUnauthorized();
    }

    const projectId = req.query.id as string;
    validateId(projectId, '프로젝트 ID');

    if (req.method === 'GET') {
      await handleGetProject(req, res, projectId);
    } else if (req.method === 'PUT') {
      await handleUpdateProject(req, res, projectId);
    } else if (req.method === 'DELETE') {
      await handleDeleteProject(req, res, projectId);
    }
  } catch (error) {
    handleError(error, res);
  }
}

/**
 * 프로젝트 상세 조회 처리
 */
async function handleGetProject(
  req: VercelRequest,
  res: VercelResponse,
  projectId: string
): Promise<void> {
  // TODO: 실제 데이터베이스 조회 로직 구현
  const mockProject: Project = {
    id: projectId,
    title: '샘플 프로젝트',
    description: '프로젝트 상세 설명',
    textConfig: {
      text: '안녕하세요',
      color: '#3b82f6',
      fontSize: 48,
      fontFamily: 'Noto Sans KR',
      animationType: 'rotate'
    },
    thumbnailUrl: undefined,
    isPublic: false,
    userId: 'user_1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  // 프로젝트가 존재하지 않는 경우
  if (projectId === 'nonexistent') {
    throwNotFound('프로젝트를 찾을 수 없습니다.');
  }

  // 권한 확인: 공개 프로젝트이거나 소유자인 경우만 조회 가능
  const currentUserId = 'user_1'; // 실제로는 인증된 사용자 ID
  if (!mockProject.isPublic && mockProject.userId !== currentUserId) {
    throwForbidden('이 프로젝트에 접근할 권한이 없습니다.');
  }

  sendSuccess(res, mockProject);
}

/**
 * 프로젝트 수정 처리
 */
async function handleUpdateProject(
  req: VercelRequest,
  res: VercelResponse,
  projectId: string
): Promise<void> {
  const { title, description, textConfig, isPublic } = req.body as {
    title?: string;
    description?: string;
    textConfig?: TextConfig;
    isPublic?: boolean;
  };

  // 유효성 검사
  if (title !== undefined) {
    validateRequired(title, '제목');
    validateStringLength(title, '제목', 1, 100);
  }

  if (description !== undefined) {
    validateStringLength(description, '설명', 0, 500);
  }

  if (textConfig) {
    validateRequired(textConfig.text, '텍스트');
    validateStringLength(textConfig.text, '텍스트', 1, 200);
  }

  // TODO: 소유자 확인 및 실제 데이터베이스 업데이트 로직 구현
  const currentUserId = 'user_1'; // 실제로는 인증된 사용자 ID
  
  const updatedProject: Project = {
    id: projectId,
    title: title || '기존 제목',
    description: description || undefined,
    textConfig: textConfig || {
      text: '기존 텍스트',
      color: '#3b82f6',
      fontSize: 48,
      fontFamily: 'Noto Sans KR',
      animationType: 'rotate'
    },
    thumbnailUrl: undefined,
    isPublic: isPublic ?? false,
    userId: currentUserId,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  };

  sendSuccess(res, updatedProject);
}

/**
 * 프로젝트 삭제 처리
 */
async function handleDeleteProject(
  req: VercelRequest,
  res: VercelResponse,
  projectId: string
): Promise<void> {
  // TODO: 소유자 확인 및 실제 데이터베이스 삭제 로직 구현
  const currentUserId = 'user_1'; // 실제로는 인증된 사용자 ID

  sendSuccess(res, { 
    message: '프로젝트가 성공적으로 삭제되었습니다.',
    deletedId: projectId 
  });
}