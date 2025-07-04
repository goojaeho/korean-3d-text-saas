# 배포 가이드

## Vercel 배포 설정

### 1. 환경변수 설정

Vercel 대시보드에서 다음 환경변수들을 설정하세요:

#### 필수 환경변수
```bash
# 애플리케이션 기본 설정
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# 데이터베이스 (Vercel Postgres)
POSTGRES_URL="your-postgres-connection-string"
POSTGRES_PRISMA_URL="your-prisma-connection-string"
POSTGRES_URL_NON_POOLING="your-non-pooling-connection-string"

# 인증 (Next-Auth)
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://your-domain.vercel.app"

# 파일 저장 (Vercel Blob)
BLOB_READ_WRITE_TOKEN="your-blob-token"
```

#### OAuth 설정 (선택사항)
```bash
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

#### 결제 설정 (Stripe)
```bash
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
```

### 2. 배포 명령어

```bash
# 로컬에서 배포 테스트
npm run build
npm run start

# Vercel CLI로 배포
vercel --prod

# 또는 Git 연동으로 자동 배포
git push origin main
```

### 3. 배포 확인사항

- [ ] 모든 환경변수가 설정되었는지 확인
- [ ] API 엔드포인트가 정상 동작하는지 확인
- [ ] 데이터베이스 연결이 정상인지 확인
- [ ] 3D 렌더링이 정상 동작하는지 확인
- [ ] 파일 업로드/다운로드가 정상인지 확인

### 4. 성능 최적화

#### 빌드 최적화
- Next.js 정적 생성 활용
- 이미지 최적화 (next/image)
- 폰트 최적화 (next/font)
- 코드 스플리팅

#### 런타임 최적화
- API 응답 캐싱
- CDN 활용
- 3D 렌더링 메모리 관리

### 5. 모니터링

#### Vercel Analytics
```bash
# Vercel Analytics 활성화
NEXT_PUBLIC_VERCEL_ANALYTICS=true
```

#### 에러 모니터링 (Sentry)
```bash
SENTRY_DSN="your-sentry-dsn"
SENTRY_ORG="your-sentry-org"
SENTRY_PROJECT="your-sentry-project"
```

### 6. 도메인 설정

1. Vercel 대시보드에서 Custom Domain 추가
2. DNS 설정 (A 레코드 또는 CNAME)
3. SSL 인증서 자동 설정 확인

### 7. CI/CD 파이프라인

```yaml
# .github/workflows/deploy.yml 예시
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      - run: npm run test
      
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 8. 트러블슈팅

#### 일반적인 문제들
1. **빌드 실패**: 타입 에러, 의존성 문제
2. **API 500 에러**: 환경변수 누락, 데이터베이스 연결 실패
3. **3D 렌더링 실패**: Three.js 모듈 로딩 실패
4. **느린 로딩**: 번들 크기 최적화 필요

#### 디버깅 방법
```bash
# 로컬에서 프로덕션 모드 테스트
npm run build && npm run start

# Vercel 로그 확인
vercel logs [deployment-url]

# 환경변수 확인
vercel env ls
```