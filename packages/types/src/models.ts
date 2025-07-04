/**
 * 사용자 관련 타입 정의
 */
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

/**
 * 프로젝트 관련 타입 정의
 */
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

/**
 * 3D 텍스트 설정 타입 (JSON 저장용)
 */
export interface TextConfig {
  text: string;
  color: string;
  fontSize: number;
  fontFamily: string;
  animationType: AnimationType;
  backgroundColor?: string;
  textureType?: TextureType;
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z: number };
  [key: string]: any; // JSON 호환성을 위한 인덱스 시그니처
}

export type AnimationType = 'rotate' | 'float' | 'pulse' | 'wave';
export type TextureType = 'solid' | 'gradient' | 'metallic' | 'neon';

/**
 * 내보내기 관련 타입
 */
export interface ExportConfig {
  format: ExportFormat;
  resolution: Resolution;
  backgroundColor: string;
  includeAnimation: boolean;
  duration?: number;
}

export type ExportFormat = 'PNG' | 'PDF';
export type Resolution = 'HD' | '4K' | 'CUSTOM';

/**
 * 세션 관련 타입
 */
export interface Session {
  user: User | null;
  expires?: string;
  accessToken?: string;
}

/**
 * 사용량 관련 타입
 */
export interface Usage {
  projectsCreated: number;
  exportsGenerated: number;
  storageUsed: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
}