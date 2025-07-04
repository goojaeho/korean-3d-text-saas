'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Text as TroikaText } from 'troika-three-text';

/**
 * 최소한의 Troika 텍스트 테스트 컴포넌트
 * 기본 Three.js + Troika 텍스트만 테스트
 */
export function TroikaTextTest() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    console.log('Initializing Troika text test...');

    // 씬 생성
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);
    sceneRef.current = scene;

    // 카메라 생성
    const camera = new THREE.PerspectiveCamera(75, 800 / 450, 0.1, 1000);
    camera.position.set(0, 0, 10);

    // 렌더러 생성
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true 
    });
    renderer.setSize(800, 450);
    rendererRef.current = renderer;

    // 조명 추가
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Troika 텍스트 생성
    const textMesh = new TroikaText();
    textMesh.text = 'Hello World';
    textMesh.fontSize = 2;
    textMesh.color = '#ffffff';
    textMesh.anchorX = 'center';
    textMesh.anchorY = 'middle';
    textMesh.position.set(0, 0, 0);

    console.log('Troika text created, syncing...');

    // 텍스트 동기화 후 씬에 추가
    textMesh.sync(() => {
      console.log('Troika text synced, adding to scene');
      scene.add(textMesh);
      
      // 첫 렌더링
      renderer.render(scene, camera);
      
      console.log('Text mesh added to scene:', {
        text: textMesh.text,
        fontSize: textMesh.fontSize,
        color: textMesh.color,
        position: textMesh.position
      });
    });

    // 애니메이션 루프
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // 텍스트 회전
      if (textMesh) {
        textMesh.rotation.y += 0.01;
      }
      
      renderer.render(scene, camera);
    };

    // 애니메이션 시작 (1초 후)
    setTimeout(() => {
      console.log('Starting animation...');
      animate();
    }, 1000);

    // 클린업
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      if (textMesh) {
        if (textMesh.geometry) textMesh.geometry.dispose();
        if (textMesh.material) {
          if (Array.isArray(textMesh.material)) {
            textMesh.material.forEach(mat => mat.dispose());
          } else {
            textMesh.material.dispose();
          }
        }
      }

      console.log('Troika text test disposed');
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
        Troika Text Test
      </div>
    </div>
  );
}