# 데이터베이스 설정 가이드

## 🚀 Prisma 초기화 및 설정

### 1. 환경변수 설정

먼저 `.env` 파일을 생성하고 데이터베이스 연결 정보를 설정하세요:

```bash
# .env 파일 복사
cp .env.example .env
```

`.env` 파일에서 다음 정보를 수정하세요:

```bash
# 로컬 PostgreSQL 사용 시
DATABASE_URL="postgresql://username:password@localhost:5432/korean_3d_text_dev"

# Vercel Postgres 사용 시 (배포환경)
DATABASE_URL="postgres://username:password@hostname:port/database?sslmode=require"
```

### 2. PostgreSQL 설치 및 실행

#### macOS (Homebrew)
```bash
# PostgreSQL 설치
brew install postgresql@15

# PostgreSQL 서비스 시작
brew services start postgresql@15

# 데이터베이스 생성
createdb korean_3d_text_dev
```

#### Ubuntu/Debian
```bash
# PostgreSQL 설치
sudo apt update
sudo apt install postgresql postgresql-contrib

# PostgreSQL 시작
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 사용자 및 데이터베이스 생성
sudo -u postgres psql
postgres=# CREATE USER korean3d WITH PASSWORD 'password123';
postgres=# CREATE DATABASE korean_3d_text_dev OWNER korean3d;
postgres=# \q
```

#### Docker 사용
```bash
# PostgreSQL 컨테이너 실행
docker run --name korean3d-postgres \
  -e POSTGRES_USER=korean3d \
  -e POSTGRES_PASSWORD=password123 \
  -e POSTGRES_DB=korean_3d_text_dev \
  -p 5432:5432 \
  -d postgres:15
```

### 3. Prisma 초기화

```bash
# 1. Prisma 클라이언트 생성
npm run db:generate

# 2. 데이터베이스 스키마 동기화 (개발용)
npm run db:push

# 3. 샘플 데이터 삽입
npm run db:seed
```

### 4. 데이터베이스 확인

#### Prisma Studio 실행 (GUI)
```bash
npm run db:studio
```
브라우저에서 `http://localhost:5555`에 접속하여 데이터를 확인할 수 있습니다.

#### 명령줄로 확인
```bash
# PostgreSQL에 직접 연결
psql postgresql://korean3d:password123@localhost:5432/korean_3d_text_dev

# 테이블 목록 확인
\dt

# 사용자 데이터 확인
SELECT * FROM users;

# 프로젝트 데이터 확인
SELECT * FROM projects;
```

## 📋 주요 명령어

### 개발 명령어
```bash
# Prisma 클라이언트 생성/재생성
npm run db:generate

# 스키마를 데이터베이스에 적용 (개발용)
npm run db:push

# 데이터베이스에서 스키마 가져오기
npm run db:pull

# Prisma Studio 실행 (데이터베이스 GUI)
npm run db:studio

# 데이터베이스 초기화 (주의: 모든 데이터 삭제)
npm run db:reset

# 샘플 데이터 삽입
npm run db:seed
```

### 배포 명령어
```bash
# 프로덕션 마이그레이션 생성
npx prisma migrate dev --name init

# 프로덕션 마이그레이션 적용
npx prisma migrate deploy
```

## 🔧 트러블슈팅

### 1. 연결 오류
```bash
# 에러: Can't reach database server
# 해결: PostgreSQL이 실행 중인지 확인
brew services restart postgresql@15  # macOS
sudo systemctl restart postgresql    # Linux
```

### 2. 권한 오류
```bash
# 에러: permission denied for database
# 해결: 사용자 권한 확인
sudo -u postgres psql
postgres=# GRANT ALL PRIVILEGES ON DATABASE korean_3d_text_dev TO korean3d;
```

### 3. 스키마 동기화 오류
```bash
# 개발 환경에서 스키마 재설정
npm run db:reset

# 프로덕션 환경에서 마이그레이션 재적용
npx prisma migrate deploy
```

### 4. 포트 충돌
```bash
# PostgreSQL 기본 포트 변경 (postgresql.conf)
port = 5433

# .env 파일의 DATABASE_URL도 함께 변경
DATABASE_URL="postgresql://korean3d:password123@localhost:5433/korean_3d_text_dev"
```

## 🌐 Vercel Postgres 설정

### 1. Vercel 대시보드에서 데이터베이스 생성
1. Vercel 대시보드 → Storage → Create Database
2. Postgres 선택 → 데이터베이스 이름 입력
3. Create 클릭

### 2. 환경변수 설정
```bash
# Vercel에서 제공하는 연결 문자열 복사
DATABASE_URL="postgres://username:password@hostname:port/database?sslmode=require"
```

### 3. 로컬 환경변수 설정
```bash
# Vercel CLI로 환경변수 다운로드
vercel env pull .env.local
```

### 4. 프로덕션 배포
```bash
# 마이그레이션 적용
npm run db:push

# 애플리케이션 배포
vercel --prod
```

## 📊 스키마 구조

현재 데이터베이스는 다음 테이블로 구성되어 있습니다:

- **users**: 사용자 정보 (인증, 플랜, 크레딧)
- **projects**: 3D 텍스트 프로젝트
- **project_exports**: 내보내기 이력
- **user_activities**: 사용자 활동 로그

자세한 스키마 정보는 [데이터베이스 문서](./README.md)를 참조하세요.

## 🔐 보안 고려사항

### 1. 환경변수 보호
- `.env` 파일을 Git에 커밋하지 마세요
- 프로덕션에서는 안전한 비밀번호 사용
- DATABASE_URL에 특수문자가 있다면 URL 인코딩 필요

### 2. 데이터베이스 권한
- 최소 권한 원칙 적용
- 읽기 전용 사용자 별도 생성 고려
- 정기적인 백업 설정

### 3. 네트워크 보안
- 방화벽 설정으로 데이터베이스 포트 보호
- SSL/TLS 연결 강제 (`sslmode=require`)
- VPN 또는 private 네트워크 사용 권장

---

문제가 발생하면 [GitHub Issues](링크)에 리포트해주세요.