import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TTFLoader } from 'three/addons/loaders/TTFLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

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
 * Three.js r178 + FontLoader + TextGeometry 사용
 * 디바운싱 패턴 적용으로 성능 최적화
 */
export class TextRenderer {
  private textMesh: THREE.Mesh | null = null;
  private currentConfig: TextConfig | null = null;
  private isLoading = false;
  private debounceTimer: number | null = null;
  private readonly DEBOUNCE_DELAY = 100; // 0.1초 지연
  private fontLoader: FontLoader;
  private ttfLoader: TTFLoader;
  private loadedFonts: Map<string, any> = new Map();
  private isInitialized = false;

  constructor() {
    this.fontLoader = new FontLoader();
    this.ttfLoader = new TTFLoader();
    this.initializeRenderer();
  }

  /**
   * 렌더러 초기화
   */
  private async initializeRenderer(): Promise<void> {
    console.log('🚀 TextRenderer initializing with Three.js r178...');
    
    try {
      // 폰트 사전 로드
      await this.preloadFonts();
      this.isInitialized = true;
      console.log('✅ TextRenderer initialized successfully');
    } catch (error) {
      console.error('❌ TextRenderer initialization failed:', error);
      this.isInitialized = true; // 실패해도 진행 (fallback 사용)
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
        console.warn('TextRenderer initialization timeout, using fallback mode');
        resolve();
      }, 5000);
    });
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
        console.log(`✅ Font ${fontInfo.name} loaded successfully`);
      } catch (error) {
        console.warn(`❌ Failed to load font ${fontInfo.name}:`, error);
      }
    });

    await Promise.allSettled(loadPromises);
    
    if (loadedCount === 0) {
      console.error('❌ No fonts could be loaded! 3D text rendering will use fallback.');
    } else {
      console.log(`✅ Successfully loaded ${loadedCount}/${defaultFonts.length} fonts`);
    }
  }

  /**
   * TTF 폰트 로드
   * @param ttfUrl TTF 폰트 URL
   * @returns Promise<any>
   */
  private loadTTFFont(ttfUrl: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let retryCount = 0;
      const maxRetries = 3;
      
      const attemptLoad = () => {
        this.ttfLoader.load(
          ttfUrl,
          (fontData: any) => {
            console.log(`✅ TTF Font loaded successfully: ${ttfUrl}`);
            // TTF 데이터를 FontLoader로 파싱
            const font = this.fontLoader.parse(fontData);
            resolve(font);
          },
          (progress: ProgressEvent) => {
            console.log(`📥 Loading TTF font ${ttfUrl}: ${(progress.loaded / progress.total * 100).toFixed(1)}%`);
          },
          (err: unknown) => {
            const error = err as Error;
            console.warn(`❌ TTF Font load attempt ${retryCount + 1} failed for ${ttfUrl}:`, error);
            
            if (retryCount < maxRetries) {
              retryCount++;
              console.log(`🔄 Retrying TTF font load (${retryCount}/${maxRetries})...`);
              setTimeout(attemptLoad, 1000 * retryCount); // 지수적 백오프
            } else {
              reject(new Error(`TTF Font loading failed after ${maxRetries} attempts: ${error.message}`));
            }
          }
        );
      };
      
      attemptLoad();
    });
  }

  /**
   * 폰트 로드 (재시도 로직 포함)
   * @param fontUrl 폰트 URL
   * @returns Promise<any>
   */
  private loadFont(fontUrl: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let retryCount = 0;
      const maxRetries = 3;
      
      const attemptLoad = () => {
        this.fontLoader.load(
          fontUrl,
          (font: any) => {
            console.log(`✅ Font loaded successfully: ${fontUrl}`);
            resolve(font);
          },
          (progress: ProgressEvent) => {
            console.log(`📥 Loading font ${fontUrl}: ${(progress.loaded / progress.total * 100).toFixed(1)}%`);
          },
          (err: unknown) => {
            const error = err as Error;
            console.warn(`❌ Font load attempt ${retryCount + 1} failed for ${fontUrl}:`, error);
            
            if (retryCount < maxRetries) {
              retryCount++;
              console.log(`🔄 Retrying font load (${retryCount}/${maxRetries})...`);
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
  public async updateText(config: TextConfig): Promise<THREE.Mesh> {
    // 초기화 완료 대기
    if (!this.isInitialized) {
      console.log('⏳ TextRenderer not initialized yet, waiting...');
      await this.waitForInitialization();
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
      console.log('🔧 Creating text with config:', config);

      // 이전 텍스트 정리 (메모리 누수 방지)
      this.disposeCurrentText();

      let textGeometry: THREE.BufferGeometry;
      
      // 폰트 로드 시도
      const font = await this.getFont(config.fontFamily || 'helvetiker');
      
      if (font) {
        // 정상: TextGeometry 사용
        console.log(`📝 Using TextGeometry for text "${config.text}"`);
        textGeometry = new TextGeometry(config.text || '안녕하세요', {
          font: font,
          size: config.fontSize || 4,
          depth: config.depth || 0.5, // Three.js r178에서 depth 사용
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelOffset: 0,
          bevelSegments: 5
        });
      } else {
        // Fallback: 개별 글자 3D 박스들
        console.log(`🔤 Creating individual character boxes for "${config.text}"`);
        const characterBoxMesh = this.createCharacterBoxes(config);
        
        // textMesh 참조 저장 (기존 인터페이스 호환)
        this.textMesh = characterBoxMesh;
        
        // 설정 저장
        this.currentConfig = { ...config };
        this.isLoading = false;
        
        console.log('✅ Character boxes created successfully');
        return characterBoxMesh;
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
      if (config.position && this.textMesh) {
        this.textMesh.position.set(config.position.x, config.position.y, config.position.z);
      }
      
      if (config.rotation && this.textMesh) {
        this.textMesh.rotation.set(config.rotation.x, config.rotation.y, config.rotation.z);
      }
      
      if (config.scale && this.textMesh) {
        this.textMesh.scale.set(config.scale.x, config.scale.y, config.scale.z);
      }

      // 설정 저장
      this.currentConfig = { ...config };
      this.isLoading = false;

      console.log('✅ TextGeometry created successfully');
      return this.textMesh!;
    } catch (error) {
      this.isLoading = false;
      console.error('❌ Failed to create text:', error);
      throw new Error(`Failed to create text: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 개별 글자 3D 박스들 생성
   * @param config 텍스트 설정
   * @returns THREE.Mesh (그룹으로 반환)
   */
  private createCharacterBoxes(config: TextConfig): THREE.Mesh {
    const text = config.text || '안녕하세요';
    const fontSize = config.fontSize || 4;
    const depth = config.depth || 0.5;
    
    // 글자 그룹 생성
    const textGroup = new THREE.Group();
    
    let currentX = 0;
    const charSpacing = fontSize * 0.1; // 글자 간격
    
    // 모든 머티리얼을 저장할 배열 (나중에 정리용)
    const materials: THREE.Material[] = [];
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      // 공백 처리
      if (char === ' ') {
        currentX += fontSize * 0.5;
        continue;
      }
      
      // 개별 글자 박스 생성
      const charGeometry = this.createSingleCharacterBox(char, fontSize, depth);
      const charMaterial = new THREE.MeshPhongMaterial({
        color: config.color || '#ffffff',
        shininess: 100,
        specular: 0x111111
      });
      
      materials.push(charMaterial);
      
      const charMesh = new THREE.Mesh(charGeometry, charMaterial);
      
      // 글자 위치 설정
      charMesh.position.x = currentX;
      textGroup.add(charMesh);
      
      // 다음 글자 위치 계산
      const charWidth = this.getCharacterWidth(char, fontSize);
      currentX += charWidth + charSpacing;
    }
    
    // 전체 텍스트 중앙 정렬
    const totalWidth = currentX - charSpacing;
    textGroup.position.x = -totalWidth / 2;
    
    // 머티리얼과 지오메트리를 가진 더미 메시 생성 (기존 인터페이스 호환)
    const dummyGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const dummyMaterial = new THREE.MeshPhongMaterial({ visible: false });
    const containerMesh = new THREE.Mesh(dummyGeometry, dummyMaterial);
    
    // 텍스트 그룹을 더미 메시에 추가
    containerMesh.add(textGroup);
    
    // 위치 및 회전 설정 적용
    if (config.position) {
      containerMesh.position.set(config.position.x, config.position.y, config.position.z);
    }
    
    if (config.rotation) {
      containerMesh.rotation.set(config.rotation.x, config.rotation.y, config.rotation.z);
    }
    
    if (config.scale) {
      containerMesh.scale.set(config.scale.x, config.scale.y, config.scale.z);
    }
    
    // textGroup을 userData에 저장하여 나중에 접근 가능하도록 함
    containerMesh.userData.textGroup = textGroup;
    containerMesh.userData.materials = materials;
    
    return containerMesh;
  }

  /**
   * 개별 글자 박스 생성
   * @param char 문자
   * @param fontSize 폰트 크기
   * @param depth 깊이
   * @returns THREE.BufferGeometry
   */
  private createSingleCharacterBox(char: string, fontSize: number, depth: number): THREE.BufferGeometry {
    const charWidth = this.getCharacterWidth(char, fontSize);
    const height = fontSize;
    
    // 둥근 모서리가 있는 개별 글자 박스
    const shape = new THREE.Shape();
    const radius = Math.min(height * 0.1, depth * 0.2);
    
    const x = -charWidth / 2;
    const y = -height / 2;
    
    shape.moveTo(x + radius, y);
    shape.lineTo(x + charWidth - radius, y);
    shape.quadraticCurveTo(x + charWidth, y, x + charWidth, y + radius);
    shape.lineTo(x + charWidth, y + height - radius);
    shape.quadraticCurveTo(x + charWidth, y + height, x + charWidth - radius, y + height);
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);
    
    const extrudeSettings = {
      depth: depth,
      bevelEnabled: true,
      bevelThickness: depth * 0.1,
      bevelSize: radius * 0.3,
      bevelSegments: 2
    };
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }

  /**
   * 문자별 너비 계산
   * @param char 문자
   * @param fontSize 폰트 크기
   * @returns 문자 너비
   */
  private getCharacterWidth(char: string, fontSize: number): number {
    // 한글과 영어 구분
    const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(char);
    
    if (isKorean) {
      return fontSize * 0.9; // 한글은 더 넓게
    } else {
      // 영어 문자별 너비 조정
      const wideChars = /[mwMW]/.test(char);
      const narrowChars = /[iltjfI]/.test(char);
      
      if (wideChars) {
        return fontSize * 0.8;
      } else if (narrowChars) {
        return fontSize * 0.4;
      } else {
        return fontSize * 0.6; // 기본 영어 문자
      }
    }
  }

  /**
   * 폰트 가져오기
   * @param fontFamily 폰트 패밀리명
   * @returns Promise<any>
   */
  private async getFont(fontFamily: string): Promise<any> {
    // 이미 로드된 폰트가 있으면 사용
    const loadedFont = this.loadedFonts.get(fontFamily);
    if (loadedFont) {
      console.log(`📁 Using cached font: ${fontFamily}`);
      return loadedFont;
    }

    // 기본 폰트 매핑 (TTF와 JSON 모두 지원)
    const fontMap: Record<string, { url: string; type: 'ttf' | 'json' }> = {
      'cookierun-bold': {
        url: '/fonts/CookieRun-Bold.ttf',
        type: 'ttf'
      },
      'nanum-gothic': {
        url: '/fonts/NanumGothic-Regular.ttf',
        type: 'ttf'
      },
      'noto-sans-kr': {
        url: '/fonts/NotoSansKR-Regular.ttf',
        type: 'ttf'
      },
      'helvetiker': {
        url: 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
        type: 'json'
      },
      'optimer': {
        url: 'https://threejs.org/examples/fonts/optimer_regular.typeface.json',
        type: 'json'
      },
      'sans-serif': {
        url: 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
        type: 'json'
      },
      'serif': {
        url: 'https://threejs.org/examples/fonts/optimer_regular.typeface.json',
        type: 'json'
      },
      'monospace': {
        url: 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
        type: 'json'
      }
    };

    const fontInfo = fontMap[fontFamily] || fontMap['helvetiker'];
    
    try {
      console.log(`📥 Loading font: ${fontFamily} from ${fontInfo.url} (${fontInfo.type})`);
      
      let font;
      if (fontInfo.type === 'ttf') {
        font = await this.loadTTFFont(fontInfo.url);
      } else {
        font = await this.loadFont(fontInfo.url);
      }
      
      this.loadedFonts.set(fontFamily, font);
      console.log(`✅ Font ${fontFamily} loaded successfully`);
      return font;
    } catch (error) {
      console.warn(`❌ Failed to load font ${fontFamily}:`, error);
      
      // Fallback 순서: helvetiker -> optimer -> 첫 번째 로드된 폰트
      const fallbackOrder = ['helvetiker', 'optimer'];
      
      for (const fallbackName of fallbackOrder) {
        const fallbackFont = this.loadedFonts.get(fallbackName);
        if (fallbackFont) {
          console.log(`🔄 Using fallback font: ${fallbackName}`);
          return fallbackFont;
        }
      }
      
      // 마지막으로 아무 폰트나 사용
      const anyFont = this.loadedFonts.values().next().value;
      if (anyFont) {
        console.log('🔄 Using any available font as last resort');
        return anyFont;
      }
      
      // 폰트가 없으면 null 반환 (BoxGeometry 사용)
      console.warn('⚠️ No fonts available - using fallback BoxGeometry');
      return null;
    }
  }

  /**
   * 현재 텍스트 메시 정리 (메모리 누수 방지)
   */
  private disposeCurrentText(): void {
    if (this.textMesh) {
      console.log('🧹 Disposing current text mesh...');
      
      // 개별 글자 박스들 정리 (userData에 저장된 경우)
      if (this.textMesh.userData.textGroup) {
        const textGroup = this.textMesh.userData.textGroup as THREE.Group;
        textGroup.traverse((child: any) => {
          if (child instanceof THREE.Mesh) {
            if (child.geometry) {
              child.geometry.dispose();
            }
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((mat: any) => mat.dispose());
              } else {
                child.material.dispose();
              }
            }
          }
        });
        console.log('✅ Character boxes disposed');
      }
      
      // userData에 저장된 머티리얼들 정리
      if (this.textMesh.userData.materials) {
        const materials = this.textMesh.userData.materials as THREE.Material[];
        materials.forEach((material) => material.dispose());
      }
      
      // 지오메트리 정리
      if (this.textMesh.geometry) {
        this.textMesh.geometry.dispose();
        console.log('✅ Text geometry disposed');
      }

      // 머티리얼 정리
      if (this.textMesh.material) {
        if (Array.isArray(this.textMesh.material)) {
          this.textMesh.material.forEach((material: THREE.Material) => {
            // 텍스처 정리 (타입 안전성 고려)
            const mat = material as any;
            if (mat.map && mat.map.dispose) {
              mat.map.dispose();
            }
            if (mat.normalMap && mat.normalMap.dispose) {
              mat.normalMap.dispose();
            }
            if (mat.roughnessMap && mat.roughnessMap.dispose) {
              mat.roughnessMap.dispose();
            }
            material.dispose();
          });
        } else {
          // 텍스처 정리 (타입 안전성 고려)
          const mat = this.textMesh.material as any;
          if (mat.map && mat.map.dispose) {
            mat.map.dispose();
          }
          if (mat.normalMap && mat.normalMap.dispose) {
            mat.normalMap.dispose();
          }
          if (mat.roughnessMap && mat.roughnessMap.dispose) {
            mat.roughnessMap.dispose();
          }
          this.textMesh.material.dispose();
        }
        console.log('✅ Text material disposed');
      }

      this.textMesh = null;
      console.log('✅ Text mesh disposed successfully');
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
   * 리소스 정리 (메모리 누수 방지)
   */
  public dispose(): void {
    console.log('🧹 TextRenderer disposing...');
    
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
    
    console.log('✅ TextRenderer disposed successfully');
  }
}