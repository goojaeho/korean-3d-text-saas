import { create } from 'zustand';
import type { TextConfig } from '@korean-3d-text/3d-engine';

/**
 * 3D 텍스트 에디터 상태 인터페이스
 */
interface EditorState {
  // 3D 텍스트 속성
  text: string;
  color: string;
  fontSize: number;
  fontFamily: string;
  depth: number; // 글자 두께 (extrusion depth)
  
  // 3D 회전 상태 (마우스 조작으로 설정)
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  
  // UI 상태
  isLoading: boolean;
  isPreviewMode: boolean;
  
  // 액션들
  setText: (text: string) => void;
  setColor: (color: string) => void;
  setFontSize: (fontSize: number) => void;
  setFontFamily: (fontFamily: string) => void;
  setDepth: (depth: number) => void;
  setRotation: (rotation: { x: number; y: number; z: number }) => void;
  setLoading: (loading: boolean) => void;
  setPreviewMode: (previewMode: boolean) => void;
  applySettings: () => void; // 수동 적용 액션
  lastApplyTime: number; // 적용 시간 추적
  
  // 헬퍼 함수들
  getTextConfig: () => TextConfig;
  resetToDefaults: () => void;
}

/**
 * 기본값 설정
 */
const defaultState = {
  text: '안녕하세요',
  color: '#3b82f6', // Tailwind blue-500
  fontSize: 4, // 4px로 더 작게 변경
  fontFamily: 'cookierun-bold', // CookieRun Bold를 기본 폰트로 설정
  depth: 0.5, // 기본 두께로 시작
  rotation: { x: 0, y: 0, z: 0 }, // 기본 회전각
  isLoading: false,
  isPreviewMode: true,
  lastApplyTime: 0, // 적용 시간 추적
};

/**
 * Zustand 에디터 상태 스토어
 * 3D 텍스트 설정과 UI 상태를 관리합니다.
 */
export const useEditorStore = create<EditorState>((set, get) => ({
  // 초기 상태
  ...defaultState,

  // 텍스트 내용 변경
  setText: (text: string) => {
    set({ text });
  },

  // 색상 변경
  setColor: (color: string) => {
    set({ color });
  },

  // 폰트 크기 변경
  setFontSize: (fontSize: number) => {
    // 최소 1, 최대 20으로 제한
    const clampedSize = Math.min(Math.max(fontSize, 1), 20);
    set({ fontSize: clampedSize });
  },

  // 폰트 패밀리 변경
  setFontFamily: (fontFamily: string) => {
    set({ fontFamily });
  },

  // 글자 두께 변경
  setDepth: (depth: number) => {
    // 최소 0, 최대 5로 제한
    const clampedDepth = Math.min(Math.max(depth, 0), 5);
    set({ depth: clampedDepth });
  },

  // 회전각 변경
  setRotation: (rotation: { x: number; y: number; z: number }) => {
    set({ rotation });
  },

  // 로딩 상태 변경
  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  // 미리보기 모드 토글
  setPreviewMode: (isPreviewMode: boolean) => {
    set({ isPreviewMode });
  },

  // 설정 적용 (수동 트리거)
  applySettings: () => {
    const currentTime = Date.now();
    console.log('ApplySettings called at:', currentTime);
    set({ 
      isLoading: true,
      lastApplyTime: currentTime 
    });
  },

  // TextConfig 객체 생성
  getTextConfig: (): TextConfig => {
    const state = get();
    return {
      text: state.text,
      color: state.color,
      fontSize: state.fontSize,
      fontFamily: state.fontFamily,
      depth: state.depth,
      position: { x: 0, y: 0, z: 0 },
      rotation: state.rotation,
      scale: { x: 1, y: 1, z: 1 },
    };
  },

  // 기본값으로 리셋
  resetToDefaults: () => {
    set(defaultState);
  },
}));

/**
 * 선택 가능한 폰트 목록 (TextGeometry 지원)
 */
export const AVAILABLE_FONTS = [
  'cookierun-bold',
  'nanum-gothic',
  'noto-sans-kr',
  'helvetiker',
  'optimer',
  'sans-serif',
  'serif',
  'monospace',
] as const;

/**
 * 두께 설정 프리셋
 */
export const DEPTH_PRESETS = [
  { value: 0, label: '평면 (Flat)' },
  { value: 0.2, label: '얇음 (Thin)' },
  { value: 0.5, label: '기본 (Normal)' },
  { value: 1.0, label: '두꺼움 (Thick)' },
  { value: 2.0, label: '매우 두꺼움 (Very Thick)' },
] as const;

/**
 * 미리 정의된 색상 팔레트
 */
export const COLOR_PALETTE = [
  '#3b82f6', // blue-500
  '#ef4444', // red-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
  '#f97316', // orange-500
  '#6366f1', // indigo-500
  '#ffffff', // white
  '#000000', // black
] as const;

/**
 * 에디터 상태를 구독하는 커스텀 훅
 */
export const useEditorState = () => useEditorStore();

/**
 * 텍스트 설정만 구독하는 최적화된 훅
 */
export const useTextConfig = () => useEditorStore((state) => state.getTextConfig());

/**
 * UI 상태만 구독하는 최적화된 훅
 */
export const useEditorUI = () => useEditorStore((state) => ({
  isLoading: state.isLoading,
  isPreviewMode: state.isPreviewMode,
  setLoading: state.setLoading,
  setPreviewMode: state.setPreviewMode,
}));