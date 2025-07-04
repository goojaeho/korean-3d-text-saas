# 프로젝트 개발 가이드

## 📚 핵심 참고 문서

### 필수 읽기 문서
- **REQUIREMENTS.md**: 프로젝트 요구정의서 - 모든 개발 결정의 기준이 되는 문서

## 🎯 프로젝트 개요

**Korean 3D Text SaaS** - 한글 3D 텍스트 생성 플랫폼

### 핵심 목표
- 웹 브라우저에서 실시간 한글 3D 텍스트 편집
- 간판 디자이너를 위한 직관적인 도구 제공
- SaaS 비즈니스 모델로 수익화

## 🏗️ 기술 스택

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

## 🎨 프로젝트 구조

```
korean-3d-text-saas/
├── apps/
│   ├── web/                    # Next.js Frontend
│   │   ├── src/
│   │   │   ├── app/           # App Router 페이지
│   │   │   ├── components/    # 페이지별 컴포넌트
│   │   │   ├── hooks/         # 커스텀 훅
│   │   │   ├── lib/           # 유틸리티 함수
│   │   │   └── stores/        # Zustand 상태 관리
│   │   └── public/           # 정적 파일
│   └── api/                   # Vercel Functions
├── packages/
│   ├── ui/                   # 공통 UI 컴포넌트
│   ├── types/               # TypeScript 타입
│   ├── 3d-engine/          # 3D 렌더링 엔진
│   └── config/             # 공통 설정
└── prisma/                 # 데이터베이스 스키마
```

## 🚀 개발 단계

### Phase 1: MVP (현재)
- [x] 프로젝트 설정
- [ ] 기본 3D 텍스트 편집기
- [ ] 4가지 애니메이션 (rotate, float, pulse, wave)
- [ ] 간단한 내보내기 (PNG)
- [ ] 사용자 인증

### Phase 2: 베타
- [ ] 프로젝트 관리 시스템
- [ ] 결제 시스템 (Stripe)
- [ ] 고급 내보내기 (GIF, MP4)
- [ ] 대시보드 개발

### Phase 3: 정식 출시
- [ ] 성능 최적화
- [ ] 보안 강화
- [ ] 모니터링 시스템
- [ ] 마케팅 페이지

## 📋 개발 원칙

### 1. 코드 품질
- **TypeScript**: 모든 코드는 타입 안전성 보장
- **ESLint + Prettier**: 코드 스타일 일관성 유지
- **테스트**: 단위 테스트 및 통합 테스트 작성

### 2. 성능 최적화
- **디바운싱**: 3D 렌더링은 0.5초 대기 후 실행
- **메모리 관리**: 이전 3D 객체 자동 정리
- **코드 스플리팅**: 동적 import로 번들 크기 최적화

### 3. 사용자 경험
- **실시간 피드백**: 모든 변경사항 즉시 반영
- **직관적 인터페이스**: 초보자도 쉽게 사용
- **반응형 디자인**: 모든 디바이스 대응

## 🔧 개발 명령어

```bash
# 개발 서버 시작
npm run dev

# 빌드
npm run build

# 테스트
npm run test

# 타입 체크
npm run type-check

# 린트
npm run lint

# 포맷팅
npm run format
```

## 📝 커밋 메시지 규칙

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅, 세미콜론 누락 등
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드 과정 또는 보조 기능 수정
```

## 🎯 핵심 기능 체크리스트

### 3D 텍스트 편집기
- [ ] 실시간 텍스트 편집
- [ ] 한글 폰트 지원 (Noto Sans Korean)
- [ ] 색상 변경 (컬러 피커)
- [ ] 크기 조절 (슬라이더)
- [ ] 폰트 변경

### 애니메이션 시스템
- [ ] rotate: Y축 회전 + 가벼운 흔들림
- [ ] float: 위아래 플로팅 + Z축 회전
- [ ] pulse: 크기 변화 + 회전 조합
- [ ] wave: X축, Y축 웨이브 모션

### 내보내기 기능
- [ ] PNG 내보내기
- [ ] PDF 내보내기
- [ ] 배경 설정 (투명, 단색, 그라데이션)

### 프로젝트 관리
- [ ] 프로젝트 저장
- [ ] 프로젝트 목록
- [ ] 공유 기능
- [ ] 버전 관리

## 💡 중요 참고사항

1. **모든 개발 결정은 REQUIREMENTS.md를 기준으로 한다**
2. **성능 최적화는 사용자 경험에 직접적인 영향을 미친다**
3. **한글 폰트 지원은 핵심 차별화 요소이다**
4. **SaaS 비즈니스 모델에 맞는 기능 구현이 필요하다**

## 🚨 주의사항

- 3D 렌더링은 브라우저 성능에 민감하므로 최적화 필수
- 모바일 환경에서의 성능 고려 필요
- 실시간 미리보기는 2D 텍스트로 먼저 구현
- 메모리 누수 방지를 위한 리소스 정리 필수

---

**이 문서는 개발 과정에서 지속적으로 업데이트됩니다.**