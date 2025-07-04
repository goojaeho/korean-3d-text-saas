declare module 'troika-three-text' {
  import * as THREE from 'three';

  export class Text extends THREE.Mesh {
    text: string;
    fontSize: number;
    color: string | number;
    anchorX: 'left' | 'center' | 'right';
    anchorY: 'top' | 'top-baseline' | 'middle' | 'bottom-baseline' | 'bottom';
    font: string;
    fontFamily: string;
    fontWeight: string | number;
    fontStyle: string;
    letterSpacing: number;
    lineHeight: number | string;
    maxWidth: number;
    textAlign: 'left' | 'right' | 'center' | 'justify';
    textIndent: number;
    whiteSpace: 'normal' | 'nowrap';
    direction: 'auto' | 'ltr' | 'rtl';
    clipRect: [number, number, number, number] | null;
    strokeColor: string | number;
    strokeWidth: number;
    strokeOpacity: number;
    fillOpacity: number;
    outlineWidth: number;
    outlineColor: string | number;
    outlineOpacity: number;
    outlineOffsetX: number;
    outlineOffsetY: number;
    outlineBlur: number;
    curveRadius: number;
    debugSDF: boolean;
    sync(callback?: () => void): void;
    dispose(): void;
  }

  export function preloadFont(
    options: {
      font?: string;
      characters?: string;
      sdfGlyphSize?: number;
    },
    callback?: () => void
  ): void;

  export function getCaretAtPoint(
    textMesh: Text,
    x: number,
    y: number
  ): { charIndex: number; x: number; y: number; height: number } | null;

  export function getSelectionRects(
    textMesh: Text,
    start: number,
    end: number
  ): Array<{ left: number; top: number; right: number; bottom: number }>;
}