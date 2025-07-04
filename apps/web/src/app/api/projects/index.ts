import { VercelRequest, VercelResponse } from '@vercel/node';
import { sendSuccess, sendPaginatedSuccess } from '../utils/apiResponse';
import { handleError, throwUnauthorized, throwValidationError } from '../utils/errorHandler';
import { validateMethod, validatePagination, validateRequired, validateStringLength } from '../utils/validation';
import { Project, TextConfig } from '../types/api';

/**
 * 프로젝트 목록 조회 및 생성 API
 * GET: 프로젝트 목록 조회
 * POST: 새 프로젝트 생성
 * @param req Vercel Request 객체
 * @param res Vercel Response 객체
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  try {
    validateMethod(req.method || '', ['GET', 'POST']);

    // 인증 확인 (임시)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throwUnauthorized();
    }

    if (req.method === 'GET') {
      await handleGetProjects(req, res);
    } else if (req.method === 'POST') {
      await handleCreateProject(req, res);
    }
  } catch (error) {
    handleError(error, res);
  }
}

/**
 * 프로젝트 목록 조회 처리
 */
async function handleGetProjects(req: VercelRequest, res: VercelResponse): Promise<void> {
  const { page, limit } = validatePagination(
    req.query.page as string,
    req.query.limit as string
  );

  // TODO: 실제 데이터베이스 조회 로직 구현
  // 현재는 모키 데이터로 응답
  const mockProjects: Project[] = [
    {
      id: 'proj_1',
      title: '샘플 프로젝트 1',
      description: '첫 번째 3D 텍스트 프로젝트',
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
    },
    {
      id: 'proj_2',
      title: '샘플 프로젝트 2',
      description: '두 번째 3D 텍스트 프로젝트',
      textConfig: {
        text: '한글 3D 텍스트',
        color: '#ef4444',
        fontSize: 36,
        fontFamily: 'Noto Sans KR',
        animationType: 'float'
      },
      thumbnailUrl: undefined,
      isPublic: true,
      userId: 'user_1',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z'
    }
  ];

  const total = mockProjects.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProjects = mockProjects.slice(startIndex, endIndex);

  sendPaginatedSuccess(res, paginatedProjects, { page, limit, total });
}

/**
 * 새 프로젝트 생성 처리
 */
async function handleCreateProject(req: VercelRequest, res: VercelResponse): Promise<void> {
  const { title, description, textConfig } = req.body as {
    title: string;
    description?: string;
    textConfig: TextConfig;
  };

  // 유효성 검사
  validateRequired(title, '제목');
  validateStringLength(title, '제목', 1, 100);
  
  if (description) {
    validateStringLength(description, '설명', 0, 500);
  }

  validateRequired(textConfig, '텍스트 설정');
  validateRequired(textConfig.text, '텍스트');
  validateStringLength(textConfig.text, '텍스트', 1, 200);

  // TODO: 실제 데이터베이스 저장 로직 구현
  const newProject: Project = {
    id: `proj_${Date.now()}`,
    title,
    description: description || undefined,
    textConfig,
    thumbnailUrl: undefined,
    isPublic: false,
    userId: 'user_1', // 실제로는 인증된 사용자 ID
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  sendSuccess(res, newProject, 201);
}