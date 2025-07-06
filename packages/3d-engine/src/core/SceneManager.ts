import * as THREE from 'three';

/**
 * 3D 씬 관리 클래스
 * Three.js 씬, 카메라, 렌더러를 관리합니다
 */
export class SceneManager {
  private scene: any = null; // THREE.Scene
  private camera: any = null; // THREE.PerspectiveCamera
  private renderer: any = null; // THREE.WebGLRenderer
  private isInitialized = false;

  constructor() {
    this.initializeSceneManager();
  }

  /**
   * SceneManager 초기화
   */
  private initializeSceneManager(): void {
    console.log('🚀 SceneManager initializing...');
    
    try {
      // Three.js 객체들 초기화
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      this.setupScene();
      console.log('✅ SceneManager initialized successfully');
      
      this.isInitialized = true;
    } catch (error) {
      console.error('❌ SceneManager initialization failed:', error);
      this.isInitialized = true; // 실패해도 진행
    }
  }

  /**
   * 초기화 완료 대기
   */
  public waitForInitialization(): Promise<void> {
    return new Promise((resolve) => {
      if (this.isInitialized) {
        resolve();
        return;
      }

      const checkInterval = setInterval(() => {
        if (this.isInitialized) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      // 5초 타임아웃
      setTimeout(() => {
        clearInterval(checkInterval);
        console.warn('SceneManager initialization timeout');
        resolve();
      }, 5000);
    });
  }

  /**
   * 씬 초기 설정
   */
  private setupScene(): void {
    if (!this.scene) {
      console.warn('⚠️ Cannot setup scene - scene not available');
      return;
    }
    // 배경색 설정 (더 어두운 색상으로 3D 객체가 잘 보이도록)
    this.scene.background = new THREE.Color(0x222222);

    // 카메라 위치 설정 (작은 텍스트를 위해 더 가까이)
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(0, 0, 0);

    // 조명 설정
    this.setupLighting();

    console.log('Scene setup completed with background color and lighting');
  }

  /**
   * 조명 설정
   */
  private setupLighting(): void {
    // 주변광 (밝게)
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    this.scene.add(ambientLight);

    // 메인 방향광
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    // 보조 포인트 라이트
    const pointLight1 = new THREE.PointLight(0xffffff, 0.7, 100);
    pointLight1.position.set(-10, 10, 10);
    this.scene.add(pointLight1);

    // 추가 포인트 라이트 (반대편)
    const pointLight2 = new THREE.PointLight(0x87ceeb, 0.5, 100);
    pointLight2.position.set(10, -10, -10);
    this.scene.add(pointLight2);

    console.log('Lighting setup completed');
  }

  /**
   * 렌더러 초기화
   * @param canvas HTML Canvas 엘리먼트
   * @param width 캔버스 너비
   * @param height 캔버스 높이
   */
  public initialize(canvas: HTMLCanvasElement, width: number, height: number): void {
    // 초기화 확인
    if (!this.isInitialized) {
      console.warn('⚠️ SceneManager not initialized yet');
      return;
    }


    if (this.renderer) {
      this.dispose();
    }

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 카메라 종횡비 업데이트
    if (this.camera) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }

    console.log('✅ Renderer initialized successfully');
  }

  /**
   * 씬 렌더링
   */
  public render(): void {
    if (!this.renderer || !this.isInitialized) {
      console.warn('SceneManager not initialized');
      return;
    }

    this.renderer.render(this.scene, this.camera);
  }

  /**
   * 캔버스 크기 변경
   * @param width 새로운 너비
   * @param height 새로운 높이
   */
  public resize(width: number, height: number): void {
    if (!this.renderer) return;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  /**
   * 배경색 변경
   * @param color 새로운 배경색 (hex)
   */
  public setBackgroundColor(color: string): void {
    this.scene.background = new THREE.Color(color);
  }

  /**
   * 씬에 객체 추가
   * @param object 추가할 3D 객체
   */
  public addObject(object: THREE.Object3D): void {
    this.scene.add(object);
  }

  /**
   * 씬에서 객체 제거
   * @param object 제거할 3D 객체
   */
  public removeObject(object: THREE.Object3D): void {
    // null 체크 추가
    if (!object) {
      console.warn('Cannot remove null or undefined object from scene');
      return;
    }

    // 자식 객체들도 모두 제거
    try {
      object.traverse((child: THREE.Object3D) => {
        if (child.parent) {
          child.parent.remove(child);
        }
      });
    } catch (error) {
      console.warn('Error traversing object during removal:', error);
    }
    
    this.scene.remove(object);
    
    // 제거 후 렌더링
    if (this.renderer) {
      this.render();
    }
  }

  /**
   * 씬의 모든 객체 제거 (조명 제외)
   */
  public clearObjects(): void {
    if (!this.scene) {
      console.warn('⚠️ Cannot clear objects - scene not available');
      return;
    }

    const objectsToRemove: any[] = [];
    
    this.scene.traverse((child: any) => {
      if (!(child instanceof THREE.Light) && child !== this.scene) {
        objectsToRemove.push(child);
      }
    });

    objectsToRemove.forEach((object: any) => {
      this.scene.remove(object);
      this.disposeObject(object);
    });
  }

  /**
   * 객체 메모리 정리
   * @param object 정리할 객체
   */
  private disposeObject(object: any): void {
    if (object instanceof THREE.Mesh) {
      if (object.geometry) {
        object.geometry.dispose();
      }
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material: any) => {
            const mat = material as any;
            if (mat.map && mat.map.dispose) mat.map.dispose();
            if (mat.normalMap && mat.normalMap.dispose) mat.normalMap.dispose();
            if (mat.roughnessMap && mat.roughnessMap.dispose) mat.roughnessMap.dispose();
            material.dispose();
          });
        } else {
          const mat = object.material as any;
          if (mat.map && mat.map.dispose) mat.map.dispose();
          if (mat.normalMap && mat.normalMap.dispose) mat.normalMap.dispose();
          if (mat.roughnessMap && mat.roughnessMap.dispose) mat.roughnessMap.dispose();
          object.material.dispose();
        }
      }
    }
  }

  /**
   * 카메라 위치 설정
   * @param x X 좌표
   * @param y Y 좌표
   * @param z Z 좌표
   */
  public setCameraPosition(x: number, y: number, z: number): void {
    this.camera.position.set(x, y, z);
  }

  /**
   * 카메라가 바라보는 지점 설정
   * @param x X 좌표
   * @param y Y 좌표
   * @param z Z 좌표
   */
  public setCameraTarget(x: number, y: number, z: number): void {
    this.camera.lookAt(x, y, z);
  }

  /**
   * 카메라 줌 인/아웃
   * @param delta 휠 델타값 (양수: 줌인, 음수: 줌아웃)
   */
  public zoomCamera(delta: number): void {
    const zoomSpeed = 0.5;
    const minDistance = 1;
    const maxDistance = 20;
    
    // 현재 카메라 위치
    const currentZ = this.camera.position.z;
    
    // 새로운 Z 위치 계산
    let newZ = currentZ + (delta > 0 ? zoomSpeed : -zoomSpeed);
    
    // 범위 제한
    newZ = Math.max(minDistance, Math.min(maxDistance, newZ));
    
    // 카메라 위치 업데이트
    this.camera.position.z = newZ;
    
    console.log(`Camera zoom: ${currentZ.toFixed(1)} -> ${newZ.toFixed(1)}`);
  }

  /**
   * 카메라 거리 가져오기
   * @returns 현재 카메라 Z 거리
   */
  public getCameraDistance(): number {
    return this.camera.position.z;
  }

  /**
   * 현재 씬을 이미지로 내보내기
   * @param format 이미지 형식
   * @param quality 품질 (0-1)
   * @returns Base64 이미지 데이터
   */
  public exportImage(format: string = 'image/png', quality: number = 1.0): string | null {
    if (!this.renderer) return null;

    this.render();
    return this.renderer.domElement.toDataURL(format, quality);
  }

  /**
   * 리소스 정리
   */
  public dispose(): void {
    this.clearObjects();
    
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }

    this.isInitialized = false;
  }

  // Getter 메서드들
  public getScene(): THREE.Scene {
    return this.scene;
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  public getRenderer(): THREE.WebGLRenderer | null {
    return this.renderer;
  }

  public isReady(): boolean {
    return this.isInitialized && this.renderer !== null;
  }
}