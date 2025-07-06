import { DynamicThreeCanvas } from '@/components/editor/DynamicThreeCanvas';
import { Controls } from '@/components/editor/Controls';
import { DebugInfo } from '@/components/editor/DebugInfo';

/**
 * 3D 텍스트 에디터 페이지
 * 좌측에는 컨트롤 패널, 우측에는 3D 캔버스를 배치합니다.
 */
export default function EditorPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Korean 3D Text Editor
              </h1>
              <span className="ml-3 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                Beta
              </span>
            </div>
            
            {/* 액션 버튼들 */}
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                도움말
              </button>
              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                내보내기
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 좌측 컨트롤 패널 */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <Controls />
            </div>
          </div>

          {/* 우측 3D 캔버스 */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  3D 미리보기
                </h2>
                <p className="text-sm text-gray-600">
                  실시간으로 3D 텍스트를 확인하고 편집할 수 있습니다.
                </p>
              </div>
              
              {/* 3D 캔버스 */}
              <div className="aspect-video w-full">
                <DynamicThreeCanvas 
                  className="w-full h-full"
                  width={800}
                  height={450}
                />
              </div>

              {/* 캔버스 하단 정보 */}
              <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>해상도: 800×450</span>
                  <span>렌더러: WebGL</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>실시간 렌더링</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 정보 섹션 */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 특징 1 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">3D</span>
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">
                실시간 3D 렌더링
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Three.js와 Troika를 사용한 고품질 3D 텍스트 렌더링으로 
              실시간으로 변경사항을 확인할 수 있습니다.
            </p>
          </div>

          {/* 특징 2 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">한글</span>
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">
                한글 폰트 최적화
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Noto Sans KR 등 한글 전용 폰트를 지원하여 
              아름다운 한글 3D 텍스트를 만들 수 있습니다.
            </p>
          </div>

          {/* 특징 3 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-sm font-bold">✨</span>
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">
                다양한 애니메이션
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              회전, 플로팅, 펄스, 웨이브 등 4가지 애니메이션 효과로 
              역동적인 3D 텍스트를 만들어보세요.
            </p>
          </div>
        </div>
      </main>
      
      {/* Debug Info (development only) */}
      {process.env.NODE_ENV === 'development' && <DebugInfo />}
    </div>
  );
}