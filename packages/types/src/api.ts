/**
 * API 공통 응답 타입
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: ErrorCode;
  message: string;
  details?: unknown;
}

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
}

/**
 * 프로젝트 API 요청/응답 타입
 */
export interface CreateProjectRequest {
  title: string;
  description?: string;
  textConfig: import('./models').TextConfig;
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
  textConfig?: import('./models').TextConfig;
  isPublic?: boolean;
}

export interface ProjectListParams {
  page?: number;
  limit?: number;
  search?: string;
  isPublic?: boolean;
}

/**
 * 인증 API 요청/응답 타입
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: import('./models').User;
  accessToken: string;
  refreshToken: string;
  expires: string;
}

/**
 * 3D 렌더링 API 요청/응답 타입
 */
export interface RenderRequest {
  textConfig: import('./models').TextConfig;
  exportConfig: import('./models').ExportConfig;
}

export interface RenderResponse {
  fileUrl: string;
  fileSize: number;
  duration?: number;
}