#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { checkGuidelines } = require('./check-guidelines');

/**
 * 빌드 시 실행되는 포괄적인 품질 검사 스크립트
 * - 가이드라인 준수 여부
 * - 타입 체크
 * - 린팅
 * - 테스트 (있는 경우)
 */

console.log('🔍 Starting comprehensive build checks...\n');

function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit', encoding: 'utf8' });
    console.log(`✅ ${description} passed\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed\n`);
    return false;
  }
}

function getAllSourceFiles() {
  const extensions = ['.ts', '.tsx', '.js', '.jsx'];
  const excludeDirs = ['node_modules', 'dist', '.next', '.turbo', '.git', '.vscode-server', '.husky'];
  const includeDirs = ['apps', 'packages', 'scripts'];
  
  function findFiles(dir, files = []) {
    if (!fs.existsSync(dir)) return files;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !excludeDirs.includes(entry.name)) {
        findFiles(fullPath, files);
      } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
        // Only include files in project directories
        const relativePath = path.relative(process.cwd(), fullPath);
        if (includeDirs.some(includeDir => relativePath.startsWith(includeDir))) {
          files.push(fullPath);
        }
      }
    }
    
    return files;
  }
  
  return findFiles(process.cwd());
}

async function main() {
  let allPassed = true;
  
  // 1. 가이드라인 검사
  console.log('🎯 Checking development guidelines...');
  try {
    const sourceFiles = getAllSourceFiles();
    checkGuidelines(sourceFiles);
    console.log('✅ Guideline checks passed\n');
  } catch (error) {
    console.error('❌ Guideline checks failed\n');
    allPassed = false;
  }
  
  // 2. TypeScript 타입 체크
  if (!runCommand('npm run type-check', 'TypeScript type checking')) {
    allPassed = false;
  }
  
  // 3. ESLint 검사
  if (!runCommand('npm run lint', 'ESLint code quality checks')) {
    allPassed = false;
  }
  
  // 4. Prettier 포맷팅 검사
  if (!runCommand('npm run format:check', 'Prettier formatting checks')) {
    allPassed = false;
  }
  
  // 5. 테스트 실행 (테스트가 있는 경우)
  try {
    if (fs.existsSync('package.json')) {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      if (packageJson.scripts && packageJson.scripts.test) {
        if (!runCommand('npm run test', 'Unit tests')) {
          allPassed = false;
        }
      }
    }
  } catch (error) {
    console.log('⚠️  No tests found, skipping test execution\n');
  }
  
  // 6. 빌드 테스트
  if (!runCommand('npm run build', 'Production build test')) {
    allPassed = false;
  }
  
  // 결과 출력
  console.log('📊 Build Checks Summary');
  console.log('========================');
  
  if (allPassed) {
    console.log('🎉 All checks passed! Ready for deployment.');
    process.exit(0);
  } else {
    console.log('💥 Some checks failed. Please fix the issues above.');
    process.exit(1);
  }
}

// CLI 실행
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Build checks failed with error:', error.message);
    process.exit(1);
  });
}

module.exports = { main };