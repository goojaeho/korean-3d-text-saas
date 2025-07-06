import * as THREE from 'three';

// 임시 타입 정의 (workspace dependency 해결 전까지)
type AnimationType = 'rotate' | 'float' | 'pulse' | 'wave';

/**
 * 3D 애니메이션 제어 클래스
 * 다양한 애니메이션 타입을 지원합니다
 */
export class AnimationController {
  private animationId: number | null = null;
  private isAnimating = false;
  private startTime = 0;
  private currentAnimation: AnimationType | null = null;
  private targetObject: any = null; // THREE.Object3D
  private originalPosition: any = null; // THREE.Vector3
  private originalRotation: any = null; // THREE.Euler
  private originalScale: any = null; // THREE.Vector3
  private isInitialized = false;

  constructor() {
    this.initializeAnimationController();
  }

  /**
   * AnimationController 초기화
   */
  private initializeAnimationController(): void {
    console.log('🚀 AnimationController initializing...');
    
    try {
      // Three.js 객체들 초기화
      this.originalPosition = new THREE.Vector3();
      this.originalRotation = new THREE.Euler();
      this.originalScale = new THREE.Vector3();
      console.log('✅ AnimationController initialized successfully');
      
      this.isInitialized = true;
    } catch (error) {
      console.error('❌ AnimationController initialization failed:', error);
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
        console.warn('AnimationController initialization timeout');
        resolve();
      }, 5000);
    });
  }

  /**
   * 애니메이션 시작
   * @param object 애니메이션할 3D 객체
   * @param animationType 애니메이션 타입
   */
  public startAnimation(object: any, animationType: AnimationType): void {
    // 초기화 확인
    if (!this.isInitialized) {
      console.warn('⚠️ AnimationController not initialized yet');
      return;
    }

    if (this.isAnimating) {
      this.stopAnimation();
    }

    // 실제 애니메이션 대상 찾기 (textGroup이 있으면 그것을 사용)
    let animationTarget = object;
    if (object.userData && object.userData.textGroup) {
      animationTarget = object.userData.textGroup as THREE.Object3D;
      console.log('Using textGroup for animation');
    }

    this.targetObject = animationTarget;
    this.currentAnimation = animationType;
    
    // 원본 변환값 저장
    this.originalPosition.copy(animationTarget.position);
    this.originalRotation.copy(animationTarget.rotation);
    this.originalScale.copy(animationTarget.scale);

    this.isAnimating = true;
    this.startTime = performance.now();
    
    this.animate();
  }

  /**
   * 애니메이션 중지
   */
  public stopAnimation(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    this.isAnimating = false;
    this.currentAnimation = null;

    // 원본 위치로 복원
    if (this.targetObject) {
      this.targetObject.position.copy(this.originalPosition);
      this.targetObject.rotation.copy(this.originalRotation);
      this.targetObject.scale.copy(this.originalScale);
    }
  }

  /**
   * 애니메이션 루프
   */
  private animate = (): void => {
    if (!this.isAnimating || !this.targetObject || !this.currentAnimation) {
      return;
    }

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.startTime) / 1000; // 초 단위

    this.updateAnimation(deltaTime);

    this.animationId = requestAnimationFrame(this.animate);
  };

  /**
   * 애니메이션 업데이트
   * @param deltaTime 경과 시간 (초)
   */
  private updateAnimation(deltaTime: number): void {
    if (!this.targetObject) return;

    switch (this.currentAnimation) {
      case 'rotate':
        this.updateRotateAnimation(deltaTime);
        break;
      case 'float':
        this.updateFloatAnimation(deltaTime);
        break;
      case 'pulse':
        this.updatePulseAnimation(deltaTime);
        break;
      case 'wave':
        this.updateWaveAnimation(deltaTime);
        break;
    }
  }

  /**
   * 회전 애니메이션 업데이트
   * Y축 회전 + 가벼운 흔들림
   * @param deltaTime 경과 시간
   */
  private updateRotateAnimation(deltaTime: number): void {
    if (!this.targetObject) return;

    const rotationSpeed = 1.0; // 회전 속도
    const wobbleAmount = 0.1; // 흔들림 정도
    const wobbleSpeed = 3.0; // 흔들림 속도

    // Y축 회전
    this.targetObject.rotation.y = this.originalRotation.y + deltaTime * rotationSpeed;

    // 가벼운 흔들림 (X, Z축)
    this.targetObject.rotation.x = this.originalRotation.x + 
      Math.sin(deltaTime * wobbleSpeed) * wobbleAmount;
    this.targetObject.rotation.z = this.originalRotation.z + 
      Math.cos(deltaTime * wobbleSpeed * 0.7) * wobbleAmount * 0.5;
  }

  /**
   * 플로팅 애니메이션 업데이트
   * 위아래 플로팅 + Z축 회전
   * @param deltaTime 경과 시간
   */
  private updateFloatAnimation(deltaTime: number): void {
    if (!this.targetObject) return;

    const floatSpeed = 2.0; // 플로팅 속도
    const floatAmount = 0.3; // 플로팅 거리
    const rotationSpeed = 0.5; // 회전 속도

    // 위아래 움직임
    this.targetObject.position.y = this.originalPosition.y + 
      Math.sin(deltaTime * floatSpeed) * floatAmount;

    // Z축 회전
    this.targetObject.rotation.z = this.originalRotation.z + 
      deltaTime * rotationSpeed;

    // 미세한 X축 흔들림
    this.targetObject.rotation.x = this.originalRotation.x +
      Math.sin(deltaTime * floatSpeed * 1.5) * 0.05;
  }

  /**
   * 펄스 애니메이션 업데이트
   * 크기 변화 + 회전 조합
   * @param deltaTime 경과 시간
   */
  private updatePulseAnimation(deltaTime: number): void {
    if (!this.targetObject) return;

    const pulseSpeed = 3.0; // 펄스 속도
    const pulseAmount = 0.2; // 크기 변화량
    const rotationSpeed = 1.5; // 회전 속도

    // 크기 변화 (펄스)
    const scaleMultiplier = 1 + Math.sin(deltaTime * pulseSpeed) * pulseAmount;
    this.targetObject.scale.copy(this.originalScale).multiplyScalar(scaleMultiplier);

    // Y축 회전
    this.targetObject.rotation.y = this.originalRotation.y + 
      deltaTime * rotationSpeed;

    // 색상 변화를 위한 머티리얼 조작 (선택적)
    this.updateMaterialIntensity(scaleMultiplier);
  }

  /**
   * 웨이브 애니메이션 업데이트
   * X축, Y축 웨이브 모션
   * @param deltaTime 경과 시간
   */
  private updateWaveAnimation(deltaTime: number): void {
    if (!this.targetObject) return;

    const waveSpeedX = 2.5; // X축 웨이브 속도
    const waveSpeedY = 3.0; // Y축 웨이브 속도
    const waveAmountX = 0.4; // X축 웨이브 크기
    const waveAmountY = 0.2; // Y축 웨이브 크기

    // X축 웨이브 움직임
    this.targetObject.position.x = this.originalPosition.x + 
      Math.sin(deltaTime * waveSpeedX) * waveAmountX;

    // Y축 웨이브 움직임 (위상차)
    this.targetObject.position.y = this.originalPosition.y + 
      Math.cos(deltaTime * waveSpeedY + Math.PI / 4) * waveAmountY;

    // 복합 회전
    this.targetObject.rotation.x = this.originalRotation.x +
      Math.sin(deltaTime * waveSpeedX * 0.5) * 0.1;
    this.targetObject.rotation.z = this.originalRotation.z +
      Math.cos(deltaTime * waveSpeedY * 0.7) * 0.15;
  }

  /**
   * 머티리얼 강도 업데이트 (펄스 애니메이션용)
   * @param intensity 강도 값
   */
  private updateMaterialIntensity(intensity: number): void {
    if (!this.targetObject) return;

    // 텍스트 메시의 머티리얼 확인
    if ('material' in this.targetObject) {
      const material = (this.targetObject as any).material;
      
      if (material && 'emissiveIntensity' in material) {
        material.emissiveIntensity = Math.max(0, (intensity - 1) * 0.5);
      }
    }
  }

  /**
   * 애니메이션 속도 조절
   * @param speed 속도 배율 (1.0 = 기본 속도)
   */
  public setAnimationSpeed(speed: number): void {
    // 현재 시간을 조정하여 속도 변경 효과
    const currentTime = performance.now();
    this.startTime = currentTime - (currentTime - this.startTime) * speed;
  }

  /**
   * 특정 애니메이션이 실행 중인지 확인
   * @param animationType 확인할 애니메이션 타입
   * @returns 실행 여부
   */
  public isAnimationRunning(animationType: AnimationType): boolean {
    return this.isAnimating && this.currentAnimation === animationType;
  }

  /**
   * 현재 실행 중인 애니메이션 타입 가져오기
   * @returns 현재 애니메이션 타입 또는 null
   */
  public getCurrentAnimation(): AnimationType | null {
    return this.currentAnimation;
  }

  /**
   * 애니메이션 실행 상태 확인
   * @returns 애니메이션 실행 여부
   */
  public getIsAnimating(): boolean {
    return this.isAnimating;
  }

  /**
   * 대상 객체 가져오기
   * @returns 현재 애니메이션 대상 객체
   */
  public getTargetObject(): THREE.Object3D | null {
    return this.targetObject;
  }

  /**
   * 리소스 정리
   */
  public dispose(): void {
    this.stopAnimation();
    this.targetObject = null;
    this.currentAnimation = null;
  }
}