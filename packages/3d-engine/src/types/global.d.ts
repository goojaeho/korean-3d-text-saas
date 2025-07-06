declare global {
  interface Window {
    THREE: typeof import('three') & {
      FontLoader: any;
      TextGeometry: any;
    };
  }
}

export {};