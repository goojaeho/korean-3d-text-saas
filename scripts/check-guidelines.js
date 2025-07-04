#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 개발 가이드라인 자동 검사 스크립트
 * REQUIREMENTS.md의 규칙을 기반으로 코드 품질 검사
 */

const BANNED_LIBRARIES = [
  'jquery', 'bootstrap', 'moment', 'lodash', 'styled-components'
];

const MAX_FILE_SIZE_LINES = 300;

function checkGuidelines(filePaths) {
  let hasErrors = false;
  
  for (const filePath of filePaths) {
    console.log(`\n🔍 Checking guidelines for: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      continue;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // 1. 파일 크기 체크 (300줄 제한)
    if (lines.length > MAX_FILE_SIZE_LINES) {
      console.error(`❌ File size violation: ${filePath} has ${lines.length} lines (max: ${MAX_FILE_SIZE_LINES})`);
      hasErrors = true;
    }
    
    // 2. 금지된 라이브러리 사용 체크
    for (const bannedLib of BANNED_LIBRARIES) {
      if (content.includes(`from '${bannedLib}'`) || 
          content.includes(`require('${bannedLib}')`) ||
          content.includes(`import ${bannedLib}`) ||
          content.includes(`@import '${bannedLib}'`)) {
        console.error(`❌ Banned library detected: ${filePath} uses '${bannedLib}'`);
        hasErrors = true;
      }
    }
    
    // 3. TypeScript 파일인지 확인 (.js 파일 금지)
    if (filePath.endsWith('.js') && 
        !filePath.includes('config') && 
        !filePath.includes('scripts') &&
        !filePath.includes('node_modules') &&
        !filePath.includes('.next') &&
        !filePath.includes('.vscode-server')) {
      console.error(`❌ JavaScript file detected: ${filePath} (TypeScript required)`);
      hasErrors = true;
    }
    
    // 4. any 타입 사용 체크
    if (content.includes(': any') || content.includes('<any>')) {
      console.warn(`⚠️  'any' type detected in: ${filePath} (consider using proper types)`);
    }
    
    // 5. console.log 사용 체크 (프로덕션 코드)
    if (content.includes('console.log') && !filePath.includes('dev') && !filePath.includes('debug')) {
      console.warn(`⚠️  console.log detected in: ${filePath} (remove before production)`);
    }
    
    // 6. useEffect 과다 사용 체크
    const useEffectCount = (content.match(/useEffect/g) || []).length;
    if (useEffectCount > 3) {
      console.warn(`⚠️  Multiple useEffect detected in: ${filePath} (${useEffectCount} instances, consider optimization)`);
    }
  }
  
  if (hasErrors) {
    console.error('\n❌ Guideline violations found! Please fix the issues above.');
    process.exit(1);
  } else {
    console.log('\n✅ All guideline checks passed!');
  }
}

// CLI 실행
if (require.main === module) {
  const filePaths = process.argv.slice(2);
  if (filePaths.length === 0) {
    console.log('Usage: node check-guidelines.js <file1> <file2> ...');
    process.exit(0);
  }
  
  checkGuidelines(filePaths);
}

module.exports = { checkGuidelines };