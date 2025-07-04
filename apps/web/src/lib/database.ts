import { prisma } from './prisma';
import type { 
  CreateProjectData, 
  UpdateProjectData, 
  CreateExportData
} from '@korean-3d-text/types';
import type { UserPlan } from '@prisma/client';

/**
 * 사용자 관련 데이터베이스 함수
 */

// 사용자 생성 (회원가입)
export async function createUser(email: string, password: string, name?: string) {
  return await prisma.user.create({
    data: {
      email,
      name,
      password, // 해시된 비밀번호가 전달되어야 함
      plan: 'FREE',
      credits: 10
    }
  });
}

// 이메일로 사용자 조회
export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      password: true,
      emailVerified: true,
      plan: true,
      credits: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

// 사용자 생성 또는 조회 (OAuth용)
export async function upsertUser(email: string, name?: string) {
  return await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name,
      password: '', // OAuth 사용자는 빈 비밀번호
      plan: 'FREE',
      credits: 10
    },
    update: {
      name: name || undefined
    }
  });
}

// 이메일 인증 처리
export async function verifyUserEmail(email: string) {
  return await prisma.user.update({
    where: { email },
    data: {
      emailVerified: new Date()
    }
  });
}

// 사용자 플랜 업그레이드
export async function updateUserPlan(userId: string, plan: UserPlan, credits?: number) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      plan,
      credits: credits || undefined
    }
  });
}

// 사용자 크레딧 차감
export async function deductUserCredits(userId: string, amount: number = 1) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      credits: {
        decrement: amount
      }
    }
  });
}

/**
 * 프로젝트 관련 데이터베이스 함수
 */

// 프로젝트 생성
export async function createProject(userId: string, data: CreateProjectData) {
  return await prisma.project.create({
    data: {
      title: data.title,
      description: data.description,
      textContent: data.textConfig, // textContent로 변경
      isPublic: data.isPublic || false,
      userId
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
}

// 프로젝트 조회 (단일)
export async function getProject(projectId: string, userId?: string) {
  return await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { userId: userId },
        { isPublic: true }
      ]
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      exports: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });
}

// 사용자 프로젝트 목록 조회
export async function getUserProjects(userId: string, page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;
  
  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where: { userId },
      orderBy: {
        updatedAt: 'desc'
      },
      skip,
      take: limit,
      include: {
        _count: {
          select: { exports: true }
        }
      }
    }),
    prisma.project.count({
      where: { userId }
    })
  ]);

  return {
    projects,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
}

// 프로젝트 업데이트
export async function updateProject(projectId: string, userId: string, data: UpdateProjectData) {
  return await prisma.project.update({
    where: {
      id: projectId,
      userId
    },
    data: {
      title: data.title,
      description: data.description,
      textContent: data.textConfig, // textContent로 변경
      isPublic: data.isPublic,
      thumbnailUrl: data.thumbnailUrl
    }
  });
}

// 프로젝트 삭제
export async function deleteProject(projectId: string, userId: string) {
  return await prisma.project.delete({
    where: {
      id: projectId,
      userId
    }
  });
}

/**
 * 내보내기 관련 데이터베이스 함수
 */

// 내보내기 생성
export async function createProjectExport(data: CreateExportData) {
  return await prisma.projectExport.create({
    data: {
      format: data.format,
      width: data.width || 1920,
      height: data.height || 1080,
      quality: data.quality || 100,
      projectId: data.projectId
    }
  });
}

// 내보내기 파일 URL 업데이트
export async function updateExportFileUrl(exportId: string, fileUrl: string, fileSize?: number) {
  return await prisma.projectExport.update({
    where: { id: exportId },
    data: {
      fileUrl,
      fileSize
    }
  });
}

/**
 * 사용자 활동 로그 함수
 */

// 활동 로그 기록
export async function logUserActivity(
  userId: string, 
  action: string, 
  metadata?: Record<string, any>
) {
  return await prisma.userActivity.create({
    data: {
      userId,
      action,
      metadata
    }
  });
}

/**
 * 통계 및 관리자 함수
 */

// 사용자 통계 조회
export async function getUserStats(userId: string) {
  const [projectCount, exportCount] = await Promise.all([
    prisma.project.count({
      where: { userId }
    }),
    prisma.projectExport.count({
      where: {
        project: {
          userId
        }
      }
    })
  ]);

  return {
    projectCount,
    exportCount
  };
}