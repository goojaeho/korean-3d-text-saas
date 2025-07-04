'use client';

import dynamic from 'next/dynamic';

// ThreeCanvas를 클라이언트 사이드에서만 로드
const ThreeCanvas = dynamic(() => 
  import('./ThreeCanvas').then(mod => ({ default: mod.ThreeCanvas })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">3D 엔진 로딩 중...</p>
      </div>
    </div>
  )
});

export { ThreeCanvas as DynamicThreeCanvas };