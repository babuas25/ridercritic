#!/usr/bin/env node

/**
 * Pre-Launch Verification Script
 * Automatically checks some items from the pre-launch checklist
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

const checkmarks = {
  pass: '✅',
  fail: '❌',
  warn: '⚠️',
};

let results = {
  passed: [],
  failed: [],
  warnings: [],
};

function log(message, type = 'info') {
  const prefix = type === 'pass' ? `${colors.green}${checkmarks.pass}` :
                 type === 'fail' ? `${colors.red}${checkmarks.fail}` :
                 type === 'warn' ? `${colors.yellow}${checkmarks.warn}` :
                 `${colors.blue}ℹ️`;
  console.log(`${prefix} ${message}${colors.reset}`);
}

function checkFileExists(filePath, description) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    log(`${description}: Found`, 'pass');
    results.passed.push(description);
  } else {
    log(`${description}: Missing`, 'fail');
    results.failed.push(description);
  }
  return exists;
}

// Removed unused function checkFileContent

function checkEnvFile() {
  const envLocal = fs.existsSync('.env.local');
  const envExample = fs.existsSync('.env.example');
  
  if (envLocal) {
    log('.env.local exists (should not be committed)', 'warn');
    results.warnings.push('.env.local should not be in git');
  }
  
  if (envExample) {
    log('.env.example exists', 'pass');
    results.passed.push('.env.example exists');
  } else {
    log('.env.example missing (recommended)', 'warn');
    results.warnings.push('.env.example missing');
  }
}

function checkGitIgnore() {
  const gitignorePath = '.gitignore';
  if (!fs.existsSync(gitignorePath)) {
    log('.gitignore missing', 'fail');
    results.failed.push('.gitignore missing');
    return;
  }
  
  const content = fs.readFileSync(gitignorePath, 'utf8');
  const required = ['.env', '.env.local', 'node_modules', '.next'];
  const missing = required.filter(item => !content.includes(item));
  
  if (missing.length === 0) {
    log('.gitignore properly configured', 'pass');
    results.passed.push('.gitignore configured');
  } else {
    log(`.gitignore missing: ${missing.join(', ')}`, 'warn');
    results.warnings.push(`.gitignore missing entries: ${missing.join(', ')}`);
  }
}

function checkPackageJson() {
  const packagePath = 'package.json';
  if (!fs.existsSync(packagePath)) {
    log('package.json missing', 'fail');
    results.failed.push('package.json missing');
    return;
  }
  
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Check scripts
  const requiredScripts = ['dev', 'build', 'start', 'lint'];
  const missingScripts = requiredScripts.filter(script => !pkg.scripts?.[script]);
  
  if (missingScripts.length === 0) {
    log('Required npm scripts present', 'pass');
    results.passed.push('npm scripts configured');
  } else {
    log(`Missing scripts: ${missingScripts.join(', ')}`, 'fail');
    results.failed.push(`Missing scripts: ${missingScripts.join(', ')}`);
  }
  
  // Check Next.js version
  const nextVersion = pkg.dependencies?.next || pkg.devDependencies?.next;
  if (nextVersion) {
    log(`Next.js version: ${nextVersion}`, 'info');
  }
}

function checkTypeScript() {
  const tsconfigPath = 'tsconfig.json';
  if (!fs.existsSync(tsconfigPath)) {
    log('tsconfig.json missing', 'fail');
    results.failed.push('tsconfig.json missing');
    return;
  }
  
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  
  if (tsconfig.compilerOptions?.strict) {
    log('TypeScript strict mode enabled', 'pass');
    results.passed.push('TypeScript strict mode');
  } else {
    log('TypeScript strict mode not enabled', 'warn');
    results.warnings.push('TypeScript strict mode disabled');
  }
  
  if (tsconfig.compilerOptions?.paths?.['@/*']) {
    log('Absolute imports configured (@/*)', 'pass');
    results.passed.push('Absolute imports configured');
  } else {
    log('Absolute imports not configured', 'warn');
    results.warnings.push('Absolute imports not configured');
  }
}

function checkNextConfig() {
  const configPath = 'next.config.js';
  if (!fs.existsSync(configPath)) {
    log('next.config.js missing', 'warn');
    results.warnings.push('next.config.js missing');
    return;
  }
  
  log('next.config.js exists', 'pass');
  results.passed.push('next.config.js exists');
  
  // Check for image optimization
  const content = fs.readFileSync(configPath, 'utf8');
  if (content.includes('images')) {
    log('Image optimization configured', 'pass');
    results.passed.push('Image optimization');
  } else {
    log('Image optimization not configured', 'warn');
    results.warnings.push('Image optimization not configured');
  }
}

function checkSecurityRules() {
  const rulesPath = 'firestore.rules';
  if (!fs.existsSync(rulesPath)) {
    log('firestore.rules missing', 'warn');
    results.warnings.push('firestore.rules missing');
    return;
  }
  
  const content = fs.readFileSync(rulesPath, 'utf8');
  
  // Check for overly permissive rules
  if (content.includes('allow read, write: if true')) {
    log('Firestore rules may be too permissive (development mode?)', 'warn');
    results.warnings.push('Firestore rules need review for production');
  } else {
    log('Firestore rules appear configured', 'pass');
    results.passed.push('Firestore rules configured');
  }
}

function checkConsoleLogs() {
  try {
    const files = ['app', 'components', 'lib'].filter(dir => 
      fs.existsSync(dir)
    );
    
    let foundLogs = false;
    const logFiles = [];
    
    function searchDirectory(dir) {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
          searchDirectory(fullPath);
        } else if (item.isFile() && (item.name.endsWith('.ts') || item.name.endsWith('.tsx') || item.name.endsWith('.js') || item.name.endsWith('.jsx'))) {
          const content = fs.readFileSync(fullPath, 'utf8');
          // Check for console.log (but allow console.error)
          if (content.match(/console\.log\(/)) {
            foundLogs = true;
            logFiles.push(fullPath);
          }
        }
      }
    }
    
    files.forEach(dir => searchDirectory(dir));
    
    if (foundLogs) {
      log(`Found console.log statements in ${logFiles.length} file(s)`, 'warn');
      if (logFiles.length <= 5) {
        logFiles.forEach(file => log(`  - ${file}`, 'info'));
      }
      results.warnings.push(`console.log found in ${logFiles.length} file(s)`);
    } else {
      log('No console.log statements found', 'pass');
      results.passed.push('No console.log statements');
    }
  } catch {
    log('Error checking console.log statements', 'warn');
    results.warnings.push('Could not check console.log statements');
  }
}

function checkBuild() {
  log('Attempting to build project...', 'info');
  try {
    execSync('npm run build', { stdio: 'pipe', timeout: 120000 });
    log('Build successful', 'pass');
    results.passed.push('Build successful');
  } catch {
    log('Build failed - check output above', 'fail');
    results.failed.push('Build failed');
  }
}

function checkLint() {
  log('Checking linting...', 'info');
  try {
    execSync('npm run lint', { stdio: 'pipe', timeout: 60000 });
    log('Linting passed', 'pass');
    results.passed.push('Linting passed');
  } catch {
    log('Linting failed - check output above', 'fail');
    results.failed.push('Linting failed');
  }
}

function checkAudit() {
  log('Checking for security vulnerabilities...', 'info');
  try {
    const output = execSync('npm audit --audit-level=moderate', { 
      stdio: 'pipe', 
      encoding: 'utf8',
      timeout: 60000 
    });
    
    // npm audit returns non-zero exit code if vulnerabilities found
    if (output.includes('found 0 vulnerabilities')) {
      log('No security vulnerabilities found', 'pass');
      results.passed.push('No security vulnerabilities');
    } else {
      log('Security vulnerabilities found - run "npm audit" for details', 'warn');
      results.warnings.push('Security vulnerabilities found');
    }
  } catch {
    // npm audit exits with code 1 if vulnerabilities found
    log('Security vulnerabilities found - run "npm audit" for details', 'warn');
    results.warnings.push('Security vulnerabilities found');
  }
}

// Main execution
console.log('\n' + '='.repeat(60));
console.log('🚀 Pre-Launch Checklist Verification');
console.log('='.repeat(60) + '\n');

// File structure checks
console.log(colors.blue + '📁 File Structure' + colors.reset);
checkFileExists('package.json', 'package.json');
checkFileExists('tsconfig.json', 'tsconfig.json');
checkFileExists('next.config.js', 'next.config.js');
checkFileExists('middleware.ts', 'middleware.ts');
checkFileExists('.gitignore', '.gitignore');
checkFileExists('README.md', 'README.md');
checkEnvFile();
checkGitIgnore();

console.log('\n' + colors.blue + '⚙️  Configuration' + colors.reset);
checkPackageJson();
checkTypeScript();
checkNextConfig();
checkSecurityRules();

console.log('\n' + colors.blue + '🔍 Code Quality' + colors.reset);
checkConsoleLogs();

console.log('\n' + colors.blue + '🔨 Build & Tests' + colors.reset);
const skipBuild = process.argv.includes('--skip-build');
if (!skipBuild) {
  checkBuild();
} else {
  log('Skipping build check (--skip-build flag)', 'info');
}

const skipLint = process.argv.includes('--skip-lint');
if (!skipLint) {
  checkLint();
} else {
  log('Skipping lint check (--skip-lint flag)', 'info');
}

console.log('\n' + colors.blue + '🔒 Security' + colors.reset);
checkAudit();

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 Summary');
console.log('='.repeat(60));
console.log(`${colors.green}✅ Passed: ${results.passed.length}${colors.reset}`);
console.log(`${colors.red}❌ Failed: ${results.failed.length}${colors.reset}`);
console.log(`${colors.yellow}⚠️  Warnings: ${results.warnings.length}${colors.reset}`);

if (results.failed.length > 0) {
  console.log(`\n${colors.red}Failed checks:${colors.reset}`);
  results.failed.forEach(item => console.log(`  - ${item}`));
}

if (results.warnings.length > 0) {
  console.log(`\n${colors.yellow}Warnings:${colors.reset}`);
  results.warnings.forEach(item => console.log(`  - ${item}`));
}

console.log('\n' + '='.repeat(60));
console.log('📋 Review PRE_LAUNCH_CHECKLIST.md for complete checklist');
console.log('='.repeat(60) + '\n');

// Exit with appropriate code
process.exit(results.failed.length > 0 ? 1 : 0);

