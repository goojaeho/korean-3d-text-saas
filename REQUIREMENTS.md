# 한글 3D 텍스트 SaaS 프로젝트 요구정의서

## 📋 프로젝트 개요

### 프로젝트명

**Korean 3D Text SaaS** - 한글 3D 텍스트 생성 플랫폼

### 프로젝트 목표

웹 브라우저에서 실시간으로 한글 3D 텍스트를 편집하고 내보낼 수 있는 SaaS 플랫폼 개발

### 대상 사용자

- 간판 디자이너

## 🎯 핵심 기능

### 1. 3D 텍스트 편집기

- **실시간 텍스트 편집**: 타이핑과 동시에 3D 미리보기
- **한글 폰트 지원**: Noto Sans Korean 등 한글 웹폰트
- **색상 변경**: 컬러 피커로 자유로운 색상 선택
- **크기 조절**: 슬라이더로 텍스트 크기 조정
- **폰트 변경**: 여러 한글 폰트 옵션 제공

### 2. 애니메이션 시스템

- **rotate**: Y축 회전 + 가벼운 흔들림
- **float**: 위아래 플로팅 + Z축 회전
- **pulse**: 크기 변화 + 회전 조합
- **wave**: X축, Y축 웨이브 모션

### 3. 내보내기 기능

- **내보내기**: PNG, PDF
- **배경 설정**: 투명, 단색, 그라데이션 배경

### 4. 프로젝트 관리

- **프로젝트 저장**: 클라우드 기반 자동 저장
- **프로젝트 목록**: 대시보드에서 관리
- **공유 기능**: 링크로 프로젝트 공유
- **버전 관리**: 편집 히스토리 추적

## 💰 수익 모델

### Free Plan (무료)

- 월 10개 프로젝트 생성
- 기본 해상도 내보내기 (HD)
- 워터마크 포함
- 기본 애니메이션 4종

### Pro Plan ($19/월)

- 월 100개 프로젝트 생성
- 고해상도 내보내기 (4K)
- 워터마크 제거
- 모든 애니메이션 및 고급 기능

### Enterprise Plan ($99/월)

- 무제한 프로젝트
- 팀 협업 기능
- API 액세스
- 우선 지원

## 🏗️ 코드 아키텍처 설계

### 전체 아키텍처 패턴

- **모노레포 구조**: Turborepo 기반 패키지 관리
- **클린 아키텍처**: 관심사 분리 및 의존성 역전
- **컴포넌트 기반**: 재사용 가능한 모듈화 설계
- **서버리스 아키텍처**: Vercel Functions 활용

### 폴더 구조 설계

```
korean-3d-text-saas/
├── apps/
│   ├── web/                    # Next.js Frontend
│   │   ├── src/
│   │   │   ├── app/           # App Router 페이지
│   │   │   │   ├── (auth)/    # 인증 관련 페이지
│   │   │   │   ├── dashboard/ # 대시보드
│   │   │   │   ├── editor/    # 3D 에디터
│   │   │   │   └── api/       # API Routes
│   │   │   ├── components/    # 페이지별 컴포넌트
│   │   │   │   ├── editor/    # 에디터 컴포넌트
│   │   │   │   ├── dashboard/ # 대시보드 컴포넌트
│   │   │   │   └── auth/      # 인증 컴포넌트
│   │   │   ├── hooks/         # 커스텀 훅
│   │   │   ├── lib/           # 유틸리티 함수
│   │   │   ├── stores/        # Zustand 상태 관리
│   │   │   └── styles/        # 스타일 파일
│   │   └── public/           # 정적 파일
│   └── api/                   # Vercel Functions
│       ├── auth/             # 인증 API
│       ├── projects/         # 프로젝트 CRUD
│       ├── 3d/              # 3D 렌더링 API
│       └── payments/        # 결제 API
├── packages/
│   ├── ui/                   # 공통 UI 컴포넌트
│   │   ├── components/       # 기본 컴포넌트
│   │   ├── layouts/         # 레이아웃 컴포넌트
│   │   └── styles/          # 공통 스타일
│   ├── types/               # TypeScript 타입
│   │   ├── api/            # API 타입
│   │   ├── models/         # 데이터 모델
│   │   └── ui/             # UI 타입
│   ├── 3d-engine/          # 3D 렌더링 엔진
│   │   ├── core/           # 핵심 엔진
│   │   ├── renderers/      # 렌더러들
│   │   ├── animations/     # 애니메이션
│   │   └── utils/          # 유틸리티
│   └── config/             # 공통 설정
├── prisma/                 # 데이터베이스 스키마
└── docs/                   # 문서
```

### 상태 관리 아키텍처

#### Zustand 스토어 구조

```typescript
// stores/editorStore.ts - 3D 에디터 상태
interface EditorState {
  // 현재 편집 상태
  currentText: string
  selectedColor: string
  selectedFont: string
  animationType: AnimationType
  
  // 에디터 UI 상태
  isEditing: boolean
  selectedTool: string
  canvasZoom: number
  
  // 히스토리 관리
  undoStack: EditorSnapshot[]
  redoStack: EditorSnapshot[]
  
  // 액션들
  updateText: (text: string) => void
  updateColor: (color: string) => void
  undo: () => void
  redo: () => void
}

// stores/uiStore.ts - 전역 UI 상태
interface UIState {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  currentModal: string | null
  notifications: Notification[]
  
  // 액션들
  toggleSidebar: () => void
  openModal: (modalId: string) => void
  showNotification: (notification: Notification) => void
}

// stores/userStore.ts - 사용자 상태
interface UserState {
  user: User | null
  subscription: Subscription | null
  usage: Usage
  
  // 액션들
  setUser: (user: User) => void
  updateUsage: (usage: Usage) => void
}
```

#### TanStack Query 구조

```typescript
// hooks/api/useProjects.ts - 프로젝트 관련 쿼리
export const useProjects = () => useQuery({
  queryKey: ['projects'],
  queryFn: fetchProjects
})

export const useProject = (id: string) => useQuery({
  queryKey: ['projects', id],
  queryFn: () => fetchProject(id)
})

export const useCreateProject = () => useMutation({
  mutationFn: createProject,
  onSuccess: () => {
    queryClient.invalidateQueries(['projects'])
  }
})

// hooks/api/useAuth.ts - 인증 관련 쿼리
export const useSession = () => useQuery({
  queryKey: ['session'],
  queryFn: fetchSession
})

// hooks/api/useSubscription.ts - 구독 관련 쿼리
export const useSubscription = () => useQuery({
  queryKey: ['subscription'],
  queryFn: fetchSubscription
})
```

### 3D 엔진 아키텍처

#### 핵심 클래스 구조

```typescript
// packages/3d-engine/core/SceneManager.ts
class SceneManager {
  private scene: THREE.Scene
  private camera: THREE.Camera
  private renderer: THREE.WebGLRenderer
  
  initialize(canvas: HTMLCanvasElement): void
  dispose(): void
  render(): void
  resize(width: number, height: number): void
}

// packages/3d-engine/core/TextRenderer.ts
class TextRenderer {
  private textMesh: troika.Text
  private config: TextConfig
  
  createText(config: TextConfig): Promise<void>
  updateText(text: string): void
  updateColor(color: string): void
  updateFont(font: string): void
  dispose(): void
}

// packages/3d-engine/core/AnimationController.ts
class AnimationController {
  private animationId: number
  private animations: Map<string, Animation>
  
  startAnimation(type: AnimationType): void
  stopAnimation(): void
  updateAnimation(deltaTime: number): void
}

// packages/3d-engine/core/ExportManager.ts
class ExportManager {
  exportPNG(options: ExportOptions): Promise<Blob>
  exportGIF(options: ExportOptions): Promise<Blob>
  exportMP4(options: ExportOptions): Promise<Blob>
}
```

#### 렌더링 최적화 전략

```typescript
// packages/3d-engine/utils/RenderOptimizer.ts
class RenderOptimizer {
  private debounceTimer: number
  private objectPool: TextObjectPool
  
  // 디바운싱 기반 렌더링
  debouncedRender(config: TextConfig): void {
    clearTimeout(this.debounceTimer)
    this.debounceTimer = setTimeout(() => {
      this.performRender(config)
    }, 500)
  }
  
  // 객체 풀 관리
  private performRender(config: TextConfig): void {
    const textObj = this.objectPool.acquire()
    // 렌더링 로직
    this.objectPool.release(textObj)
  }
}
```

### API 설계 아키텍처

#### RESTful API 구조

```
GET    /api/projects              # 프로젝트 목록
POST   /api/projects              # 프로젝트 생성
GET    /api/projects/:id          # 프로젝트 상세
PUT    /api/projects/:id          # 프로젝트 수정
DELETE /api/projects/:id          # 프로젝트 삭제

POST   /api/3d/render             # 3D 텍스트 렌더링
POST   /api/3d/export             # 이미지/영상 내보내기

GET    /api/auth/session          # 세션 정보
POST   /api/auth/signin           # 로그인
POST   /api/auth/signup           # 회원가입
POST   /api/auth/signout          # 로그아웃

GET    /api/subscription          # 구독 정보
POST   /api/subscription/upgrade  # 플랜 업그레이드
POST   /api/subscription/cancel   # 구독 취소

POST   /api/payments/webhook      # Stripe 웹훅
```

#### API 응답 표준화

```typescript
// packages/types/api/responses.ts
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    page?: number
    limit?: number
    total?: number
  }
}

// API 응답 예시
interface ProjectResponse extends ApiResponse<Project> {}
interface ProjectsResponse extends ApiResponse<Project[]> {}
```

### 데이터베이스 설계

#### Prisma 스키마 구조

```prisma
// prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  plan      UserPlan @default(FREE)
  credits   Int      @default(10)
  projects  Project[]
  subscription Subscription?
  usage     Usage[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Project {
  id          String   @id @default(cuid())
  title       String
  description String?
  textConfig  Json     // 3D 텍스트 설정
  thumbnailUrl String?
  isPublic    Boolean  @default(false)
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  exports     Export[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model TextTemplate {
  id          String @id @default(cuid())
  name        String
  description String?
  config      Json   // 폰트, 색상, 애니메이션 설정
  category    String
  isPublic    Boolean @default(false)
  userId      String?
  usageCount  Int     @default(0)
  createdAt   DateTime @default(now())
}

model Export {
  id        String     @id @default(cuid())
  projectId String
  format    ExportFormat
  resolution String
  fileUrl   String
  fileSize  Int
  project   Project    @relation(fields: [projectId], references: [id])
  createdAt DateTime   @default(now())
}

enum UserPlan {
  FREE
  PRO
  ENTERPRISE
}

enum ExportFormat {
  PNG
  JPEG
  GIF
  MP4
}
```

### 컴포넌트 설계 원칙

#### 컴포넌트 분류 체계

```typescript
// packages/ui/components/ - 기본 컴포넌트
- atoms/     # 최소 단위 (Button, Input, Icon)
- molecules/ # 조합 단위 (SearchBox, Card, Modal)
- organisms/ # 복합 단위 (Header, Sidebar, ProjectGrid)
- templates/ # 레이아웃 (PageLayout, DashboardLayout)

// apps/web/src/components/ - 페이지별 컴포넌트
- editor/    # 에디터 전용 컴포넌트
- dashboard/ # 대시보드 전용 컴포넌트
- auth/      # 인증 전용 컴포넌트
```

#### 컴포넌트 작성 규칙

```typescript
// 1. Props 인터페이스 정의
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: (e: MouseEvent) => void
  children: ReactNode
}

// 2. 컴포넌트 구현
export const Button: FC<ButtonProps> = ({ 
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children
}) => {
  return (
    <button 
      className={cn(
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        { 'btn-disabled': disabled }
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

// 3. 기본값 및 타입 내보내기
export type { ButtonProps }
```

### 에러 처리 아키텍처

#### 에러 타입 정의

```typescript
// packages/types/errors.ts
enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
}

class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'AppError'
  }
}
```

#### 에러 핸들링 전략

```typescript
// apps/web/src/lib/errorHandler.ts
export const handleApiError = (error: unknown) => {
  if (error instanceof AppError) {
    // 알려진 에러 처리
    showNotification({
      type: 'error',
      message: error.message
    })
  } else {
    // 알 수 없는 에러 처리
    showNotification({
      type: 'error', 
      message: '예상치 못한 오류가 발생했습니다.'
    })
  }
}
```

### 테스트 아키텍처

#### 테스트 구조

```
tests/
├── unit/           # 단위 테스트
│   ├── components/
│   ├── hooks/
│   └── utils/
├── integration/    # 통합 테스트
│   ├── api/
│   └── 3d-engine/
└── e2e/           # E2E 테스트
    ├── auth/
    ├── editor/
    └── dashboard/
```

#### 테스트 전략

```typescript
// 컴포넌트 테스트
describe('Button Component', () => {
  it('renders with correct variant', () => {
    render(<Button variant="primary">Click me</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn-primary')
  })
})

// 훅 테스트
describe('useProjects Hook', () => {
  it('fetches projects successfully', async () => {
    const { result, waitFor } = renderHook(() => useProjects())
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

// 3D 엔진 테스트
describe('TextRenderer', () => {
  it('creates text mesh with correct config', () => {
    const renderer = new TextRenderer()
    const config = { text: 'Hello', color: '#ff0000' }
    renderer.createText(config)
    expect(renderer.getTextMesh().material.color.getHex()).toBe(0xff0000)
  })
})
```

### 성능 최적화 전략

#### 번들 최적화

```typescript
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ['@packages/ui', '@packages/3d-engine']
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'three': 'three/build/three.module.js'
    }
    return config
  }
}
```

#### 코드 스플리팅

```typescript
// 동적 import로 3D 엔진 지연 로딩
const TextEditor = dynamic(() => import('@/components/editor/TextEditor'), {
  loading: () => <EditorSkeleton />,
  ssr: false
})
```

### 배포 아키텍처

#### Vercel 배포 설정

```json
// vercel.json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ]
}
```

## 🔧 기술 요구사항

### Frontend

- **React 19** + **TypeScript 5.7**
- **Next.js 15.1** (App Router)
- **TailwindCSS 3.4**
- **Zustand 5.0.6** (클라이언트 상태)
- **TanStack Query 5.81.5** (서버 상태)
- **Three.js r178** + **Troika-three-text**
- **Next-Auth 5.0** (인증)

### Backend & 인프라

- **Vercel Serverless Functions** (API)
- **Vercel Postgres** (데이터베이스)
- **Vercel Blob** (파일 저장)
- **Prisma ORM 6.10.0**
- **Stripe** (결제 처리)

### 성능 최적화

- **디바운싱 기반 3D 렌더링**: 0.5초 대기 후 렌더링
- **메모리 관리**: 이전 3D 객체 자동 정리
- **실시간 미리보기**: 2D 텍스트로 즉시 반응

## 👥 사용자 시나리오

### 시나리오 1: 간판 디자이너

1. 회원가입 후 Pro Plan 구독
2. "안녕하세요" 텍스트 입력
3. 컬러를 브랜드 색상으로 변경
4. 클라이언트에게 미리보기 링크 공유 또는 파일 내보내기

## 🎨 UI/UX 요구사항

### 디자인 원칙

- **직관적 인터페이스**: 초보자도 쉽게 사용
- **실시간 피드백**: 모든 변경사항 즉시 반영
- **반응형 디자인**: 데스크톱/모바일 모두 지원
- **현대적 디자인**: 깔끔하고 미니멀한 인터페이스

### 레이아웃 구조

- **에디터 뷰**: 우측 3D 캔버스 + 좌측 컨트롤 패널
- **대시보드**: 프로젝트 그리드 뷰 + 사용량 정보
- **랜딩 페이지**: 기능 소개 + 가격 정보 + CTA

## 🔒 보안 요구사항

### 데이터 보안

- **사용자 인증**: Next-Auth 5.0 OAuth 연동
- **데이터 암호화**: 민감 정보 암호화 저장
- **파일 보안**: Vercel Blob 접근 권한 관리
- **API 보안**: Rate limiting 및 입력값 검증

### 개인정보 보호

- **GDPR 준수**: 유럽 사용자 개인정보 보호
- **데이터 최소화**: 필요한 정보만 수집
- **사용자 동의**: 명확한 이용약관 및 개인정보 처리방침

## 📈 성능 기준

### 응답 시간

- **페이지 로딩**: 3초 이내
- **텍스트 입력 반응**: 100ms 이내 (2D 미리보기)
- **3D 렌더링**: 1초 이내 (디바운싱 후)
- **내보내기 처리**: 30초 이내

### 동시 사용자

- **목표**: 1,000명 동시 사용자
- **피크 시간**: 평일 오후 2-5시
- **확장성**: 수직/수평 확장 가능한 아키텍처

## 📱 브라우저 지원

### 지원 브라우저

- **Chrome**: 최신 버전
- **Firefox**: 최신 버전
- **Safari**: 최신 버전
- **Edge**: 최신 버전

### 모바일 지원

- **iOS Safari**: 버전 14+
- **Android Chrome**: 버전 90+
- **반응형 디자인**: 모든 디바이스 대응

## 🚀 개발 단계

### Phase 1: MVP (4주)

- [x] 프로젝트 설정
- [ ] 기본 3D 텍스트 편집기
- [ ] 4가지 애니메이션
- [ ] 간단한 내보내기 (PNG)
- [ ] 사용자 인증

### Phase 2: 베타 (4주)

- [ ] 프로젝트 관리 시스템
- [ ] 결제 시스템 (Stripe)
- [ ] 고급 내보내기 (GIF, MP4)
- [ ] 대시보드 개발

### Phase 3: 정식 출시 (4주)

- [ ] 성능 최적화
- [ ] 보안 강화
- [ ] 모니터링 시스템
- [ ] 마케팅 페이지

## 📊 성공 지표

### 기술 지표

- **페이지 로딩 속도**: 평균 2초 이하
- **에러율**: 1% 이하
- **서버 가동률**: 99.9% 이상

### 비즈니스 지표

- **월간 활성 사용자**: 1,000명 (6개월 후)
- **유료 전환율**: 15% 이상
- **고객 만족도**: 4.5점 이상 (5점 만점)

## 🔄 유지보수 계획

### 정기 업데이트

- **보안 패치**: 매주 점검
- **기능 업데이트**: 월 1회
- **성능 최적화**: 분기 1회

### 백업 전략

- **데이터베이스**: 일일 백업
- **사용자 파일**: 실시간 복제
- **코드 저장소**: Git 버전 관리

이 요구정의서는 프로젝트 진행 과정에서 지속적으로 업데이트됩니다.