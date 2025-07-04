#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 문서 자동 생성 스크립트
 * - API 엔드포인트 문서화
 * - 컴포넌트 문서화 
 * - 타입 정의 문서화
 */

function extractJSDocComments(filePath) {
  if (!fs.existsSync(filePath)) return [];
  
  const content = fs.readFileSync(filePath, 'utf8');
  const comments = [];
  
  // JSDoc 주석 패턴 매칭
  const jsdocRegex = /\/\*\*(.*?)\*\//gs;
  const matches = content.matchAll(jsdocRegex);
  
  for (const match of matches) {
    const comment = match[1]
      .split('\n')
      .map(line => line.replace(/^\s*\*\s?/, '').trim())
      .filter(line => line.length > 0)
      .join('\n');
    
    if (comment) {
      comments.push(comment);
    }
  }
  
  return comments;
}

function generateAPIDocumentation() {
  console.log('📚 Generating API documentation...');
  
  const apiDir = 'apps/web/src/app/api';
  if (!fs.existsSync(apiDir)) {
    console.log('⚠️  API directory not found, skipping API docs');
    return;
  }
  
  let apiDocs = '# API Documentation\n\n';
  apiDocs += 'Auto-generated API documentation from source code.\n\n';
  
  function scanApiRoutes(dir, basePath = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const routePath = path.join(basePath, entry.name);
      
      if (entry.isDirectory()) {
        scanApiRoutes(fullPath, routePath);
      } else if (entry.name === 'route.ts') {
        const comments = extractJSDocComments(fullPath);
        const endpoint = basePath.replace(/\\/g, '/') || '/';
        
        apiDocs += `## ${endpoint}\n\n`;
        
        if (comments.length > 0) {
          apiDocs += comments.join('\n\n') + '\n\n';
        } else {
          apiDocs += '*No documentation available*\n\n';
        }
        
        // HTTP 메서드 추출
        const content = fs.readFileSync(fullPath, 'utf8');
        const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
          .filter(method => content.includes(`export async function ${method}`));
        
        if (methods.length > 0) {
          apiDocs += `**Available methods:** ${methods.join(', ')}\n\n`;
        }
        
        apiDocs += '---\n\n';
      }
    }
  }
  
  scanApiRoutes(apiDir);
  
  fs.writeFileSync('docs/api/README.md', apiDocs);
  console.log('✅ API documentation generated at docs/api/README.md');
}

function generateComponentDocumentation() {
  console.log('🧩 Generating component documentation...');
  
  const componentsDir = 'packages/ui/src/components';
  if (!fs.existsSync(componentsDir)) {
    console.log('⚠️  Components directory not found, skipping component docs');
    return;
  }
  
  let componentDocs = '# Component Documentation\n\n';
  componentDocs += 'Auto-generated component documentation from source code.\n\n';
  
  const files = fs.readdirSync(componentsDir)
    .filter(file => file.endsWith('.tsx') || file.endsWith('.ts'));
  
  for (const file of files) {
    const filePath = path.join(componentsDir, file);
    const componentName = path.basename(file, path.extname(file));
    const comments = extractJSDocComments(filePath);
    
    componentDocs += `## ${componentName}\n\n`;
    
    if (comments.length > 0) {
      componentDocs += comments.join('\n\n') + '\n\n';
    } else {
      componentDocs += '*No documentation available*\n\n';
    }
    
    // Props 타입 추출 (간단한 패턴)
    const content = fs.readFileSync(filePath, 'utf8');
    const propsMatch = content.match(/interface\\s+(\\w*Props)\\s*\\{([^}]*)\\}/s);
    
    if (propsMatch) {
      componentDocs += `**Props:**\n\`\`\`typescript\n${propsMatch[0]}\n\`\`\`\n\n`;
    }
    
    componentDocs += `**File:** \`${filePath}\`\n\n`;
    componentDocs += '---\n\n';
  }
  
  fs.writeFileSync('docs/components/README.md', componentDocs);
  console.log('✅ Component documentation generated at docs/components/README.md');
}

function generateTypeDocumentation() {
  console.log('📋 Generating type documentation...');
  
  const typesDir = 'packages/types/src';
  if (!fs.existsSync(typesDir)) {
    console.log('⚠️  Types directory not found, skipping type docs');
    return;
  }
  
  let typeDocs = '# Type Documentation\n\n';
  typeDocs += 'Auto-generated type documentation from source code.\n\n';
  
  function scanTypes(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        scanTypes(fullPath);
      } else if (entry.name.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const comments = extractJSDocComments(fullPath);
        
        typeDocs += `## ${entry.name}\n\n`;
        
        if (comments.length > 0) {
          typeDocs += comments.join('\n\n') + '\n\n';
        }
        
        // 인터페이스와 타입 추출
        const interfaces = content.match(/export\\s+interface\\s+\\w+\\s*\\{[^}]*\\}/gs) || [];
        const types = content.match(/export\\s+type\\s+\\w+\\s*=[^;]+;/gs) || [];
        
        if (interfaces.length > 0 || types.length > 0) {
          typeDocs += '**Exported types:**\n\n';
          
          [...interfaces, ...types].forEach(definition => {
            typeDocs += `\`\`\`typescript\n${definition}\n\`\`\`\n\n`;
          });
        }
        
        typeDocs += '---\n\n';
      }
    }
  }
  
  scanTypes(typesDir);
  
  fs.writeFileSync('docs/api/types.md', typeDocs);
  console.log('✅ Type documentation generated at docs/api/types.md');
}

function generateProjectOverview() {
  console.log('📖 Generating project overview...');
  
  const overview = `# Korean 3D Text SaaS - Project Documentation

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

\`\`\`
korean-3d-text-saas/
├── apps/
│   └── web/                # Next.js Frontend Application
├── packages/
│   ├── ui/                # 공통 UI 컴포넌트
│   ├── types/             # TypeScript 타입 정의
│   └── 3d-engine/         # 3D 렌더링 엔진
├── scripts/               # 개발 도구 스크립트
└── docs/                  # 자동 생성 문서
\`\`\`

## 기술 스택

- **Frontend**: Next.js 15.1, React 19, TypeScript 5.7
- **3D Graphics**: Three.js r178, Troika-three-text
- **Styling**: TailwindCSS 3.4
- **State Management**: Zustand 5.0.6
- **Build Tool**: Turborepo 2.5.4

## 개발 시작하기

\`\`\`bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 빌드 및 품질 검사
npm run build:check
\`\`\`

---

*이 문서는 자동으로 생성됩니다. 수동으로 편집하지 마세요.*
`;
  
  fs.writeFileSync('docs/README.md', overview);
  console.log('✅ Project overview generated at docs/README.md');
}

async function main() {
  console.log('📚 Starting documentation generation...\n');
  
  try {
    generateAPIDocumentation();
    generateComponentDocumentation();
    generateTypeDocumentation();
    generateProjectOverview();
    
    console.log('\n🎉 Documentation generation completed!');
    console.log('📁 Check the docs/ directory for generated documentation.');
  } catch (error) {
    console.error('💥 Documentation generation failed:', error.message);
    process.exit(1);
  }
}

// CLI 실행
if (require.main === module) {
  main();
}

module.exports = { main };