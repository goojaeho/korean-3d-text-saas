/**
 * API 공통 타입 정의
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface ApiRequest {
  method: string;
  body?: unknown;
  query?: Record<string, string | string[]>;
  headers?: Record<string, string>;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  textConfig: TextConfig;
  thumbnailUrl?: string;
  isPublic: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TextConfig {
  text: string;
  color: string;
  fontSize: number;
  fontFamily: string;
  animationType: AnimationType;
}

export type AnimationType = 'rotate' | 'float' | 'pulse' | 'wave';

export interface User {
  id: string;
  email: string;
  name?: string;
  plan: UserPlan;
  credits: number;
  createdAt: string;
  updatedAt: string;
}

export type UserPlan = 'FREE' | 'PRO' | 'ENTERPRISE';

export interface Session {
  user: User | null;
  expires?: string;
}

export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
}