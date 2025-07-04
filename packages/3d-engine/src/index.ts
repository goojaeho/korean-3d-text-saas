// 핵심 클래스 내보내기
export { SceneManager } from './core/SceneManager';
export { TextRenderer } from './core/TextRenderer';
export { AnimationController } from './core/AnimationController';

// 타입 정의 내보내기
export type { TextConfig } from './core/TextRenderer';
export type AnimationType = 'rotate' | 'float' | 'pulse' | 'wave';

export type ExportFormat = 'png' | 'pdf';

export interface ExportConfig {
  format: ExportFormat;
  width?: number;
  height?: number;
  quality?: number;
  backgroundColor?: string;
}