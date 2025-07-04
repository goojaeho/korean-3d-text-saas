# 데이터베이스 설계 문서

## 개요

Korean 3D Text SaaS의 데이터베이스는 Prisma ORM 6.10.0과 PostgreSQL을 사용하여 설계되었습니다.

## 스키마 구조

### 핵심 모델

#### User (사용자)
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  plan      UserPlan @default(FREE)
  credits   Int      @default(10)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  projects  Project[]
}
```

**주요 특징:**
- CUID 기반 ID 시스템
- 이메일 기반 고유 식별
- 플랜별 크레딧 시스템
- 프로젝트와 1:N 관계

#### Project (프로젝트)
```prisma
model Project {
  id           String    @id @default(cuid())
  title        String
  description  String?
  textConfig   Json      // 3D 텍스트 설정
  thumbnailUrl String?
  isPublic     Boolean   @default(false)
  userId       String
  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  exports      ProjectExport[]
}
```

**주요 특징:**
- JSON 기반 텍스트 설정 저장
- 사용자별 소유권 관리
- 공개/비공개 설정
- 내보내기 이력과 1:N 관계

#### ProjectExport (내보내기)
```prisma
model ProjectExport {
  id         String       @id @default(cuid())
  format     ExportFormat
  fileUrl    String?
  fileSize   Int?
  width      Int          @default(1920)
  height     Int          @default(1080)
  quality    Int          @default(100)
  projectId  String
  project    Project      @relation(fields: [projectId], references: [id], onDelete: Cascade)
  createdAt  DateTime     @default(now())
}
```

**주요 특징:**
- PNG, PDF 형식 지원
- Vercel Blob 파일 URL 저장
- 내보내기 설정 이력 관리

### Enum 타입

#### UserPlan
```prisma
enum UserPlan {
  FREE      // 무료 플랜 (월 10개 프로젝트)
  PRO       // 프로 플랜 (월 100개 프로젝트)  
  PREMIUM   // 프리미엄 플랜 (무제한)
}
```

#### AnimationType
```prisma
enum AnimationType {
  rotate    // Y축 회전 + 가벼운 흔들림
  float     // 위아래 플로팅 + Z축 회전
  pulse     // 크기 변화 + 회전 조합
  wave      // X축, Y축 웨이브 모션
}
```

#### ExportFormat
```prisma
enum ExportFormat {
  PNG       // PNG 이미지
  PDF       // PDF 문서
}
```

## 사용 방법

### 환경 설정

1. `.env` 파일 설정:
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/korean_3d_text_db"
```

2. Prisma 클라이언트 생성:
```bash
npm run db:generate
```

3. 데이터베이스 동기화:
```bash
npm run db:push
```

### 데이터베이스 함수 사용

#### 프로젝트 생성
```typescript
import { createProject } from '@/lib/database';

const newProject = await createProject('user_id', {
  title: '새 프로젝트',
  textConfig: {
    text: '안녕하세요',
    color: '#3b82f6',
    fontSize: 48
  }
});
```

#### 프로젝트 목록 조회
```typescript
import { getUserProjects } from '@/lib/database';

const result = await getUserProjects('user_id', 1, 10);
console.log(result.projects); // 프로젝트 배열
console.log(result.totalPages); // 전체 페이지 수
```

#### 사용자 통계
```typescript
import { getUserStats } from '@/lib/database';

const stats = await getUserStats('user_id');
console.log(stats.projectCount); // 프로젝트 수
console.log(stats.exportCount); // 내보내기 수
```

## 주요 명령어

```bash
# Prisma 클라이언트 생성
npm run db:generate

# 데이터베이스 스키마 동기화 (개발용)
npm run db:push

# 데이터베이스 스키마 가져오기
npm run db:pull

# Prisma Studio 실행 (GUI)
npm run db:studio

# 데이터베이스 초기화
npm run db:reset
```

## 관계 설정

### 사용자 ↔ 프로젝트
- **1:N 관계**: 한 사용자는 여러 프로젝트를 소유
- **Cascade 삭제**: 사용자 삭제 시 모든 프로젝트 삭제

### 프로젝트 ↔ 내보내기
- **1:N 관계**: 한 프로젝트는 여러 내보내기 이력을 가짐
- **Cascade 삭제**: 프로젝트 삭제 시 모든 내보내기 이력 삭제

## 성능 최적화

### 인덱스
- `User.email`: 고유 인덱스 (로그인 성능)
- `Project.userId`: 외래키 인덱스 (사용자별 조회 성능)
- `ProjectExport.projectId`: 외래키 인덱스 (프로젝트별 내보내기 조회 성능)

### 쿼리 최적화
- `include` 사용으로 관련 데이터 일괄 조회
- 페이지네이션으로 대용량 데이터 처리
- `select` 사용으로 필요한 필드만 조회

## 보안 고려사항

### 접근 제어
- 사용자는 본인의 프로젝트만 수정/삭제 가능
- 공개 프로젝트는 모든 사용자가 조회 가능
- 비공개 프로젝트는 소유자만 접근 가능

### 데이터 검증
- 필수 필드 validation
- 타입 안전성 (TypeScript + Prisma)
- SQL Injection 방지 (Prisma ORM)

## 백업 및 복구

### 백업 전략
- 일일 자동 백업 (Vercel Postgres)
- 중요 변경 전 수동 백업
- 내보내기 파일은 Vercel Blob에 별도 저장

### 복구 절차
1. Vercel 대시보드에서 백업 선택
2. 새 데이터베이스 인스턴스 생성
3. 환경변수 업데이트
4. 애플리케이션 재배포

---

*이 문서는 Prisma 스키마 변경 시 자동으로 업데이트됩니다.*