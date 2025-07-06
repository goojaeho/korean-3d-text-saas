'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { SceneManager, TextRenderer } from '@korean-3d-text/3d-engine';
import { useEditorStore } from '@/stores/editorStore';

/**
 * 3D Canvas 컴포넌트 Props
 */
interface ThreeCanvasProps {
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Three.js 3D 캔버스 컴포넌트
 * SceneManager와 TextRenderer를 사용하여 3D 텍스트를 렌더링합니다.
 * Zustand 스토어와 연동하여 실시간으로 텍스트 변경사항을 반영합니다.
 */
export function ThreeCanvas({ 
  className = '', 
  width = 800, 
  height = 600 
}: ThreeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);
  const textRendererRef = useRef<TextRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [cameraDistance, setCameraDistance] = useState(5); // 카메라 거리 상태

  // Zustand 스토어에서 상태 구독
  const { 
    rotation,
    isLoading,
    lastApplyTime,
    setLoading,
    setRotation,
    getTextConfig 
  } = useEditorStore();

  /**
   * 텍스트 업데이트 (디바운싱 적용)
   */
  const updateText = useCallback(async (config: ReturnType<typeof getTextConfig>) => {
    if (!textRendererRef.current || !sceneManagerRef.current) {
      console.log('TextRenderer or SceneManager not ready');
      setLoading(false);
      return;
    }

    try {
      console.log('Starting text update with config:', config);
      setLoading(true);

      // TextRenderer 초기화 완료 대기
      if (!textRendererRef.current.isReady()) {
        console.log('Waiting for TextRenderer initialization...');
        await textRendererRef.current.waitForInitialization();
        console.log('TextRenderer initialization completed');
      }

      // 기존 텍스트 제거
      const oldTextMesh = textRendererRef.current.getTextMesh();
      if (oldTextMesh) {
        console.log('Removing old text mesh');
        sceneManagerRef.current.removeObject(oldTextMesh);
      }

      // 새 텍스트 생성 (디바운싱 적용)
      console.log('Creating new text mesh...');
      const newTextMesh = await textRendererRef.current.updateText(config);
      console.log('New text mesh created:', newTextMesh);
      console.log('Mesh type:', newTextMesh.type);
      console.log('Mesh userData:', newTextMesh.userData);
      console.log('Mesh children:', newTextMesh.children);
      
      // 씬에 추가
      sceneManagerRef.current.addObject(newTextMesh);
      console.log('Text mesh added to scene');

      // 즉시 렌더링
      sceneManagerRef.current.render();
      console.log('Scene rendered');

      console.log('Text update completed:', config.text);
    } catch (error) {
      console.error('Failed to update text:', error);
      // 에러 발생 시에도 로딩 상태 해제
      setLoading(false);
    } finally {
      console.log('Update text process completed');
      // 확실히 로딩 상태 해제
      setTimeout(() => {
        setLoading(false);
      }, 100);
    }
  }, [setLoading]);

  /**
   * 렌더링 루프 (업데이트가 있을 때만 실행)
   */
  const render = useCallback(() => {
    if (!sceneManagerRef.current) return;
    
    // 성능 최적화: 업데이트가 있을 때만 렌더링
    sceneManagerRef.current.render();
  }, []);

  /**
   * 마우스 드래그 상태
   */
  const mouseState = useRef({
    isDown: false,
    lastX: 0,
    lastY: 0
  });

  /**
   * 마우스 다운 이벤트
   */
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    console.log('Mouse down at:', event.clientX, event.clientY);
    mouseState.current.isDown = true;
    mouseState.current.lastX = event.clientX;
    mouseState.current.lastY = event.clientY;
  }, []);

  /**
   * 마우스 업 이벤트
   */
  const handleMouseUp = useCallback(() => {
    mouseState.current.isDown = false;
  }, []);

  /**
   * 마우스 무브 이벤트 (드래그로 회전)
   */
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!mouseState.current.isDown) return;

    const deltaX = event.clientX - mouseState.current.lastX;
    const deltaY = event.clientY - mouseState.current.lastY;

    console.log('Mouse drag delta:', deltaX, deltaY);

    // 회전 감도 조절
    const rotationSpeed = 0.01;
    
    // 새로운 회전값 계산
    const newRotation = {
      x: rotation.x + deltaY * rotationSpeed,
      y: rotation.y + deltaX * rotationSpeed,
      z: rotation.z
    };

    console.log('New rotation:', newRotation);

    // 상태 업데이트
    setRotation(newRotation);

    // 마지막 위치 업데이트
    mouseState.current.lastX = event.clientX;
    mouseState.current.lastY = event.clientY;
  }, [rotation, setRotation]);


  /**
   * 3D 씬 초기화
   */
  const initScene = useCallback(async () => {
    if (!canvasRef.current) {
      console.log('Canvas ref not available');
      return;
    }

    try {
      console.log('Initializing 3D Scene...');

      // SceneManager 초기화
      sceneManagerRef.current = new SceneManager();
      sceneManagerRef.current.initialize(canvasRef.current, width, height);

      // TextRenderer 초기화 (비동기)
      textRendererRef.current = new TextRenderer();
      
      // TextRenderer 초기화 완료 대기
      console.log('Waiting for TextRenderer initialization...');
      try {
        await textRendererRef.current.waitForInitialization();
        console.log('TextRenderer initialization completed');
      } catch (error) {
        console.warn('TextRenderer initialization failed, but continuing:', error);
      }

      console.log('SceneManager and TextRenderer initialized');

      // 초기 렌더링 (텍스트 없이)
      sceneManagerRef.current.render();

      // 초기 텍스트는 생성하지 않음 (적용 버튼 클릭 시에만)
      console.log('3D Scene ready. Click "적용" button to render text.');

      console.log('3D Scene initialized successfully');
    } catch (error) {
      console.error('Failed to initialize 3D scene:', error);
    }
  }, [width, height]);

  /**
   * 창 크기 변경 처리
   */
  const handleResize = useCallback(() => {
    if (!sceneManagerRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    sceneManagerRef.current.resize(rect.width, rect.height);
  }, []);

  /**
   * 네이티브 휠 이벤트 처리 (카메라 줌과 스크롤 방지)
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleNativeWheel = (event: WheelEvent) => {
      // 브라우저 기본 스크롤 방지
      event.preventDefault();
      event.stopPropagation();
      
      // 카메라 줌 로직을 네이티브 이벤트에서 직접 처리
      if (!sceneManagerRef.current) return;

      // 휠 델타값으로 줌 제어
      const delta = event.deltaY;
      sceneManagerRef.current.zoomCamera(delta);
      
      // 카메라 거리 상태 업데이트
      const newDistance = sceneManagerRef.current.getCameraDistance();
      setCameraDistance(newDistance);
      
      // 즉시 렌더링
      if (sceneManagerRef.current) {
        sceneManagerRef.current.render();
      }
      
      console.log('Native camera zoom applied, distance:', newDistance.toFixed(1));
    };

    // 패시브가 아닌 이벤트 리스너로 등록
    canvas.addEventListener('wheel', handleNativeWheel, { passive: false });

    return () => {
      canvas.removeEventListener('wheel', handleNativeWheel);
    };
  }, []);

  /**
   * 컴포넌트 마운트 시 초기화
   */
  useEffect(() => {
    initScene();

    // 창 크기 변경 이벤트 리스너
    window.addEventListener('resize', handleResize);

    // 클린업
    return () => {
      window.removeEventListener('resize', handleResize);
      
      // 애니메이션 프레임 정리 (필요시)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      // 리소스 정리
      if (textRendererRef.current) {
        textRendererRef.current.dispose();
        textRendererRef.current = null;
      }

      if (sceneManagerRef.current) {
        sceneManagerRef.current.dispose();
        sceneManagerRef.current = null;
      }

      console.log('3D Scene disposed');
    };
  }, [initScene, handleResize]);

  /**
   * 회전값 변경 시 텍스트 메쉬 회전 직접 업데이트
   */
  useEffect(() => {
    if (!textRendererRef.current) return;
    
    const textMesh = textRendererRef.current.getTextMesh();
    if (textMesh) {
      console.log('Updating text rotation:', rotation);
      
      // 컨테이너 메시의 회전 업데이트
      textMesh.rotation.set(rotation.x, rotation.y, rotation.z);
      
      // 성능 최적화: 직접 렌더링
      if (sceneManagerRef.current) {
        sceneManagerRef.current.render();
      }
    }
  }, [rotation]);

  /**
   * lastApplyTime 변경을 감지하여 텍스트 업데이트
   */
  useEffect(() => {
    if (lastApplyTime === 0) return; // 초기값은 무시
    
    console.log('Apply settings detected, lastApplyTime:', lastApplyTime);
    
    if (!sceneManagerRef.current || !textRendererRef.current) {
      console.log('Scene not ready, setting loading to false');
      setLoading(false);
      return;
    }

    console.log('Applying settings...');
    const config = getTextConfig();
    updateText(config).catch((error) => {
      console.error('Failed to update text in effect:', error);
      setLoading(false);
    });
  }, [lastApplyTime, updateText, getTextConfig, setLoading]);

  return (
    <div className={`relative ${className}`}>
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full border border-gray-200 rounded-lg bg-gray-50 cursor-grab active:cursor-grabbing"
        style={{ maxWidth: '100%', height: 'auto' }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp} // 마우스가 캔버스를 벗어나면 드래그 종료
      />
      
      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
          <div className="bg-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            <span className="text-sm text-gray-700">렌더링 중...</span>
          </div>
        </div>
      )}

      {/* 캔버스 정보 (개발용) */}
      <div className="absolute top-2 left-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
        <div>{width} × {height}px</div>
        <div>카메라: {cameraDistance.toFixed(1)}m</div>
        <div className="text-gray-400 mt-1">휠: 줌 / 드래그: 회전</div>
      </div>
    </div>
  );
}