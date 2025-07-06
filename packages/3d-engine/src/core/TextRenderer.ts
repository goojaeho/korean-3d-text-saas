import * as THREE from 'three';

// FontLoader와 TextGeometry를 동적으로 import하여 타입 문제 해결
// 타입 정의는 런타임에 동적으로 로드

/**
 * 3D 텍스트 설정 타입
 */
export interface TextConfig {
  text: string;
  color: string;
  fontSize: number;
  fontFamily?: string;
  depth?: number; // 글자 두께 (실제 3D extrusion)
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z: number };
}

/**
 * 3D 텍스트 렌더링 클래스
 * Three.js TextGeometry를 사용한 진짜 3D 텍스트 렌더링
 * 디바운싱 패턴 적용으로 성능 최적화
 */
export class TextRenderer {
  private textMesh: THREE.Mesh | null = null;
  private currentConfig: TextConfig | null = null;
  private isLoading = false;
  private debounceTimer: number | null = null;
  private readonly DEBOUNCE_DELAY = 100; // 0.1초 지연
  private fontLoader: any;
  private loadedFonts: Map<string, any> = new Map();
  private FontLoader: any;
  private TextGeometry: any;
  private isInitialized = false;

  constructor() {
    this.initializeLoaders();
  }

  /**
   * 로더들 초기화 (CDN 방식)
   */
  private async initializeLoaders(): Promise<void> {
    try {
      // CDN에서 Three.js examples 스크립트 로드
      await this.loadThreeExamples();
      
      // FontLoader와 TextGeometry 글로벌에서 가져오기
      const THREE_GLOBAL = (globalThis as any).THREE || (window as any).THREE;
      
      if (THREE_GLOBAL && THREE_GLOBAL.FontLoader && THREE_GLOBAL.TextGeometry) {
        this.FontLoader = THREE_GLOBAL.FontLoader;
        this.TextGeometry = THREE_GLOBAL.TextGeometry;
        this.fontLoader = new this.FontLoader();
        
        await this.preloadFonts();
        this.isInitialized = true;
        console.log('TextRenderer initialized successfully');
      } else {
        // Fallback: 간단한 구현으로 대체
        throw new Error('Three.js examples not available, using fallback');
      }
    } catch (error) {
      console.warn('Failed to initialize Three.js examples, using fallback:', error);
      await this.initializeFallback();
    }
  }

  /**
   * Three.js examples CDN 로드
   */
  private loadThreeExamples(): Promise<void> {
    return new Promise((resolve, reject) => {
      // 이미 로드되었는지 확인
      if ((globalThis as any).THREE?.FontLoader) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/three@0.160.0/examples/js/loaders/FontLoader.js';
      script.onload = () => {
        const script2 = document.createElement('script');
        script2.src = 'https://unpkg.com/three@0.160.0/examples/js/geometries/TextGeometry.js';
        script2.onload = () => resolve();
        script2.onerror = () => reject(new Error('Failed to load TextGeometry'));
        document.head.appendChild(script2);
      };
      script.onerror = () => reject(new Error('Failed to load FontLoader'));
      document.head.appendChild(script);
    });
  }

  /**
   * Fallback 초기화 (간단한 박스 지오메트리 사용)
   */
  private async initializeFallback(): Promise<void> {
    console.log('Using fallback text renderer');
    
    // 간단한 박스로 텍스트 대체
    this.FontLoader = null;
    this.TextGeometry = THREE.BoxGeometry;
    this.fontLoader = null;
    
    this.isInitialized = true;
  }

  /**
   * 한글 폰트 사전 로드
   */
  private async preloadFonts(): Promise<void> {
    const defaultFonts = [
      {
        url: 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
        name: 'helvetiker'
      },
      {
        url: 'https://threejs.org/examples/fonts/optimer_regular.typeface.json',
        name: 'optimer'
      }
    ];

    let loadedCount = 0;
    const loadPromises = defaultFonts.map(async (fontInfo) => {
      try {
        const font = await this.loadFont(fontInfo.url);
        this.loadedFonts.set(fontInfo.name, font);
        loadedCount++;
        console.log(`Font ${fontInfo.name} loaded successfully`);
      } catch (error) {
        console.warn(`Failed to load font ${fontInfo.name}:`, error);
      }
    });

    await Promise.allSettled(loadPromises);
    
    if (loadedCount === 0) {
      console.error('No fonts could be loaded! 3D text rendering will fail.');
      throw new Error('Font loading failed completely');
    } else {
      console.log(`Successfully loaded ${loadedCount}/${defaultFonts.length} fonts`);
    }
  }

  /**
   * 폰트 로드 (재시도 로직 포함)
   * @param fontUrl 폰트 URL
   * @returns Promise<any>
   */
  private loadFont(fontUrl: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.fontLoader) {
        console.warn('FontLoader not available for loading:', fontUrl);
        reject(new Error('FontLoader not initialized'));
        return;
      }
      
      let retryCount = 0;
      const maxRetries = 3;
      
      const attemptLoad = () => {
        this.fontLoader.load(
          fontUrl,
          (font: any) => {
            console.log(`Font loaded successfully: ${fontUrl}`);
            resolve(font);
          },
          (progress: ProgressEvent) => {
            console.log(`Loading font ${fontUrl}: ${(progress.loaded / progress.total * 100).toFixed(1)}%`);
          },
          (error: Error) => {
            console.warn(`Font load attempt ${retryCount + 1} failed for ${fontUrl}:`, error);
            
            if (retryCount < maxRetries) {
              retryCount++;
              console.log(`Retrying font load (${retryCount}/${maxRetries})...`);
              setTimeout(attemptLoad, 1000 * retryCount); // 지수적 백오프
            } else {
              reject(new Error(`Font loading failed after ${maxRetries} attempts: ${error.message}`));
            }
          }
        );
      };
      
      attemptLoad();
    });
  }

  /**
   * 디바운싱이 적용된 텍스트 업데이트 메서드
   * @param config 텍스트 설정
   * @returns Promise<THREE.Mesh>
   */
  public updateText(config: TextConfig): Promise<THREE.Mesh> {
    // 초기화 상태 체크
    if (!this.isInitialized) {
      return Promise.reject(new Error('TextRenderer not initialized yet'));
    }

    // 기존 타이머 취소
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    return new Promise<THREE.Mesh>((resolve, reject) => {
      // 0.1초 지연 후 실행
      this.debounceTimer = window.setTimeout(async () => {
        try {
          const textMesh = await this.createTextImmediate(config);
          resolve(textMesh);
        } catch (error) {
          reject(error);
        } finally {
          this.debounceTimer = null;
        }
      }, this.DEBOUNCE_DELAY);
    });
  }

  /**
   * 즉시 3D 텍스트 생성 (내부 메서드)
   * @param config 텍스트 설정
   * @returns Promise<THREE.Mesh>
   */
  private async createTextImmediate(config: TextConfig): Promise<THREE.Mesh> {
    this.isLoading = true;

    try {
      console.log('Creating text with config:', config);

      // 이전 텍스트 정리 (메모리 누수 방지)
      this.disposeCurrentText();

      let textGeometry: THREE.BufferGeometry;
      
      if (!this.TextGeometry || this.TextGeometry === THREE.BoxGeometry) {
        // Fallback: BoxGeometry 사용
        console.log('Using fallback BoxGeometry for text');
        textGeometry = new THREE.BoxGeometry(
          (config.text?.length || 5) * (config.fontSize || 4) * 0.6, // 너비
          config.fontSize || 4, // 높이  
          config.depth || 0.5 // 깊이
        );
      } else {
        // 정상: TextGeometry 사용
        const font = await this.getFont(config.fontFamily || 'helvetiker');
        
        textGeometry = new this.TextGeometry(config.text || 'HELLO', {
          font: font,
          size: config.fontSize || 4,
          height: config.depth || 0.5, // 실제 3D 두께
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelOffset: 0,
          bevelSegments: 5
        });
      }

      // 텍스트 중앙 정렬
      textGeometry.computeBoundingBox();
      const centerOffsetX = -0.5 * (textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x);
      const centerOffsetY = -0.5 * (textGeometry.boundingBox!.max.y - textGeometry.boundingBox!.min.y);
      textGeometry.translate(centerOffsetX, centerOffsetY, 0);

      // 머티리얼 생성
      const material = new THREE.MeshPhongMaterial({
        color: config.color || '#ffffff',
        shininess: 100,
        specular: 0x111111
      });

      // 메시 생성
      this.textMesh = new THREE.Mesh(textGeometry, material);
      
      // 위치 및 회전 설정
      if (config.position) {
        this.textMesh.position.set(config.position.x, config.position.y, config.position.z);
      }
      
      if (config.rotation) {
        this.textMesh.rotation.set(config.rotation.x, config.rotation.y, config.rotation.z);
      }
      
      if (config.scale) {
        this.textMesh.scale.set(config.scale.x, config.scale.y, config.scale.z);
      }

      // 설정 저장
      this.currentConfig = { ...config };
      this.isLoading = false;

      console.log('TextGeometry created successfully');
      return this.textMesh;
    } catch (error) {
      this.isLoading = false;
      console.error('Failed to create text:', error);
      throw new Error(`Failed to create text: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 폰트 가져오기
   * @param fontFamily 폰트 패밀리명
   * @returns Promise<any>
   */
  private async getFont(fontFamily: string): Promise<any> {
    // FontLoader가 없는 경우 (fallback 모드)
    if (!this.fontLoader) {
      console.log('FontLoader not available, returning null font');
      return null;
    }

    // 이미 로드된 폰트가 있으면 사용
    const loadedFont = this.loadedFonts.get(fontFamily);
    if (loadedFont) {
      console.log(`Using cached font: ${fontFamily}`);
      return loadedFont;
    }

    // 기본 폰트 매핑
    const fontMap: Record<string, string> = {
      'helvetiker': 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
      'optimer': 'https://threejs.org/examples/fonts/optimer_regular.typeface.json',
      'sans-serif': 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
      'serif': 'https://threejs.org/examples/fonts/optimer_regular.typeface.json',
      'monospace': 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json'
    };

    const fontUrl = fontMap[fontFamily] || fontMap['helvetiker'];
    
    try {
      console.log(`Loading font: ${fontFamily} from ${fontUrl}`);
      const font = await this.loadFont(fontUrl);
      this.loadedFonts.set(fontFamily, font);
      console.log(`Font ${fontFamily} loaded successfully`);
      return font;
    } catch (error) {
      console.warn(`Failed to load font ${fontFamily}:`, error);
      
      // Fallback 순서: helvetiker -> optimer -> 첫 번째 로드된 폰트
      const fallbackOrder = ['helvetiker', 'optimer'];
      
      for (const fallbackName of fallbackOrder) {
        const fallbackFont = this.loadedFonts.get(fallbackName);
        if (fallbackFont) {
          console.log(`Using fallback font: ${fallbackName}`);
          return fallbackFont;
        }
      }
      
      // 마지막으로 아무 폰트나 사용
      const anyFont = this.loadedFonts.values().next().value;
      if (anyFont) {
        console.log('Using any available font as last resort');
        return anyFont;
      }
      
      throw new Error('No fonts available - font loading system failed');
    }
  }

  /**
   * 현재 텍스트 메시 정리 (메모리 누수 방지)
   */
  private disposeCurrentText(): void {
    if (this.textMesh) {
      console.log('Disposing current text mesh...');
      
      // 지오메트리 정리
      if (this.textMesh.geometry) {
        this.textMesh.geometry.dispose();
        console.log('Text geometry disposed');
      }

      // 머티리얼 정리
      if (this.textMesh.material) {
        if (Array.isArray(this.textMesh.material)) {
          this.textMesh.material.forEach((material: THREE.Material) => {
            // 텍스처 정리 (타입 안전성 고려)
            const mat = material as any;
            if (mat.map) {
              mat.map.dispose();
            }
            if (mat.normalMap) {
              mat.normalMap.dispose();
            }
            if (mat.roughnessMap) {
              mat.roughnessMap.dispose();
            }
            material.dispose();
          });
        } else {
          // 텍스처 정리 (타입 안전성 고려)
          const mat = this.textMesh.material as any;
          if (mat.map) {
            mat.map.dispose();
          }
          if (mat.normalMap) {
            mat.normalMap.dispose();
          }
          if (mat.roughnessMap) {
            mat.roughnessMap.dispose();
          }
          this.textMesh.material.dispose();
        }
        console.log('Text material disposed');
      }

      this.textMesh = null;
      console.log('Text mesh disposed successfully');
    }
  }

  /**
   * 디바운싱 타이머 취소
   */
  public cancelPendingUpdate(): void {
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  /**
   * 현재 텍스트 메시 가져오기
   * @returns THREE.Mesh 객체 또는 null
   */
  public getTextMesh(): THREE.Mesh | null {
    return this.textMesh;
  }

  /**
   * 현재 설정 가져오기
   * @returns 현재 텍스트 설정
   */
  public getCurrentConfig(): TextConfig | null {
    return this.currentConfig ? { ...this.currentConfig } : null;
  }

  /**
   * 로딩 상태 확인
   * @returns 로딩 여부
   */
  public isTextLoading(): boolean {
    return this.isLoading;
  }

  /**
   * 초기화 완료 상태 확인
   * @returns 초기화 완료 여부
   */
  public isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * 초기화 완료 대기
   * @returns 초기화 완료 Promise
   */
  public waitForInitialization(): Promise<void> {
    if (this.isInitialized) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const checkInitialization = () => {
        if (this.isInitialized) {
          resolve();
        } else {
          setTimeout(checkInitialization, 100);
        }
      };
      
      // 최대 10초 대기
      setTimeout(() => {
        reject(new Error('TextRenderer initialization timeout'));
      }, 10000);
      
      checkInitialization();
    });
  }

  /**
   * 리소스 정리 (메모리 누수 방지)
   */
  public dispose(): void {
    console.log('TextRenderer disposing...');
    
    // 대기 중인 업데이트 취소
    this.cancelPendingUpdate();
    
    // 현재 텍스트 정리
    this.disposeCurrentText();
    
    // 로드된 폰트들 정리
    this.loadedFonts.clear();
    
    // 상태 초기화
    this.currentConfig = null;
    this.isLoading = false;
    this.isInitialized = false;
    this.fontLoader = null;
    this.FontLoader = null;
    this.TextGeometry = null;
    
    console.log('TextRenderer disposed successfully');
  }
}