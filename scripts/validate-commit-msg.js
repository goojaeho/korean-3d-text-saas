#!/usr/bin/env node

const fs = require('fs');

/**
 * 커밋 메시지 유효성 검사 스크립트
 * REQUIREMENTS.md의 커밋 메시지 규칙 강제
 */

const COMMIT_TYPES = [
  'feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore'
];

const COMMIT_REGEX = /^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,50}/;

function validateCommitMessage(messageFile) {
  if (!fs.existsSync(messageFile)) {
    console.error('❌ Commit message file not found');
    process.exit(1);
  }

  const message = fs.readFileSync(messageFile, 'utf8').trim();
  
  // 빈 메시지 체크
  if (!message) {
    console.error('❌ Commit message is empty');
    process.exit(1);
  }
  
  // 커밋 메시지가 주석으로만 이루어져 있는지 체크
  const nonCommentLines = message.split('\n').filter(line => !line.startsWith('#'));
  const actualMessage = nonCommentLines.join('\n').trim();
  
  if (!actualMessage) {
    console.error('❌ Commit message contains only comments');
    process.exit(1);
  }
  
  const firstLine = actualMessage.split('\n')[0];
  
  // 커밋 메시지 형식 체크
  if (!COMMIT_REGEX.test(firstLine)) {
    console.error('❌ Invalid commit message format!');
    console.error('');
    console.error('Expected format: <type>: <description>');
    console.error('');
    console.error('Valid types:', COMMIT_TYPES.join(', '));
    console.error('');
    console.error('Examples:');
    console.error('  feat: add 3d text rotation animation');
    console.error('  fix: resolve memory leak in scene manager');
    console.error('  docs: update api documentation');
    console.error('');
    console.error('Your message:', firstLine);
    process.exit(1);
  }
  
  // 첫 번째 줄 길이 체크 (50자 이내)
  if (firstLine.length > 50) {
    console.error(`❌ Commit message first line too long (${firstLine.length} chars, max: 50)`);
    console.error('Message:', firstLine);
    process.exit(1);
  }
  
  // 설명 부분이 대문자로 시작하는지 체크
  const description = firstLine.split(': ')[1];
  if (description && description[0] !== description[0].toLowerCase()) {
    console.error('❌ Commit description should start with lowercase letter');
    console.error('Message:', firstLine);
    process.exit(1);
  }
  
  console.log('✅ Commit message format is valid');
}

// CLI 실행
if (require.main === module) {
  const messageFile = process.argv[2];
  if (!messageFile) {
    console.error('Usage: node validate-commit-msg.js <commit-msg-file>');
    process.exit(1);
  }
  
  validateCommitMessage(messageFile);
}

module.exports = { validateCommitMessage };