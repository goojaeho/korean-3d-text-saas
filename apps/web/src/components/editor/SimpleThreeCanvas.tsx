'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * 간단한 Three.js 테스트 컴포넌트
 * 기본 큐브를 표시하여 3D 렌더링이 작동하는지 확인
 */
export function SimpleThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    console.log('Initializing simple Three.js scene...');

    // 씬 생성
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222); // 어두운 배경
    sceneRef.current = scene;

    // 카메라 생성
    const camera = new THREE.PerspectiveCamera(
      75, 
      800 / 450, 
      0.1, 
      1000
    );
    camera.position.set(0, 0, 5);

    // 렌더러 생성
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true 
    });
    renderer.setSize(800, 450);
    rendererRef.current = renderer;

    // 조명 추가
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // 테스트 큐브 생성
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    console.log('Test cube added to scene');

    // 애니메이션 루프
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // 큐브 회전
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      
      renderer.render(scene, camera);
    };

    // 첫 렌더링
    renderer.render(scene, camera);
    
    // 애니메이션 시작
    animate();

    console.log('Simple Three.js scene initialized successfully');

    // 클린업
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      console.log('Simple Three.js scene disposed');
    };
  }, []);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={450}
        className="w-full h-full border border-gray-200 rounded-lg bg-gray-50"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      
      <div className="absolute top-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
        Simple Three.js Test
      </div>
    </div>
  );
}