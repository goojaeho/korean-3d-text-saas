// troika-three-text 타입 정의
declare module 'troika-three-text' {
  import * as THREE from 'three';

  interface TextGeometry {
    dispose(): void;
  }

  interface TextMaterial extends THREE.Material {
    color: THREE.Color;
    transparent: boolean;
    opacity: number;
  }

  export class Text extends THREE.Mesh {
    text: string;
    font?: string;
    fontSize: number;
    color: string | number;
    anchorX: string | number;
    anchorY: string | number;
    clipRect?: [number, number, number, number];
    curveRadius?: number;
    depthOffset?: number;
    direction?: 'auto' | 'ltr' | 'rtl';
    fillOpacity?: number;
    glyphGeometryDetail?: number;
    gpuAccelerated?: boolean;
    lineHeight?: number | string;
    material?: TextMaterial;
    maxWidth?: number;
    outlineBlur?: string | number;
    outlineColor?: string | number;
    outlineOffsetX?: string | number;
    outlineOffsetY?: string | number;
    outlineOpacity?: number;
    outlineWidth?: string | number;
    overflowWrap?: 'normal' | 'break-word';
    strokeColor?: string | number;
    strokeOpacity?: number;
    strokeWidth?: string | number;
    textAlign?: 'left' | 'right' | 'center' | 'justify';
    textIndent?: number;
    whiteSpace?: 'normal' | 'nowrap';
    
    sync(callback?: () => void): void;
    dispose(): void;
  }
}