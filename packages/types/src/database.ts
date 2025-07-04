// 데이터베이스 관련 타입 정의
// Prisma 스키마와 동기화 유지
// 기본 타입들은 models.ts에서 import

import type { TextConfig, ExportFormat, UserPlan } from './models';

// 사용자 활동 메타데이터 타입
export interface UserActivityMetadata {
  projectId?: string;
  exportFormat?: ExportFormat;
  planType?: UserPlan;
  [key: string]: any;
}

// 프로젝트 생성 데이터 타입
export interface CreateProjectData {
  title: string;
  description?: string;
  textConfig: TextConfig;
  isPublic?: boolean;
}

// 프로젝트 업데이트 데이터 타입
export interface UpdateProjectData {
  title?: string;
  description?: string;
  textConfig?: TextConfig;
  isPublic?: boolean;
  thumbnailUrl?: string;
}

// 프로젝트 내보내기 데이터 타입
export interface CreateExportData {
  projectId: string;
  format: ExportFormat;
  width?: number;
  height?: number;
  quality?: number;
}