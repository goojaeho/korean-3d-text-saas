module.exports = {
  // TypeScript/JavaScript files
  '**/*.{ts,tsx,js,jsx}': [
    'eslint --fix',
    'prettier --write',
  ],
  
  // JSON, Markdown, and YAML files
  '**/*.{json,md,yaml,yml}': [
    'prettier --write',
  ],
  
  // TypeScript type checking for entire project
  '**/*.{ts,tsx}': () => 'npm run type-check',
  
  // Custom guideline checks
  '**/*.{ts,tsx,js,jsx}': [
    'node scripts/check-guidelines.js',
  ],
};