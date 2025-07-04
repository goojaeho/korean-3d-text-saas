# Korean 3D Text SaaS - Project Documentation

## 개요

이 프로젝트는 한글 3D 텍스트 생성 플랫폼입니다. 웹 브라우저에서 실시간으로 3D 텍스트를 편집하고 내보낼 수 있는 SaaS 서비스입니다.

## 문서 구조

- [API Documentation](./api/README.md) - REST API 엔드포인트 문서
- [Component Documentation](./components/README.md) - UI 컴포넌트 문서  
- [Type Documentation](./api/types.md) - TypeScript 타입 정의
- [Development Guide](../CLAUDE.md) - 개발 가이드라인
- [Requirements](../REQUIREMENTS.md) - 프로젝트 요구사항
- [Deployment Guide](../DEPLOYMENT.md) - 배포 가이드

## 프로젝트 구조

```
korean-3d-text-saas/
├── apps/
│   └── web/                # Next.js Frontend Application
├── packages/
│   ├── ui/                # 공통 UI 컴포넌트
│   ├── types/             # TypeScript 타입 정의
│   └── 3d-engine/         # 3D 렌더링 엔진
├── scripts/               # 개발 도구 스크립트
└── docs/                  # 자동 생성 문서
```

## 기술 스택

- **Frontend**: Next.js 15.1, React 19, TypeScript 5.7
- **3D Graphics**: Three.js r178, Troika-three-text
- **Styling**: TailwindCSS 3.4
- **State Management**: Zustand 5.0.6
- **Build Tool**: Turborepo 2.5.4

## 개발 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 빌드 및 품질 검사
npm run build:check
```

---

*이 문서는 자동으로 생성됩니다. 수동으로 편집하지 마세요.*
